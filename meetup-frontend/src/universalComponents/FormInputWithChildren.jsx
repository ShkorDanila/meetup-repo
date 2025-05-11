import classNames from "classnames";

const FormInputWithChildren = ({
  errorMessage,
  className,
  title,
  isRequired,
  children,
}) => {
  return (
    <div
      className={classNames(
        "relative flex flex-col gap-0.5 items-start w-full h-max",
        className
      )}
    >
      <label
        className={
          isRequired
            ? "after:content-['*'] after:text-red-500"
            : "after:content-['(optional)'] after:text-gray-500"
        }
      >
        {title}:&nbsp;
      </label>
      {children}

      <label className='text-red-500 mt-0.5 text-sm ml-1'>
        {errorMessage || "\t"}
      </label>
    </div>
  );
};

export default FormInputWithChildren;
