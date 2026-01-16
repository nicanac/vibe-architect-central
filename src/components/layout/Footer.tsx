import Link from "next/link";
import { Terminal, Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-[var(--terminal-green)] bg-[var(--terminal-bg)] mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Terminal className="w-5 h-5 text-[var(--terminal-green)]" />
              <span className="text-[var(--terminal-green)] uppercase tracking-tighter font-mono">
                Vibe_Coding_v1.0
              </span>
            </Link>
            <p className="text-[var(--terminal-green)]/70 font-mono text-sm">
              &gt; Cutting-edge AI tools and orchestration prompts for Senior Vibe Architects.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[var(--terminal-purple)] font-mono font-bold uppercase text-sm">
              {"// Navigation"}
            </h3>
            <nav className="grid grid-cols-2 gap-2 text-sm font-mono">
              <Link
                href="/tools"
                className="text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors"
              >
                [ Tools ]
              </Link>
              <Link
                href="/prompts"
                className="text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors"
              >
                [ Prompts ]
              </Link>
              <Link
                href="/instructions"
                className="text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors"
              >
                [ Instructions ]
              </Link>
              <Link
                href="/wizard"
                className="text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors"
              >
                [ Wizard ]
              </Link>
              <Link
                href="/submit"
                className="text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors"
              >
                [ Submit ]
              </Link>
              <Link
                href="/profile"
                className="text-[var(--terminal-green)]/70 hover:text-[var(--terminal-green)] transition-colors"
              >
                [ Profile ]
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-[var(--terminal-purple)] font-mono font-bold uppercase text-sm">
              {"// Connect"}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/nicanac/vibe-architect-central"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 border-[var(--terminal-green)]/50 text-[var(--terminal-green)]/70 hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/10 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border-2 border-[var(--terminal-green)]/50 text-[var(--terminal-green)]/70 hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)] hover:bg-[var(--terminal-green)]/10 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[var(--terminal-green)]/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[var(--terminal-green)]/50 font-mono text-xs">
            © {currentYear} Vibe Architect Central. All rights reserved.
          </p>
          <p className="text-[var(--terminal-green)]/50 font-mono text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-[var(--terminal-purple)]" /> by Vibe Architects
          </p>
        </div>
      </div>
    </footer>
  );
}
