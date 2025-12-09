import { axios } from "@/configs/axios";
import type { IUser } from "@/types";

interface RegisterResponse {
  user: IUser;
  accessToken: string;
}

interface VerifyResponse {
  user: IUser;
  accessToken: string;
}

interface CheckVerificationAccessResponse {
  canAccess: boolean;
  userId?: string;
  remainingTime?: number;
}

interface ResendVerificationCodeResponse {
  message: string;
}

interface LoginResponse {
  accessToken?: string;
  user?: { id: string };
  status?: string;
  redirectTo?: string;
}

export const useAuthApi = () => {
  const handleRegister = async (formData: FormData) => {
    const response = await axios.post<RegisterResponse>("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const handleVerify = async (code: string) => {
    const response = await axios.post<VerifyResponse>("/auth/verify", { code });
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  };

  const handleCheckVerificationAccess = async () => {
    const response = await axios.get<CheckVerificationAccessResponse>("/auth/check-verification-access");
    return response.data;
  };

  const handleResendVerificationCode = async () => {
    const response = await axios.post<ResendVerificationCodeResponse>("/auth/resend-verification-code");
    return response.data;
  };

  const handleLogin = async (email: string, password: string) => {
    const response = await axios.post<LoginResponse>("/auth/login", { email, password });
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  };

  const handleGetCurrentUser = async () => {
    const response = await axios.get<IUser>("/auth/me");
    return response.data;
  };

  const handleLogout = async () => {
    const response = await axios.post("/auth/logout");
    localStorage.removeItem("accessToken");
    return {
      status: response.status,
      message: response.data.message,
    };
  };

  return {
    handleRegister,
    handleVerify,
    handleCheckVerificationAccess,
    handleResendVerificationCode,
    handleLogin,
    handleGetCurrentUser,
    handleLogout,
  };
};
