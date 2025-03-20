import axios from "axios";
import { useCookies } from "react-cookie";
import { AuthContext } from "../context/AuthContext";
import { get } from "lodash";
import { useAntNotification } from "../utils/notification";

const AuthProvider = ({ children }) => {
  const [_, setCookie, removeCookie] = useCookies(["auth-token"]);
  const { antNotification, contextHolder } = useAntNotification();

  const authenticate = async ({ email, password }) => {
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8090/api/collections/actors/auth-with-password",
        { identity: email, password: password }
      );
      setCookie("auth-token", get(data, "token"), {
        expires: new Date(Date.now() + 12096e5),
      });
    } catch {
      antNotification({
        type: "error",
        customTitle: "Failure",
        customMessage: "Invalid credentials",
      });
    }
  };

  const register = async ({ email, password, name }) => {
    try {
      const { data } = await axios.post(
        "http://127.0.0.1:8090/api/collections/actors/records",
        {
          email: email,
          password: password,
          passwordConfirm: password,
          name: name,
        }
      );
      setCookie("auth-token", get(data, "token"), {
        expires: new Date(Date.now() + 12096e5),
      });
    } catch {
      antNotification({
        type: "error",
        customTitle: "Failure",
        customMessage: "User with such email already exists",
      });
    }
  };

  const unAuthenticate = () => {
    removeCookie("auth-token");
  };

  const contextData = {
    authenticate,
    unAuthenticate,
    register,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
