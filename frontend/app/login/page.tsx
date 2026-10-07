"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  login,
  register,
} from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [mode, setMode] = useState<
    "login" | "register"
  >("login");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit() {
    const name = username.trim();

    if (!name) {
      setError("Please enter a username.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user =
        mode === "register"
          ? await register(name)
          : await login(name);

      localStorage.setItem(
        "duolingo_user",
        JSON.stringify(user)
      );

      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        {/* Logo */}
        <div className="text-center">

          <div className="text-6xl">
            🦉
          </div>

          <h1 className="mt-4 text-3xl font-black text-gray-900">
            {mode === "login"
              ? "Welcome back!"
              : "Create your account"}
          </h1>

          <p className="mt-2 text-gray-600">
            Learn German from English
          </p>

        </div>

        {/* Username */}
        <div className="mt-8">

          <label className="mb-2 block font-bold text-gray-800">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Choose a username"
            maxLength={30}
            autoComplete="username"
            className="
              w-full rounded-2xl border-2
              border-gray-200 px-5 py-4
              font-semibold text-gray-900
              outline-none
              focus:border-green-500
            "
          />

          {error && (
            <p className="mt-3 text-sm font-semibold text-red-500">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              mt-6 w-full rounded-2xl
              bg-green-500 py-4
              font-black text-white
              transition
              hover:bg-green-600
              disabled:cursor-not-allowed
              disabled:bg-gray-300
            "
          >
            {loading
              ? "PLEASE WAIT..."
              : mode === "login"
                ? "LOG IN"
                : "CREATE ACCOUNT"}
          </button>

        </div>

        {/* Switch mode */}
        <div className="mt-6 text-center">

          {mode === "login" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?
              {" "}

              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="font-bold text-green-600 hover:text-green-700"
              >
                Create one
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?
              {" "}

              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="font-bold text-green-600 hover:text-green-700"
              >
                Log in
              </button>
            </p>
          )}

        </div>

      </div>

    </main>
  );
}