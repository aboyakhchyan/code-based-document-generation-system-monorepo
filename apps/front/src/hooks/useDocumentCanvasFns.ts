import type { IsCenter } from "@/components/resume-creator";
import type { BlockCategory, IContentBlock, IDocument, ShapeBlock } from "@/types";
import { useCallback } from "react";

interface IDocumentCanvasParams {
  documentData: IDocument;
  onPushToUndo: (document: IDocument | null) => void;
  onSetDocumentData: React.Dispatch<React.SetStateAction<IDocument | null>>;
  onSetIsCenter: React.Dispatch<React.SetStateAction<IsCenter>>;
}

const SNAP_THRESHOLD = 10;
const PARENT_BLOCK_PADDING = 40;

export const useDocumentCanvasFns = ({
  documentData,
  onPushToUndo,
  onSetDocumentData,
  onSetIsCenter,
}: IDocumentCanvasParams) => {
  const handleCancelEditMode = () => {
    if (!documentData.isEditMode) return;

    onPushToUndo(documentData);
    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            isEditMode: false,
            contentBlocks: prev.contentBlocks.map((b) => ({ ...b, isEditMode: false })),
            imageBlocks: prev.imageBlocks.map((b) => ({ ...b, isEditMode: false })),
          }
        : prev
    );
  };

  const handleBlockDrag = (id: number, top: number, left: number, category: BlockCategory) => {
    if (!["shapeBlocks", "imageBlocks", "contentBlocks"].includes(category)) return;
    onPushToUndo(documentData);
    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            [category]: prev[category].map((b) => (b.id === id ? { ...b, top, left } : b)),
          }
        : prev
    );
  };

  const handleBlockResize = (id: number, width: number, height: number, category: BlockCategory) => {
    if (!["shapeBlocks", "imageBlocks", "contentBlocks"].includes(category)) return;
    onPushToUndo(documentData);
    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            [category]: prev[category].map((b) => (b.id === id ? { ...b, width, height } : b)),
          }
        : prev
    );
  };

  const handleContentChange = (id: number, value: string) => {
    onPushToUndo(documentData);
    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            contentBlocks: prev.contentBlocks.map((b) => (b.id === id ? { ...b, content: value } : b)),
          }
        : prev
    );
  };

  const toggleBlockEditMode = (id: number, mode: boolean, category: BlockCategory) => {
    if (!["shapeBlocks", "imageBlocks", "contentBlocks"].includes(category)) return;
    if (!documentData) return;

    const block = documentData[category].find((b) => b.id === id);
    if (!block) return;

    if (block.isEditMode !== mode) {
      onSetDocumentData((prev) =>
        prev
          ? {
              ...prev,
              [category]: prev[category].map((b) => (b.id === id ? { ...b, isEditMode: mode } : b)),
            }
          : prev
      );
    }
  };

  const handleResizeDocument = (_: any, __: any, ref: HTMLElement) => {
    if (!documentData.isEditMode) return;
    onPushToUndo(documentData);

    const width = parseFloat(ref.style.width);
    const height = parseFloat(ref.style.height);

    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            dimension: prev.dimension ? { ...prev.dimension, width, height, format: "custom" } : prev.dimension,
          }
        : prev
    );
  };

  const handleDeleteBlock = (id: number, blockType: BlockCategory = "contentBlocks") => {
    if (!documentData) return;

    onPushToUndo(documentData);
    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            [blockType]: prev[blockType].filter((block) => block.id !== id),
          }
        : prev
    );
  };

  const handleChangeColor = (
    evt: React.ChangeEvent<HTMLInputElement>,
    id: number,
    property: keyof IContentBlock | keyof ShapeBlock,
    category: BlockCategory
  ) => {
    if (!documentData) return;

    const value = evt.target.value;
    const updatedBlocks =
      documentData?.[category].map((block) => (block.id === id ? { ...block, [property]: value } : block)) ?? [];

    onPushToUndo(documentData);

    onSetDocumentData((prev) => (prev ? { ...prev, [category]: updatedBlocks } : prev));
  };

  const toggleBlockZIndex = (id: number, direction: "up" | "down", category: BlockCategory) => {
    if (!documentData) return;
    onPushToUndo(documentData);
    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            [category]: prev[category].map((block) => {
              if (block.id === id) {
                const newZIndex = direction === "up" ? block.zIndex + 1 : Math.max(0, block.zIndex - 1);
                return { ...block, zIndex: newZIndex };
              }
              return block;
            }),
          }
        : prev
    );
  };

  const handleContentAutoResize = useCallback(
    (id: number, height: number) => {
      const target = documentData.contentBlocks.find((block) => block.id === id);
      if (!target || height <= target.height) {
        return;
      }

      onPushToUndo(documentData);

      onSetDocumentData((prev) =>
        prev
          ? {
              ...prev,
              contentBlocks: prev.contentBlocks.map((block) => (block.id === id ? { ...block, height } : block)),
            }
          : prev
      );
    },
    [documentData, onPushToUndo, onSetDocumentData]
  );

  const handleBlockRotate = (id: number, rotation: number, category: BlockCategory) => {
    if (!["shapeBlocks", "imageBlocks", "contentBlocks"].includes(category)) return;
    const target = documentData[category].find((b) => b.id === id);
    if (!target || (target.rotation ?? 0) === rotation) return;

    onSetDocumentData((prev) =>
      prev
        ? {
            ...prev,
            [category]: prev[category].map((b) => (b.id === id ? { ...b, rotation } : b)),
          }
        : prev
    );

    onPushToUndo(documentData);
  };

  const handleShowCenterGuideline = (x: number, y: number, width: number, height: number) => {
    if (!documentData || !documentData.dimension) {
      onSetIsCenter({
        vertical: { 25: false, 50: false, 75: false },
        horizontal: { 25: false, 50: false, 75: false },
      });
      return;
    }

    const blockCenterX = x + width / 2;
    const blockCenterY = y + height / 2;

    const checkPercentX = (percent: number) => {
      const documentWidth = documentData.dimension?.width ?? 0;
      const lineX = documentWidth * (percent / 100) - PARENT_BLOCK_PADDING;
      return Math.abs(blockCenterX - lineX) <= SNAP_THRESHOLD;
    };

    const checkPercentY = (percent: number) => {
      const documentHeight = documentData.dimension?.height ?? 0;
      const lineY = documentHeight * (percent / 100) - PARENT_BLOCK_PADDING;
      return Math.abs(blockCenterY - lineY) <= SNAP_THRESHOLD;
    };

    const vertical: { 25: boolean; 50: boolean; 75: boolean } = {
      25: checkPercentX(25),
      50: checkPercentX(50),
      75: checkPercentX(75),
    };

    const horizontal: { 25: boolean; 50: boolean; 75: boolean } = {
      25: checkPercentY(25),
      50: checkPercentY(50),
      75: checkPercentY(75),
    };

    onSetIsCenter({ vertical, horizontal });
  };
  return {
    handleCancelEditMode,
    handleBlockDrag,
    handleBlockResize,
    handleContentChange,
    handleResizeDocument,
    handleDeleteBlock,
    handleChangeColor,
    handleContentAutoResize,
    handleBlockRotate,
    handleShowCenterGuideline,
    toggleBlockEditMode,
    toggleBlockZIndex,
  };
};
