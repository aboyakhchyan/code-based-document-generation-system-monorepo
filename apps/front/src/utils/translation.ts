import { Gender, UserRole } from "@/types";

export const translateRoleToHy = (role: UserRole): string => {
  switch (role) {
    case UserRole.USER:
      return "Օգտատեր";
    case UserRole.ADMIN:
      return "Ադմինիստրատոր";
    default:
      return "Անհայտ";
  }
};

export const translateGenderToHy = (gender: Gender): string => {
  switch (gender) {
    case Gender.MALE:
      return "արական";
    case Gender.EMALE:
      return "իգական";
  }
};
