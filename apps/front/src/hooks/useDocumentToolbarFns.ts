import React from "react";
import { initialDocumentData } from "@/pages";
import { dimensions } from "@/constants/dimesions";
import type {
  BlockType,
  CircleBlock,
  FontWeightType,
  IContentBlock,
  IDimension,
  IDocument,
  ImageBlock,
  LineBlock,
  RectangleBlock,
  ShapeType,
  TextAlignType,
  TriangleBlock,
} from "@/types";
import { toast } from "react-toastify";
import { ConfirmToast } from "@/components/ui";

interface IDocumentToolbarParams {
  documentData: IDocument | null;
  selectedBlockId: number | null;
  shapeType: ShapeType;
  onPushToUndo: (document: IDocument | null) => void;
  onSetDocumentData: React.Dispatch<React.SetStateAction<IDocument | null>>;
}

interface IShapeBlockSettings {
  rectangle: Omit<RectangleBlock, "id" | "styles"> & {
    styles: Omit<RectangleBlock["styles"], "top" | "left" | "zIndex">;
  };
  triangle: Omit<TriangleBlock, "id" | "styles"> & { styles: Omit<TriangleBlock["styles"], "top" | "left" | "zIndex"> };
  circle: Omit<CircleBlock, "id" | "styles"> & { styles: Omit<CircleBlock["styles"], "top" | "left" | "zIndex"> };
  line: Omit<LineBlock, "id" | "styles"> & { styles: Omit<LineBlock["styles"], "top" | "left" | "zIndex"> };
}

const CONTENT_BLOCK_SETTINGS: Record<
  BlockType,
  {
    defaultContent: string;
    contentType: BlockType;
    styles: Omit<IContentBlock["styles"], "top" | "left" | "rotation" | "zIndex" | "isEditMode">;
  }
> = {
  text: {
    defaultContent: "Տեքստ",
    contentType: "text",
    styles: {
      width: 100,
      height: 50,
      backgroundColor: "transparent",
      fontSize: 16,
      fontWeight: "400",
      color: "black",
      fontFamily: "arial",
      textAlign: "left",
    },
  },
  description: {
    defaultContent: "Նկարագրություն",
    contentType: "description",
    styles: {
      width: 320,
      height: 150,
      backgroundColor: "transparent",
      fontSize: 32,
      color: "black",
      fontFamily: "arial",
      fontWeight: "700",
      textAlign: "left",
    },
  },
  title: {
    defaultContent: "Վերնագիր",
    contentType: "title",
    styles: {
      width: 400,
      height: 250,
      backgroundColor: "transparent",
      fontSize: 48,
      color: "black",
      fontFamily: "arial",
      fontWeight: "700",
      textAlign: "left",
    },
  },
};

const SHAPE_BLOCK_SETTINGS: IShapeBlockSettings = {
  rectangle: {
    shapeType: "rectangle",
    styles: {
      width: 100,
      height: 50,
      rotation: 0,
      backgroundColor: "transparent",
      borderColor: "#000000",
      isEditMode: false,
    },
  },
  triangle: {
    shapeType: "triangle",
    styles: {
      width: 150,
      height: 150,
      rotation: 0,
      backgroundColor: "transparent",
      borderColor: "#000000",
      isEditMode: false,
    },
    points: [50, 0, 0, 100, 100, 100],
  },
  circle: {
    shapeType: "circle",
    styles: {
      width: 150,
      height: 150,
      rotation: 0,
      backgroundColor: "transparent",
      borderColor: "#000000",
      isEditMode: false,
    },
    radius: 50,
  },
  line: {
    shapeType: "line",
    styles: {
      width: 150,
      height: 0,
      rotation: 0,
      backgroundColor: "transparent",
      borderColor: "#000000",
      isEditMode: false,
    },
    x2: 100,
    y2: 0,
    lineWidth: 2,
  },
};

