import { useCookies } from "react-cookie";

const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["auth-token"]);

  return <>{children}</>;
};

export default AuthProvider;
