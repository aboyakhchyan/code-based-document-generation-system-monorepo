import type { BlockCategory, ImageBlock as ImageBlockType } from "@/types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
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
import { ChevronsDown, ChevronsUp, Ellipsis, ImageUp, RotateCcw, Trash2 } from "lucide-react";
import { OutsideClickWrapper } from "../common";
import env from "@/utils/env";

interface ImageBlockProps {
  block: ImageBlockType;
  onBlockDrag: (id: number, top: number, left: number, category: BlockCategory) => void;
  onBlockResize: (id: number, width: number, height: number, category: BlockCategory) => void;
  onToggleBlockEditMode: (id: number, mode: boolean, category: BlockCategory) => void;
  onDeleteBlock: (id: number, category: BlockCategory) => void;
  onBlockRotate: (id: number, rotation: number, category: BlockCategory) => void;
  onToggleBlockZIndex: (id: number, direction: "up" | "down", category: BlockCategory) => void;
  onDrag?: (x: number, y: number, width: number, height: number) => void;
  onDragStop?: () => void;
}

const ImageBlockComponent: React.FC<ImageBlockProps> = ({
  block,
  onBlockDrag,
  onBlockResize,
  onToggleBlockEditMode,
  onDeleteBlock,
  onBlockRotate,
  onToggleBlockZIndex,
  onDrag,
  onDragStop,
}) => {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const rotationStateRef = useRef<{
    center: { x: number; y: number };
    startAngle: number;
    startRotation: number;
  } | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const onBlockRotateRef = useRef(onBlockRotate);

  const imageURL = useMemo(() => {
    const objectURL = block.file ? URL.createObjectURL(block.file) : null;
    if (objectURL) {
      return objectURL;
    }

    if (!block.path) {
      return undefined;
    }

    const protocols = /^https?:\/\//;
    if (block.path.match(protocols)) {
      return block.path;
    }

    const normalizedPath = block.path.startsWith("/") ? block.path : `/${block.path}`;
    const publicPath = normalizedPath.startsWith("/public/") ? normalizedPath : `/public/uploads/${normalizedPath}`;

    return `${env.API_URL}${publicPath}`;
  }, [block.file, block.path]);

  useEffect(() => {
    onBlockRotateRef.current = onBlockRotate;
  }, [onBlockRotate]);

  const handleRotationMove = useCallback(
    (evt: MouseEvent) => {
      const state = rotationStateRef.current;
      if (!state) return;

      const { center, startAngle, startRotation } = state;
      const currentAngle = Math.atan2(evt.clientY - center.y, evt.clientX - center.x);
      const deltaAngle = currentAngle - startAngle;
      let rotation = startRotation + (deltaAngle * 180) / Math.PI;

      rotation = ((rotation % 360) + 360) % 360;
      onBlockRotateRef.current(block.id, Number(rotation.toFixed(2)), "imageBlocks");
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

      const element = imageRef.current;
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

      onToggleBlockEditMode(block.id, true, "imageBlocks");
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
      size={{ width: block.styles.width ?? 200, height: block.styles.height ?? 200 }}
      position={{ x: block.styles.left ?? 0, y: block.styles.top ?? 0 }}
      bounds="parent"
      style={{ zIndex: block.styles.isEditMode ? 999 : block.styles.zIndex }}
      onDrag={(_, d) => onDrag?.(d.x, d.y, block.styles.width ?? 200, block.styles.height ?? 200)}
      onDragStop={(_, d) => {
        onBlockDrag(block.id, d.y, d.x, "imageBlocks");
        onDragStop?.();
      }}
      onResizeStop={(_, __, ref) =>
        onBlockResize(block.id, parseInt(ref.style.width), parseInt(ref.style.height), "imageBlocks")
      }
      disableDragging={!block.styles.isEditMode}
      enableResizing={block.styles.isEditMode}
      className={cn(
        "p-1 bg-transparent transition-colors duration-200 hover:outline hover:outline-dashed hover:outline-primary-600",
        block.styles.isEditMode && "outline outline-dashed outline-primary-600"
      )}
    >
      <OutsideClickWrapper cb={() => block.styles.isEditMode && onToggleBlockEditMode(block.id, false, "imageBlocks")}>
        <div
          ref={imageRef}
          className={cn(
            "relative w-full h-full transition-transform ease-in-out",
            block.styles.isEditMode && "border border-dashed border-primary-600"
          )}
          onClick={() => onToggleBlockEditMode(block.id, true, "imageBlocks")}
          style={{
            transform: `rotate(${block.styles.rotation ?? 0}deg)`,
            transformOrigin: "center",
            transitionDuration: isRotating ? "0ms" : "200ms",
          }}
        >
          <img
            src={imageURL || undefined}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: block.styles.isEditMode ? "move" : "",
            }}
            alt={block.file?.name || "image-block"}
          />

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
                  onSelect={(evt) => evt.preventDefault()}
                  onMouseDown={(evt) => evt.stopPropagation()}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    onDeleteBlock(block.id, "imageBlocks");
                  }}
                  className="flex items-center justify-cetner"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center rounded-lg cursor-pointer text-error-50 hover:text-white hover:bg-error-50 w-1/2 p-2 transition-colors duration-300">
                        <Trash2 size={20} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Ջնջել</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => onToggleBlockZIndex(block.id, "down", "imageBlocks")}
                        className="flex flex-col items-center justify-center w-1/2 p-2 rounded-lg group hover:bg-pink-400 text-pink-400 hover:text-white transition-colors duration-300 cursor-pointer"
                      >
                        <ImageUp size={20} className="Փոխել" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Փոխել</TooltipContent>
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
                        onClick={() => onToggleBlockZIndex(block.id, "up", "imageBlocks")}
                        className="flex flex-col items-center justify-center w-1/3 p-2 rounded-lg group hover:bg-green-400 hover:text-white transition-colors duration-300 cursor-pointer"
                      >
                        <ChevronsUp size={20} className="text-green-400 transition-colors duration-300" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Առաջ բերել</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => onToggleBlockZIndex(block.id, "down", "imageBlocks")}
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
              rounded-full p-2 cursor-pointer
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

ImageBlockComponent.displayName = "ImageBlock";

export const ImageBlock = React.memo(ImageBlockComponent);
