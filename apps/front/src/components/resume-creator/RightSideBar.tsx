import { AIButton, Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "../ui";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { IDocument } from "@/types";
import { Ratio } from "lucide-react";
import { DimensionsSettings } from "./DimensionSettings";
import { AIGenerator } from "../assistant";

interface IRightSideBarProps {
  documentData: IDocument | null;
  onSetDocumentData: Dispatch<SetStateAction<IDocument | null>>;
  onSetFormat: Dispatch<SetStateAction<string>>;
}

type ActivePartType = "dimensions" | "ai-generator";

export const RightSideBar: React.FC<IRightSideBarProps> = ({ documentData, onSetDocumentData, onSetFormat }) => {
  const [isAiHovered, setIsAiHovered] = useState<boolean>(false);
  const [activePart, setActivePart] = useState<ActivePartType>("dimensions");

  const isDimensionsActive = activePart === "dimensions";
  const isAiActive = activePart === "ai-generator";

  return (
    <aside className="flex flex-col gap-15 items-center w-1/3 h-full p-4  rounded-tl-3xl bg-gray-50 border-gray-200 border-1">
      <div className="flex flex-row gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "group flex items-center gap-2 border-[1.5px] rounded-xl font-medium transition-all duration-300",
                isDimensionsActive
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-primary-800 hover:bg-primary-800 hover:text-white"
              )}
              variant="ghost"
              onClick={() => setActivePart("dimensions")}
            >
              <Ratio
                size={20}
                className={cn(
                  "group-hover:text-white transition-colors duration-300",
                  isDimensionsActive ? "text-white" : "text-primary-800"
                )}
              />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
                  isDimensionsActive ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
                )}
                style={{
                  transitionProperty: "max-width, opacity, color",
                }}
              >
                <span
                  className={cn(
                    "transition-colors duration-300",
                    isDimensionsActive ? "text-white" : "text-primary-800"
                  )}
                >
                  Փաստաթղթի չափսերը
                </span>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Փաստաթղթի չափսերը</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "inline-flex items-center gap-2 font-semibold border-[1.5px] border-transparent rounded-xl transition-all duration-300",
                "bg-gradient-to-r from-[#EEAECA] to-[#94BBE9] bg-clip-border",
                "hover:scale-[1.02]"
              )}
              style={{
                background:
                  isAiHovered || isAiActive
                    ? "linear-gradient(90deg, #EEAECA, #94BBE9) padding-box, linear-gradient(90deg, #EEAECA, #94BBE9) border-box"
                    : "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #EEAECA, #94BBE9) border-box",
                borderRadius: "0.75rem",
              }}
              variant="ghost"
              onMouseEnter={() => setIsAiHovered(true)}
              onMouseLeave={() => setIsAiHovered(false)}
              onClick={() => setActivePart("ai-generator")}
            >
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
                  isAiActive ? "max-w-[160px]" : "max-w-0 opacity-0"
                )}
                style={{
                  transitionProperty: "max-width, color, opacity",
                }}
              >
                <span
                  className={cn(
                    "transition-colors duration-300",
                    isAiHovered || isAiActive
                      ? "text-white"
                      : "bg-gradient-to-r from-[#EEAECA] to-[#94BBE9] bg-clip-text text-transparent"
                  )}
                >
                  AI գեներացում
                </span>
              </span>
              <AIButton isActive={isAiHovered || isAiActive} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>AI գեներացում</TooltipContent>
        </Tooltip>
      </div>

      {activePart === "dimensions" ? (
        <DimensionsSettings documentData={documentData} onSetDocumentData={onSetDocumentData} onSetFormat={onSetFormat} />
      ) : activePart === "ai-generator" ? (
        <AIGenerator />
      ) : null}
    </aside>
  );
};
