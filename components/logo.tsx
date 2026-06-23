import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 font-black tracking-tight">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-brand-500 text-lg text-white shadow-[0_0_24px_rgba(25,118,210,.24)] after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/20 after:to-transparent">B</span>
      <span className="text-lg">BucketMate</span>
    </Link>
  );
}
