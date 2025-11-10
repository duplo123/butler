"use client";

import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface StageColumnProps {
  id: string;
  title: string;
  emoji: string;
  count: number;
  children: ReactNode;
}

const stageColors: Record<string, string> = {
  considering: "bg-yellow-100 border-yellow-300",
  applied: "bg-blue-100 border-blue-300",
  registered: "bg-green-100 border-green-300",
  archived: "bg-gray-100 border-gray-300",
};

export default function StageColumn({
  id,
  title,
  emoji,
  count,
  children,
}: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex min-h-[500px] w-full flex-col rounded-lg border-2 border-gray-200 bg-gray-50 p-4 md:w-80">
      <div
        className={`mb-3 rounded-lg border-2 p-3 ${
          stageColors[id] || "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-sm font-medium text-gray-700">
            {count}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 rounded-lg p-2 transition-colors ${
          isOver ? "bg-blue-50" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
