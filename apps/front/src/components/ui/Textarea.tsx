import React from "react";
import { cn } from "./utils";

interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn("border-input outline-none", className)}
      {...props}
    />
  );
};
