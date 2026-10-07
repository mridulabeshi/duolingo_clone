"use client";

import { useRouter } from "next/navigation";
import SkillNode from "./SkillNode";

interface Skill {
  id: number;
  title: string;
  description: string;
  order_index: number;
  progress: number;
  completed: boolean;
  crowns: number;
  locked: boolean;
  lessons: {
    id: number;
    title: string;
    order_index: number;
  }[];
}

interface Unit {
  id: number;
  title: string;
  description: string;
  order_index: number;
  skills: Skill[];
}

interface LearningPathProps {
  units: Unit[];
}

export default function LearningPath({
  units,
}: LearningPathProps) {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24">
      {units.map((unit) => (
        <section
          key={unit.id}
          className="mb-16"
        >
          <div className="mb-10 rounded-2xl bg-green-500 p-6 text-white shadow-md">
            <p className="text-sm font-bold uppercase tracking-wider opacity-80">
              Unit {unit.order_index}
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {unit.title}
            </h2>

            <p className="mt-1 opacity-90">
              {unit.description}
            </p>
          </div>

          <div className="relative flex flex-col items-center gap-10">
            {unit.skills.map(
              (skill, index) => (
                <div
                  key={skill.id}
                  className="relative"
                >
                  {index > 0 && (
                    <div className="absolute -top-10 left-1/2 h-10 w-1 -translate-x-1/2 bg-gray-300" />
                  )}

                  <SkillNode
                    id={skill.id}
                    title={skill.title}
                    progress={skill.progress}
                    locked={skill.locked}
                    completed={skill.completed}
                    onClick={() => {
                      if (
                        !skill.locked &&
                        skill.lessons.length > 0
                      ) {
                        router.push(
                          `/lesson/${skill.lessons[0].id}`
                        );
                      }
                    }}
                  />

                  {skill.crowns > 0 && (
                    <p className="mt-2 text-center text-sm font-bold text-yellow-600">
                      👑 {skill.crowns}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      ))}
    </main>
  );
}