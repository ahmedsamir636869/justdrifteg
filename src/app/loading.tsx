import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] w-full animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-zinc-500/20 rounded-full animate-pulse"></div>
        <Loader2 className="w-10 h-10 text-zinc-400 animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 animate-pulse">Loading</p>
    </div>
  );
}
