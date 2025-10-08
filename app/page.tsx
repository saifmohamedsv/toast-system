"use client";
import {
  toast,
  ToastContainer,
  ToastPosition,
  ToastVariant,
} from "@/components/toast";
import { useState } from "react";

const variants: ToastVariant[] = ["success", "error", "warning", "info"];
const variantIcons: Record<ToastVariant, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};
const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export default function Home() {
  const [selectedVariant, setSelectedVariant] =
    useState<ToastVariant>("success");
  const [selectedPosition, setSelectedPosition] =
    useState<ToastPosition>("top-right");

  const handleShowToast = () => {
    toast[selectedVariant](
      `${selectedVariant} at ${selectedPosition}`,
      `This is a ${selectedVariant} message`,
      { position: selectedPosition }
    );
  };

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center gap-12 bg-white text-gray-900">
      <header className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-2">Toast System Documentation</h1>
        <p className="text-gray-700">
          Select a variant and position, then click <b>Show Toast</b> to see it
          in action. See usage example below.
        </p>
      </header>

      <section className="w-full max-w-xl flex flex-col gap-8 items-center">
        <div className="w-full flex flex-col gap-8 justify-center">
          {/* Variant Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Variant</h2>
            <div className="flex gap-2 flex-wrap justify-center">
              {variants.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium
                    ${
                      selectedVariant === variant
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-50"
                    }
                  `}
                  aria-pressed={selectedVariant === variant}
                >
                  <span>{variantIcons[variant]}</span>
                  <span className="capitalize">{variant}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Position Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Position</h2>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() => setSelectedPosition(position)}
                  className={`px-3 py-2 rounded-lg border text-sm transition font-medium
                    ${
                      selectedPosition === position
                        ? "bg-blue-100 text-blue-800 border-blue-400"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-50"
                    }
                  `}
                  aria-pressed={selectedPosition === position}
                >
                  {position.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          className="mt-4 px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition text-lg"
          onClick={handleShowToast}
        >
          Show Toast
        </button>
      </section>

      <section className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`import { toast, ToastContainer } from "@/components/toast";

toast.success("Success", "This is a success message", {
  position: "top-right",
  variant: "success",
});

<ToastContainer />`}
        </pre>
      </section>

      <ToastContainer />
    </div>
  );
}
