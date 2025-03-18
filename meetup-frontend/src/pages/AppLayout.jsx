import { useCookies } from "react-cookie";
import AuthPage from "./AuthPage";
import OutletPage from "./OutletPage";

const AppLayout = () => {
  const [cookies] = useCookies(["auth-token"]);

  return cookies["auth-token"] ? <OutletPage /> : <AuthPage />;
};

export default AppLayout;
