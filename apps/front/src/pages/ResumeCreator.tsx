import { DocumentCanvas, DocumentToolbar, RightSideBar } from "@/components/resume-creator";
import { DashboardContent, DashboardHeader } from "@/components/dashboard";
import { Input, Spinner } from "@/components/ui";
import { CV_TEMPLATES, dimensions } from "@/constants";
import type { IDimension, IDocument, ShapeType } from "@/types";
import { FileUser } from "lucide-react";
import { useEffect, useState } from "react";
import { useUndoRedo } from "@/hooks";

const initialDocumentData: IDocument = {
  id: Date.now(),
  title: "",
  backgroundColor: "#FFFFFF",
  isEditMode: false,
  dimension: null,
  contentBlocks: [],
  imageBlocks: [],
  shapeBlocks: [],
};

export const ResumeCreator = () => {
  const [format, setFormat] = useState<string>("a4");
  const [documentData, setDocumentData] = useState<IDocument | null>(initialDocumentData || null);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");

  const { undoStack, redoStack, handlePushToHistory, handleRedo, handleUndo } = useUndoRedo<IDocument>({
    currentState: documentData,
    mutator: setDocumentData,
    options: { limit: 20 },
  });

  useEffect(() => {
    setDocumentData(CV_TEMPLATES[2]);
    setFormat(CV_TEMPLATES[2].dimension?.format || "a4");
  }, []);

  useEffect(() => {
    const documentDimension = dimensions.find((d) => d.format === format);
    if (documentDimension) {
      setDocumentData((prev) =>
        prev
          ? {
              ...prev,
              dimension: documentDimension as IDimension,
            }
          : prev
      );
    }
  }, [format]);

  console.log(documentData?.dimension?.format);
  return (
    <div className="flex h-screen gap-5">
      <div className="flex flex-col w-4/5 max-w-[1150px]">
        <DashboardHeader>
          <div className="w-1/3">
            <div className="flex flex-row gap-5 font-bold text-primary-800 p-5">
              <FileUser size={50} />
              <div className="flex flex-col justify-between">
                <h1>Ստեղծել ռեզյումե</h1>
                <Input
                  className="border-0 box-border p-0 text-sm font-medium bg-transparent placeholder:text-sm h-7 transition-colors duration-300 hover:border-1"
                  placeholder="Փաստաթղթի անվանում"
                />
              </div>
            </div>
          </div>
        </DashboardHeader>
        <DashboardContent>
          <DocumentToolbar
            documentData={documentData}
            selectedBlockId={selectedBlockId}
            shapeType={shapeType}
            undoStack={undoStack}
            redoStack={redoStack}
            onPushToUndo={handlePushToHistory}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSetDocumentData={setDocumentData}
            onSetShapeType={setShapeType}
          />
          <div className="flex-1 overflow-auto  bg-gray-100 p-20">
            <div className="relative flex justify-center items-center">
              {documentData?.dimension ? (
                <DocumentCanvas
                  documentData={documentData}
                  onPushToUndo={handlePushToHistory}
                  onSetDocumentData={setDocumentData}
                  onSetSelectedBlockId={setSelectedBlockId}
                />
              ) : (
                <Spinner fullScreen={true} />
              )}
            </div>
          </div>
        </DashboardContent>
      </div>

      {documentData?.dimension && (
        <RightSideBar documentData={documentData} onSetDocumentData={setDocumentData} onSetFormat={setFormat} />
      )}
    </div>
  );
};
