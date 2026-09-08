"use client";

import { useEffect, useState } from "react";

export default function Reveal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <h1
      className={`mx-auto max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight font-display sm:text-6xl transition-all duration-700 ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0"
      }`}
    >
      Tiens ton engagement.
      <br />
      <span className="text-[#9AA3B2]">Avec un groupe.</span>
    </h1>
  );
}