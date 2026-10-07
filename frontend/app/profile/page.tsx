"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Heart,
  Gem,
  Zap,
  Target,
} from "lucide-react";

import TopBar from "@/components/TopBar";
import { getUserStats } from "@/lib/api";

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

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(
      "duolingo_user"
    );

    if (!stored) {
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(stored);

    getUserStats(currentUser.id)
      .then((data) => {
        setUser(data);

        localStorage.setItem(
          "duolingo_user",
          JSON.stringify(data)
        );
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
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

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
              🦉
            </div>

            <h1 className="mt-4 text-3xl font-black text-gray-900">
              {user.username}
            </h1>

            <p className="mt-1 text-gray-600">
              German learner
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              icon={<Zap />}
              label="Total XP"
              value={user.xp}
            />

            <StatCard
              icon={<Flame />}
              label="Streak"
              value={`${user.streak} days`}
            />

            <StatCard
              icon={<Heart />}
              label="Hearts"
              value={`${user.hearts}/5`}
            />

            <StatCard
              icon={<Gem />}
              label="Gems"
              value={user.gems}
            />
          </div>

          <div className="mt-8 rounded-2xl bg-green-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-green-600" />

                <span className="font-bold text-gray-900">
                  Daily Goal
                </span>
              </div>

              <span className="font-bold text-gray-900">
                {user.daily_xp}/{user.daily_goal} XP
              </span>
            </div>

            <div className="mt-4 h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${dailyProgress}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-8 w-full rounded-2xl bg-green-500 py-4 font-black text-white hover:bg-green-600"
          >
            Back to Learning Path
          </button>
        </div>
      </main>
    </div>
  );
}


function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center text-green-600">
        {icon}
      </div>

      <p className="mt-2 text-2xl font-black text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-600">
        {label}
      </p>
    </div>
  );
}