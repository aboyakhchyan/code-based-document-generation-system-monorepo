import React, { useEffect, useState } from "react";
import { Camera, Star, UserRoundPen } from "lucide-react";
import { DashboardContent, DashboardHeader } from "@/components/dashboard";
import {
  Input,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Gender } from "@/types";
import boyIcon from "@/assets/icons/boy.png";
import womanIcon from "@/assets/icons/woman.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileSchema } from "@/configs/yup/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserApi } from "@/hooks/api";
import { AxiosError } from "axios";
import { ages, cities } from "@/constants/cities";
import { cn } from "@/components/ui/utils";
import { getImageSrc } from "@/utils";
import { useAuth, usePageMeta } from "@/hooks";

type FormValues = {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  gender?: "male" | "female";
  age?: number;
};

export const Profile = () => {
  usePageMeta("Անձնական տվյալներ", "Թարմացրեք ձեր անձնական տվյալները, քաղաքը, կոնտակտները և պրոֆիլի նկարը։");

  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { handleEditUserApi } = useUserApi();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const isMan = currentUser?.gender === Gender.MALE || (currentUser?.gender as string) === "male";
  const defaultPicture = isMan ? boyIcon : womanIcon;

  const getGenderValue = (gender: Gender | string | undefined): "male" | "female" => {
    if (gender === Gender.MALE || (gender as string) === "male") return "male";
    return "female";
  };

  const form = useForm<FormValues>({
    resolver: yupResolver(editProfileSchema) as any,
    mode: "onChange",
    defaultValues: {
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      phone: (currentUser as any)?.phone || (currentUser as any)?.phoneNumber || "",
      city: (currentUser as any)?.city || "",
      gender: getGenderValue(currentUser?.gender),
      age: currentUser?.age || 18,
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phone: (currentUser as any)?.phone || (currentUser as any)?.phoneNumber || "",
        city: (currentUser as any)?.city || "",
        gender: getGenderValue(currentUser.gender),
        age: currentUser.age || 18,
      });
    }
  }, [currentUser, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    const { fullName, email, age, phone, gender, city } = values;

    if (fullName !== undefined && fullName !== "") {
      formData.append("fullName", fullName);
    }
    if (email !== undefined && email !== "") {
      formData.append("email", email);
    }
    if (age !== undefined) {
      formData.append("age", age.toString());
    }
    if (phone !== undefined && phone !== "") {
      formData.append("phone", phone);
    }
    if (gender !== undefined) {
      formData.append("gender", gender);
    }
    if (city !== undefined && city !== "") {
      formData.append("city", city);
    }
    if (imageFile) {
      formData.append("picture", imageFile);
    }

    return editMutation.mutate(formData);
  };

  const editMutation = useMutation({
    mutationFn: handleEditUserApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setImageFile(null);
      setImagePreview("");
      const fileInput = document.getElementById("imageUpload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Փոփոխությունները պահպանելիս սխալ է առաջացել";
      form.setError("root", {
        type: "server",
        message: errorMessage,
      });
    },
  });

  if (!currentUser) {
    return null;
  }

  const displayImage = imagePreview || getImageSrc(currentUser.picture) || defaultPicture;

  return (
    <>
      <DashboardHeader>
        <div className="w-full flex items-center gap-4 p-5 font-bold text-primary-800">
          <UserRoundPen size={40} />
          <h1 className="text-2xl">Անձնական տվյալներ</h1>
        </div>
      </DashboardHeader>

      <DashboardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-12 flex flex-col gap-6"
          >
            {currentUser.isSubscribed && (
              <div className="absolute right-2 top-2 flex flex-row item-center gap-2 h-max w-max rounded-lg p-1 bg-yellow-400 select-none">
                <Star className="text-white h-3 w-3" />
                <p className="text-[10px] text-white font-urbanist">Բաժանորդագրված է</p>
              </div>
            )}
            <div className="relative w-36 h-36 mx-auto">
              <img
                src={displayImage ?? ""}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border border-gray-300"
              />
              <label
                htmlFor="imageUpload"
                className="absolute bottom-2 right-2 bg-primary-800 p-2 rounded-full cursor-pointer hover:bg-primary-600 transition"
              >
                <Camera size={18} className="text-white" />
                <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            {currentUser?.isVerified ? (
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-green-50 border border-green-200 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-700 text-sm font-semibold">Վավերացված օգտատեր</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gray-100 border border-gray-300 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm font-medium">Չվավերացված օգտատեր</span>
                </div>
              </div>
            )}
            {form.formState.errors.root && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-primary-800">Անուն Ազգանուն</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Մուտքագրեք ձեր լրիվ անունը"
                        className="border-primary-800"
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
                    <FormLabel className="text-sm font-medium text-primary-800">Էլ. հասցե</FormLabel>
                    <FormControl>
                      <Input disabled type="email" className="border-primary-800" {...field} />
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
                    <FormLabel className="text-sm font-medium text-primary-800">Հեռախոսահամար</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="+374 77 000 000" className="border-primary-800" {...field} />
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
                    <FormLabel className="text-sm font-medium text-primary-800">Քաղաք</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-primary-800">
                          <SelectValue placeholder="Ընտրեք քաղաք" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-row gap-5">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary-800">Սեռ</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-primary-800">
                            <SelectValue placeholder="Ընտրեք սեռը" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Արական</SelectItem>
                          <SelectItem value="female">Իգական</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-primary-800">Տարիք</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value, 10))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="border-primary-800">
                            <SelectValue placeholder="Ընտրեք տարիքը" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ages.map((age) => (
                            <SelectItem key={age} value={age.toString()}>
                              {age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={(!form.formState.isDirty && !imageFile) || editMutation.isPending}
                className={cn("bg-primary-800 hover:bg-primary-700 text-white font-medium px-6 rounded-lg")}
              >
                {editMutation.isPending ? "Պահպանվում է..." : "Պահպանել փոփոխությունները"}
              </Button>
            </div>
          </form>
        </Form>
      </DashboardContent>
    </>
  );
};
