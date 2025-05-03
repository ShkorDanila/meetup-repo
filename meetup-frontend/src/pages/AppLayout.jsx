import { useCookies } from "react-cookie";
import AuthPage from "./AuthPage";
import OutletPage from "./OutletPage";
import { CompaniesPage } from "./CompaniesPage";

const AppLayout = () => {
  const [cookies] = useCookies(["user-data", "company-data"]);
  return !cookies["user-data"] ? (
    <AuthPage />
  ) : !cookies["company-data"] ? (
    <CompaniesPage />
  ) : (
    <OutletPage />
  );
};

export default AppLayout;
