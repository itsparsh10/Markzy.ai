"use client";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div className="border-t border-blue-100 bg-white px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div className="text-blue-900 font-medium text-center sm:text-left">
        &copy; Markzy 2025
      </div>
      <div className="w-full sm:w-auto flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5">
        <button
          onClick={() => router.push("/help-center")}
          className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-2 text-sm sm:text-base"
        >
          <i className="fas fa-question-circle"></i>
          <span>Help Center</span>
        </button>
        <button
          onClick={() => router.push("/suggest-tool")}
          className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-2 text-sm sm:text-base"
        >
          <i className="fas fa-lightbulb"></i>
          <span>Suggest a Tool</span>
        </button>
        <button
          onClick={() => router.push("/rate-us")}
          className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-2 text-sm sm:text-base"
        >
          <i className="fas fa-star"></i>
          <span>Rate Us</span>
        </button>
      </div>
    </div>
  );
}
