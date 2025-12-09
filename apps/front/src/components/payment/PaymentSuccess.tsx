import { Button } from "@/components/ui";
import { CheckCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import StripeIcon from '@assets/icons/stripe.svg'

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="relative w-full max-w-md bg-white shadow-lg rounded-2xl p-8 pb-25 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Վճարումը հաջողությամբ ավարտվեց!</h1>

        <p className="text-gray-600 mb-6">Ձեր վճարումը հաջողությամբ մշակվել է: Ձեր բաժանորդագրությունը այժմ ակտիվ է:</p>

        <div className="space-y-3">
          <Button variant="primary" size="lg" className="w-full" onClick={() => navigate("/dashboard")}>
            Գնալ Գլխավոր էջ
          </Button>

          <Button
            variant="ghost"
            size="md"
            className="w-full"
            onClick={() => navigate("/dashboard/transaction/history")}
          >
            Դիտել Գործարքների Պատմություն
          </Button>
        </div>
        <div className="absolute flex items-center justify-center w-full h-15 bg-primary-800 bottom-0 left-0 rounded-b-2xl">
            <img src={StripeIcon} width={50} height={50} alt="Stripe image"/>
        </div>
      </div>
    </div>
  );
};
