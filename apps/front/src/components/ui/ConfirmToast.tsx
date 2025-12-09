import React from "react";
import { Button } from "@/components/ui";

interface IConfirmToastProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmToast: React.FC<IConfirmToastProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col gap-3 p-4 min-w-[300px]">
      <p className="text-sm text-gray-800 font-medium">{message}</p>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Ոչ
        </Button>
        <Button variant="primary" size="sm" onClick={onConfirm}>
          Այո
        </Button>
      </div>
    </div>
  );
};
