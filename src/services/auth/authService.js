import apiClient from "../../api/axios.custom";
import { API_ENDPOINTS } from "../../api/endpoints";

export const authService = {
  login: async (loginData) => {
    const { userName, password } = loginData;
    try {
      const payload = {
        userName: userName,
        password: password,
      };
      const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);

      return res;
    } catch (error) {}
  },
};
