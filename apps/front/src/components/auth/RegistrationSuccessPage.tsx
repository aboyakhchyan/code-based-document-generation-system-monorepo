"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "../ui";

export const RegistrationSuccessPage = () => {
  return (
    <main className="absolute top-0 left-0 flex items-center justify-center min-h-screen w-full  bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <CheckCircle size={28} className="text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Շնորհակալություն գրանցման համար!
        </h1>
        <p className="text-gray-600">
          Ձեր հարցումն ուղարկվել է ադմինիստրատորին։ Պատասխանը կուղարկվի Ձեր էլ․ հասցեին:
        </p>
        <Button
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => window.location.href = "/"}
        >
          Գլխավոր էջ
        </Button>
      </div>
    </main>
  );
}
