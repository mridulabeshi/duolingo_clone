"use client";

import { useState } from "react";

interface TranslateExerciseProps {
  wordBank: string[];
  selected: string;
  disabled: boolean;
  onSelect: (answer: string) => void;
}

export default function TranslateExercise({
  wordBank,
  selected,
  disabled,
  onSelect,
}: TranslateExerciseProps) {
  const [words, setWords] = useState<string[]>(
    selected ? selected.split(" ") : []
  );

  function toggleWord(word: string, index: number) {
    if (disabled) return;

    const newWords = [...words];

    const selectedIndex = newWords.indexOf(word);

    if (selectedIndex !== -1) {
      newWords.splice(selectedIndex, 1);
    } else {
      newWords.push(word);
    }

    setWords(newWords);
    onSelect(newWords.join(" "));
  }

  return (
    <div>
      <div className="mb-8 min-h-20 rounded-2xl border-2 border-gray-200 bg-gray-50 p-5">
        <p className="text-xl font-bold text-gray-900">
          {words.join(" ")}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {wordBank.map((word, index) => {
          const used = words.includes(word);

          return (
            <button
              key={`${word}-${index}`}
              disabled={disabled || used}
              onClick={() => toggleWord(word, index)}
              className={`
                rounded-xl border-2 px-5 py-3
                font-bold text-gray-900
                shadow-sm transition
                ${
                  used
                    ? "border-gray-200 bg-gray-100 text-gray-400"
                    : "border-gray-300 bg-white hover:-translate-y-0.5 hover:border-blue-400"
                }
              `}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}