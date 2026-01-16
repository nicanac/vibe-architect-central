"use client";

import { cn } from "@/lib/utils";
import { Terminal, AtSign, Network, Code } from "lucide-react";
import Link from "next/link";

interface TerminalFooterProps {
  theme?: "dark" | "light";
}

export function TerminalFooter({ theme = "dark" }: TerminalFooterProps) {
  return (
    <footer className="border-t-8 border-[var(--terminal-purple)] pt-16 pb-8 text-xs uppercase tracking-widest bg-[var(--terminal-bg)]">
      <div className="max-w-8xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2 mb-6 text-[var(--terminal-green)]">
              <Terminal className="w-6 h-6" />
              <span className="font-bold text-xl tracking-tighter">
                Vibe_Coding
              </span>
            </div>
            <p className="leading-loose text-[var(--terminal-text-muted)]">
              Automating the future, one vibe at a time. <br />
              LOCATION: [ CLOUD_SERVER_01 ]
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 underline text-[var(--terminal-green)]">
              DIR: /Company
            </h4>
            <ul className="space-y-3 text-[var(--terminal-text-muted)]">
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--terminal-purple)] transition-colors"
                >
                  About_Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--terminal-purple)] transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--terminal-purple)] transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold mb-6 underline text-[var(--terminal-green)]">
              DIR: /Services
            </h4>
            <ul className="space-y-3 text-[var(--terminal-text-muted)]">
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--terminal-purple)] transition-colors"
                >
                  AI_Consulting
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--terminal-purple)] transition-colors"
                >
                  Development
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[var(--terminal-purple)] transition-colors"
                >
                  System_Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-6 underline text-[var(--terminal-green)]">
              Join_The_Network
            </h4>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="EMAIL_ADDRESS"
                className="border-2 p-2 font-mono outline-none transition-colors bg-[var(--terminal-bg)] border-[var(--terminal-green)] text-[var(--terminal-green)] focus:border-[var(--terminal-purple)]"
              />
              <button
                type="submit"
                className="font-bold py-2 pixel-border-sm transition-colors bg-[var(--terminal-green)] text-[var(--terminal-bg)] hover:bg-[var(--terminal-hover-bg)] hover:text-[var(--terminal-hover-text)]"
              >
                JOIN_VIBE.exe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-[var(--terminal-border-muted)] text-[var(--terminal-text-muted)]">
          <p>© 2024 Vibe Coding Agency. All bits reserved.</p>
          <div className="flex space-x-8">
            <Link
              href="#"
              className="hover:text-[var(--terminal-purple)] transition-colors"
            >
              <AtSign className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="hover:text-[var(--terminal-purple)] transition-colors"
            >
              <Network className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="hover:text-[var(--terminal-purple)] transition-colors"
            >
              <Code className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
