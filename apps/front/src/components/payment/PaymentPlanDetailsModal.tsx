import { usePaymentApi } from "@/hooks";
import { Button, Skeleton, Spinner } from "@/components/ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { X } from "lucide-react";
import StripeIcon from "@assets/icons/stripe.svg";
import { cn } from "@/components/ui/utils";
import type { AxiosError } from "axios";

interface IPaymentPlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IPlan {
  id: string;
  amount: string;
  savingAmount?: string;
  savingPercent?: string;
  interval: "year" | "month";
}

const PaymentPlanDetailsModal: React.FC<IPaymentPlanDetailsModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { getPlanDetailsApi, initPaymentApi } = usePaymentApi();

  const {
    data: plans,
    isLoading: isPlanDetailsLoading,
    isError: isPlanDetailsError,
    error: planDetailsError,
  } = useQuery<IPlan[]>({
    queryKey: ["payment-plans"],
    queryFn: getPlanDetailsApi,
    enabled: isOpen,
  });

  const {
    mutateAsync,
    isPending: isInitPaymentLoading,
    isError: isInitPaymentError,
  } = useMutation({
    mutationFn: initPaymentApi,
    onSuccess: (data) => {
      const url = data.url;

      document.location.href = url;
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const responseMessage = error?.response?.data.message || "";

      setErrorMsg(responseMessage);
    },
  });

  const handlePaymentInit = async () => {
    if (!selectedPlanId) return;

    mutateAsync(selectedPlanId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray/50 backdrop-blur-sm animate-in fade-in-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-90">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <h2 className="text-2xl font-bold text-white text-center w-[80%]">Ընտրեք Բաժանորդագրության փաթեթ</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/70 transition cursor-pointer">
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          {isPlanDetailsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative p-6 rounded-2xl border-2 border-gray-200 bg-white">
                <div className="space-y-4">
                  <div>
                    <Skeleton variant="rounded" height={28} width="60%" className="mb-2" />
                    <Skeleton variant="rounded" height={16} width="40%" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <Skeleton variant="rounded" height={48} width="120px" />
                    <Skeleton variant="rounded" height={20} width="60px" />
                  </div>
                  <Skeleton variant="rounded" height={40} width="100%" className="mt-4" />
                </div>
              </div>

              <div className="relative p-6 rounded-2xl border-2 border-gray-200 bg-white">
                <div className="space-y-4">
                  <div>
                    <Skeleton variant="rounded" height={28} width="60%" className="mb-2" />
                    <Skeleton variant="rounded" height={16} width="40%" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <Skeleton variant="rounded" height={48} width="120px" />
                    <Skeleton variant="rounded" height={20} width="60px" />
                  </div>
                  <Skeleton variant="rounded" height={40} width="100%" className="mt-4" />
                </div>
              </div>
            </div>
          )}
          {plans && plans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => {
                const isYearly = plan.interval === "year";

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative p-6 rounded-2xl transition-all duration-300 border bg-white border-gray-200",
                      "hover:border-primary-300 hover:shadow-md",
                      selectedPlanId === plan.id && "border-primary-300 shadow-md"
                    )}
                  >
                    {isYearly && plan.savingPercent && (
                      <div className="absolute -top-3 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        Խնայողություն {plan.savingPercent}
                      </div>
                    )}

                    <div className="flex flex-col justify-between h-full space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {isYearly ? "Տարեկան փաթեթ" : "Ամսական փաթեթ"}
                        </h3>

                        {isYearly && plan.savingAmount && (
                          <p className="text-sm text-gray-700 mt-1">Խնայողություն {plan.savingAmount}</p>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-primary-800">{plan.amount}</span>
                        <span className="text-gray-600 text-lg">/ {isYearly ? "տարի" : "ամիս"}</span>
                      </div>

                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full mt-4 rounded-xl shadow-sm hover:shadow-lg transition"
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        Ընտրել
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {plans && plans.length === 0 && <div className="text-center py-12 text-gray-600">Պլաններ չեն գտնվել</div>}
        </div>
        <div className="flex justify-center w-full">
          <Button onClick={handlePaymentInit} variant="primary" className="w-max">
            {isInitPaymentLoading ? <Spinner size="sm" /> : "Վճարել"}
          </Button>
        </div>

        {(isPlanDetailsError || isInitPaymentError) && (
          <div className="text-center py-4 text-red-600 font-medium">
            {isPlanDetailsError && planDetailsError instanceof Error ? `${planDetailsError.message}` : null}

            {isInitPaymentError ? `${errorMsg}` : null}
          </div>
        )}

        <div className="p-4 mt-4 border-t border-gray-200 flex justify-center bg-gray-50">
          <img src={StripeIcon} alt="Stripe" width={55} height={55} className="opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default PaymentPlanDetailsModal;
