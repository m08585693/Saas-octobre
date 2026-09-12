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
        const el = document.getElementById(targetId);
        if (!el) return;
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY,
          behavior: reduced ? "auto" : "smooth",
        });
      }}
      className="transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}