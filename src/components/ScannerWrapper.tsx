'use client'

import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("@/components/Scanner"), { 
  ssr: false,
  loading: () => (
    <div className="card p-12 text-center flex flex-col items-center gap-4 border-dashed">
      <div className="w-12 h-12 rounded-full border-2 border-zinc-100 border-t-transparent animate-spin"></div>
      <p className="text-zinc-500 text-sm">Initializing camera module...</p>
    </div>
  )
});

export default function ScannerWrapper({ cars }: { cars: any[] }) {
  return <Scanner cars={cars} />;
}
