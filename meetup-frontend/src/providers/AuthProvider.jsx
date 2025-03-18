import axios from "axios";
import { useCookies } from "react-cookie";
import { AuthContext } from "../context/AuthContext";

const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["auth-token"]);

  const authenticate = async (email, password) => {
    const userData = await axios.post(
      "http://127.0.0.1:8090/api/collections/actors/auth-with-password",
      { identity: email, password: password }
    );
    console.log(userData);
  };

  const unAuthenticate = () => {
    console.log("AAA");
  };

  const contextData = {
    authenticate,
    unAuthenticate,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
