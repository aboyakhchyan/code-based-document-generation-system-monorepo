import { dimensions } from "@/constants";
import type { IDocument } from "@/types";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import { Checkbox, cn, Input, Label } from "../ui";

interface IDimensionSettingsProps {
  documentData: IDocument | null;
  onSetDocumentData: Dispatch<SetStateAction<IDocument | null>>;
  onSetFormat: Dispatch<SetStateAction<string>>;
}

export const DimensionsSettings: React.FC<IDimensionSettingsProps> = ({
  documentData,
  onSetDocumentData,
  onSetFormat,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const format = documentData?.dimension?.format ?? "";

  useEffect(() => {
    setIsChecked(format === "custom");
  }, [documentData]);

  const handleChangeFormat = (format: string) => {
    onSetFormat(format);
  };

  const handleWidthChange = (value: number) => {
    onSetDocumentData((prev) => (prev ? { ...prev, dimension: { ...prev.dimension!, width: value } } : prev));
  };

  const handleHeightChange = (value: number) => {
    onSetDocumentData((prev) => (prev ? { ...prev, dimension: { ...prev.dimension!, height: value } } : prev));
  };
  return (
    <div className="flex flex-col items-cetner gap-10 w-full">
      {!!dimensions.length &&
        dimensions.slice(0, dimensions.length - 1).map((dimension, index) => {
          const { title, width, height, sizeType, size, preview } = dimension;
          const isActive = format === dimension.format && !isChecked;
          return (
            <div key={index} className="flex flex-row gap-5">
              <div
                onClick={() => handleChangeFormat(dimension.format)}
                className={cn(
                  "group flex items-center justify-center border-2 border-dashed cursor-pointer border-primary-950 hover:bg-primary-950 hover:border-gray-200 transition-colors duration-300",
                  isActive && "bg-primary-950 border-gray-200"
                )}
                style={{
                  width: `${preview?.width}px`,
                  height: `${preview?.height}px`,
                }}
              >
                <p
                  className={cn(
                    "text-sm text-primary-950 group-hover:text-white transition-colors duration-300",
                    isActive && "text-white"
                  )}
                >
                  {title}
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm">
                  {width} - {height} px
                </p>
                <p className="text-sm">
                  {size} {sizeType}
                </p>
              </div>
            </div>
          );
        })}
      <div className="flex flex-col gap-5 w-full">
        <Label className="flex items-center gap-2 text-primary-950 cursor-pointer">
          <Checkbox
            className="cursor-pointer"
            checked={isChecked}
            onCheckedChange={(checked: boolean) => onSetFormat(checked ? "custom" : "a4")}
          />
          Անհատական չափսեր
        </Label>

        <div className="flex flex-row items-center justify-start gap-5">
          <Input
            type="number"
            value={documentData?.dimension?.width || ""}
            onChange={(evt) => {
              let value = Number(evt.target.value);
              if (!isNaN(value)) {
                if (value > 3000) value = 3000;
                handleWidthChange(value);
              }
            }}
            disabled={!isChecked}
            min={100}
            max={9999}
            className="w-20"
          />
          ×
          <Input
            type="number"
            value={documentData?.dimension?.height || ""}
            onChange={(evt) => {
              let value = Number(evt.target.value);
              if (!isNaN(value)) {
                if (value > 5000) value = 5000;
                handleHeightChange(value);
              }
            }}
            disabled={!isChecked}
            min={100}
            max={5000}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};
