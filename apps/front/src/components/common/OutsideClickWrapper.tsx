import { useRef } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface OutsideClickWrapperProps {
  children: React.ReactNode;
  cb: () => void;
}

export const OutsideClickWrapper: React.FC<OutsideClickWrapperProps> = ({ children, cb }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick<HTMLDivElement>(ref, cb);

  return (
    <div className="w-full h-full" ref={ref}>
      {children}
    </div>
  );
};
