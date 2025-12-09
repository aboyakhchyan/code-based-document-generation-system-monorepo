import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthApi } from "./api/useAuthApi";
import type { IUser } from "@/types";

export const useAuthState = () => {
  const { handleGetCurrentUser, handleLogin, handleLogout } = useAuthApi();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<IUser>({
    queryKey: ["currentUser"],
    queryFn: handleGetCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("accessToken"),
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => handleLogin(email, password),
    onSuccess: async () => {
      await refetch();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      refetch();
    },
  });

  const isAuthenticated = !!user && !isError;

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  return {
    user,
    isLoading,
    isError,
    error,
    isAuthenticated,
    isAdmin,
    isUser,
    login: (email: string, password: string) => {
      loginMutation.mutate({ email, password });
    },
    loginAsync: (email: string, password: string) => {
      return loginMutation.mutateAsync({ email, password });
    },
    logout: () => {
      logoutMutation.mutate();
    },
    logoutAsync: () => {
      return logoutMutation.mutateAsync();
    },
    refetchUser: refetch,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
