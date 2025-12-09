import { Button, Input } from "@/components/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { cn } from "@/components/ui/utils";
import { loginSchema } from "@/configs/yup/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import type React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth, usePageMeta } from "@/hooks";
import { AxiosError } from "axios";

interface FormValues {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
  usePageMeta("Մուտք", "Մուտք գործեք ձեր հաշվով՝ շարունակելու փաստաթղթերի ստեղծումն ու կառավարումը։");

  const { loginAsync, isLoggingIn, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const from = "/dashboard";

  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await loginAsync(values.email, values.password);

      if (response.status === "verification_required" && response.redirectTo) {
        navigate(response.redirectTo, { replace: true });
        return;
      }

      if (response.accessToken) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || "Մուտք գործելիս սխալ է առաջացել";
      form.setError("root", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  return (
    <Form {...form}>
      <h1 className="text-1xl font-semibold mb-6 text-center text-gray-800">Մուտք գործել</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Էլ. փոստ*</FormLabel>
              <FormControl>
                <Input
                  type="input"
                  placeholder="example@student.com"
                  className="border-primary-800 text-primary-800  focus:border-primary-800 focus:ring-primary-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Գաղտնաբառ</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Գրեք գաղտնաբառը"
                  className="border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-red-600 text-sm text-center mt-2">{form.formState.errors.root.message}</div>
        )}

        <Button
          variant="primary"
          type="submit"
          className="w-full mt-4"
          disabled={!form.formState.isValid || isLoggingIn}
        >
          {isLoggingIn ? "Մուտք գործվում է..." : "Մուտք"}
        </Button>
      </form>
    </Form>
  );
};
