import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Calendar, Flex, List, Table } from "antd";
import { useContext } from "react";
import { useCookies } from "react-cookie";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "@tanstack/react-router";
import Avatar from "react-avatar";
import { every, isArray } from "lodash";
import dayjs from "dayjs";

export const MeetupsPage = () => {
  const [cookies, setCookies] = useCookies(["user-data", "company-data"]);
  const { getListOfEntities, getListOfActors } = useContext(ApiContext);

  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["meetups", cookies["user-data"]?.token],
    queryFn: getMeetups,
    retryOnMount: true,
  });

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
    return data.items;
  }

  async function getMeetups() {
    const { data } = await getListOfEntities({
      filter: [
        "entity_type='meetup'",
        `parent='${cookies["company-data"].id}'`,
      ],
    });
    return data;
  }

  const handleMeetupClick = (meetup) => {
    console.log(
      !every(
        meetup.params.program.map((item) => item?.centified),
        true
      )
    );
  };

  const cellRenderFunc = (current, info) => {
    const meetupsForDay = data.items.filter((item) =>
      dayjs(item.params.datetime, "DD.MM.YYYY HH:mm").isSame(current, "date")
    );

    return (
      <div
        className={`w-full h-full 
        scrollbar-thumb-rounded-full scrollbar-track-rounded-full
         scrollbar scrollbar-thumb-[#bababa] scrollbar-track-transparent overflow-y-auto`}
      >
        <ul className='flex flex-col items-start gap-1 '>
          {meetupsForDay.map((item) => (
            <li
              onClick={() => handleMeetupClick(item)}
              key={item.content}
              className='hover:bg-[#e0e0e0] p-1 hover:[&_.ant-badge-status-text]:!text-[#141414] rounded-md'
            >
              <Badge
                status={
                  !every(
                    item.params.program.map((item) => item?.centified),
                    true
                  )
                    ? "error"
                    : item.params.owner === cookies["user-data"].record.id
                      ? "success"
                      : item.params.program
                            .map((item) => item.speaker)
                            .includes(cookies["user-data"].record.id)
                        ? "processing"
                        : "warning"
                }
                text={item.params.title}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Flex
      vertical
      className='w-full h-full gap-3 items-center justify-start !p-3 !pt-10'
    >
      <Button
        onClick={() => navigate({ to: "new-meetup" })}
        className='w-fit'
        icon={<PlusOutlined />}
      >
        Create new Meetup
      </Button>
      <div className='flex items-center gap-4'>
        <Badge status='success' text='As owner' />
        <Badge status='processing' text='As speaker' />
        <Badge status='warning' text='As member' />
        <Badge status='error' text='Not certified' />
      </div>
      {data && isArray(membersQuery.data) && (
        <Calendar
          onSelect={(date) => console.log(date.format("DD-MM-YYYY"))}
          defaultValue={dayjs()}
          cellRender={cellRenderFunc}
        />
      )}
    </Flex>
  );
};
