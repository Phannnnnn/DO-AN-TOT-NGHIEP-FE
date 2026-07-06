import apiClient from "@/api/axios.custom";
import { API_ENDPOINTS } from "@/api/endpoints";

export const cloudinaryService = {
 generateSignature: (folder) => {
 return apiClient.post(API_ENDPOINTS.CLOUDINARY.GENERATE_SIGNATURE, {
 folder,
 });
 },

 upload: (cloudName, formData) => {
 return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
 method: "POST",
 body: formData,
 });
 },
};
