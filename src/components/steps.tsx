"use client";

import { useEffect, useState } from "react";

export default function Steps() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const steps = [
    {
      number: "01",
      title: "Rejoins un groupe",
      text: "Pas un cours, pas un coach. Des gens qui poursuivent le même objectif que toi.",
    },
    {
      number: "02",
      title: "Check-in chaque jour",
      text: "Un clic par jour. Ta série se construit, et le jour où tu hésites, elle te retient.",
    },
    {
      number: "03",
      title: "Grimpe dans le classement",
      text: "Ta position dans le groupe est visible. Tu avances, les autres le voient.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {steps.map((step, i) => (
        <div
          key={step.number}
          className={`rounded-[4px] border border-white/10 bg-[#151A24] p-7 transition-all duration-500 ${
            show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: `${i * 120}ms` }}
        >
          <p className="font-mono text-sm text-[#5B93FF]">{step.number}</p>
          <h3 className="mt-4 text-lg font-semibold text-[#F5F5F5] font-display">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#9AA3B2]">
            {step.text}
          </p>
        </div>
      ))}
    </div>
  );
}