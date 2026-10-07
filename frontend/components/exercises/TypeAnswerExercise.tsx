"use client";

interface TypeAnswerExerciseProps {
  selected: string;
  disabled: boolean;
  onSelect: (answer: string) => void;
}

export default function TypeAnswerExercise({
  selected,
  disabled,
  onSelect,
}: TypeAnswerExerciseProps) {
  return (
    <div>
      <input
        type="text"
        value={selected}
        disabled={disabled}
        onChange={(e) => onSelect(e.target.value)}
        placeholder="Type your answer..."
        autoComplete="off"
        className="
          w-full rounded-2xl border-2
          border-gray-300 bg-white
          px-6 py-5
          text-xl font-bold text-gray-900
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-blue-500
          disabled:bg-gray-100
        "
      />

      <p className="mt-3 text-sm text-gray-500">
        Type the German word or phrase.
      </p>
    </div>
  );
}