import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateEventForm from "@/components/CreateEventForm";
import { CalendarPlus, ShieldAlert } from "lucide-react";

export default async function CreateEventPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from('profiles').select('is_organizer').eq('id', user.id).single();
  if (!profile?.is_organizer) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-2xl px-4 py-8 sm:py-12 animate-in items-center mx-auto">
      
      <div className="flex flex-col items-center text-center gap-3 mb-10 w-full border-b border-zinc-800/50 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100/10 flex items-center justify-center text-zinc-100 mb-2 border border-zinc-100/20">
          <CalendarPlus className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">Host a Meet</h1>
        <p className="text-zinc-400 font-medium max-w-md">
          Create an event to generate an Organizer QR Code. Attendees must scan this code while physically at your event's GPS location.
        </p>
      </div>

      <div className="w-full card p-6 sm:p-8 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-100/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex gap-4 items-start mb-8 relative z-10">
          <div className="mt-0.5 text-zinc-500 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200">Anti-Spoofing:</strong> When users scan your QR code, their phone's hardware GPS is checked against your event's coordinates. They cannot check-in from home.
          </p>
        </div>

        <div className="relative z-10">
          <CreateEventForm />
        </div>
      </div>
    </div>
  );
}
