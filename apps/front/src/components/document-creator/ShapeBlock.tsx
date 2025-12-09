import type { BlockCategory, IContentBlock, ShapeBlock as ShapeBlockType } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { OutsideClickWrapper } from "../common";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui";
import { ChevronsDown, ChevronsUp, Ellipsis, PaintBucket, Palette, RotateCcw, Trash2 } from "lucide-react";

interface IShapeBlockProps {
  block: ShapeBlockType;
  onBlockDrag: (id: number, top: number, left: number, category: BlockCategory) => void;
  onBlockResize: (id: number, width: number, height: number, category: BlockCategory) => void;
  onToggleBlockEditMode: (id: number, mode: boolean, category: BlockCategory) => void;
  onDeleteBlock: (id: number, category: BlockCategory) => void;
  onBlockRotate: (id: number, rotation: number, category: BlockCategory) => void;
  onChangeColor: (
    evt: React.ChangeEvent<HTMLInputElement>,
    id: number,
    property: keyof IContentBlock["styles"] | keyof ShapeBlockType["styles"],
    category: BlockCategory
  ) => void;
  onToggleBlockZIndex: (id: number, direction: "up" | "down", category: BlockCategory) => void;
  onDrag?: (x: number, y: number, width: number, height: number) => void;
  onDragStop?: () => void;
}

