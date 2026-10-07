"use client";

import {
  Lock,
  Check,
} from "lucide-react";

interface SkillNodeProps {
  id: number;
  title: string;
  progress: number;
  locked: boolean;
  completed: boolean;
  onClick: () => void;
}

export default function SkillNode({
  title,
  progress,
  locked,
  completed,
  onClick,
}: SkillNodeProps) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`group flex w-64 flex-col items-center rounded-3xl border-2 bg-white p-6 shadow-sm transition ${
        locked
          ? "cursor-not-allowed border-gray-200 opacity-60"
          : completed
            ? "border-green-500 hover:-translate-y-1 hover:shadow-lg"
            : "border-blue-500 hover:-translate-y-1 hover:shadow-lg"
      }`}
    >
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full ${
          locked
            ? "bg-gray-200 text-gray-500"
            : completed
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
        }`}
      >
        {locked ? (
          <Lock className="h-8 w-8" />
        ) : completed ? (
          <Check className="h-9 w-9" />
        ) : (
          <span className="text-3xl">📚</span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-black text-gray-900">
        {title}
      </h3>

      <div className="mt-4 w-full">
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${
              completed
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-2 text-sm font-bold text-gray-600">
          {completed
            ? "Completed"
            : locked
              ? "Locked"
              : `${progress}% complete`}
        </p>
      </div>
    </button>
  );
}