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
import { Navigate, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "@/configs/yup/auth";
import { IconGrid } from "@/components/common";
import { RegistrationSuccessPage } from "@/components/auth";

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
  const [searchParams] = useSearchParams();
  const userType = searchParams.get("user-type");

  const [image, setImage] = useState<File | null>(null);

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

  const onSubmit = (values: FormValues) => {
    console.log("Student Sign Up:", values);
  };

  if (userType !== "user") {
    return <Navigate to="/register?user-type=user" replace />;
  }

  if (false) {
    return <RegistrationSuccessPage />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
        <h1 className="text-1xl font-semibold mb-6 text-center text-gray-800">{userType === "user" && "Գրանցում"}</h1>
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
                    {(userType === "user" ? ages : ages.slice(10)).map((a) => (
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
          <IconGrid file={image} onSetFile={setImage} />{" "}
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

        <Button variant="primary" type="submit" className="w-full mt-4" disabled={!form.formState.isValid}>
          Գրանցվել
        </Button>
      </form>
    </Form>
  );
};
