import { Button, Input } from "@/components/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { cn } from "@/components/ui/utils";
import { loginSchema } from "@/configs/yup/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import type React from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Student Sign Up:", values);
  };

  return (
    <Form {...form}>
      <h1 className="text-1xl font-semibold mb-6 text-center text-gray-800">
        Մուտք գործել
      </h1>
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

        <Button
          variant="primary"
          type="submit"
          className="w-full mt-4"
          disabled={!form.formState.isValid}
        >
          Մուտք
        </Button>
      </form>
    </Form>
  );
};
