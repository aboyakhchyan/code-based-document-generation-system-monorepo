import * as yup from "yup";
import { ages, cities } from "@/constants/cities";

export const registerSchema = yup.object().shape({
  fullName: yup.string().required("Խնդրում ենք մուտքագրել անուն և ազգանունը"),
  email: yup
    .string()
    .email("Էլ․ փոստի հասցեն անվավեր է")
    .required("Խնդրում ենք մուտքագրել էլ․ փոստի հասցեն"),
  phone: yup
    .string()
    .matches(/^\+?\d{7,15}$/, "Խնդրում ենք մուտքագրել վավեր հեռախոսահամար")
    .required("Խնդրում ենք մուտքագրել հեռախոսահամարը"),
  city: yup
    .string()
    .oneOf(
      cities.map((c) => c.name),
      "Խնդրում ենք ընտրել քաղաք"
    )
    .required("Խնդրում ենք ընտրել քաղաք"),
  gender: yup
    .string()
    .oneOf(["male", "female"], "Խնդրում ենք ընտրել սեռը")
    .required("Խնդրում ենք ընտրել սեռը"),
  age: yup
    .number()
    .oneOf(ages, "Խնդրում ենք ընտրել տարիքը")
    .required("Խնդրում ենք մուտքագրել տարիքը"),
  password: yup
    .string()
    .min(6, "Գաղտնաբառը պետք է լինի առնվազն 6 նիշ")
    .required("Խնդրում ենք մուտքագրել գաղտնաբառը"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Գաղտնաբառերը չեն համընկնում")
    .required("Խնդրում ենք կրկնել գաղտնաբառը"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Էլ․ փոստի հասցեն անվավեր է")
    .required("Խնդրում ենք մուտքագրել էլ․ փոստի հասցեն"),
  password: yup
    .string()
    .min(6, "Գաղտնաբառը պետք է լինի առնվազն 6 նիշ")
    .required("Խնդրում ենք մուտքագրել գաղտնաբառը"),
});
