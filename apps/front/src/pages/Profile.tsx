import React, { useState } from "react";
import { Camera, UserRoundPen } from "lucide-react";
import { DashboardContent, DashboardHeader } from "@/components/dashboard";
import { Input, Button } from "@/components/ui";
import { Gender, type IUser } from "@/types";
import { user as userData } from "@/constants/students";
import boyIcon from "@/assets/icons/boy.png";
import womanIcon from "@/assets/icons/woman.png";

export const Profile = () => {
  const [user, setUser] = useState<IUser>(userData);
  const [image, setImage] = useState<string>("");

  const isMan = userData.gender === Gender.MALE;
  const defaultPicture = isMan ? boyIcon : womanIcon;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  return (
    <>
      <DashboardHeader>
        <div className="w-full flex items-center gap-4 p-5 font-bold text-primary-800">
          <UserRoundPen size={40} /><h1 className="text-2xl">Անձնական տվյալներ</h1>
        </div>
      </DashboardHeader>

      <DashboardContent>
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div className="relative w-36 h-36 mx-auto">
            <img
              src={user.picture ? user.picture : image ? image : defaultPicture}
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

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-primary-800">Էլ. հասցե</label>
              <Input type="email" value={user.email} disabled className="border-primary-800 text-gray-700" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-primary-800">Անուն Ազգանուն</label>
              <Input
                type="text"
                defaultValue={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                placeholder="Մուտքագրեք ձեր լրիվ անունը"
                className="border-primary-800"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-primary-800">Հին գաղտնաբառ</label>
              <Input type="password" placeholder="Մուտքագրեք հին գաղտնաբառը" className="border-primary-800" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-primary-800">Նոր գաղտնաբառ</label>
              <Input type="password" placeholder="Մուտքագրեք նոր գաղտնաբառը" className="border-primary-800" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-primary-800 hover:bg-primary-700 text-white font-medium px-6 rounded-lg">
              Պահպանել փոփոխությունները
            </Button>
          </div>
        </div>
      </DashboardContent>
    </>
  );
};
