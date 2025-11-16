import React from "react";
import { Button } from "@components/ui/Button";

export const NotFound: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Էջը չի գտնվել
      </h2>
      <p className="text-gray-500 mb-8">
        Կներեք, բայց այս էջը գոյություն չունի։ Ստուգեք հասցեն կամ վերադարձրեք
        գլխավոր էջ։
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => window.history.back()} variant="link">
          Վերադառնալ
        </Button>

        <Button onClick={() => (window.location.href = "/")} variant="link">
          Գլխավոր էջ
        </Button>
      </div>
    </main>
  );
};
