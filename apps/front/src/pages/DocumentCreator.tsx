import { DocumentCanvas, DocumentToolbar, RightSideBar } from "@/components/document-creator";
import { DashboardContent, DashboardHeader } from "@/components/dashboard";
import { cn, Input } from "@/components/ui";
import type { IDimension, IDocument, ShapeType } from "@/types";
import { FileUser } from "lucide-react";
import { lazy, useEffect, useState } from "react";
import { usePageMeta, useUndoRedo } from "@/hooks";
import { dimensions } from "@/constants/dimesions";
import { useOutletContext } from "react-router-dom";
import type { IOutletContext } from "@/layouts/Dashboard";
import { v4 as uuidv4 } from "uuid";

const PaymentPlanDetailsModal = lazy(() => import("@components/payment/PaymentPlanDetailsModal"));
const DocumentTemplatesModal = lazy(() => import("@components/document-creator/DocumentTemplatesModal"));

export const initialDocumentData: IDocument = {
  id: uuidv4(),
  title: "",
  backgroundColor: "#FFFFFF",
  isEditMode: false,
  dimensions: null,
  contentBlocks: [],
  imageBlocks: [],
  shapeBlocks: [],
};

export const ResumeCreator = () => {
  usePageMeta("Փաստաթուղթ ստեղծել", "Կազմեք և խմբագրեք փաստաթղթերը բլոկներով, պատկերներով ու ձևերով A4 ձևաչափով։");

  const [format, setFormat] = useState<string>("a4");
  const [documentData, setDocumentData] = useState<IDocument | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");

  const [isPlanDetailsModalOpen, setIsPlanDetailsModalOpen] = useState<boolean>(false);

  const { navOpen, isTemplatesModalOpen, setIsTemplatesModalOpen } = useOutletContext<IOutletContext>();

  const { undoStack, redoStack, handlePushToHistory, handleRedo, handleUndo } = useUndoRedo<IDocument>({
    currentState: documentData,
    mutator: setDocumentData,
    options: { limit: 20 },
  });

  useEffect(() => {
    const documentDimension = dimensions.find((d) => d.format === format);

    if (documentDimension) {
      setDocumentData(initialDocumentData);
    }
  }, []);

  useEffect(() => {
    const documentDimension = dimensions.find((d) => d.format === format);
    if (documentDimension) {
      setDocumentData((prev) => {
        if (!prev) return prev;
        if (prev.dimensions?.format !== format) {
          return {
            ...prev,
            dimensions: documentDimension as IDimension,
          };
        }
        return prev;
      });
    }
  }, [format]);

  return (
    <div className="flex flex-row justify-between h-screen gap-5">
      <div className={cn("flex flex-col max-w-[1520px]", navOpen && "max-w-[1220px]")}>
        <DashboardHeader>
          <div className="w-1/3">
            <div className="flex flex-row gap-5 font-bold text-primary-800 p-5">
              <FileUser size={50} />
              <div className="flex flex-col justify-between">
                <h1>Ստեղծել փաստաթուղթ</h1>
                <Input
                  className="
                      border border-transparent 
                      box-border 
                      p-0 
                      text-sm font-medium 
                      bg-transparent 
                      placeholder:text-sm 
                      h-7 
                      transition-colors duration-300 
                      hover:border-gray-300
                      focus:border-gray-400
                    "
                  placeholder="Փաստաթղթի անվանում"
                  defaultValue={documentData?.title}
                  onChange={(evt) => setDocumentData((prev) => (prev ? { ...prev, title: evt.target.value } : prev))}
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
          <div className="relative flex-1 justify-center items-center overflow-auto bg-gray-100 p-20">
            <div className="absolute left-1/6">
              {documentData && documentData?.dimensions && (
                <DocumentCanvas
                  documentData={documentData}
                  onPushToUndo={handlePushToHistory}
                  onSetDocumentData={setDocumentData}
                  onSetSelectedBlockId={setSelectedBlockId}
                />
              )}
            </div>
          </div>
        </DashboardContent>
      </div>

      {documentData?.dimensions && (
        <RightSideBar
          documentData={documentData}
          onSetDocumentData={setDocumentData}
          onSetFormat={setFormat}
          onSetIsPlanDetailsModalOpen={setIsPlanDetailsModalOpen}
        />
      )}

      <PaymentPlanDetailsModal isOpen={isPlanDetailsModalOpen} onClose={() => setIsPlanDetailsModalOpen(false)} />
      <DocumentTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        documentData={documentData}
        onSetDocumentData={setDocumentData}
      />
    </div>
  );
};
