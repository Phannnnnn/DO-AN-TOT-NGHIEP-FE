import { authService } from "@/services";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const authStateReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null };
    case "STOP_LOADING":
      return { ...state, loading: false };

    default:
      return state;
  }
};

const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }
  try {
    const decode = jwtDecode(token);
    const now = Date.now() / 1000;
    const timeOut = (decode.exp - now) * 1000;
    console.log(timeOut);
    return decode.exp < now + 10;
  } catch (error) {
    return true;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authStateReducer, {
    user: null,
    loading: true,
  });

  useEffect(() => {
    const initialLoad = () => {
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        dispatch({ type: "STOP_LOADING" });
        return;
      }

      try {
        const decoded = jwtDecode(access_token);
        const { id, fullName, role } = decoded;

        dispatch({
          type: "LOGIN",
          payload: { id, fullName, role },
        });
      } catch {
        dispatch({ type: "STOP_LOADING" });
      }
    };

    initialLoad();
  }, []);

  const login = async (loginData) => {
    const res = await authService.login(loginData);
    if (res.success) {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      const { id, fullName, role } = res.data.user;

      dispatch({ type: "LOGIN", payload: { id, fullName, role } });
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    dispatch({ type: "LOGOUT" });
  };

  const ctxValue = {
    user: authState.user,
    loading: authState.loading,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
};
