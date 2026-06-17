import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, ScanLine } from "lucide-react";

export default async function EventOrganizerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !event) {
    return <div className="text-center p-12 text-red-400">Event not found.</div>;
  }

  // Payload is simply the event ID. Attendees use the in-app scanner to scan this.
  const payload = JSON.stringify({ event_id: event.id });

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl px-4 py-8 sm:py-12 animate-in items-center">
      
      <div className="flex flex-col items-center text-center gap-2 mb-10 w-full">
        <div className="inline-flex items-center gap-1.5 text-zinc-100 font-bold tracking-widest text-[10px] sm:text-xs uppercase bg-zinc-100/10 px-3 py-1 rounded-full border border-zinc-100/20 mb-2">
          <ScanLine className="w-3.5 h-3.5" /> Organizer Dashboard
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.9]">{event.name}</h1>
        <p className="text-zinc-400 font-medium flex items-center gap-1 mt-2">
          <MapPin className="w-4 h-4" /> {event.location_name}
        </p>
      </div>

      <div className="relative group w-full max-w-[400px] mb-10">
        <div className="absolute inset-0 bg-zinc-100/20 rounded-[2.5rem] blur-2xl group-hover:bg-zinc-100/30 transition-colors duration-500"></div>
        <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl relative flex justify-center items-center ring-8 ring-zinc-100/10 border border-zinc-100/20">
          <QRCodeSVG value={payload} size={100} style={{ width: "100%", height: "100%" }} level="H" includeMargin={false} />
          
          <div className="absolute inset-0 border-2 border-zinc-100 rounded-[2rem] pointer-events-none"></div>
          {/* Scan corner accents */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-zinc-100 rounded-tl-xl pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-zinc-100 rounded-tr-xl pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-zinc-100 rounded-bl-xl pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-zinc-100 rounded-br-xl pointer-events-none"></div>
        </div>
      </div>

      <p className="text-zinc-400 text-sm max-w-md text-center mb-8 leading-relaxed">
        Attendees must open the <strong className="text-white font-semibold">JUST DRIFT Scanner</strong> on their mobile device and point their camera at this QR code.
      </p>

      <div className="card p-6 w-full relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-zinc-100/10 transition-colors"></div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 relative z-10">Location Parameters</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 font-medium">Latitude</span>
            <span className="text-white font-mono bg-zinc-900 px-2 py-1 rounded w-fit">{event.latitude}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 font-medium">Longitude</span>
            <span className="text-white font-mono bg-zinc-900 px-2 py-1 rounded w-fit">{event.longitude}</span>
          </div>
          <div className="col-span-2 pt-2 mt-2 border-t border-zinc-800/50 flex flex-col gap-1">
            <span className="text-zinc-500 font-medium">Verification Radius</span>
            <span className="text-zinc-200 font-mono font-bold bg-zinc-100/10 px-3 py-1.5 rounded-lg w-fit border border-zinc-100/20">{event.radius_meters} meters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
