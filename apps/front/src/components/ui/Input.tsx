import React, { useState } from "react";
import { cn } from "./utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ className, icon = null, type, ...props }) => {
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const isPwdInput = type === "password";

  return (
    <div className="relative">
      <input
        type={!showPwd ? type : "text"}
        data-slot="input"
        className={cn(
          "w-full px-4 py-2 rounded-lg text-sm border border-gray-300 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white",
          className
        )}
        {...props}
      />
      {icon && <div className="absolute top-2 right-2">{icon}</div>}
      {isPwdInput &&
        (showPwd ? (
          <div onClick={() => setShowPwd(false)} className="absolute top-1/4 right-1 text-primary-800 cursor-pointer">
            <Eye size={20} />
          </div>
        ) : (
          <div onClick={() => setShowPwd(true)} className="absolute top-1/4 right-1 text-primary-800 cursor-pointer">
            <EyeOff size={20} />
          </div>
        ))}
    </div>
  );
};
