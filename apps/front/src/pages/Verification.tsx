import { RegistrationSuccessPage } from "@/components/auth";
import { Button, Spinner } from "@/components/ui";
import { useAuthApi, usePageMeta } from "@/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Verification: React.FC = () => {
  usePageMeta("Էլ․ փոստի հաստատում", "Մուտքագրեք ստացած կոդը և հաստատեք ձեր էլ․ փոստը՝ ակտիվացնելու հաշիվը։");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(300);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const { handleVerify, handleCheckVerificationAccess, handleResendVerificationCode } = useAuthApi();

  const checkVerificationAccessQuery = useQuery({
    queryKey: ["checkVerificationAccess"],
    queryFn: handleCheckVerificationAccess,
  });

  const { data, isPending: isCheckAccessPending } = checkVerificationAccessQuery;

  useEffect(() => {
    if (data?.remainingTime !== undefined) {
      setRemainingTime(data.remainingTime);
    }
  }, [data?.remainingTime]);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const verifyMutation = useMutation({
    mutationFn: handleVerify,
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || error.message || "Սխալ է առաջացել կոդը ստուգելիս";
      setError(errorMessage);
    },
  });

  const { isError: isVerifyError, isPending: isVerifyPending, error: verifyError } = verifyMutation;

  const resendMutation = useMutation({
    mutationFn: handleResendVerificationCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkVerificationAccess"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || error.message || "Սխալ է առաջացել կոդը կրկին ուղարկելիս";
      setError(errorMessage);
    },
  });

  const { isPending: isResendPending } = resendMutation;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    if (error) {
      setError("");
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (event.key === "Enter" && index === 3 && values[index]) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const code = values.join("");

    if (code.length !== 4) {
      setError("Դաշտը պետք է պարունակի 4 նիշ");
      return;
    }

    setError("");

    verifyMutation.mutate(code);
  };

  if (isSuccess) {
    return <RegistrationSuccessPage />;
  }

  if (isCheckAccessPending) {
    return <Spinner fullScreen={true} />;
  }

  if (!data?.canAccess) {
    navigate("/login");
  }

  return (
    <main className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-lg text-primary-800 font-semibold">Մուտքագրեք 4-նիշանի կոդը</h2>
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
        {remainingTime > 0 && (
          <p className="text-sm text-primary-600">
            Կոդը գործում է մինչև {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
        )}
        {(error || isVerifyError) && (
          <p className="text-sm text-red-600">
            {error ||
              (verifyError instanceof AxiosError
                ? verifyError.response?.data?.message || verifyError.message
                : "Սխալ է առաջացել կոդը ստուգելիս")}
          </p>
        )}
        <p
          onClick={() => {
            if (!isResendPending) {
              setError("");
              resendMutation.mutate();
            }
          }}
          className={`text-xs text-primary-600 select-none ${
            isResendPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isResendPending ? "Ուղարկվում է..." : "Կրկին ուղարկել հաստատման կոդը"}
        </p>
        <Button
          onClick={handleSubmit}
          disabled={isVerifyPending || values.some((v) => !v)}
          className="px-4 py-2 bg-primary-200 text-white rounded-xl hover:bg-primary-300 transition text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifyPending ? "Ստուգվում է..." : "Ստուգել"}
        </Button>
      </div>
    </main>
  );
};
