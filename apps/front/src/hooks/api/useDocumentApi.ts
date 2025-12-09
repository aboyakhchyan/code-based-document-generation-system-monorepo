import { axios } from "@/configs/axios";

export const useDocumentApi = () => {
  const getDocumentTemplatesApi = async () => {
    const response = await axios.get(`/document/templates`);
    return response.data;
  };

  const selectTemplateApi = async (templateId: string) => {
    const response = await axios.post(`/document/template/select/${templateId}`);
    return response.data;
  };
  return {
    getDocumentTemplatesApi,
    selectTemplateApi,
  };
};
