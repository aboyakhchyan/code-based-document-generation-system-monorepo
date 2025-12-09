import { cn } from "./utils";

interface ISkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<ISkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}) => {
  const variantStyles = {
    rectangular: "",
    circular: "rounded-full",
    rounded: "rounded-lg",
  };

  const animationStyles = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn("bg-gray-200", variantStyles[variant], animationStyles[animation], className)}
      style={style}
      aria-label="Loading..."
      role="status"
    />
  );
};
