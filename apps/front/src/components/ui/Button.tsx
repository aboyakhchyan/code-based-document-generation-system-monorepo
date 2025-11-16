import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";
import { useId } from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "success" | "error" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
  children: React.ReactNode;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-100 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
        secondary: "bg-secondary-200 text-secondary-700 hover:bg-secondary-300 focus-visible:ring-secondary-500",
        ghost: "border-1 border-primary-800 text-primary-800",
        success: "bg-success-200 text-white hover:bg-success-600 focus-visible:ring-success-500",
        error: "bg-error-100 text-white hover:bg-error-600 focus-visible:ring-error-500",
        link: "text-primary-500 underline-offset-4 hover:underline focus-visible:ring-primary-500",
      },
      size: {
        sm: "h-8 text-sm px-3 py-1",
        md: "h-9 text-sm px-4 py-2",
        lg: "h-10 text-base px-5 py-2.5",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button: React.FC<IButtonProps> = ({ className, variant, size, children, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp {...props} className={cn(buttonVariants({ variant, size, className }))}>
      {children}
    </Comp>
  );
};


export const AIButton: React.FC<{ className?: string; isActive?: boolean }> = ({ className, isActive = false }) => {
  const rawId = useId();
  const gradientId = `bot-gradient-${rawId.replace(/:/g, "")}`;
  const stroke = isActive ? "#FFFFFF" : `url(#${gradientId})`;

  return (
    <svg
      className={cn("h-5 w-5", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {!isActive && (
        <defs>
          <linearGradient id={gradientId} x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EEAECA" />
            <stop offset="1" stopColor="#94BBE9" />
          </linearGradient>
        </defs>
      )}
      <path d="M12 8V4H8" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect width="16" height="12" x="4" y="8" rx="2" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 14h2" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 14h2" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 13v2" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13v2" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
