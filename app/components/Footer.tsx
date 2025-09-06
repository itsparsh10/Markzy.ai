"use client";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div className="border-t border-blue-100 bg-white px-2 py-2 flex flex-wrap justify-between items-center">
      <div className="text-blue-900 font-medium">
        &copy; Markzy 2025
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={() => router.push("/help-center")}
          className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-2"
        >
          <i className="fas fa-question-circle"></i>
          <span>Help Center</span>
        </button>
        <button
          onClick={() => router.push("/suggest-tool")}
          className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-2"
        >
          <i className="fas fa-lightbulb"></i>
          <span>Suggest a Tool</span>
        </button>
        <button
          onClick={() => router.push("/rate-us")}
          className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-2"
        >
          <i className="fas fa-star"></i>
          <span>Rate Us</span>
        </button>
      </div>
    </div>
  );
}
