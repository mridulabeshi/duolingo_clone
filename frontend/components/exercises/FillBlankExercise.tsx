"use client";

interface FillBlankExerciseProps {
  options: string[];
  selected: string;
  disabled: boolean;
  onSelect: (answer: string) => void;
}

export default function FillBlankExercise({
  options,
  selected,
  disabled,
  onSelect,
}: FillBlankExerciseProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <button
            key={option}
            disabled={disabled}
            onClick={() => onSelect(option)}
            className={`
              w-full rounded-2xl border-2
              px-6 py-5 text-left
              text-lg font-bold text-gray-900
              transition-all

              ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-400"
              }

              disabled:cursor-default
            `}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}