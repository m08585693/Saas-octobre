import Link from "next/link";
import BrandLogo from "@/components/brand";
import CreateObjectiveForm from "./create-objective-form";

export default function CreatePage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden bg-[#0A0A10]">
      <div className="landing-halo left-[-140px] top-[-120px] size-[420px] bg-violet-600/25" />
      <div className="landing-halo bottom-[-160px] right-[-120px] size-[460px] bg-blue-600/20" />
      <div className="landing-grid pointer-events-none absolute inset-0" />

      <div className="relative">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <BrandLogo />
          <Link
            href="/dashboard"
            className="text-sm text-[#A1A1AA] transition-colors hover:text-white"
          >
            Retour au dashboard
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-20 pt-8">
          <CreateObjectiveForm />
        </main>
      </div>
    </div>
  );
}