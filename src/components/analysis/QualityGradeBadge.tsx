import type { QualityGrade } from "../../types";

interface QualityGradeBadgeProps {
  grade: QualityGrade;
  size?: "sm" | "md" | "lg";
}

const gradeColors: Record<QualityGrade, string> = {
  A: "bg-green-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-yellow-500 text-white",
  D: "bg-orange-500 text-white",
  F: "bg-red-500 text-white",
  "N/A": "bg-gray-400 text-white",
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-2",
};

export default function QualityGradeBadge({
  grade,
  size = "md",
}: QualityGradeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-full ${gradeColors[grade]} ${sizeClasses[size]}`}
    >
      {grade}
    </span>
  );
}
