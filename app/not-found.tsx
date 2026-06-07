import Link from "next/link";
import { Aurora } from "@/components/aurora";
import { MagneticButton } from "@/components/magnetic-button";
import { SectionShell } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden py-32">
      <Aurora />
      <SectionShell className="text-center">
        <p className="font-display text-[7rem] font-extrabold leading-none text-gradient sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          This page took an unmeasured detour.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you
          back to measurable value.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <MagneticButton href="/">Back to home</MagneticButton>
          <Link
            href="/contact-us"
            className="inline-flex items-center rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-blue/50 hover:text-blue"
          >
            Contact us
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
