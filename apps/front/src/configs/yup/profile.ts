import * as yup from "yup";
import { ages, cities } from "@/constants/cities";

export const editProfileSchema = yup.object().shape({
  fullName: yup.string().optional(),
  email: yup.string().email("Էլ․ փոստի հասցեն անվավեր է").optional(),
  phone: yup
    .string()
    .matches(/^\+?[0-9\s\-()]{7,20}$/, "Խնդրում ենք մուտքագրել վավեր հեռախոսահամար")
    .optional(),
  city: yup
    .string()
    .oneOf(
      cities.map((c) => c.name),
      "Խնդրում ենք ընտրել քաղաք"
    )
    .optional(),
  gender: yup.string().oneOf(["male", "female"], "Խնդրում ենք ընտրել սեռը").optional(),
  age: yup.number().oneOf(ages, "Խնդրում ենք ընտրել տարիքը").optional(),
});
