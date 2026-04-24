import { AuthContextProvider } from "./authContext/AuthContextProvider";

const ContextProvider = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

export default ContextProvider;

export { useAuth } from "./authContext/AuthContextProvider";
