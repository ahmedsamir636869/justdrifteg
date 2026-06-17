import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ScannerWrapper from "@/components/ScannerWrapper";
import { QrCode } from "lucide-react";

export default async function ScanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .eq("owner_id", user.id);

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl px-4 py-8 sm:py-12 animate-in items-center">
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100/10 flex items-center justify-center text-zinc-100 mb-2">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Scanner</h1>
        <p className="text-zinc-400 max-w-sm">Scan the organizer's event QR code to securely check in and verify your location.</p>
      </div>

      <div className="w-full">
        <ScannerWrapper cars={cars || []} />
      </div>
    </div>
  );
}
