import type {
  BlockType,
  CircleBlock,
  FontWeightType,
  IContentBlock,
  IDocument,
  ImageBlock,
  LineBlock,
  RectangleBlock,
  ShapeType,
  TextAlignType,
  TriangleBlock,
} from "@/types";

interface IDocumentToolbarParams {
  documentData: IDocument | null;
  selectedBlockId: number | null;
  shapeType: ShapeType;
  onPushToUndo: (document: IDocument | null) => void;
  onSetDocumentData: React.Dispatch<React.SetStateAction<IDocument | null>>;
}

interface IShapeBlockSettings {
  rectangle: Omit<RectangleBlock, "id" | "top" | "left" | "zIndex">;
  triangle: Omit<TriangleBlock, "id" | "top" | "left" | "zIndex">;
  circle: Omit<CircleBlock, "id" | "top" | "left" | "zIndex">;
  line: Omit<LineBlock, "id" | "top" | "left" | "zIndex">;
}

const CONTENT_BLOCK_SETTINGS: Record<BlockType, Omit<IContentBlock, "id" | "top" | "left" | "content" | "zIndex">> = {
  text: {
    width: 100,
    height: 50,
    contentType: "text",
    defaultContent: "Տեքստ",
    backgroundColor: "transparent",
    fontSize: 16,
    fontWeight: "400",
    color: "black",
    rotation: 0,
    fontFamily: "arial",
    textAlign: "left",
    isEditMode: false,
  },
  description: {
    width: 320,
    height: 150,
    contentType: "description",
    defaultContent: "Նկարագրություն",
    backgroundColor: "transparent",
    fontSize: 32,
    rotation: 0,
    color: "black",
    fontFamily: "arial",
    fontWeight: "700",
    textAlign: "left",
    isEditMode: false,
  },
  title: {
    width: 400,
    height: 250,
    contentType: "title",
    defaultContent: "Վերնագիր",
    backgroundColor: "transparent",
    fontSize: 48,
    rotation: 0,
    color: "black",
    fontFamily: "arial",
    fontWeight: "700",
    textAlign: "left",
    isEditMode: false,
  },
};

const SHAPE_BLOCK_SETTINGS: IShapeBlockSettings = {
  rectangle: {
    width: 100,
    height: 50,
    rotation: 0,
    shapeType: "rectangle",
    backgroundColor: "transparent",
    borderColor: "#000000",
    isEditMode: false,
  },
  triangle: {
    width: 150,
    height: 150,
    rotation: 0,
    shapeType: "triangle",
    backgroundColor: "transparent",
    borderColor: "#000000",
    isEditMode: false,
    points: [50, 0, 0, 100, 100, 100],
  },
  circle: {
    width: 150,
    height: 150,
    rotation: 0,
    shapeType: "circle",
    backgroundColor: "transparent",
    borderColor: "#000000",
    isEditMode: false,
    radius: 50,
  },
  line: {
    width: 150,
    height: 0,
    rotation: 0,
    shapeType: "line",
    backgroundColor: "transparent",
    borderColor: "#000000",
    isEditMode: false,
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
  const handleAddContentBlock = (value: BlockType) => {
    const initialContentBlock = { id: Date.now(), top: 0, left: 0, content: "", zIndex: 0 };
    const settings = CONTENT_BLOCK_SETTINGS[value];
    const newBlock = { ...initialContentBlock, ...settings };

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: [...prev.contentBlocks, newBlock] } : prev));
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
          top: 0,
          left: 0,
          width: 200,
          height: 200,
          file: file,
          isEditMode: false,
          zIndex: 0,
          rotation: 0,
        };
        onPushToUndo(documentData);
        onSetDocumentData((prev) => (prev ? { ...prev, imageBlocks: [...prev.imageBlocks, newBlock] } : prev));
      }
    };
  };

  const handleAddShapeBlock = (shapeType: ShapeType) => {
    const initialShapeBlock = { id: Date.now(), top: 0, left: 0, zIndex: 0 };
    const settings = SHAPE_BLOCK_SETTINGS[shapeType];
    const newBlock = { ...initialShapeBlock, ...settings };

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, shapeBlocks: [...prev.shapeBlocks, newBlock] } : prev));
  };

  const handleChangeDocumentBackgroundColor = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!documentData) return;

    const value = evt.target.value;
    onPushToUndo(documentData);

    onSetDocumentData((prev) => (prev ? { ...prev, backgroundColor: value } : prev));
  };

  const handleChangeFontFamily = (value: string) => {
    if (!selectedBlockId) return;

    const updatedBlocks =
      documentData?.contentBlocks.map((block) =>
        block.id === selectedBlockId ? { ...block, fontFamily: value } : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const handleChangeFontSize = (value: string) => {
    if (!selectedBlockId) return;

    const updatedBlocks =
      documentData?.contentBlocks.map((block) =>
        block.id === selectedBlockId ? { ...block, fontSize: Number(value) } : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const toggleFontBold = () => {
    if (!selectedBlockId) return;

    const updatedBlocks =
      documentData?.contentBlocks.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              fontWeight:
                block.fontWeight === ("400" as FontWeightType) ? ("700" as FontWeightType) : ("400" as FontWeightType),
            }
          : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const toggleFontItalic = () => {
    if (!selectedBlockId) return;

    const updatedBlocks =
      documentData?.contentBlocks.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              fontFamily: block.fontStyle && block.fontStyle !== "italic" ? "italic" : "none",
            }
          : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const toggleTextUnderline = () => {
    if (!selectedBlockId) return;

    const updatedBlocks =
      documentData?.contentBlocks.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              textDecoration: block.textDecoration && block.textDecoration !== "underline" ? "underline" : "none",
            }
          : block
      ) ?? [];

    if (documentData) {
      onPushToUndo(documentData);
    }

    onSetDocumentData((prev) => (prev ? { ...prev, contentBlocks: updatedBlocks } : prev));
  };

  const handleChangeAlign = (align: TextAlignType) => {
    if (!selectedBlockId) return;
    const updatedBlocks =
      documentData?.contentBlocks.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              textAlign: align,
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
    toggleFontBold,
    toggleTextUnderline,
    toggleFontItalic,
  };
};
