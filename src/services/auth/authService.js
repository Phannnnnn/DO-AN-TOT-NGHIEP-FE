import apiClient from "../../api/axios.custom";
import { API_ENDPOINTS } from "../../api/endpoints";

export const authService = {
 login: (loginData) => {
 const { userName, password } = loginData;
 const payload = {
 userName: userName,
 password: password,
 };
 return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
 },
};
