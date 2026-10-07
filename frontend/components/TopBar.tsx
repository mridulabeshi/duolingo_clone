"use client";

import { useRouter } from "next/navigation";
import {
  Flame,
  Heart,
  Gem,
  Zap,
  UserCircle,
  Trophy,
} from "lucide-react";

interface TopBarProps {
  streak: number;
  xp: number;
  hearts: number;
  gems: number;
}

export default function TopBar({
  streak,
  xp,
  hearts,
  gems,
}: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <button
          onClick={() => router.push("/")}
          className="text-2xl font-black text-green-600"
        >
          MyDuolingo
        </button>

        <div className="flex items-center gap-3">
          <Stat
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            value={streak}
          />

          <Stat
            icon={<Zap className="h-5 w-5 text-yellow-500" />}
            value={xp}
          />

          <Stat
            icon={<Heart className="h-5 w-5 text-red-500" />}
            value={hearts}
          />

          <Stat
            icon={<Gem className="h-5 w-5 text-blue-500" />}
            value={gems}
          />

          <button
            onClick={() =>
              router.push("/leaderboard")
            }
            title="Leaderboard"
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
          >
            <Trophy className="h-5 w-5" />
          </button>

          <button
            onClick={() => router.push("/profile")}
            title="Profile"
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
          >
            <UserCircle className="h-6 w-6" />
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                "duolingo_user"
              );

              router.push("/login");
            }}
            className="rounded-xl px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}


function Stat({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: number;
}) {
  return (
    <div className="flex items-center gap-1 font-black text-gray-800">
      {icon}
      <span>{value}</span>
    </div>
  );
}