import Link from "next/link";
import { Zap, User, LogIn, Wrench, BookOpen, Wand2, FileCode2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/auth";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Zap className="w-6 h-6 text-primary" />
          <span className="hidden sm:inline">Vibe Architect Central</span>
          <span className="sm:hidden">VAC</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-6">
          <Link
            href="/tools"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">Tools</span>
          </Link>
          <Link
            href="/prompts"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Prompts</span>
          </Link>
          <Link
            href="/instructions"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileCode2 className="w-4 h-4" />
            <span className="hidden sm:inline">Instructions</span>
          </Link>
          <Link
            href="/wizard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">Wizard</span>
          </Link>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
