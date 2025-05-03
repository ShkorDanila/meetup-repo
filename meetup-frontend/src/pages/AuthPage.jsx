import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LogoIcon from "../customIcons/LogoIcon";
import { useForm } from "@tanstack/react-form";
import { Button, Input, Popover, Spin } from "antd";
import FormInput from "../universalComponents/FormInput";
import { BaseButton } from "../universalComponents/BaseButton";

const AuthPage = () => {
  const { authenticate, register } = useContext(AuthContext);

  const [isNewUser, setIsNewUser] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      if (isNewUser) {
        await register(value);
      } else {
        await authenticate(value);
      }
    },
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <>
      <div className='w-full h-full bg-[#101011] grid place-items-center relative'>
        <LogoIcon
          className={
            "w-4xl aspect-square absolute -translate-x-6 -translate-y-8"
          }
        />
        <div className='max-w-[90vw] max-h-[70vh] min-w-[30vw] min-h-[40vh] backdrop-blur-md bg-[#7171752d] flex flex-col p-5 items-center gap-6'>
          <h1 className='text-5xl font-semibold text-[#e7eef1]'>IT Meetups</h1>
          <form
            className='w-full'
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className='mb-5 text-[#bbbbbb]'>
              {!isNewUser
                ? "First time on service?"
                : "Already have an account?"}{" "}
              <Button
                onClick={() => setIsNewUser((prev) => !prev)}
                className='!p-0 !h-fit !text-[#8d859e]'
                type='text'
              >
                {!isNewUser ? "Register" : "Log in"}
              </Button>
            </div>
            <div className='flex flex-col items-start gap-1.5 w-full'>
              {isNewUser && (
                <form.Field
                  name='name'
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "A name is required"
                        : value.length < 3
                          ? "Name must be at least 3 characters"
                          : undefined,
                  }}
                  children={(field) => {
                    // Avoid hasty abstractions. Render props are great!
                    return (
                      <>
                        <FormInput
                          id={field.name}
                          title={"Name"}
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
              )}
              <form.Field
                name='email'
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Email is required"
                      : !validateEmail(value)
                        ? "Invalid email format"
                        : undefined,
                }}
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <FormInput
                        id={field.name}
                        title={"Email"}
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
                name='password'
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Password is required"
                      : value.length < 8
                        ? "Password must be at least 8 characters long"
                        : undefined,
                }}
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <FormInput
                        id={field.name}
                        inputType='password'
                        title={"Password"}
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
              <div className='mt-4 flex items-center gap-2 w-full flex-col'>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <BaseButton
                      loading={isSubmitting}
                      disabled={!canSubmit}
                      className={"max-w-72"}
                      htmlType='submit'
                      title={isNewUser ? "Sign Up" : "Sign In"}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
