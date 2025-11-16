import React from "react";

interface PercentRulerProps {
  width: number;
  height: number;
}

export const PercentRuler: React.FC<PercentRulerProps> = ({ width, height }) => {
  const percents = [25, 50, 75];

  return (
    <>
      <div
        className="absolute pointer-events-none z-40"
        style={{
          left: `0`,
          top: `-30px`,
          width: `${width}px`,
          height: "20px",
        }}
      >
        {percents.map((percent) => (
          <div
            key={`top-${percent}`}
            className="absolute flex flex-col items-center"
            style={{
              left: `${(percent / 100) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-xs text-primary-800 font-medium mt-0.5">{percent}%</span>
          </div>
        ))}
      </div>

      <div
        className="absolute pointer-events-none z-40"
        style={{
          right: `-50px`,
          top: `0`,
          width: "40px",
          height: `${height}px`,
        }}
      >
        {percents.map((percent) => (
          <div
            key={`right-${percent}`}
            className="absolute flex flex-row items-center justify-end"
            style={{
              top: `${(percent / 100) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <span className="text-xs text-primary-800 font-medium mr-1">{percent}%</span>
          </div>
        ))}
      </div>
    </>
  );
};
