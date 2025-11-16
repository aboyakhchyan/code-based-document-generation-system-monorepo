import { ImagePlus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface IconGridProps {
  file: File | null;
  onSetFile: Dispatch<SetStateAction<File | null>>;
}

export const IconGrid: React.FC<IconGridProps> = ({ file, onSetFile }) => {
  const handleChangeFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png, .webp, .jpg, .jpeg, .svg";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        onSetFile(target.files[0]);
      }
    };
    input.click();
  };

  const handleRemoveFile = () => {
    if (file) {
      onSetFile(null);
    }
  };

  return (
    <>
      {file ? (
        <div className="relative flex justify-center items-center w-12 h-12 rounded-xl">
          <img
            className="w-12 h-12 rounded-xl"
            alt="image"
            src={URL.createObjectURL(file)}
          />
          <span
            onClick={handleRemoveFile}
            className="absolute top-[-3px] right-[-3px] flex justify-center items-center w-4 h-4 text-sm rounded-[50%] bg-error-100 cursor-pointer select-none text-white"
          >
            ✕
          </span>
        </div>
      ) : (
        <div
          onClick={handleChangeFile}
          className="flex justify-center items-center w-12 h-12 rounded-xl border-2 border-primary-800 border-dashed cursor-pointer"
        >
          <ImagePlus className="text-primary-800" />
        </div>
      )}
    </>
  );
};
