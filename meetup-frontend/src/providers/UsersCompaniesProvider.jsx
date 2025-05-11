import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { get } from "lodash";
import { CompanyContext } from "../context/CompanyContext";
import { useCookies } from "react-cookie";

const UsersCompaniesProvider = ({ children }) => {
  const [cookies, setCookies] = useCookies(["user-data", "company-data"]);
  const companyQuery = useQuery({
    queryKey: ["usersCompanies", cookies["user-data"]?.token],
    queryFn: getUsersCompanies,
    retryOnMount: true,
  });

  const { getListOfEntities, createEntity } = useContext(ApiContext);

  async function getUsersCompanies() {
    if (!cookies["user-data"]) {
      return [];
    }
    const response = await getListOfEntities({
      filter: [
        "entity_type='company'",
        `params.members~'${cookies["user-data"].record.id}'`,
      ],
    });
    console.log(response.data);
    return get(response, "data");
  }

  async function refetchCompany() {
    if (!cookies["user-data"]) {
      return [];
    }

    const response = await getListOfEntities({
      filter: [
        "entity_type='company'",
        `id="${cookies["company-data"].id}"`,
        `params.members~'${cookies["user-data"].record.id}'`,
      ],
    });

    console.log(get(response, "data").items[0]);

    setCookies("company-data", get(response, "data").items[0]);
    return get(response, "data");
  }

  async function createNewCompany({ title, description }) {
    const data = {
      entity_type: "company",
      actor_id: cookies["user-data"]?.record?.id,
      params: {
        title: title,
        description: description,
        members: [cookies["user-data"]?.record?.id || cookies["user-data"]?.id],
      },
    };
    const response = await createEntity(data);
    setCookies("company-data", get(response, "data"));
    return get(response, "data");
  }

  return (
    <CompanyContext.Provider
      value={{ companyQuery, createNewCompany, refetchCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default UsersCompaniesProvider;
