import { AuthContextProvider } from "./authContext/AuthContextProvider";
import { NotificationProvider } from "./NotificationContext";

const ContextProvider = ({ children }) => {
 return (
 <AuthContextProvider>
 <NotificationProvider>{children}</NotificationProvider>
 </AuthContextProvider>
 );
};

export default ContextProvider;

export { useAuth } from "./authContext/AuthContextProvider";
export { useNotification } from "./NotificationContext";
