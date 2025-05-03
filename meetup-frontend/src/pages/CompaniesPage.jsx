import { useContext, useEffect, useState } from "react";
import { CompanyContext } from "../context/CompanyContext";
import { useForm } from "@tanstack/react-form";
import FormInput from "../universalComponents/FormInput";
import { Button, Spin, Table } from "antd";
import Avatar from "react-avatar";
import { PlusCircleFilled } from "@ant-design/icons";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiPlus } from "@mdi/js";
import { BaseButton } from "../universalComponents/BaseButton";
import { useCookies } from "react-cookie";
import { get } from "lodash";

export const CompaniesPage = () => {
  const { companyQuery, createNewCompany } = useContext(CompanyContext);
  const [_, setCookies] = useCookies(["company-data"]);
  const [isCreateNewCompany, setIsCreateNewCompany] = useState(false);

  const toggleIsCreateCompany = () => {
    return setIsCreateNewCompany((prev) => !prev);
  };

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      await createNewCompany({
        title: value.title,
        description: value.description,
      });
    },
  });


  return (
    <div className='w-full h-full bg-[#101011] grid place-items-center relative'>
      <div className='max-w-[90vw] max-h-[70vh] min-w-[30vw] min-h-[40vh] backdrop-blur-md bg-[#7171752d] flex flex-col p-5 items-center gap-6'>
        <label className='text-xl'>
          {isCreateNewCompany ? "Create" : "Select"} a company
        </label>
        {isCreateNewCompany ||
        !companyQuery["data"]?.totalItems ||
        companyQuery["data"]?.totalItems <= 0 ? (
          <>
            <form
              className='w-full'
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field
                name='title'
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Title is required"
                      : value.length < 3
                        ? "Title must be at least 3 characters"
                        : undefined,
                }}
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <FormInput
                        id={field.name}
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
                name='description'
                validators={{
                  onChange: ({ value }) =>
                    value.length > 256
                      ? "Description must not be more than 256 characters long"
                      : undefined,
                }}
                children={(field) => {
                  // Avoid hasty abstractions. Render props are great!
                  return (
                    <>
                      <FormInput
                        id={field.name}
                        title={"Description"}
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
                      title={isSubmitting ? <Spin /> : "Create"}
                      htmlType='submit'
                      disabled={!canSubmit}
                    />
                  )}
                />
              </div>
            </form>
          </>
        ) : (
          <div className='w-full flex flex-col gap-3 mb-2'>
            {companyQuery["data"] &&
              companyQuery["data"].items.map((item) => (
                <>
                  <div
                    onClick={() => setCookies("company-data", item)}
                    className='flex gap-2 shadow-md bg-[#d8d8e2] text-black w-full items-center cursor-pointer hover:scale-[101%]'
                  >
                    <Avatar size='40' name={item.params.title || ""} />
                    <span>{item.params.title}</span>
                  </div>
                </>
              ))}
          </div>
        )}
        {companyQuery["data"]?.totalItems &&
          companyQuery["data"]?.totalItems > 0 && (
            <BaseButton
              title={
                isCreateNewCompany ? "To companies list" : "Create new company"
              }
              mdiPath={isCreateNewCompany ? mdiChevronLeft : mdiPlus}
              onClick={toggleIsCreateCompany}
            />
          )}
      </div>
    </div>
  );
};