const ShapeBlockComponent: React.FC<IShapeBlockProps> = ({
  block,
  onBlockDrag,
  onBlockResize,
  onToggleBlockEditMode,
  onDeleteBlock,
  onBlockRotate,
  onChangeColor,
  onToggleBlockZIndex,
  onDrag,
  onDragStop,
}) => {
  const shapeRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRef = useRef<HTMLInputElement | null>(null);
  const rotationStateRef = useRef<{
    center: { x: number; y: number };
    startAngle: number;
    startRotation: number;
  } | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const onBlockRotateRef = useRef(onBlockRotate);

  useEffect(() => {
    onBlockRotateRef.current = onBlockRotate;
  }, [onBlockRotate]);

  const handleRotationMove = useCallback(
    (evt: MouseEvent) => {
      const state = rotationStateRef.current;
      if (!state) {
        return;
      }

      const { center, startAngle, startRotation } = state;
      const currentAngle = Math.atan2(evt.clientY - center.y, evt.clientX - center.x);
      const deltaAngle = currentAngle - startAngle;
      let rotation = startRotation + (deltaAngle * 180) / Math.PI;

      rotation = ((rotation % 360) + 360) % 360;
      onBlockRotateRef.current(block.id, Number(rotation.toFixed(2)), "shapeBlocks");
    },
    [block.id]
  );

  const handleRotationEnd = useCallback(() => {
    rotationStateRef.current = null;
    setIsRotating(false);
    document.removeEventListener("mousemove", handleRotationMove);
    document.removeEventListener("mouseup", handleRotationEnd);
  }, [handleRotationMove]);

  const handleRotationStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const element = shapeRef.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      const startAngle = Math.atan2(event.clientY - center.y, event.clientX - center.x);

      rotationStateRef.current = {
        center,
        startAngle,
        startRotation: block.styles.rotation ?? 0,
      };

      onToggleBlockEditMode(block.id, true, "shapeBlocks");
      setIsRotating(true);

      document.addEventListener("mousemove", handleRotationMove);
      document.addEventListener("mouseup", handleRotationEnd);
    },
    [block.id, block.styles.rotation, handleRotationEnd, handleRotationMove, onToggleBlockEditMode]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleRotationMove);
      document.removeEventListener("mouseup", handleRotationEnd);
      rotationStateRef.current = null;
      setIsRotating(false);
    };
  }, [handleRotationEnd, handleRotationMove]);

  return (
    <Rnd
      key={block.id}
      size={{ width: block.styles.width, height: block.styles.height }}
      position={{ x: block.styles.left, y: block.styles.top }}
      bounds="parent"
      style={{ zIndex: block.styles.isEditMode ? 999 : block.styles.zIndex }}
      onDrag={(_, d) => onDrag?.(d.x, d.y, block.styles.width, block.styles.height)}
      onDragStop={(_, d) => {
        onBlockDrag(block.id, d.y, d.x, "shapeBlocks");
        onDragStop?.();
      }}
      onResizeStop={(_, __, ref) =>
        onBlockResize(block.id, parseFloat(ref.style.width), parseFloat(ref.style.height), "shapeBlocks")
      }
      enableResizing={block.styles.isEditMode}
      disableDragging={isRotating}
      className={cn(
        "p-1 bg-transparent transition-colors duration-200 hover:outline hover:outline-dashed hover:outline-primary-600",
        block.styles.isEditMode && "outline outline-dashed outline-primary-600"
      )}
    >
      <OutsideClickWrapper cb={() => block.styles.isEditMode && onToggleBlockEditMode(block.id, false, "shapeBlocks")}>
        <div
          ref={shapeRef}
          className={cn(
            "relative w-full h-full transition-transform ease-in-out",
            block.styles.isEditMode
              ? "outline outline-dashed outline-primary-600"
              : "hover:outline hover:outline-dashed hover:outline-primary-600"
          )}
          style={{
            transform: `rotate(${block.styles.rotation}deg)`,
            transformOrigin: "center",
            transitionDuration: isRotating ? "0ms" : "200ms",
          }}
        >
          {block.shapeType === "rectangle" && (
            <div
              onClick={() => onToggleBlockEditMode(block.id, true, "shapeBlocks")}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: block.styles.backgroundColor,
                border: `2px solid ${block.styles.borderColor}`,
                borderRadius: 0,
              }}
            />
          )}

          {block.shapeType === "circle" && (
            <div
              onClick={() => onToggleBlockEditMode(block.id, true, "shapeBlocks")}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: block.styles.backgroundColor,
                border: `2px solid ${block.styles.borderColor}`,
                borderRadius: "50%",
              }}
            />
          )}

          {block.shapeType === "triangle" && (
            <svg
              onClick={() => onToggleBlockEditMode(block.id, true, "shapeBlocks")}
              width="100%"
              height="100%"
              viewBox={`0 0 ${block.styles.width} ${block.styles.height}`}
              preserveAspectRatio="none"
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <polygon
                points={`0,${block.styles.height} ${block.styles.width / 2},0 ${block.styles.width},${
                  block.styles.height
                }`}
                fill={block.styles.backgroundColor}
                stroke={block.styles.borderColor}
                strokeWidth={2}
              />
            </svg>
          )}

          {block.shapeType === "line" && (
            <div
              onClick={() => onToggleBlockEditMode(block.id, true, "shapeBlocks")}
              style={{
                width: "100%",
                height: block.lineWidth || 2,
                backgroundColor: block.styles.borderColor,
              }}
            />
          )}
          {block.styles.isEditMode && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(evt) => evt.stopPropagation()}
                      className="absolute top-[-30px] right-1  p-1 rounded cursor-pointer"
                    >
                      <Ellipsis size={18} className="text-primary-600" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Ընտրանքներ</TooltipContent>
              </Tooltip>

              <DropdownMenuContent
                onMouseDown={(evt) => evt.stopPropagation()}
                onClick={(evt) => evt.stopPropagation()}
                align="start"
                className="text-sm"
              >
                <DropdownMenuItem
                  onMouseDown={(evt) => evt.stopPropagation()}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    onDeleteBlock(block.id, "shapeBlocks");
                  }}
                  className="group flex justify-center cursor-pointer  hover:bg-error-50 transition-colors duration-300"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Trash2
                          size={20}
                          className="text-error-50 group-hover:text-white transition-colors duration-300"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Ջնջել</TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  onMouseDown={(evt) => evt.stopPropagation()}
                  className="flex items-center justify-between gap-2 cursor-pointer"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative flex flex-col items-center justify-center w-1/2 p-2 rounded-lg group hover:bg-yellow-400 transition-colors duration-300">
                        <Palette
                          size={20}
                          className="text-yellow-400 group-hover:text-white transition-colors duration-300"
                        />
                        <input
                          onChange={(evt) => onChangeColor(evt, block.id, "borderColor", "shapeBlocks")}
                          ref={colorPickerRef}
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Սահմանի գույն</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative flex flex-col items-center justify-center w-1/2 p-2 rounded-lg group hover:bg-orange-400 transition-colors duration-300">
                        <PaintBucket
                          size={20}
                          className="text-orange-400 group-hover:text-white transition-colors duration-300"
                        />
                        <input
                          onChange={(evt) => onChangeColor(evt, block.id, "backgroundColor", "shapeBlocks")}
                          ref={colorPickerRef}
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Ֆոնի գույն</TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  onMouseDown={(evt) => evt.stopPropagation()}
                  onClick={(evt) => evt.stopPropagation()}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => onToggleBlockZIndex(block.id, "up", "shapeBlocks")}
                        className="flex flex-col items-center justify-center w-1/3 p-2 rounded-lg group hover:bg-green-400 transition-colors duration-300 cursor-pointer"
                      >
                        <ChevronsUp
                          size={20}
                          className="text-green-400 group-hover:text-white transition-colors duration-300"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Առաջ բերել</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => onToggleBlockZIndex(block.id, "down", "shapeBlocks")}
                        className="flex flex-col items-center justify-center w-1/3 p-2 rounded-lg group hover:bg-blue-400 transition-colors duration-300 cursor-pointer"
                      >
                        <ChevronsDown
                          size={20}
                          className="text-blue-400 group-hover:text-white transition-colors duration-300"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Ետ բերել</TooltipContent>
                  </Tooltip>
                  <div className="flex items-center justify-center w-1/3">{block.styles.zIndex}</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {block.styles.isEditMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="
                      absolute bottom-[-25px] right-[-25px]
                    bg-white shadow-md border border-gray-200
                      rounded-full p-2 cursor-rotate
                      flex items-center justify-center select-none z-20
                      group
                    "
                  onMouseDown={handleRotationStart}
                  role="button"
                  tabIndex={0}
                >
                  <RotateCcw
                    size={18}
                    className="text-primary-600 group-hover:text-primary-800 transition-transform duration-300 group-hover:rotate-[-30deg]"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Պտտել</TooltipContent>
            </Tooltip>
          )}
        </div>
      </OutsideClickWrapper>
    </Rnd>
  );
};

ShapeBlockComponent.displayName = "ShapeBlock";

export const ShapeBlock = React.memo(ShapeBlockComponent);
