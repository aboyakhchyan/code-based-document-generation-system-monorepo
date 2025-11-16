import type { BlockCategory, IContentBlock } from "@/types";
import React, { useRef } from "react";

interface IContentBlockProps {
  block: IContentBlock;
  onToggleBlockEditMode: (id: number, mode: boolean, category: BlockCategory) => void;
  onSetSelectedBlockId: (id: number) => void;
}

const DRAG_THRESHOLD = 5;

const ContentBlockComponent: React.FC<IContentBlockProps> = ({
  block,
  onToggleBlockEditMode,
  onSetSelectedBlockId,
}) => {
  const isDraggingRef = useRef(false);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (evt: React.PointerEvent<HTMLDivElement>) => {
    pointerDownPosRef.current = { x: evt.clientX, y: evt.clientY };
    isDraggingRef.current = false;
  };

  const handlePointerMove = (evt: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDownPosRef.current) return;
    const deltaX = Math.abs(evt.clientX - pointerDownPosRef.current.x);
    const deltaY = Math.abs(evt.clientY - pointerDownPosRef.current.y);
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
    }
  };

  const handlePointerUp = () => {
    if (!pointerDownPosRef.current) return;
    if (!isDraggingRef.current) {
      onToggleBlockEditMode(block.id, true, "contentBlocks");
      onSetSelectedBlockId(block.id);
    }
    pointerDownPosRef.current = null;
    isDraggingRef.current = false;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        pointerDownPosRef.current = null;
        isDraggingRef.current = false;
      }}
      className="w-full h-full p-1 break-words"
      style={{
        fontSize: `${block.fontSize}px`,
        fontWeight: block.fontWeight,
        color: block.content ? block.color : "gray",
        fontFamily: block.fontFamily
          ? block.fontFamily.includes(" ")
            ? `"${block.fontFamily}"`
            : block.fontFamily
          : "Arial",
        textAlign: block.textAlign,
        ...(block.textDecoration ? { textDecoration: block.textDecoration } : null),
        ...(block.fontStyle ? { fontStyle: block.fontStyle } : null),
      }}
      dangerouslySetInnerHTML={{
        __html: block.content || block.defaultContent,
      }}
    />
  );
};

ContentBlockComponent.displayName = "ContentBlock";

export const ContentBlock = React.memo(ContentBlockComponent);
