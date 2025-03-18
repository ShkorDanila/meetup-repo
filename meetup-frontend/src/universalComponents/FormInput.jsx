import { Input } from "antd";
import classNames from "classnames";

const FormInput = ({
  placeholder,
  errorMessage,
  className,
  title,
  inputType = "default",
  isRequired,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        "relative flex flex-col gap-0.5 items-start w-full h-max",
        className
      )}
    >
      <label className="after:content-['*'] after:text-red-500">
        {title}:&nbsp;
      </label>
      {inputType === "password" && (
        <Input.Password
          className='!rounded-none'
          {...rest}
          placeholder={placeholder}
          required={isRequired}
        ></Input.Password>
      )}
      {inputType === "default" && (
        <Input
          className='!rounded-none'
          {...rest}
          placeholder={placeholder}
          required={isRequired}
        ></Input>
      )}

      <label className='text-red-500 mt-0.5 text-sm ml-1'>
        {errorMessage || "\t"}
      </label>
    </div>
  );
};

export default FormInput;
