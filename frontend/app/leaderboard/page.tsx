"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

import TopBar from "@/components/TopBar";
import {
  getLeaderboard,
  getUserStats,
} from "@/lib/api";

interface Leader {
  rank: number;
  id: number;
  username: string;
  xp: number;
  streak: number;
}

interface User {
  id: number;
  username: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
}

export default function LeaderboardPage() {
  const router = useRouter();

  const [leaders, setLeaders] = useState<Leader[]>([]);
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

    Promise.all([
      getLeaderboard(),
      getUserStats(currentUser.id),
    ])
      .then(([leaderboard, stats]) => {
        setLeaders(leaderboard);
        setUser(stats);

        localStorage.setItem(
          "duolingo_user",
          JSON.stringify(stats)
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
            <Trophy className="mx-auto h-12 w-12 text-yellow-500" />

            <h1 className="mt-3 text-3xl font-black text-gray-900">
              Leaderboard
            </h1>

            <p className="mt-2 text-gray-600">
              See how you compare with other learners.
            </p>
          </div>

          <div className="space-y-3">
            {leaders.map((leader) => {
              const isCurrentUser =
                leader.id === user.id;

              return (
                <div
                  key={leader.id}
                  className={`flex items-center gap-4 rounded-2xl p-4 ${
                    isCurrentUser
                      ? "bg-green-100 ring-2 ring-green-500"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="w-10 text-center text-lg font-black text-gray-700">
                    {leader.rank}
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-200 text-xl">
                    🦉
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-gray-900">
                      {leader.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-sm text-green-600">
                          You
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-gray-600">
                      🔥 {leader.streak} day streak
                    </p>
                  </div>

                  <div className="font-black text-gray-900">
                    {leader.xp} XP
                  </div>
                </div>
              );
            })}
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