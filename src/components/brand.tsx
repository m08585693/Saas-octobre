import Link from "next/link";
import { Zap } from "lucide-react";

type BrandLogoProps = {
  href?: string;
  withIcon?: boolean;
  size?: "sm" | "lg";
  className?: string;
};

const SIZES = {
  sm: "text-base",
  lg: "text-lg",
};

export default function BrandLogo({
  href = "/",
  withIcon = true,
  size = "sm",
  className,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label="Winter Arc — accueil"
      className={`group inline-flex items-center gap-2.5 ${className ?? ""}`}
    >
      {withIcon && (
        <span className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_16px_rgba(139,92,246,0.4)] transition-shadow duration-300 group-hover:shadow-[0_0_22px_rgba(139,92,246,0.6)]">
          <Zap className="size-4 text-white" fill="currentColor" />
        </span>
      )}
      <span
        className={`font-brand ${SIZES[size]} font-extrabold uppercase leading-none tracking-tight text-transparent bg-gradient-to-b from-white to-[#E2E8F0] bg-clip-text`}
      >
        Winter Arc
      </span>
    </Link>
  );
}