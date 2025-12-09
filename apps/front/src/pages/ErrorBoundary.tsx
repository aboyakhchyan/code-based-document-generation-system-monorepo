import React from "react";
import { Button } from "@components/ui/Button";
import { usePageMeta } from "@/hooks";

export const ErrorBoundary: React.FC = () => {
  usePageMeta("Սերվերի սխալ", "Տեղի է ունեցել տեխնիկական սխալ։ Փորձեք նորից կամ վերադառնեք գլխավոր էջ։");

  return (
    <main className="absolute top-0 left-0 min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-2">500</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Սխալ է տեղի ունեցել
      </h2>
      <p className="text-gray-500 mb-8">
        Կներեք, բայց ինչ-որ բան սխալ է գնացել։ Խնդրում ենք փորձել կրկին կամ
        վերադառնալ գլխավոր էջ։
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => window.location.reload()}
          variant="error"
          size="md"
        >
          Կրկին փորձել
        </Button>

        <Button onClick={() => (window.location.href = "/")} variant="primary">
          Գլխավոր էջ
        </Button>
      </div>
    </main>
  );
};
