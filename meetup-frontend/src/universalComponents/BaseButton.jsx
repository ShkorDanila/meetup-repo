import Icon from "@mdi/react";
import { Button } from "antd";
import classNames from "classnames";

export const BaseButton = ({ mdiPath, title, className, onClick, ...rest }) => {
  return (
    <Button
      onClick={onClick}
      className={classNames(
        "!border-0 !flex !gap-2 !rounded-none !shadow-md !bg-[#1f1f20]",
        "!w-full !items-center !justify-center !h-[40px] !text-white !cursor-pointer",
        "hover:!scale-[101%] hover:!bg-[#dedee4] hover:!text-[#1f1f20]",
        className
      )}
      {...rest}
    >
      {mdiPath && <Icon path={mdiPath} size={1} />}
      <span className=' text-[1.010rem] leading-none'>{title}</span>
    </Button>
  );
};
