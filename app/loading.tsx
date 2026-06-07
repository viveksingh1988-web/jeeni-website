export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-slate-200 border-t-teal" />
          <div className="absolute inset-2 animate-pulse-soft rounded-full bg-gradient-to-br from-blue to-navy opacity-40 blur-sm" />
        </div>
        <p className="text-sm font-medium tracking-widest text-muted uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
