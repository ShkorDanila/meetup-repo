import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ApiContext } from "../context/ApiContext";
import { Button, List, Modal } from "antd";
import Avatar from "react-avatar";
import { CrownOutlined, PlusOutlined } from "@ant-design/icons";
import FormInput from "../universalComponents/FormInput";
import { validateEmail } from "../utils/email";
import { isEmpty } from "lodash";
import { AuthContext } from "../context/AuthContext";
import { generate } from "generate-password";
import emailjs from "@emailjs/browser";
import { useAntNotification } from "../utils/notification";
import { CompanyContext } from "../context/CompanyContext";

export const CompanyPage = () => {
  const [cookies, setCookies] = useCookies(["user-data", "company-data"]);
  const { getListOfActors, updateEntity } = useContext(ApiContext);
  const { register } = useContext(AuthContext);

  const { antNotification, contextHolder } = useAntNotification();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState(undefined);

  const members = cookies["company-data"]?.params?.members || [];

  const companyParams = cookies["company-data"]?.params;

  const { refetchCompany } = useContext(CompanyContext);
  const membersQuery = useQuery({
    queryKey: ["members", cookies["user-data"]?.token],
    queryFn: getMembers,
    retryOnMount: true,
  });

  useEffect(() => {
    membersQuery.refetch();
  }, [members]);

  async function getMembers() {
    const { data } = await getListOfActors({
      filter: members.map((item) => `id='${item}'`),
      fields: ["id,name,email"],
      filterSeparator: "OR",
    });
    return data.items;
  }

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async () => {
    if (!validateEmail(email)) {
      setErrorMsg("Invalida email format");
      return;
    }
    setErrorMsg(undefined);
    if (membersQuery.data.map((item) => item.email).includes(email)) {
      setErrorMsg("User is already in company");
      return;
    }

    let finalEmail = "";
    let charset =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let newPassword = "";
    for (let i = 0; i < 8; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    try {
      const { data } = await getListOfActors({ filter: [`email="${email}"`] });
      if (!isEmpty(data.items)) {
        const { email: usersEmail } = data.items[0];
        finalEmail = usersEmail;
      } else {
        finalEmail = email;
        await register({ email: email, password: newPassword, name: email });
      }

      const { data: finalUser } = await getListOfActors({
        filter: [`email="${finalEmail}"`],
      });

      const finalUserId = finalUser.items[0].id;
      await updateEntity(cookies["company-data"].id, {
        params: {
          ...companyParams,
          members: [...companyParams.members, finalUserId],
        },
      });
      await refetchCompany();
      try {
        emailjs.init({
          publicKey: "nWaQlV1p9_rd9OH5H",
        });
        emailjs.send("service_qcq72gp", "template_y4z0lun", {
          publicKey: "nWaQlV1p9_rd9OH5H",
          company_name: companyParams.title,
          name: finalEmail,
          email: finalEmail,
          password: !isEmpty(data.items) ? "Private" : newPassword,
        });
        setOpen(false);
        antNotification({
          type: "success",
          customTitle: "User successfully added",
        });
      } catch {
        console.log("error");
      }
    } catch {
      console.log("external error");
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className='flex flex-col p-5 gap-2'>
      {contextHolder}
      <h1 className='text-3xl text-white'>{companyParams.title}</h1>
      <h2 className='text-lg text-white mt-5'>{companyParams.description}</h2>
      <div className='flex flex-col gap-2 mt-5'>
        <label className='text-lg flex items-center gap-5 w-fit'>
          Members:{" "}
          <Button onClick={showModal} className='flex items-center w-fit'>
            <PlusOutlined />
            <div className='leading-none mt-0.5'>Add member</div>
          </Button>
        </label>
        <List
          className='max-h-96 overflow-y-auto [&_.ant-list-item-meta]:!items-center'
          dataSource={membersQuery.data}
          renderItem={(item) => (
            <List.Item className='cursor-pointer'>
              <List.Item.Meta
                avatar={
                  <div className='flex items-center gap-3'>
                    {cookies["company-data"]?.actor_id === item.id ? (
                      <label className='text-xl mb-1'>
                        <CrownOutlined />
                      </label>
                    ) : null}
                    <Avatar name={item.name} size='20' />
                  </div>
                }
                title={
                  <label className='text-white text-lg flex items-center gap-2'>
                    {item.name}
                  </label>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <Modal
        open={open}
        title='Member invitation'
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <FormInput
          isRequired
          placeholder={"email@gmail.com"}
          title={"Email"}
          errorMessage={errorMsg}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </Modal>
    </div>
  );
};
