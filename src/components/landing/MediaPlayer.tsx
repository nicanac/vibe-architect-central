"use client";

import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import Image from "next/image";

interface MediaPlayerProps {
  theme?: "dark" | "light";
  imageSrc?: string;
}

export function MediaPlayer({ theme = "dark", imageSrc }: MediaPlayerProps) {
  return (
    <section className="mb-32 relative">
      <div className="pixel-border p-2 bg-[var(--terminal-bg)]">
        {/* Terminal Header */}
        <div className="terminal-header h-8 flex items-center px-4 justify-between bg-[var(--terminal-border)]">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--terminal-bg)]">
            Media_Player.dll
          </span>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[var(--terminal-bg)]" />
            <div className="w-3 h-3 bg-[var(--terminal-bg)]" />
          </div>
        </div>

        {/* Video Container */}
        <div className="aspect-video relative overflow-hidden flex items-center justify-center group bg-black">
          {/* Placeholder Image */}
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="Abstract 3D Liquid Forms"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 contrast-125 opacity-60 brightness-150"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--terminal-bg)] to-[var(--terminal-border)]" />
          )}

          {/* Radial Gradient Overlay */}
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--terminal-green)_0%,_transparent_100%)] opacity-20 pointer-events-none"
          />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 pixel-border cursor-pointer hover:scale-110 transition-transform bg-[var(--terminal-purple)]/80">
              <Play className="w-16 h-16 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