export const useDocumentToolbarFns = ({
  documentData,
  selectedBlockId,
  onPushToUndo,
  onSetDocumentData,
}: IDocumentToolbarParams) => {
  const handleCreateDocument = () => {
    const hasOpenDocument = documentData !== null;

    if (hasOpenDocument) {
      const confirmMessage = "Ձեզ մոտ այժմ բաց է փաստաթուղթ: Դուք ցանկանու՞մ եք ստեղծել նոր փաստաթուղթ թե մնալ այստեղ:";

      const createNewDocument = (closeToast?: () => void) => {
        const defaultDimension = dimensions.find((d) => d.format === "a4") as IDimension;
        const newDocument: IDocument = {
          ...initialDocumentData,
          id: Date.now(),
          dimensions: defaultDimension || null,
        };
        onSetDocumentData(newDocument);
        if (closeToast) closeToast();
      };

      toast(
        ({ closeToast }: { closeToast?: () => void }) =>
          React.createElement(ConfirmToast, {
            message: confirmMessage,
            onConfirm: () => {
              createNewDocument(closeToast);
            },
            onCancel: () => {
              if (closeToast) closeToast();
            },
          }),
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: true,
          className: "custom-toast",
        }
      );

      return;
    }

    const defaultDimension = dimensions.find((d) => d.format === "a4") as IDimension;
    const newDocument: IDocument = {
      ...initialDocumentData,
      id: Date.now(),
      dimensions: defaultDimension || null,
    };
    onSetDocumentData(newDocument);
  };

  const handleAddContentBlock = (value: BlockType) => {
    const settings = CONTENT_BLOCK_SETTINGS[value];
    const newBlock: IContentBlock = {
      id: Date.now(),
      content: "",
      defaultContent: settings.defaultContent,
      contentType: settings.contentType,
      styles: {
        top: 0,
        left: 0,
        width: settings.styles.width,
        height: settings.styles.height,
        rotation: 0,
        zIndex: 0,
        isEditMode: false,
        backgroundColor: settings.styles.backgroundColor,
        fontSize: settings.styles.fontSize,
        fontWeight: settings.styles.fontWeight,
        color: settings.styles.color,
        fontFamily: settings.styles.fontFamily,
        textAlign: settings.styles.textAlign,
        fontStyle: settings.styles.fontStyle,
        textDecoration: settings.styles.textDecoration,
      },
    };

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: [...(prev.contentBlocks || []), newBlock] } : prev));
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = (evt) => {
      const file = (evt.target as HTMLInputElement).files?.[0];
      if (file) {
        const newBlock: ImageBlock = {
          id: Date.now(),
          styles: {
            width: 200,
            height: 200,
            rotation: 0,
            top: 0,
            left: 0,
            zIndex: 0,
            isEditMode: false,
          },
          file: file,
        };
        onPushToUndo(documentData);
        onSetDocumentData((prev) => (prev ? { ...prev, imageBlocks: [...(prev.imageBlocks || []), newBlock] } : prev));
      }
    };
  };

  const handleAddShapeBlock = (shapeType: ShapeType) => {
    const initialShapeBlock = {
      id: Date.now(),
      styles: { top: 0, left: 0, zIndex: 0, width: 0, height: 0, rotation: 0, isEditMode: false },
    };
    const settings = SHAPE_BLOCK_SETTINGS[shapeType];
    const newBlock = {
      ...settings,
      ...initialShapeBlock,
      styles: {
        ...initialShapeBlock.styles,
        ...settings.styles,
      },
    };

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, shapeBlocks: [...(prev.shapeBlocks || []), newBlock] } : prev));
  };

  const handleChangeDocumentBackgroundColor = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!documentData) return;

    const value = evt.target.value;
    onPushToUndo(documentData);

    onSetDocumentData((prev) => (prev ? { ...prev, backgroundColor: value } : prev));
  };

  const handleChangeFontFamily = (value: string) => {
    if (selectedBlockId === null) return;

    const updatedBlocks =
      documentData?.contentBlocks?.map((block) =>
        block.id === selectedBlockId ? { ...block, styles: { ...block.styles, fontFamily: value } } : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const handleChangeFontSize = (value: string) => {
    if (selectedBlockId === null) return;

    const updatedBlocks =
      documentData?.contentBlocks?.map((block) =>
        block.id === selectedBlockId ? { ...block, styles: { ...block.styles, fontSize: Number(value) } } : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const toggleFontBold = () => {
    if (selectedBlockId === null) return;

    const updatedBlocks =
      documentData?.contentBlocks?.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              styles: {
                ...block.styles,
                fontWeight:
                  block.styles.fontWeight === ("400" as FontWeightType)
                    ? ("700" as FontWeightType)
                    : ("400" as FontWeightType),
              },
            }
          : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const toggleFontItalic = () => {
    if (selectedBlockId === null) return;

    const updatedBlocks =
      documentData?.contentBlocks?.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              styles: {
                ...block.styles,
                fontStyle: block.styles.fontStyle && block.styles.fontStyle !== "italic" ? "italic" : "none",
              },
            }
          : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const toggleTextUnderline = () => {
    if (selectedBlockId === null) return;

    const updatedBlocks =
      documentData?.contentBlocks?.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              styles: {
                ...block.styles,
                textDecoration:
                  block.styles.textDecoration && block.styles.textDecoration !== "underline" ? "underline" : "none",
              },
            }
          : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const handleChangeAlign = (align: TextAlignType) => {
    if (selectedBlockId === null) return;
    const updatedBlocks =
      documentData?.contentBlocks?.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              styles: {
                ...block.styles,
                textAlign: align,
              },
            }
          : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  return {
    handleAddContentBlock,
    handleAddImage,
    handleAddShapeBlock,
    handleChangeAlign,
    handleChangeDocumentBackgroundColor,
    handleChangeFontSize,
    handleChangeFontFamily,
    handleCreateDocument,
    toggleFontBold,
    toggleTextUnderline,
    toggleFontItalic,
  };
};
