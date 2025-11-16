import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  RotateCw,
  Download,
  FileText,
  Scaling,
  Image,
  File,
  ChevronDown,
  Text,
  Heading1,
  Square,
  Circle,
  Minus,
  Triangle,
  ImageUp,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import type { BlockType, IDocument, ShapeType } from "@/types";
import { useDocumentToolbarFns } from "@/hooks";

interface IDocumentToolbar {
  documentData: IDocument | null;
  selectedBlockId: number | null;
  shapeType: ShapeType;
  undoStack: IDocument[];
  redoStack: IDocument[];
  onPushToUndo: (document: IDocument | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSetDocumentData: React.Dispatch<React.SetStateAction<IDocument | null>>;
  onSetShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
}

const EXPORT_TYPES = [
  {
    id: "pdf",
    icon: <FileText className="w-4 h-4" />,
    label: "PDF",
    color: "text-red-500 bg-red-50 hover:bg-red-100",
  },
  {
    id: "docx",
    icon: <File className="w-4 h-4" />,
    label: "DOCX",
    color: "text-blue-500 bg-blue-50 hover:bg-blue-100",
  },
  {
    id: "png",
    icon: <Image className="w-4 h-4" />,
    label: "PNG",
    color: "text-green-500 bg-green-50 hover:bg-green-100",
  },
];

const FONT_SIZES = [8, 12, 16, 20, 24, 28, 32, 36, 44, 48, 60, 72, 80, 96, 112, 120];

export const DocumentToolbar: React.FC<IDocumentToolbar> = ({
  documentData,
  selectedBlockId,
  shapeType,
  undoStack,
  redoStack,
  onPushToUndo,
  onRedo,
  onUndo,
  onSetDocumentData,
}) => {
  const {
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
  } = useDocumentToolbarFns({
    documentData,
    selectedBlockId,
    shapeType,
    onPushToUndo,
    onSetDocumentData,
  });

  return (
    <div
      className="w-full border-b border-gray-200 bg-white p-3 flex items-center justify-between shadow-sm overflow-x-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Select onValueChange={handleChangeFontFamily} defaultValue="Arial">
            <SelectTrigger className="w-48 border border-gray-200 bg-white/80 backdrop-blur-sm cursor-pointer rounded-xl px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue placeholder="Ընտրել տառատեսակը" />
            </SelectTrigger>

            <SelectContent className="border border-gray-200 bg-white/95 backdrop-blur-md rounded-xl shadow-lg z-50 py-2 animate-in fade-in-0 zoom-in-95">
              {[
                "Arial",
                "Times New Roman",
                "Roboto",
                "Open Sans",
                "Urbanist",
                "Inter",
                "Poppins",
                "Montserrat",
                "Lato",
                "Noto Sans Armenian",
                "Noto Serif Armenian",
                "Armenian Serif",
              ].map((font) => (
                <SelectItem
                  key={font}
                  value={font}
                  className="px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
                  style={{ fontFamily: font }}
                >
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select onValueChange={handleChangeFontSize} defaultValue="16">
            <SelectTrigger className="w-24 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue placeholder="Չափը" />
            </SelectTrigger>

            <SelectContent className="border border-gray-200 bg-white/95 backdrop-blur-md rounded-xl shadow-lg z-50 py-2 animate-in fade-in-0 zoom-in-95">
              {FONT_SIZES.map((size) => (
                <SelectItem
                  key={size}
                  value={String(size)}
                  className="px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select onValueChange={(value) => handleAddShapeBlock(value as ShapeType)} defaultValue="rectangle">
            <SelectTrigger className="w-max border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-medium cursor-pointer text-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue placeholder="Ֆիգուրա" />
            </SelectTrigger>

            <SelectContent className="border border-gray-200 bg-white/95 backdrop-blur-md rounded-xl shadow-lg z-50 py-2 animate-in fade-in-0 zoom-in-95">
              <SelectItem
                value="rectangle"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
              >
                <Square className="w-4 h-4 text-blue-600" />
              </SelectItem>
              <SelectItem
                value="circle"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
              >
                <Circle className="w-4 h-4 text-green-600" />
              </SelectItem>
              <SelectItem
                value="line"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
              >
                <Minus className="w-4 h-4 text-purple-600" />
              </SelectItem>
              <SelectItem
                value="triangle"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
              >
                <Triangle className="w-4 h-4 text-amber-600" />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select defaultValue="text" onValueChange={(value) => handleAddContentBlock(value as BlockType)}>
            <SelectTrigger className="w-48 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-xl cursor-pointer px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
              <SelectValue placeholder="Ընտրել բլոկը" />
            </SelectTrigger>

            <SelectContent className="border border-gray-200 bg-white/95 backdrop-blur-md rounded-xl shadow-lg z-50 py-2 animate-in fade-in-0 zoom-in-95">
              <SelectItem
                value="title"
                className="px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
              >
                <div className="flex flex-row items-center gap-3">
                  <Heading1 className="w-4 h-4 text-blue-600" />
                  Վերնագիր
                </div>
              </SelectItem>
              <SelectItem
                value="description"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
              >
                <div className="flex flex-row items-center gap-3">
                  <FileText className="w-4 h-4 text-green-600" />
                  Նկարագրություն
                </div>
              </SelectItem>
              <SelectItem
                value="text"
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors duration-150"
              >
                <div className="flex flex-row items-center gap-3">
                  <Text className="w-4 h-4 text-purple-600" />
                  Տեքստ
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleFontBold}>
                <Bold className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Թավ</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleFontItalic}>
                <Italic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Շեղ</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTextUnderline}>
                <Underline className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ընդգծված</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => handleChangeAlign("left")}>
                <AlignLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ձախ</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => handleChangeAlign("center")}>
                <AlignCenter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Կենտրոն</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => handleChangeAlign("right")}>
                <AlignRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Աջ</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex border-l border-gray-300 pl-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">
                <input type="color" className="w-10" onChange={handleChangeDocumentBackgroundColor} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Փաստաթղթի գույն</TooltipContent>
          </Tooltip>
        </div>

        <div className="border-l border-gray-300 px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onSetDocumentData((prev) => (prev ? { ...prev, isEditMode: true } : prev))}
                variant={documentData?.isEditMode ? "primary" : "ghost"}
                size="icon"
              >
                <Scaling className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Խմբագրել</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onUndo} disabled={!undoStack.length} variant="ghost" size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Վերադարձ</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onRedo} disabled={!redoStack.length} variant="ghost" size="icon">
              <RotateCw className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Կրկնել</TooltipContent>
        </Tooltip>

        <div className="border-l border-gray-300 pl-2 flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <FileText className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Փաստաթուղթ</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleAddImage} variant="ghost" size="icon">
                <ImageUp className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ավելացնել նկար</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="primary"
                className="group gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
                Բեռնել
                <ChevronDown className="w-3 h-3 opacity-80 transition-transform group-hover:rotate-180" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="flex flex-col gap-3 min-w-[140px] p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95"
            >
              {EXPORT_TYPES.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-200 hover:translate-x-1 ${type.color}`}
                >
                  <div className={`p-1 rounded-lg ${type.color.split("hover")[0]}`}>{type.icon}</div>
                  <span className="font-medium">{type.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
