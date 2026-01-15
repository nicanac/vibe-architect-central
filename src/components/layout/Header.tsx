import Link from "next/link";
import { Terminal, User, LogIn, Wrench, BookOpen, Wand2, FileCode2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/auth";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-[var(--terminal-bg)] border-b-4 border-[var(--terminal-green)]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Terminal className="w-6 h-6 text-[var(--terminal-green)]" />
          <span className="hidden sm:inline text-[var(--terminal-green)] uppercase tracking-tighter font-mono">
            Vibe_Coding_v1.0
          </span>
          <span className="sm:hidden text-[var(--terminal-green)] uppercase font-mono">VAC</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-4 text-sm uppercase">
          <Link
            href="/tools"
            className="flex items-center gap-1.5 px-2 py-1 text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold"
          >
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">[ Tools ]</span>
          </Link>
          <Link
            href="/prompts"
            className="flex items-center gap-1.5 px-2 py-1 text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">[ Prompts ]</span>
          </Link>
          <Link
            href="/instructions"
            className="flex items-center gap-1.5 px-2 py-1 text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold"
          >
            <FileCode2 className="w-4 h-4" />
            <span className="hidden sm:inline">[ Instructions ]</span>
          </Link>
          <Link
            href="/wizard"
            className="flex items-center gap-1.5 px-2 py-1 text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold"
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">[ Wizard ]</span>
          </Link>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-2 py-1 text-[var(--terminal-green)] hover:bg-[var(--terminal-green)] hover:text-[var(--terminal-bg)] transition-all font-bold"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">[ Profile ]</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-[var(--terminal-purple)] hover:text-[var(--terminal-green)] transition-colors hidden sm:block font-bold uppercase"
                >
                  Sign_Out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-1 bg-[var(--terminal-purple)] text-white pixel-border-sm hover:translate-y-0.5 active:translate-y-1 transition-all font-bold"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">LOGIN.exe</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
