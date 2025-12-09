import { axios } from "@/configs/axios";
import type { IUser } from "@/types";

export const useUserApi = () => {
  const handleEditUserApi = async (formData: FormData) => {
    const response = await axios.patch<IUser>("/user/edit", formData);
    return response.data;
  };

  return {
    handleEditUserApi,
  };
};
