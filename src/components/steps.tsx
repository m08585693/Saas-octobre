"use client";

import { useEffect, useState } from "react";

export default function Steps() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const steps = [
    { n: "01", label: "Rejoins un groupe" },
    { n: "02", label: "Check-in chaque jour" },
    { n: "03", label: "Grimpe dans le classement" },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
      {steps.map((step, i) => (
        <div
          key={step.n}
          className={`text-center transition-all duration-500 ${
            show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: `${i * 110}ms` }}
        >
          <p className="font-display text-6xl font-bold leading-none text-[#3B82F6]">
            {step.n}
          </p>
          <p className="mt-3 font-display text-xl font-semibold text-[#F5F5F5]">
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}