import {
  CalendarOutlined,
  MediumOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FloatButton } from "antd";
import LogoIcon from "../customIcons/LogoIcon";
import classNames from "classnames";

const navOptions = [
  {
    key: "personalCalendarNav",
    icon: <CalendarOutlined />,
    tooltip: "Personal calendar",
    link: "/personal-calendar",
  },
  {
    key: "profileCalendarNav",
    icon: <UserOutlined />,
    tooltip: "Profile",
    link: "/profile",
  },
  {
    key: "meetups",
    icon: <MediumOutlined />,
    tooltip: "Meetups",
    link: "/meetups",
  },
];

const OutletPage = () => {
  return (
    <>
      <Outlet />
      <FloatButton.Group
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
      </FloatButton.Group>
    </>
  );
};

export default OutletPage;
