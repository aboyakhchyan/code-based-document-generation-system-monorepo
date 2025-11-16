import { cn } from "./utils";

interface ISpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
  label?: string;
}

const sizeMap: Record<Required<ISpinnerProps>["size"], { wrapper: string; spinner: string }> = {
  sm: {
    wrapper: "min-w-[2rem] min-h-[2rem]",
    spinner: "w-6 h-6 border-2",
  },
  md: {
    wrapper: "min-w-[2.5rem] min-h-[2.5rem]",
    spinner: "w-10 h-10 border-[3px]",
  },
  lg: {
    wrapper: "min-w-[3.5rem] min-h-[3.5rem]",
    spinner: "w-14 h-14 border-4",
  },
};

export const Spinner: React.FC<ISpinnerProps> = ({ size = "md", fullScreen = false, className, label }) => {
  const currentSize = sizeMap[size];

  return (
    <div
      className={cn(
        fullScreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-sm"
          : "inline-flex flex-col items-center justify-center gap-3",
        currentSize.wrapper,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "rounded-full border-solid border-gray-50 border-t-primary-600 animate-spin",
          currentSize.spinner
        )}
      />
      {label && <span className="text-sm font-medium text-primary-700 tracking-wide uppercase">{label}</span>}
    </div>
  );
};
