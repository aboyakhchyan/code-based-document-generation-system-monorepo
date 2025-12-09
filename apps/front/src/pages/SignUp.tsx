import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/components/ui/utils";
import { ages, cities } from "@/constants/cities";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/configs/yup/auth";
import { IconGrid } from "@/components/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthApi } from "@/hooks/api";
import { usePageMeta } from "@/hooks";

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  gender: "male" | "female";
  age: number;
  password: string;
  confirmPassword: string;
}

export const SignUp: React.FC = () => {
  usePageMeta("Գրանցում", "Ստեղծեք նոր հաշիվ, լրացրեք տվյալները և սկսեք աշխատել փաստաթղթերի հետ։");

  const { handleRegister } = useAuthApi();
  const navigate = useNavigate();

  const [picture, setPicture] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: cities[0].name,
      gender: "male",
      age: ages[0],
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: handleRegister,
    onSuccess: (data) => {
      const { accessToken } = data;

      localStorage.setItem("accessToken", accessToken);

      navigate("/verification");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || error.message || "Գրանցման ժամանակ սխալ է առաջացել";

      form.setError("root", {
        type: "server",
        message: errorMessage,
      });
    },
  });

  const { isPending, isError, error } = registerMutation;

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();

    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("city", values.city);
    formData.append("gender", values.gender);
    formData.append("age", values.age.toString());
    formData.append("password", values.password);
    formData.append("role", "user");

    if (picture) {
      formData.append("picture", picture);
    }

    registerMutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
        <h1 className="text-1xl font-semibold mb-6 text-center text-gray-800">Գրանցում</h1>

        {(form.formState.errors.root || (isError && error)) && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {form.formState.errors.root?.message ||
              (error instanceof Error ? error.message : "Գրանցման ժամանակ սխալ է առաջացել")}
          </div>
        )}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Անուն և Ազգանուն*</FormLabel>
              <FormControl>
                <Input
                  type="input"
                  placeholder="Հրանտ Մկրտչյան"
                  className="border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  className="border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Հեռախոսահամար*</FormLabel>
              <FormControl>
                <Input
                  type="input"
                  placeholder="+374 77 000 000"
                  className="border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Քաղաք*</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800">
                    <SelectValue placeholder="Ընտրիր քաղաքը" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name} ({c.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Սեռ*</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800">
                    <SelectValue placeholder="Ընտրիր սեռը" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Արական</SelectItem>
                    <SelectItem value="female">Իգական</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Տարիք*</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(Number(value))}>
                  <SelectTrigger className="border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800">
                    <SelectValue placeholder="Ընտրիր Տարիք" />
                  </SelectTrigger>
                  <SelectContent>
                    {ages.map((a) => (
                      <SelectItem key={a} value={String(a)}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          {" "}
          <FormLabel className="text-primary-800">Վերբեռնել պատկեր</FormLabel>{" "}
          <IconGrid file={picture} onSetFile={setPicture} />{" "}
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Գաղտնաբառ*</FormLabel>
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-800">Հաստատել գաղտնաբառը*</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Մուտքագրեք կրկին գաղտնաբառը"
                  className="border-primary-800 text-primary-800 focus:border-primary-800 focus:ring-primary-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="primary" type="submit" className="w-full mt-4" disabled={!form.formState.isValid || isPending}>
          {isPending ? "Գրանցվում է..." : "Գրանցվել"}
        </Button>
      </form>
    </Form>
  );
};
