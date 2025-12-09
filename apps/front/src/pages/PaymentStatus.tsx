import { PaymentSuccess } from "@/components/payment";
import { Spinner } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePageMeta } from "@/hooks";

export const PaymentStatus: React.FC = () => {
  usePageMeta("Վճարման կարգավիճակ", "Ստուգեք ձեր վճարման արդյունքը և շարունակեք փաստաթղթերի հասանելիությունը։");

  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const statusParam = searchParams.get("status");

    if (statusParam) {
      setStatus(statusParam.toLowerCase());
    } else {
      const pathname = window.location.pathname;
      if (pathname.includes("status=success")) {
        setStatus("success");
      } else if (pathname.includes("status=failed")) {
        setStatus("failed");
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const queryStatus = urlParams.get("status");
        if (queryStatus) {
          setStatus(queryStatus.toLowerCase());
        }
      }
    }

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (status === "success") {
    return <PaymentSuccess />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Անվավեր Վճարման Կարգավիճակ</h1>
        <p className="text-gray-600 mb-6">
          Հնարավոր չէ որոշել վճարման կարգավիճակը: Խնդրում ենք ստուգել ձեր գործարքների պատմությունը:
        </p>
      </div>
    </div>
  );
};
