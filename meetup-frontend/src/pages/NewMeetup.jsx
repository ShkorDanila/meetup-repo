import { useForm } from "@tanstack/react-form";
import FormInput from "../universalComponents/FormInput";
import { Button, DatePicker, List, Popover, Steps, Tooltip } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import FormInputWithChildren from "../universalComponents/FormInputWithChildren";
import { useCookies } from "react-cookie";
import { isUrl } from "../utils/url";
import { ApiContext } from "../context/ApiContext";
import { useQuery } from "@tanstack/react-query";
import { isArray, isEmpty, last } from "lodash";
import Avatar from "react-avatar";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import classNames from "classnames";
import { useAntNotification } from "../utils/notification";
import emailjs from '@emailjs/browser';

export const NewMeetup = () => {
  const [stepsCount, setStepsCount] = useState(0);

  const { antNotification, contextHolder } = useAntNotification();

  const [cookies, setCookies] = useCookies(["user-data", "company-data"]);
  const [isDateTimeOpen, setIsDateTimeOpen] = useState(false);

  const { getListOfActors, createEntity } = useContext(ApiContext);

  const members = cookies["company-data"]?.params?.members || [];

  const membersQuery = useQuery({
    queryKey: ["members", cookies["user-data"]?.token],
    queryFn: getMembers,
    retryOnMount: true,
  });

  async function getMembers() {
    const { data } = await getListOfActors({
      filter: members.map((item) => `id='${item}'`),
      fields: ["id,name"],
      filterSeparator: "OR",
    });
    return data?.items;
  }

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: "",
      datetime: dayjs(),
      owner: cookies["user-data"]?.record?.id,
      conferenceLink: "",
      meetupMembers: [],
      program: [
        {
          speaker: "",
          description: "",
          id: 0,
        },
      ],
    },

    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  const handleRemoveCheckpoint = (deleteItem) => {
    if (form.getFieldValue("program").length === 1) {
      return;
    } else {
      form.setFieldValue(
        "program",
        form
          .getFieldValue("program")
          .filter((item) => item.id !== deleteItem.id)
      );
    }
  };

  const handleAddCheckpoint = () => {
    form.setFieldValue("program", [
      ...form.getFieldValue("program"),
      {
        speaker: "",
        description: "",
        id: last(form.getFieldValue("program")).id + 1,
      },
    ]);
  };

  const handleSubmit = async () => {
    const meetup = {
      entity_type: "meetup",
      parent: cookies["company-data"].id,
      actor_id: cookies["user-data"].record.id,
      params: {
        title: form.getFieldValue("title"),
        datetime: form.getFieldValue("datetime").format("DD.MM.YYYY HH:mm"),
        owner: form.getFieldValue("owner"),
        members: form.getFieldValue("meetupMembers").map((item) => item.id),
        program: form
          .getFieldValue("program")
          .sort((a, b) => a.id - b.id)
          .map((item, iterator) => ({
            speaker: item.speaker.id,
            description: item.description,
            order: iterator,
          })),
        conferenceLink: form.getFieldValue("conferenceLink"),
      },
    };

    const resp = await createEntity(meetup);
    if (resp.status !== 200) {
      antNotification({
        type: "error",
        customTitle: "External error",
        customMessage: "Something went wrong",
      });
    } else {
      navigate({ to: "/meetups" });
      antNotification({
        type: "success",
        customTitle: "Success",
        customMessage: "Meetup successfully created",
      });

      emailjs
    }
  };

  const handleMeetupSteps = async (type) => {
    if (type === "cancel") {
      switch (stepsCount) {
        case 0:
          navigate({ to: "/meetups" });
          break;
        case 1:
        case 2:
          setStepsCount((prev) => prev - 1);
          break;
      }
    } else if (type === "next") {
      switch (stepsCount) {
        case 0:
          {
            const validateTitle = await form.validateField("title");
            const validateDatetime = await form.validateField("datetime");
            const validateMembers = await form.validateField("meetupMembers");

            if (
              !isEmpty(validateDatetime) ||
              !isEmpty(validateTitle) ||
              !isEmpty(validateMembers)
            ) {
              return;
            } else {
              setStepsCount((prev) => prev + 1);
            }
          }
          break;
        case 1:
          {
            const speakers = form
              .getFieldValue("program")
              .map((item) => item.speaker);
            if (speakers.includes("")) {
              antNotification({
                type: "error",
                customTitle: "Invalid data",
                customMessage: "All checkpoints must include speaker",
              });
            } else {
              setStepsCount((prev) => prev + 1);
            }
          }
          break;
        case 2:
          {
            handleSubmit();
          }
          break;
      }
    }
  };

  const handleMemberClick = (member) => {
    if (form.getFieldValue("meetupMembers").includes(member)) {
      form.setFieldValue(
        "meetupMembers",
        form
          .getFieldValue("meetupMembers")
          .filter((item) => item.id !== member.id)
      );
    } else {
      form.setFieldValue("meetupMembers", [
        ...form.getFieldValue("meetupMembers"),
        member,
      ]);
    }
  };

  return (
    <div className='flex flex-col w-full h-full p-5'>
      {contextHolder}
      <div className='flex flex-col  gap-5 mb-6 w-full'>
        <h1 className='text-5xl font-semibold text-[#e7eef1]'>
          Create new meetup
        </h1>
        <div className='flex justify-between gap-5'>
          <Steps
            className='max-w-2xl'
            current={stepsCount}
            items={[
              {
                title: "Basic info",
              },
              {
                title: "Program",
              },
              {
                title: "Overview",
              },
            ]}
          />
          <div className='flex items-center gap-3'>
            <Button
              variant='outlined'
              onClick={() => handleMeetupSteps("cancel")}
            >
              {stepsCount === 0
                ? "Cancel"
                : stepsCount === 1
                  ? "Back to Basic info"
                  : "Back to Program"}
            </Button>
            <Button
              variant='solid'
              color='primary'
              onClick={() => handleMeetupSteps("next")}
            >
              {stepsCount === 0
                ? "To Program"
                : stepsCount === 1
                  ? "To Overview"
                  : "Create meetup"}
            </Button>
          </div>
        </div>
      </div>
      <form
        className='max-w-3xl flex flex-col gap-3 items-start'
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {stepsCount === 0 && (
          <>
            <form.Field
              name='title'
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Title is required"
                    : value.length < 4
                      ? "Title must be at least 4 characters long"
                      : undefined,
              }}
              children={(field) => {
                return (
                  <>
                    <FormInput
                      className='max-w-80'
                      id={field.name}
                      isRequired
                      title={"Title"}
                      errorMessage={field.state.meta.errors.join(", ")}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                );
              }}
            />

            <form.Field
              name='datetime'
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Date and time are required";
                  }

                  return undefined;
                },
              }}
              children={(field) => {
                return (
                  <>
                    <FormInputWithChildren
                      errorMessage={field.state.meta.errors.join(", ")}
                      isRequired
                      title={"Meetup date and time"}
                      key={field.name}
                    >
                      <DatePicker
                        className='!rounded-none'
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        open={isDateTimeOpen}
                        onOpenChange={setIsDateTimeOpen}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(value)}
                        showTime
                        showSecond={false}
                        format={"DD.MM.YYYY HH:mm"}
                        onOk={() => setIsDateTimeOpen(false)}
                      />
                    </FormInputWithChildren>
                  </>
                );
              }}
            />

            <form.Field
              name='conferenceLink'
              validators={{
                onChange: ({ value }) =>
                  value && !isUrl(value) ? "Invalid link" : undefined,
              }}
              children={(field) => {
                return (
                  <>
                    <FormInput
                      className='max-w-80'
                      id={field.name}
                      title={"Remote conference link"}
                      errorMessage={field.state.meta.errors.join(", ")}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </>
                );
              }}
            />

            <form.Field
              name='meetupMembers'
              validators={{
                onChange: ({ value }) =>
                  !isArray(value) || isEmpty(value)
                    ? "Should have at least 1 member"
                    : undefined,
              }}
              children={(field) => {
                return (
                  <>
                    <FormInputWithChildren
                      errorMessage={field.state.meta.errors.join(", ")}
                      isRequired
                      title={"Meetup members"}
                      key={field.name}
                    >
                      <div className='mt-2 flex items-center gap-2'>
                        <Popover
                          title='Add members'
                          trigger={"click"}
                          content={
                            <>
                              <List
                                className='max-h-96 overflow-y-auto'
                                dataSource={membersQuery.data}
                                renderItem={(item) => (
                                  <List.Item
                                    className='cursor-pointer'
                                    onClick={() => handleMemberClick(item)}
                                  >
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar name={item.name} size='20' />
                                      }
                                      title={
                                        <label className='text-white text-lg flex items-center gap-2'>
                                          {item.name}
                                          <label className='text-green-500'>
                                            {field.state.value.includes(
                                              item
                                            ) ? (
                                              <CheckOutlined size={10} />
                                            ) : null}
                                          </label>
                                        </label>
                                      }
                                    />
                                  </List.Item>
                                )}
                              />
                            </>
                          }
                        >
                          <Button>Add member</Button>
                        </Popover>
                        <div className='flex items-center gap-1'>
                          {isArray(field.state.value) &&
                            field.state.value.map((item) => (
                              <Avatar name={item.name} round={true} size='30' />
                            ))}
                        </div>
                      </div>
                    </FormInputWithChildren>
                  </>
                );
              }}
            />
          </>
        )}

        {stepsCount === 1 && (
          <>
            <div className='flex flex-col items-start gap-3 w-full'>
              <Button icon={<PlusOutlined />} onClick={handleAddCheckpoint}>
                Add meetup checkpoint
              </Button>
              <form.Field
                name='program'
                validators={{
                  onChange: ({ value }) =>
                    value && !isUrl(value) ? "Invalid link" : undefined,
                }}
                children={(field) => {
                  return (
                    <>
                      {field.state.value.map((programItem, iterator) => {
                        return (
                          <div className='flex flex-col gap-2 ml-4 w-full'>
                            <h2 className='text-lg text-white flex items-center gap-3'>
                              Checkpoint {iterator + 1}{" "}
                              <span
                                onClick={() =>
                                  handleRemoveCheckpoint(programItem)
                                }
                                className={classNames(
                                  field.state.value.length > 1
                                    ? "text-red-500 cursor-pointer"
                                    : "text-gray-500 cursor-not-allowed",
                                  "flex items-center "
                                )}
                              >
                                <CloseOutlined />
                              </span>
                            </h2>
                            <div className='flex items-center gap-2'>
                              <Popover
                                title='Add members'
                                trigger={"click"}
                                content={
                                  <>
                                    <List
                                      className='max-h-96 overflow-y-auto'
                                      dataSource={membersQuery.data}
                                      renderItem={(item) => (
                                        <List.Item
                                          className={classNames(
                                            "cursor-pointer",
                                            programItem.speaker === item
                                              ? "outline-1 outline-solid outline-blue-500"
                                              : ""
                                          )}
                                          onClick={() => {
                                            let currentValue =
                                              field.state.value;

                                            if (
                                              currentValue[iterator].speaker !==
                                              ""
                                            ) {
                                              currentValue[iterator] = {
                                                id: currentValue[iterator].id,
                                                speaker: "",
                                                description:
                                                  currentValue[iterator]
                                                    .description,
                                              };
                                            } else {
                                              currentValue[iterator] = {
                                                id: currentValue[iterator].id,
                                                speaker: item,
                                                description:
                                                  currentValue[iterator]
                                                    .description,
                                              };
                                            }
                                            field.handleChange(currentValue);
                                          }}
                                        >
                                          <List.Item.Meta
                                            avatar={
                                              <Avatar
                                                name={item.name}
                                                size='25'
                                              />
                                            }
                                            title={
                                              <label className='text-white text-lg flex items-center gap-2'>
                                                {item.name}
                                                <label className='text-green-500'>
                                                  {programItem.speaker ===
                                                  item ? (
                                                    <CheckOutlined size={10} />
                                                  ) : null}
                                                </label>
                                              </label>
                                            }
                                          />
                                        </List.Item>
                                      )}
                                    />
                                  </>
                                }
                              >
                                <Button className='w-fit'>
                                  {programItem.speaker === ""
                                    ? "Add speaker"
                                    : "Change speaker"}
                                </Button>
                              </Popover>
                              {programItem.speaker !== "" && (
                                <Avatar
                                  name={programItem.speaker?.name}
                                  round={true}
                                  size={30}
                                />
                              )}
                            </div>
                            <TextArea
                              className='max-w-2xl'
                              rows={6}
                              value={programItem.description}
                              minLength={20}
                              onChange={(e) => {
                                let currentValue = field.state.value;
                                currentValue[iterator] = {
                                  id: currentValue[iterator].id,
                                  speaker: currentValue[iterator].speaker,
                                  description: e.currentTarget.value,
                                };
                                field.handleChange(currentValue);
                              }}
                            ></TextArea>
                          </div>
                        );
                      })}
                    </>
                  );
                }}
              />
            </div>
          </>
        )}

        {stepsCount === 2 && (
          <div className='w-full flex flex-col gap-5'>
            <h1 className='text-2xl text-white'>Meetup overview</h1>
            <div className='ml-3 flex flex-col gap-3'>
              <label className='text-xl'>
                Title:{" "}
                <label className='text-white'>
                  {form.getFieldValue("title")}
                </label>
              </label>
              <label className='text-xl'>
                Date and time:{" "}
                <label className='text-white'>
                  {form.getFieldValue("datetime").format("DD.MM.YYYY HH:mm")}
                </label>
              </label>
              <label className='text-xl'>
                Meetup owner:{" "}
                <label className='text-white'>
                  {cookies["user-data"]?.record?.name}
                </label>
              </label>
              <label className='text-xl flex items-center gap-3'>
                Members:{" "}
                <div className='flex items-center gap-2'>
                  {form.getFieldValue("meetupMembers").map((item) => (
                    <Avatar round size={30} name={item.name} />
                  ))}
                </div>
              </label>
              {form.getFieldValue("conferenceLink") !== "" && (
                <label className='text-xl'>
                  Remote conference link:{" "}
                  <a href={form.getFieldValue("conferenceLink")}>
                    {form.getFieldValue("conferenceLink")}
                  </a>
                </label>
              )}
              <div className='flex flex-col items-start gap-3 bg-[#1a1a1b] p-3'>
                <label className='text-xl'>Program:</label>
                <div className='flex flex-col items-start gap-2 ml-2'>
                  {form.getFieldValue("program").map((item, iterator) => {
                    return (
                      <div className='flex flex-col gap-1 bg-[#2b2b2e] p-2'>
                        <label className='text-lg'>
                          Checkpoint{" "}
                          <label className='text-white'>{iterator + 1}</label>
                        </label>
                        <label className='text-lg flex items-center gap-3'>
                          Speaker:{" "}
                          <Avatar round size='30' name={item.speaker.name} />{" "}
                          <label className='text-white'>
                            {item.speaker.name}
                          </label>
                        </label>
                        <label className='text-lg'>
                          Description:{" "}
                          <label className='break-word max-w-56 text-white'>
                            {item.description}
                          </label>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
