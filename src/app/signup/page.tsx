"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Mail, Lock, User, Github, Loader2, CheckCircle } from "lucide-react";
import { signUpWithEmail, signInWithOAuth } from "@/lib/supabase/auth";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const result = await signUpWithEmail(email, password, displayName);

    if (result.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    await signInWithOAuth(provider);
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="border-2 border-[var(--terminal-green)] p-8 max-w-md w-full text-center space-y-6 bg-[var(--terminal-bg)]">
          <div className="w-16 h-16 mx-auto border-2 border-[var(--terminal-green)] flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[var(--terminal-green)]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold uppercase font-mono text-[var(--terminal-green)]">
              Check_Your_Email!
            </h1>
            <p className="text-[var(--terminal-green)]/70 font-mono text-sm">
              &gt; We&apos;ve sent a confirmation link to{" "}
              <span className="text-[var(--terminal-purple)] font-bold">{email}</span>.
              Click the link to activate your account.
            </p>
          </div>

          <div className="pt-4 border-t-2 border-[var(--terminal-green)]/30">
            <p className="text-sm text-[var(--terminal-green)]/70 font-mono">
              Didn&apos;t receive the email?{" "}
              <button
                onClick={() => setIsSuccess(false)}
                className="text-[var(--terminal-purple)] hover:underline font-bold"
              >
                Try_again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Terminal className="w-8 h-8 text-[var(--terminal-green)]" />
            <span className="text-[var(--terminal-green)] uppercase font-mono tracking-tighter">
              Vibe_Coding
            </span>
          </Link>
          <p className="text-[var(--terminal-green)]/70 font-mono text-sm">
            &gt; Join the community of Senior Vibe Architects
          </p>
        </div>

        {/* Signup Card */}
        <div className="border-2 border-[var(--terminal-green)] p-8 space-y-6 bg-[var(--terminal-bg)]">
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b-2 border-[var(--terminal-green)]/30 pb-4 -mt-4 -mx-4 px-4">
            <span className="text-[var(--terminal-purple)] font-mono text-xs uppercase">
              REGISTER_MODULE.exe
            </span>
            <div className="flex gap-2">
              <div className="w-3 h-3 border border-[var(--terminal-green)]" />
              <div className="w-3 h-3 border border-[var(--terminal-green)]" />
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleOAuth("github")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold uppercase font-mono"
            >
              <Github className="w-5 h-5" />
              Continue_with_GitHub
            </button>

            <button
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold uppercase font-mono"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue_with_Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[var(--terminal-green)]/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--terminal-bg)] px-2 text-[var(--terminal-purple)] font-mono font-bold">
                // OR_SIGN_UP_WITH_EMAIL //
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-bold uppercase font-mono text-[var(--terminal-green)]">
                Display_Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--terminal-green)]/50" />
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Vibe_Master"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--terminal-bg)] border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] font-mono focus:outline-none focus:border-[var(--terminal-purple)] placeholder:text-[var(--terminal-green)]/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold uppercase font-mono text-[var(--terminal-green)]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--terminal-green)]/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--terminal-bg)] border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] font-mono focus:outline-none focus:border-[var(--terminal-purple)] placeholder:text-[var(--terminal-green)]/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-bold uppercase font-mono text-[var(--terminal-green)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--terminal-green)]/50" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--terminal-bg)] border-2 border-[var(--terminal-green)] text-[var(--terminal-green)] font-mono focus:outline-none focus:border-[var(--terminal-purple)] placeholder:text-[var(--terminal-green)]/30"
                />
              </div>
              <p className="text-xs text-[var(--terminal-green)]/50 font-mono">
                &gt; At least 8 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[var(--terminal-purple)] text-white font-bold uppercase font-mono pixel-border-sm hover:translate-y-0.5 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  CREATING_ACCOUNT...
                </>
              ) : (
                "CREATE_ACCOUNT.exe"
              )}
            </button>
          </form>

          <p className="text-xs text-center text-[var(--terminal-green)]/50 font-mono">
            &gt; By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[var(--terminal-green)]/70 font-mono">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--terminal-purple)] hover:underline font-bold"
          >
            Sign_in
          </Link>
        </p>
      </div>
    </div>
  );
}
