import {
  CalendarOutlined,
  DashboardOutlined,
  DashOutlined,
  MediumOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FloatButton, Layout, Menu } from "antd";
import LogoIcon from "../customIcons/LogoIcon";
import classNames from "classnames";
import { useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";

const { Header, Footer, Sider, Content } = Layout;

const OutletPage = () => {
  const [cookies] = useCookies(["user-data", "company-data"]);
  const userId = useMemo(() => cookies["user-data"].record.id, [cookies]);

  const navOptions = useMemo(
    () => [
      {
        key: "personalCalendarNav",
        icon: <CalendarOutlined />,
        label: <Link to={"/personal-calendar"}>Personal calendar</Link>,
      },
      {
        key: "profileCalendarNav",
        icon: <UserOutlined />,
        label: <Link to={"/profile"}>Profile</Link>,
      },
      {
        key: "meetups",
        icon: <MediumOutlined />,
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
      {/* <FloatButton.Group
        className={classNames(
          "[&_.ant-float-btn-content]:w-full",
          "[&_.ant-float-btn-icon]:!m-0 [&_.ant-float-btn-icon]:!pb-0.5 [&_.ant-float-btn-icon]:!w-full [&_.ant-float-btn-icon]:!h-full",
          "[&_.ant-float-btn-body]:!bg-[#1f1f20]",
          "[&_.anticon]:!pt-0.5 [&_.anticon]:!text-white"
        )}
        icon={
          <div className='w-full h-full grid place-items-center [&_path]:fill-white'>
            <LogoIcon className='aspect-square w-7 ' />
          </div>
        }
        trigger='click'
      >
        {navOptions.map(({ tooltip, icon, key, link }) => (
          <span key={key} className='relative'>
            <Link to={link} className=' w-full aspect-square'>
              <FloatButton tooltip={tooltip} icon={icon} />
            </Link>
          </span>
        ))}
      </FloatButton.Group> */}
    </Layout>
  );
};

export default OutletPage;
