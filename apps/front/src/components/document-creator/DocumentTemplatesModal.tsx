import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDocumentApi } from "@/hooks";
import type { IDocument, IDocumentTemplate } from "@/types";
import { ConfirmToast, DynamicImage, Skeleton, Spinner } from "../ui";
import { getImageSrc } from "@/utils";
import { toast } from "react-toastify";

interface IDocumentTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: IDocument | null;
  onSetDocumentData: Dispatch<SetStateAction<IDocument | null>>;
}

const DocumentTemplatesModal: React.FC<IDocumentTemplatesModalProps> = ({
  isOpen,
  onClose,
  documentData,
  onSetDocumentData,
}) => {
  const { getDocumentTemplatesApi, selectTemplateApi } = useDocumentApi();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const { data: templatesData, isLoading: isTemplatesLoading } = useQuery<IDocumentTemplate[]>({
    queryKey: ["document-templates"],
    queryFn: getDocumentTemplatesApi,
    enabled: isOpen,
  });

  const { isPending: isSelecting, mutate: selectTemplateMutate } = useMutation({
    mutationFn: selectTemplateApi,
    onSuccess: (data) => {
      onSetDocumentData(data);
    },
  });

  const handleSelectTemplate = (templateId: string) => {
    const hasOpenDocument = documentData !== null;

    if (hasOpenDocument) {
      const confirmMessage = "Ձեզ մոտ այժմ բաց է փաստաթուղթ: Դուք ցանկանու՞մ եք ստեղծել նոր փաստաթուղթ թե մնալ այստեղ:";

      toast(
        ({ closeToast }: { closeToast?: () => void }) =>
          React.createElement(ConfirmToast, {
            message: confirmMessage,
            onConfirm: () => {
              selectTemplateMutate(templateId);
              if (closeToast) closeToast();
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

    selectTemplateMutate(templateId);
  };

  useEffect(() => {
    const updatePosition = () => {
      const node = document.getElementById("sub_nav_item_1");
      if (!node) {
        setPosition(null);
        return;
      }

      const rect = node.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY - 20,
        left: rect.left + window.scrollX + rect.width + 25,
      });
    };

    const setupObservers = () => {
      const node = document.getElementById("sub_nav_item_1");
      if (!node) return null;

      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updatePosition);
      });
      resizeObserver.observe(node);

      const mutationObserver = new MutationObserver(() => {
        requestAnimationFrame(updatePosition);
      });

      const sidebar = node.closest("aside");
      if (sidebar) {
        mutationObserver.observe(sidebar, {
          attributes: true,
          attributeFilter: ["style", "class"],
          childList: true,
          subtree: true,
        });

        resizeObserver.observe(sidebar);
      }

      mutationObserver.observe(node, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      return { resizeObserver, mutationObserver };
    };

    let checkInterval: number | null = null;
    let observers: ReturnType<typeof setupObservers> = null;

    const findAndSetup = () => {
      const node = document.getElementById("sub_nav_item_1");
      if (node) {
        updatePosition();

        if (!observers) {
          observers = setupObservers();
        }

        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
        return true;
      }
      return false;
    };
    findAndSetup();

    let checkCount = 0;
    const maxChecks = 50;
    checkInterval = setInterval(() => {
      checkCount++;
      if (findAndSetup() || checkCount >= maxChecks) {
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }
    }, 200);

    const handleScroll = () => {
      requestAnimationFrame(updatePosition);
    };

    const handleResize = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (observers) {
        observers.resizeObserver.disconnect();
        observers.mutationObserver.disconnect();
      }
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!position) return null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[620px] h-[500px] flex flex-col animate-fadeIn"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Ընտրեք ձևանմուշ</h2>

        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isTemplatesLoading && (
          <div className="grid grid-cols-3 gap-6">
            {new Array(6).fill(0).map((_, index) => (
              <div key={index} className="group">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition bg-white">
                  <Skeleton className="w-full h-50 object-cover" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isTemplatesLoading && templatesData && templatesData.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {templatesData.map((template) => (
              <div
                key={String(template.id)}
                className="group cursor-pointer"
                onClick={() => handleSelectTemplate(String(template.id))}
              >
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition bg-white">
                  <DynamicImage
                    className="w-full h-50 object-cover"
                    alt={`Template image ${template.id}`}
                    src={getImageSrc(template.previewPath)}
                  />
                </div>

                <div className="mt-2 text-sm text-gray-700 font-medium truncate">{template.title}</div>
              </div>
            ))}
          </div>
        )}

        {!isTemplatesLoading && (!templatesData || templatesData.length === 0) && (
          <div className="text-center py-10 text-gray-500">Դատարկ է</div>
        )}
      </div>
      {isSelecting && <Spinner fullScreen={true} />}
    </div>
  );
};

export default DocumentTemplatesModal;
