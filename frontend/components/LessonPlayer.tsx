"use client";

import { useEffect, useState } from "react";
import { X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

import TranslateExercise from "./exercises/TranslateExercise";
import MatchPairs from "./exercises/MatchPairs";
import FillBlankExercise from "./exercises/FillBlankExercise";
import TypeAnswerExercise from "./exercises/TypeAnswerExercise";

import {
  submitAnswer,
  completeLesson,
} from "@/lib/api";


// ==================================================
// TYPES
// ==================================================

interface Exercise {
  id: number;
  type: string;
  question: string;

  data: {
    options?: string[];

    word_bank?: string[];

    pairs?: {
      left: string;
      right: string;
    }[];

    hint?: string;
  };

  order_index: number;
}


interface Lesson {
  id: number;
  title: string;

  skill: {
    id: number;
    title: string;
  };

  exercises: Exercise[];

  total_exercises: number;
}


interface LessonPlayerProps {
  lesson: Lesson;
}


interface StoredUser {
  id: number;
  username: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
}


// ==================================================
// LESSON PLAYER
// ==================================================

export default function LessonPlayer({
  lesson,
}: LessonPlayerProps) {

  const router = useRouter();


  // ==================================================
  // STATE
  // ==================================================

  const [user, setUser] =
    useState<StoredUser | null>(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [checked, setChecked] =
    useState(false);

  const [result, setResult] = useState<{
    correct: boolean;
    correctAnswer: string;
    xpEarned: number;
  } | null>(null);

  const [hearts, setHearts] =
    useState(5);

  const [finished, setFinished] =
    useState(false);

  const [completionXp, setCompletionXp] =
    useState(0);


  // ==================================================
  // GET CURRENT USER
  // ==================================================

  useEffect(() => {

    const stored =
      localStorage.getItem(
        "duolingo_user"
      );

    if (!stored) {
      router.push("/login");
      return;
    }

    try {

      const parsed =
        JSON.parse(stored);

      setUser(parsed);
      setHearts(parsed.hearts);

    } catch {

      localStorage.removeItem(
        "duolingo_user"
      );

      router.push("/login");
    }

  }, [router]);


  // ==================================================
  // CURRENT EXERCISE
  // ==================================================

  const exercise =
    lesson.exercises[currentIndex];


  const progress =
    ((currentIndex + 1) /
      lesson.total_exercises) *
    100;


  // ==================================================
  // CHECK ANSWER
  // ==================================================

  async function handleCheck() {

    if (
      !selectedAnswer ||
      checked ||
      !user
    ) {
      return;
    }

    try {

      const resultData =
        await submitAnswer(
          lesson.id,
          exercise.id,
          selectedAnswer,
          user.id
        );


      setResult({
        correct: resultData.correct,
        correctAnswer:
          resultData.correct_answer,
        xpEarned:
          resultData.xp_earned,
      });


      setHearts(
        resultData.hearts
      );


      const updatedUser = {
        ...user,
        xp: resultData.total_xp,
        hearts: resultData.hearts,
      };


      setUser(updatedUser);


      localStorage.setItem(
        "duolingo_user",
        JSON.stringify(updatedUser)
      );


      setChecked(true);

    } catch (error) {

      console.error(
        "Failed to submit answer:",
        error
      );

    }
  }


  // ==================================================
  // CONTINUE
  // ==================================================

  async function handleContinue() {

    if (!user) {
      return;
    }


    // ------------------------------------------
    // LAST EXERCISE
    // ------------------------------------------

    if (
      currentIndex ===
      lesson.exercises.length - 1
    ) {

      try {

        const completion =
          await completeLesson(
            lesson.id,
            user.id
          );


        // XP awarded specifically
        // for completing the lesson.
        setCompletionXp(
          completion.xp_earned
        );


        const updatedUser = {
          ...user,
          xp: completion.total_xp,
          hearts: completion.hearts,
          streak: completion.streak,
        };


        setUser(updatedUser);


        setHearts(
          completion.hearts
        );


        localStorage.setItem(
          "duolingo_user",
          JSON.stringify(updatedUser)
        );


        setFinished(true);

      } catch (error) {

        console.error(
          "Failed to complete lesson:",
          error
        );

      }

      return;
    }


    // ------------------------------------------
    // NEXT EXERCISE
    // ------------------------------------------

    setCurrentIndex(
      (prev) => prev + 1
    );

    setSelectedAnswer("");

    setChecked(false);

    setResult(null);
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (!user) {

    return (
      <main className="flex min-h-screen items-center justify-center">

        <p className="font-bold text-gray-600">
          Loading...
        </p>

      </main>
    );
  }


  // ==================================================
  // LESSON COMPLETE
  // ==================================================

  if (finished) {

    return (
      <LessonComplete
        lesson={lesson}
        completionXp={completionXp}
        onHome={() =>
          router.push("/")
        }
      />
    );
  }


  // ==================================================
  // PLAYER
  // ==================================================

  return (

    <div className="min-h-screen bg-white">


      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="mx-auto flex max-w-3xl items-center gap-5 px-6 py-5">

        <button
          onClick={() =>
            router.push("/")
          }
          className="text-gray-500 hover:text-gray-900"
        >
          <X className="h-7 w-7" />
        </button>


        {/* Progress */}

        <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>


        {/* Hearts */}

        <div className="flex items-center gap-1 font-bold text-red-500">

          <Heart
            className="h-6 w-6 fill-red-500"
          />

          {hearts}

        </div>

      </header>


      {/* ==========================================
          QUESTION
      ========================================== */}

      <main className="mx-auto max-w-2xl px-6 pt-16">

        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
          {lesson.skill.title}
        </p>


        <h1 className="mb-10 text-3xl font-black text-gray-900">
          {exercise.question}
        </h1>


        {/* ========================================
            MULTIPLE CHOICE
        ======================================== */}

        {exercise.type ===
          "multiple_choice" && (

          <MultipleChoice
            options={
              exercise.data.options ??
              []
            }
            selected={
              selectedAnswer
            }
            disabled={
              checked
            }
            onSelect={
              setSelectedAnswer
            }
          />

        )}


        {/* ========================================
            TRANSLATE
        ======================================== */}

        {exercise.type ===
          "translate" && (

          <TranslateExercise
            wordBank={
              exercise.data.word_bank ??
              []
            }
            selected={
              selectedAnswer
            }
            disabled={
              checked
            }
            onSelect={
              setSelectedAnswer
            }
          />

        )}


        {/* ========================================
            MATCH
        ======================================== */}

        {exercise.type ===
          "match" && (

          <MatchPairs
            pairs={
              exercise.data.pairs ??
              []
            }
            selected={
              selectedAnswer
            }
            disabled={
              checked
            }
            onSelect={
              setSelectedAnswer
            }
          />

        )}


        {/* ========================================
            FILL BLANK
        ======================================== */}

        {exercise.type ===
          "fill_blank" && (

          <FillBlankExercise
            options={
              exercise.data.options ??
              []
            }
            selected={
              selectedAnswer
            }
            disabled={
              checked
            }
            onSelect={
              setSelectedAnswer
            }
          />

        )}


        {/* ========================================
            TYPE ANSWER
        ======================================== */}

        {exercise.type ===
          "type_answer" && (

          <TypeAnswerExercise
            selected={
              selectedAnswer
            }
            disabled={
              checked
            }
            onSelect={
              setSelectedAnswer
            }
          />

        )}


        {/* ========================================
            CHECK / FEEDBACK
        ======================================== */}

        <div className="mt-12">

          {!checked ? (

            <button
              onClick={
                handleCheck
              }
              disabled={
                !selectedAnswer ||
                hearts <= 0
              }
              className="
                w-full rounded-2xl
                bg-green-500 py-4
                font-black text-white
                hover:bg-green-600
                disabled:cursor-not-allowed
                disabled:bg-gray-300
              "
            >
              {hearts <= 0
                ? "NO HEARTS"
                : "CHECK"}
            </button>

          ) : (

            <Feedback
              correct={
                result!.correct
              }
              correctAnswer={
                result!.correctAnswer
              }
              xpEarned={
                result!.xpEarned
              }
              onContinue={
                handleContinue
              }
            />

          )}

        </div>

      </main>

    </div>
  );
}


// ==================================================
// MULTIPLE CHOICE
// ==================================================

function MultipleChoice({
  options,
  selected,
  disabled,
  onSelect,
}: {
  options: string[];
  selected: string;
  disabled: boolean;
  onSelect: (
    answer: string
  ) => void;
}) {

  return (

    <div className="space-y-4">

      {options.map(
        (option) => {

          const isSelected =
            selected === option;

          return (

            <button
              key={option}
              disabled={disabled}
              onClick={() =>
                onSelect(option)
              }
              className={`
                w-full rounded-2xl border-2
                px-6 py-5 text-left
                font-bold text-gray-900
                transition-all

                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }
              `}
            >
              {option}
            </button>

          );
        }
      )}

    </div>
  );
}


// ==================================================
// FEEDBACK
// ==================================================

function Feedback({
  correct,
  correctAnswer,
  xpEarned,
  onContinue,
}: {
  correct: boolean;
  correctAnswer: string;
  xpEarned: number;
  onContinue: () => void;
}) {

  return (

    <div
      className={`
        fixed bottom-0 left-0 right-0
        border-t px-6 py-5

        ${
          correct
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }
      `}
    >

      <div className="mx-auto flex max-w-2xl items-center justify-between">

        <div>

          <p
            className={`
              text-xl font-black

              ${
                correct
                  ? "text-green-600"
                  : "text-red-600"
              }
            `}
          >
            {correct
              ? "Correct!"
              : "Not quite!"}
          </p>


          {correct ? (

            <p className="mt-1 font-black text-green-600">
              +{xpEarned} XP
            </p>

          ) : (

            <p className="mt-1 text-gray-700">

              Correct answer:{" "}

              <strong>
                {correctAnswer}
              </strong>

            </p>

          )}

        </div>


        <button
          onClick={
            onContinue
          }
          className={`
            rounded-xl px-8 py-3
            font-black text-white

            ${
              correct
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }
          `}
        >
          CONTINUE
        </button>

      </div>

    </div>
  );
}


// ==================================================
// LESSON COMPLETE
// ==================================================

function LessonComplete({
  lesson,
  completionXp,
  onHome,
}: {
  lesson: Lesson;
  completionXp: number;
  onHome: () => void;
}) {

  return (

    <main className="flex min-h-screen items-center justify-center bg-green-50 px-6">

      <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">


        {/* Celebration */}

        <div className="text-6xl">
          🎉
        </div>


        {/* Title */}

        <h1 className="mt-5 text-4xl font-black text-gray-900">
          Lesson Complete!
        </h1>


        {/* Description */}

        <p className="mt-3 text-gray-600">
          You completed{" "}
          {lesson.title}.
        </p>


        {/* XP */}

        <div className="mt-8 rounded-2xl bg-yellow-50 p-6">

          <p className="text-sm font-bold text-gray-600">
            XP EARNED
          </p>

          <p className="mt-1 text-4xl font-black text-yellow-500">
            +{completionXp} XP
          </p>

        </div>


        {/* Continue */}

        <button
          onClick={onHome}
          className="
            mt-8 w-full rounded-2xl
            bg-green-500 py-4
            font-black text-white
            hover:bg-green-600
          "
        >
          CONTINUE
        </button>

      </div>

    </main>
  );
}