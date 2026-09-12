"use client";

import type { ReactNode } from "react";

export default function ScrollLink({
  targetId,
  children,
}: {
  targetId: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }}
      className="transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}