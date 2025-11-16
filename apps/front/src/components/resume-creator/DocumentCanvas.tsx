import type { IDocument } from "@/types";
import { Rnd } from "react-rnd";
import { cn, Spinner } from "../ui";
import { OutsideClickWrapper, ShowCenterGuideline, PercentRuler } from "../common";
import { ContentBlock } from "./ContentBlock";
import { ImageBlock } from "./ImageBlock";
import { useDocumentCanvasFns } from "@/hooks";
import { ShapeBlock } from "./ShapeBlock";
import { Suspense, lazy, useState } from "react";

const EditableContentBlock = lazy(() => import("./EditableContentBlock"));

interface IDocumentCanvas {
  documentData: IDocument;
  onPushToUndo: (document: IDocument | null) => void;
  onSetDocumentData: React.Dispatch<React.SetStateAction<IDocument | null>>;
  onSetSelectedBlockId: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface IsCenter {
  vertical: {
    25: boolean;
    50: boolean;
    75: boolean;
  };
  horizontal: {
    25: boolean;
    50: boolean;
    75: boolean;
  };
}

export const DocumentCanvas: React.FC<IDocumentCanvas> = ({
  documentData,
  onPushToUndo,
  onSetDocumentData,
  onSetSelectedBlockId,
}) => {
  const [isCenter, setIsCenter] = useState<IsCenter>({
    vertical: { 25: false, 50: false, 75: false },
    horizontal: { 25: false, 50: false, 75: false },
  });
  const { isEditMode, dimension, contentBlocks, imageBlocks, shapeBlocks } = documentData;
  const {
    handleCancelEditMode,
    handleBlockDrag,
    handleBlockResize,
    handleContentChange,
    handleDeleteBlock,
    handleResizeDocument,
    handleChangeColor,
    handleContentAutoResize,
    handleBlockRotate,
    handleShowCenterGuideline,
    toggleBlockEditMode,
    toggleBlockZIndex,
  } = useDocumentCanvasFns({ documentData, onSetIsCenter: setIsCenter, onPushToUndo, onSetDocumentData });

  return (
    <Rnd
      size={{ width: dimension?.width || 794, height: dimension?.height || 1123 }}
      onResize={handleResizeDocument}
      minWidth={100}
      minHeight={100}
      maxWidth={3000}
      maxHeight={5000}
      disableDragging={!isEditMode}
      enableResizing={isEditMode ? undefined : false}
      className={cn("justify-center shadow-md p-10", isEditMode && "border-1 border-primary-800 border-dashed")}
      style={{ backgroundColor: documentData.backgroundColor }}
    >
      <OutsideClickWrapper cb={handleCancelEditMode}>
        <div className="relative w-full h-full overflow-hidden">
          {!!contentBlocks.length &&
            contentBlocks.map((block) => (
              <Rnd
                key={block.id}
                size={{ width: block.width, height: block.height }}
                position={{ x: block.left, y: block.top }}
                style={{ backgroundColor: block.backgroundColor, zIndex: block.zIndex }}
                bounds="parent"
                onDragStop={(_, d) => {
                  handleBlockDrag(block.id, d.y, d.x, "contentBlocks");
                  setIsCenter({
                    vertical: { 25: false, 50: false, 75: false },
                    horizontal: { 25: false, 50: false, 75: false },
                  });
                }}
                onDrag={(_, d) => handleShowCenterGuideline(d.x, d.y, block.width, block.height)}
                onResizeStop={(_, __, ref) =>
                  handleBlockResize(
                    block.id,
                    parseFloat(ref.style.width),
                    parseFloat(ref.style.height),
                    "contentBlocks"
                  )
                }
                enableResizing={block.isEditMode}
                disableDragging={block.isEditMode}
                className={cn("p-1", block.isEditMode && "border border-dashed border-primary-600")}
              >
                {block.isEditMode ? (
                  <OutsideClickWrapper
                    cb={() => block.isEditMode && toggleBlockEditMode(block.id, false, "contentBlocks")}
                  >
                    <Suspense fallback={<Spinner fullScreen={true} size="sm" className="bg-transparent" />}>
                      <EditableContentBlock
                        block={block}
                        isEditMode={block.isEditMode}
                        onContentChange={handleContentChange}
                        onChangeColor={handleChangeColor}
                        onDeleteBlock={handleDeleteBlock}
                        onBlur={() => toggleBlockEditMode(block.id, false, "contentBlocks")}
                        onResize={handleContentAutoResize}
                        onToggleBlockZIndex={toggleBlockZIndex}
                      />
                    </Suspense>
                  </OutsideClickWrapper>
                ) : (
                  <ContentBlock
                    block={block}
                    onSetSelectedBlockId={onSetSelectedBlockId}
                    onToggleBlockEditMode={toggleBlockEditMode}
                  />
                )}
              </Rnd>
            ))}

          {!!imageBlocks.length &&
            imageBlocks.map((block) => (
              <ImageBlock
                key={block.id}
                block={block}
                onDeleteBlock={handleDeleteBlock}
                onBlockDrag={handleBlockDrag}
                onBlockResize={handleBlockResize}
                onToggleBlockEditMode={toggleBlockEditMode}
                onBlockRotate={handleBlockRotate}
                onToggleBlockZIndex={toggleBlockZIndex}
                onDrag={(x, y, width, height) => handleShowCenterGuideline(x, y, width, height)}
                onDragStop={() =>
                  setIsCenter({
                    vertical: { 25: false, 50: false, 75: false },
                    horizontal: { 25: false, 50: false, 75: false },
                  })
                }
              />
            ))}

          {!!shapeBlocks.length &&
            shapeBlocks.map((block) => (
              <ShapeBlock
                key={block.id}
                block={block}
                onDeleteBlock={handleDeleteBlock}
                onBlockDrag={handleBlockDrag}
                onBlockResize={handleBlockResize}
                onToggleBlockEditMode={toggleBlockEditMode}
                onBlockRotate={handleBlockRotate}
                onChangeColor={handleChangeColor}
                onToggleBlockZIndex={toggleBlockZIndex}
                onDrag={(x, y, width, height) => handleShowCenterGuideline(x, y, width, height)}
                onDragStop={() =>
                  setIsCenter({
                    vertical: { 25: false, 50: false, 75: false },
                    horizontal: { 25: false, 50: false, 75: false },
                  })
                }
              />
            ))}
        </div>
      </OutsideClickWrapper>
      <ShowCenterGuideline showHorizontal={isCenter.horizontal} showVertical={isCenter.vertical} />
      {dimension && <PercentRuler {...dimension} />}
    </Rnd>
  );
};
