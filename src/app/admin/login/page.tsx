"use client";

import { useState, useRef, useCallback, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import OrbitBackground from "@/components/home/OrbitBackground";

type LoginState = "idle" | "loading" | "success" | "error";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loginState, setLoginState] = useState<LoginState>("idle");

  // Stable Supabase client — created once, reused across submissions
  const supabaseRef = useRef(createClient());

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (loginState === "loading" || loginState === "success") return;

      setError(null);
      setLoginState("loading");

      const supabase = supabaseRef.current;

      // Retry up to 3 times for flaky connections
      const MAX_ATTEMPTS = 3;
      let lastError = "";

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (authError) {
            // Auth errors (wrong password, etc.) — don't retry
            lastError = authError.message;

            // Friendly error messages
            if (authError.message.includes("Invalid login")) {
              lastError = "Invalid email or password";
            } else if (authError.message.includes("rate")) {
              lastError = "Too many attempts — please wait a moment";
            }

            break;
          }

          // Success — verify the session is actually set
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            lastError = "Session not established — retrying...";
            if (attempt < MAX_ATTEMPTS) {
              await new Promise((r) => setTimeout(r, 1000 * attempt));
              continue;
            }
            break;
          }

          // Session confirmed — show success state briefly, then redirect
          setLoginState("success");

          // Refresh the router cache so server components see the new session
          router.refresh();

          // Small delay for the success animation to be visible
          await new Promise((r) => setTimeout(r, 600));

          router.push("/admin");
          return;
        } catch (e: unknown) {
          lastError =
            e instanceof Error ? e.message : "Connection error — retrying...";

          if (attempt < MAX_ATTEMPTS) {
            await new Promise((r) => setTimeout(r, 1000 * attempt));
            continue;
          }
        }
      }

      // All attempts failed
      setLoginState("error");
      setError(lastError || "Unable to sign in. Please try again.");

      // Reset to idle after a moment so user can retry
      setTimeout(() => setLoginState("idle"), 2000);
    },
    [email, password, loginState, router]
  );

  const isDisabled = loginState === "loading" || loginState === "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-mag-black relative">
      <OrbitBackground glossaryTerms={[]} showTerms={false} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 max-w-sm w-full mx-4 bg-mag-dark/80 backdrop-blur-xl border border-mag-border rounded-xl p-8"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/spxlogo.png"
            alt="SPX6900 Logo"
            width={60}
            height={60}
            className="w-[60px] h-[60px]"
          />
        </div>

        {/* Heading */}
        <h1 className="font-display text-xl font-bold mt-4 text-center text-white">
          Admin Login
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@spx6900.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isDisabled}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isDisabled}
          />

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium sign-in button */}
          <motion.button
            type="submit"
            disabled={isDisabled}
            whileTap={isDisabled ? undefined : { scale: 0.98 }}
            className={`
              relative w-full h-11 rounded-lg font-semibold text-sm
              transition-all duration-300 overflow-hidden
              disabled:cursor-not-allowed
              ${
                loginState === "success"
                  ? "bg-emerald-500 text-white"
                  : loginState === "error"
                    ? "bg-red-500/80 text-white"
                    : "bg-gold-400 text-mag-black hover:bg-gold-500"
              }
            `}
          >
            {/* Animated shimmer overlay during loading */}
            <AnimatePresence>
              {loginState === "loading" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s ease-in-out infinite",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Glow pulse during loading */}
            {loginState === "loading" && (
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  boxShadow: "0 0 20px rgba(212,175,55,0.3)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            )}

            {/* Button content */}
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              <AnimatePresence mode="wait">
                {loginState === "loading" ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </motion.span>
                ) : loginState === "success" ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="inline-flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Welcome back
                  </motion.span>
                ) : loginState === "error" ? (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Try again
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        </form>
      </motion.div>

      {/* Shimmer keyframe animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
