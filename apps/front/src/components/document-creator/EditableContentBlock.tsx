import type { BlockCategory, IContentBlock } from "@/types";
import { CheckCheck, ChevronsDown, ChevronsUp, Copy, Ellipsis, PaintBucket, Palette, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
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

interface EditableContentBlockProps {
  block: IContentBlock;
  isEditMode: boolean;
  onContentChange: (id: number, value: string) => void;
  onChangeColor: (
    evt: React.ChangeEvent<HTMLInputElement>,
    id: number,
    property: keyof IContentBlock["styles"],
    category: BlockCategory
  ) => void;
  onDeleteBlock: (id: number, category: BlockCategory) => void;
  onBlur: () => void;
  onResize: (id: number, height: number) => void;
  onToggleBlockZIndex: (id: number, direction: "up" | "down", category: BlockCategory) => void;
}

const EditableContentBlockComponent: React.FC<EditableContentBlockProps> = ({
  block,
  isEditMode,
  onContentChange,
  onChangeColor,
  onDeleteBlock,
  onBlur,
  onResize,
  onToggleBlockZIndex,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [localContent, setLocalContent] = useState(block.content);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const colorPickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (block.content !== localContent && !isEditMode) {
      setLocalContent(block.content);
      if (contentRef.current) {
        contentRef.current.innerHTML = block.content;
        adjustHeight();
      }
    }
  }, [block.content, isEditMode]);

  const handleCopyText = async () => {
    if (contentRef.current?.textContent) {
      try {
        await navigator.clipboard.writeText(contentRef.current.textContent);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
      } catch {
        setIsCopied(false);
      }
    }
  };

  const adjustHeight = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

      el.style.height = "auto";
      const scrollHeight = el.scrollHeight;
      el.style.height = `${scrollHeight}px`;
      el.style.overflowY = scrollHeight > parseInt(el.style.maxHeight || "0") ? "auto" : "hidden";

      if (Math.abs(scrollHeight - block.styles.height) > 1) {
        onResize(block.id, scrollHeight);
      }

      if (range && selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }, [block.styles.height, block.id, onResize]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      let value = target.innerHTML;

      if (value === "<br>" || value.trim() === "") {
        value = "";
        target.innerHTML = "";
      }

      setLocalContent(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        onContentChange(block.id, value);
      }, 200);

      adjustHeight();
    },
    [block.id, onContentChange, adjustHeight]
  );

  const handleBlur = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onContentChange(block.id, localContent);
    onBlur();
  }, [block.id, localContent, onContentChange, onBlur]);

  useEffect(() => {
    adjustHeight();
  }, [isEditMode, adjustHeight]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== localContent) {
      contentRef.current.innerHTML = localContent;
      adjustHeight();
    }
  }, []);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        className="w-full p-1 outline-none  resize-none box-border"
        style={{
          fontSize: `${block.styles.fontSize}px`,
          fontWeight: block.styles.fontWeight,
          color: block.styles.color || "black",
          fontFamily: block.styles.fontFamily
            ? block.styles.fontFamily.includes(" ")
              ? `"${block.styles.fontFamily}"`
              : block.styles.fontFamily
            : "Arial",
          textAlign: block.styles.textAlign,
          ...(block.styles.textDecoration ? { textDecoration: block.styles.textDecoration } : null),
          ...(block.styles.fontStyle ? { fontStyle: block.styles.fontStyle } : null),
          minHeight: "20px",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
        onBlur={handleBlur}
        onInput={handleInput}
        onFocus={adjustHeight}
      />
      <div
        onClick={handleCopyText}
        className={cn("absolute top-1 right-1 cursor-pointer transition-colors duration-300 z-10")}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            {isCopied ? (
              <CheckCheck size={15} className={cn(isCopied ? "text-green-400" : "text-gray-400")} />
            ) : (
              <Copy size={15} className={cn(isCopied ? "text-green-400" : "text-gray-400")} />
            )}
          </TooltipTrigger>
          <TooltipContent>{isCopied ? "Պատճենված է" : "Պատճենել"}</TooltipContent>
        </Tooltip>
      </div>
      {isEditMode && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(evt) => evt.stopPropagation()}
                  className="absolute top-[-30px] right-1 transition-opacity p-1 rounded cursor-pointer"
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
                onDeleteBlock(block.id, "contentBlocks");
              }}
              className="group flex justify-center cursor-pointer hover:bg-error-50 transition-colors duration-300"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Trash2 size={20} className="text-error-50 group-hover:text-white transition-colors duration-300" />
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
                      onChange={(evt) => onChangeColor(evt, block.id, "color", "contentBlocks")}
                      ref={colorPickerRef}
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Տեքստի գույն</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex flex-col items-center justify-center w-1/2 p-2 rounded-lg group hover:bg-orange-400 transition-colors duration-300">
                    <PaintBucket
                      size={20}
                      className="text-orange-400 group-hover:text-white transition-colors duration-300"
                    />
                    <input
                      onChange={(evt) => onChangeColor(evt, block.id, "backgroundColor", "contentBlocks")}
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
                    onClick={() => onToggleBlockZIndex(block.id, "up", "contentBlocks")}
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
                    onClick={() => onToggleBlockZIndex(block.id, "down", "contentBlocks")}
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
    </div>
  );
};

EditableContentBlockComponent.displayName = "EditableContentBlock";

export default EditableContentBlockComponent;

export const EditableContentBlock = EditableContentBlockComponent;
