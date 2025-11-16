import { useRef, useState } from "react";

export const Verification: React.FC = () => {
  const [values, setValues] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string>("");
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = values.join("");
    if (code.length !== 4) return setError("Դաշտը պետք է պարունակի 4 նիշ");
    
  };

  return (
    <main className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-lg text-primary-800 font-semibold">
          Մուտքագրեք 4-հիշատակի կոդը
        </h2>
        <div className="flex gap-2">
          {values.map((val, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 text-center border border-primary-800 rounded-md focus:outline-none focus:ring"
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => {
                inputsRef.current[index] = el!;
              }}
            />
          ))}
        </div>
        {error && <p className="text-sm text-error-100">{error}</p>}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary-200 text-white rounded-2xl hover:bg-primary-300 transition text-sm cursor-pointer"
        >
          Ստուգել
        </button>
      </div>
    </main>
  );
};
