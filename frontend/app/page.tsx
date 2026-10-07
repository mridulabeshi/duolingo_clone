"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target } from "lucide-react";

import TopBar from "@/components/TopBar";
import LearningPath from "@/components/LearningPath";
import {
  getCourse,
  getUserStats,
} from "@/lib/api";

interface User {
  id: number;
  username: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  daily_goal: number;
  daily_xp: number;
}

interface Course {
  id: number;
  name: string;
  source_language: string;
  target_language: string;
  units: any[];
}

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(
      "duolingo_user"
    );

    if (!stored) {
      router.push("/login");
      return;
    }

    const loggedInUser = JSON.parse(stored);

    Promise.all([
      getCourse(loggedInUser.id),
      getUserStats(loggedInUser.id),
    ])
      .then(([courseData, statsData]) => {
        setCourse(courseData);
        setUser(statsData);

        localStorage.setItem(
          "duolingo_user",
          JSON.stringify(statsData)
        );
      })
      .catch(() => {
        localStorage.removeItem(
          "duolingo_user"
        );

        router.push("/login");
      });
  }, [router]);

  if (!user || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="font-bold text-gray-600">
          Loading DuoLearn...
        </p>
      </div>
    );
  }

  const dailyProgress = Math.min(
    100,
    Math.round(
      (user.daily_xp / user.daily_goal) * 100
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        streak={user.streak}
        xp={user.xp}
        hearts={user.hearts}
        gems={user.gems}
      />

      <main>
        <section className="mx-auto max-w-3xl px-6 pt-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500">
                  Welcome back
                </p>

                <h1 className="mt-1 text-3xl font-black text-gray-900">
                  {user.username} 👋
                </h1>

                <p className="mt-2 text-gray-600">
                  Keep learning German!
                </p>
              </div>

              <button
                onClick={() => router.push("/profile")}
                className="rounded-2xl bg-green-100 px-4 py-3 font-bold text-green-700"
              >
                Profile
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Target className="h-5 w-5 text-green-600" />
                  Daily Goal
                </div>

                <span className="font-bold text-gray-700">
                  {user.daily_xp}/{user.daily_goal} XP
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${dailyProgress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <LearningPath units={course.units} />
        </div>
      </main>
    </div>
  );
}