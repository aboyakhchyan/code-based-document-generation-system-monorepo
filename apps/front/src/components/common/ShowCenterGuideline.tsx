import React from "react";
import { cn } from "../ui";

interface IPercents {
  25: boolean;
  50: boolean;
  75: boolean;
}

interface IShowCenterGuideline {
  showVertical: IPercents;
  showHorizontal: IPercents;
}

const PERCENTS = [25, 50, 75] as const;

export const ShowCenterGuideline: React.FC<IShowCenterGuideline> = ({ showHorizontal, showVertical }) => {
  return (
    <>
      {PERCENTS.map((percent) => {
        if (!showHorizontal[percent]) return null;
        return (
          <div
            key={`horizontal-${percent}`}
            className={cn(
              "absolute left-0 w-full border-1 border-dashed pointer-events-none z-50",
              percent === 50 ? "border-primary-800" : "border-green-600"
            )}
            style={{
              top: `${percent}%`,
              height: "2px",
              transform: "translateY(-50%)",
            }}
          />
        );
      })}

      {PERCENTS.map((percent) => {
        if (!showVertical[percent]) return null;
        return (
          <div
            key={`vertical-${percent}`}
            className={cn(
              "absolute top-0 h-full border-1 border-dashed pointer-events-none z-50",
              percent === 50 ? "border-primary-800" : "border-green-600"
            )}
            style={{
              left: `${percent}%`,
              width: "2px",
              transform: "translateX(-50%)",
            }}
          />
        );
      })}
    </>
  );
};
