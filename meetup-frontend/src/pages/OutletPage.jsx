import {
  CalendarOutlined,
  DashboardOutlined,
  DashOutlined,
  MediumOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "@tanstack/react-router";
import { Layout, Menu } from "antd";
import LogoIcon from "../customIcons/LogoIcon";
import classNames from "classnames";
import { useMemo } from "react";
import { useCookies } from "react-cookie";
import { useAntNotification } from "../utils/notification";

const { Sider, Content } = Layout;

const OutletPage = () => {
  const [cookies] = useCookies(["user-data", "company-data"]);
  const { contextHolder } = useAntNotification();

  const navOptions = useMemo(
    () => [
      {
        key: "profileCalendarNav",
        icon: <UserOutlined />,
        label: <Link to={"/profile"}>Profile</Link>,
      },
      {
        key: "meetups",
        icon: <CalendarOutlined />,
        label: <Link to={"/meetups"}>Meetups</Link>,
      },
      cookies["user-data"]?.record?.id ===
        cookies["company-data"]?.actor_id && {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: <Link to={"/dashboard"}>Company Dashboard</Link>,
      },
    ],
    [cookies]
  );

  return (
    <Layout className='w-full h-full bg-[#101011]'>
      {contextHolder}
      <Sider className='!bg-card-app'>
        <LogoIcon className={"w-20 [&_path]:fill-white m-3"} />
        <Menu
          className={classNames(
            "!bg-transparent [&_li]:!text-white [&_li]:hover:!scale-[101%] [&_ul]:!border-0",
            " [&_.ant-menu-item-selected]:!bg-white [&_.ant-menu-item-selected]:!text-[#101011] [&_.ant-menu-item]:!rounded-none"
          )}
          mode='vertical'
          items={navOptions}
        />
      </Sider>
      <Content className=' bg-dark-app px-3 pt-3 overflow-y-auto'>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default OutletPage;
