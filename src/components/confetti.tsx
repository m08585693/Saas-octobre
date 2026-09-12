"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#8B5CF6", "#3B82F6", "#F59E0B", "#10B981", "#F43F5E", "#FACC15"];

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  spin: number;
};

type ConfettiProps = {
  onDone?: () => void;
};

function makePieces(): ConfettiPiece[] {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.4,
    size: 6 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    spin: 360 + Math.random() * 720,
  }));
}

export default function Confetti({ onDone }: ConfettiProps) {
  const [pieces] = useState<ConfettiPiece[]>(makePieces);

  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  if (pieces.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -30, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0.9, 0],
            rotate: p.spin,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.55,
            backgroundColor: p.color,
            borderRadius: 2,
            boxShadow: `0 0 8px ${p.color}66`,
          }}
        />
      ))}
    </div>
  );
}