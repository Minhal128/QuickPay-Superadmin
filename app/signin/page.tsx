"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { api } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        skipRefresh: true,
      });
      router.replace("/DashboardMain/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-10 bg-[#131522]"></div>

      <form
        onSubmit={onSubmit}
        className="relative z-20 w-full max-w-lg bg-[#202736] rounded-xl shadow-xl p-6 sm:p-8"
      >
        <h1 className="text-white font-Manrope text-xl md:text-2xl">ABER</h1>

        <p className="text-white font-Manrope text-lg mt-1">
          Login to your account
        </p>

        <div className="mt-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="Please enter your email address"
            className="w-full bg-[#2A3243] text-sm font-Manrope text-white placeholder-[#8CA1C2] rounded-full px-5 py-4.5 outline-none"
          />
        </div>

        <div className="relative mt-3">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full bg-[#2A3243] text-sm font-Manrope text-white placeholder-[#8CA1C2] rounded-full px-5 py-4.5 pr-12 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8CA1C2]"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-red-400 font-Manrope">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 cursor-pointer font-Manrope bg-[#FFFFFF] text-black font-medium py-3.5 rounded-full disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
