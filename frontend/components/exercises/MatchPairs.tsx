"use client";

import { useState } from "react";

interface MatchPairsProps {
  pairs: {
    left: string;
    right: string;
  }[];
  selected: string;
  disabled: boolean;
  onSelect: (answer: string) => void;
}

export default function MatchPairs({
  pairs,
  selected,
  disabled,
  onSelect,
}: MatchPairsProps) {
  const [selectedLeft, setSelectedLeft] = useState("");
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const matchedLeft = matchedPairs.map((pair) => pair.split("=")[0]);
  const matchedRight = matchedPairs.map((pair) => pair.split("=")[1]);

  function handleLeftClick(left: string) {
    if (disabled || matchedLeft.includes(left)) return;

    setSelectedLeft(left);
  }

  function handleRightClick(right: string) {
    if (
      disabled ||
      !selectedLeft ||
      matchedRight.includes(right)
    ) {
      return;
    }

    const pair = pairs.find(
      (item) =>
        item.left === selectedLeft &&
        item.right === right
    );

    if (!pair) return;

    const newMatchedPairs = [
      ...matchedPairs,
      `${pair.left}=${pair.right}`,
    ];

    setMatchedPairs(newMatchedPairs);
    setSelectedLeft("");

    // Submit only after every pair has been matched
    if (newMatchedPairs.length === pairs.length) {
      onSelect(newMatchedPairs.join("|"));
    }
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Left column */}
      <div className="space-y-3">
        {pairs.map((pair) => {
          const isMatched = matchedLeft.includes(pair.left);
          const isSelected = selectedLeft === pair.left;

          return (
            <button
              key={pair.left}
              disabled={disabled || isMatched}
              onClick={() => handleLeftClick(pair.left)}
              className={`w-full rounded-xl border-2 px-4 py-4 text-lg font-bold transition ${
                isMatched
                  ? "border-green-400 bg-green-50 text-green-700"
                  : isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                    : "border-gray-300 bg-white text-gray-900 shadow-sm hover:border-blue-400"
              }`}
            >
              {pair.left}

              {isMatched && (
                <span className="ml-2">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right column */}
      <div className="space-y-3">
        {pairs.map((pair) => {
          const isMatched = matchedRight.includes(pair.right);

          return (
            <button
              key={pair.right}
              disabled={disabled || isMatched || !selectedLeft}
              onClick={() => handleRightClick(pair.right)}
              className={`w-full rounded-xl border-2 px-4 py-4 text-lg font-bold transition ${
                isMatched
                  ? "border-green-400 bg-green-50 text-green-700"
                  : !selectedLeft
                    ? "border-gray-300 bg-white text-gray-400"
                    : "border-gray-300 bg-white text-gray-900 shadow-sm hover:border-blue-400"
              }`}
            >
              {pair.right}

              {isMatched && (
                <span className="ml-2">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="col-span-2 text-center">
        <p className="text-sm font-bold text-gray-600">
          {matchedPairs.length} / {pairs.length} matched
        </p>
      </div>
    </div>
  );
}