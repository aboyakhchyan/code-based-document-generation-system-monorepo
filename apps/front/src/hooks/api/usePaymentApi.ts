import { axios } from "@/configs/axios";

export const usePaymentApi = () => {
  const getTransactionHistoryApi = async () => {
    const response = await axios.get("/payment/history");
    return response.data;
  };

  const getPlanDetailsApi = async () => {
    const response = await axios.get("/payment/plan-details?provider=stripe");
    return response.data;
  };

  const initPaymentApi = async (priceId: string) => {
    const response = await axios.post("/payment/init", { priceId, provider: "stripe" });
    return response.data;
  };

  return {
    getPlanDetailsApi,
    initPaymentApi,
    getTransactionHistoryApi,
  };
};
