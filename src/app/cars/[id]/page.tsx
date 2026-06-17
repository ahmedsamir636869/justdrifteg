import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, Car, Wrench, Trophy, Navigation, Camera } from "lucide-react";
import Link from "next/link";
import CarImageUpload from "@/components/CarImageUpload";
import AddMaintenanceForm from "@/components/AddMaintenanceForm";
import DeleteMaintenanceButton from "@/components/DeleteMaintenanceButton";
import CarSettingsModal from "@/components/CarSettingsModal";

export default async function CarProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch car details with owner profile
  const { data: car, error } = await supabase
    .from("cars")
    .select(`
      *,
      profiles:owner_id (username, avatar_url)
    `)
    .eq("id", id)
    .single();

  if (error || !car) {
    notFound();
  }

  const isOwner = user?.id === car.owner_id;

  // Fetch car images
  const { data: carImages } = await supabase
    .from("car_images")
    .select("*")
    .eq("car_id", id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  // Fetch unlocked pages for this car
  const { data: unlockedPages } = await supabase
    .from("unlocked_pages")
    .select("page_type")
    .eq("car_id", id);

  const hasEventHistory = unlockedPages?.some(p => p.page_type === 'Event History');

  // Fetch basic maintenance logs (limit to 5)
  const { data: maintenance } = await supabase
    .from("maintenance_logs")
    .select("*")
    .eq("car_id", id)
    .order("date", { ascending: false })
    .limit(5);

  // Fetch event history if unlocked
  let eventHistory = null;
  if (hasEventHistory) {
    const { data } = await supabase
      .from("event_attendance")
      .select(`
        check_in_time,
        events (name, location_name)
      `)
      .eq("car_id", id)
      .order("check_in_time", { ascending: false });
    eventHistory = data;
  }

  // Get primary image for hero
  const primaryImage = carImages?.find(img => img.is_primary) || carImages?.[0];

  return (
    <div className="w-full max-w-6xl px-4 py-8 sm:py-12 animate-in flex flex-col gap-8">
      
      {/* Breadcrumb / Back Navigation */}
      {isOwner && (
        <div className="flex items-center gap-2 mb-[-1rem]">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Garage
          </Link>
        </div>
      )}

      {/* Profile Header */}
      <div className="card relative overflow-hidden">
        {primaryImage && (
          <div className="w-full h-64 md:h-96 relative">
            <img src={primaryImage.url} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent"></div>
          </div>
        )}
        <div className={`p-6 sm:p-10 ${primaryImage ? '-mt-24 relative z-10' : ''}`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-100/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end relative z-10 gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 text-zinc-100 font-bold tracking-widest text-[10px] sm:text-xs uppercase bg-zinc-100/10 px-3 py-1 rounded-full w-fit border border-zinc-100/20">
                  <Car className="w-3 h-3" /> Garage Profile
                </div>
                {isOwner && <CarSettingsModal car={car} />}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mt-2 leading-[0.9]">{car.year} {car.make} <br className="hidden sm:block" />{car.model}</h1>
              <p className="text-lg sm:text-xl text-zinc-400 font-medium mt-2">{car.trim || 'Base'} {car.chassis_code && <span className="mono text-zinc-500 text-sm ml-2">[{car.chassis_code}]</span>}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md p-3 pr-6 rounded-full border border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                {car.profiles?.avatar_url ? (
                  <img src={car.profiles.avatar_url} alt={car.profiles.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-zinc-400">{car.profiles?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Owner</span>
                <span className="text-sm font-bold text-white">{car.profiles?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Photo Gallery */}
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-100/10 flex items-center justify-center">
                <Camera className="w-5 h-5 text-zinc-100" />
              </div>
              <h2 className="text-xl font-bold text-white">Photos</h2>
              {carImages && <span className="text-xs font-bold text-zinc-500 ml-auto bg-zinc-800/50 px-2.5 py-1 rounded-md">{carImages.length}</span>}
            </div>
            <CarImageUpload carId={id} existingImages={carImages || []} isOwner={isOwner} />
          </div>

          {/* Maintenance Section */}
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50">
              <div className="w-10 h-10 rounded-xl bg-zinc-100/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-zinc-100" />
              </div>
              <h2 className="text-xl font-bold text-white">Maintenance Log</h2>
            </div>
            
            {maintenance && maintenance.length > 0 ? (
              <div className="flex flex-col gap-3">
                {maintenance.map(log => (
                  <div key={log.id} className="flex flex-col gap-2 bg-zinc-900/50 p-5 rounded-xl border border-zinc-800/50">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <h4 className="font-bold text-white text-lg">{log.service_type}</h4>
                        <span className="text-xs font-mono text-zinc-500 mt-1">{new Date(log.date).toLocaleDateString()}</span>
                      </div>
                      {isOwner && <DeleteMaintenanceButton logId={log.id} carId={id} />}
                    </div>
                    <div className="inline-flex items-center text-xs font-medium text-zinc-100/80 bg-zinc-100/10 w-fit px-2 py-0.5 rounded uppercase tracking-wider">{log.mileage.toLocaleString()} miles</div>
                    {log.notes && <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{log.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 text-sm">No maintenance records logged yet.</p>
              </div>
            )}

            {isOwner && <AddMaintenanceForm carId={id} />}
          </div>

          {/* Gamification / Event History Tab */}
          {hasEventHistory ? (
            <div className="card p-6 sm:p-8 bg-gradient-to-b from-[#111113] to-[#09090b] border-green-900/30 glow-cyan-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Trophy className="w-40 h-40" />
              </div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-zinc-100/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <Navigation className="w-5 h-5 text-zinc-200" />
                </div>
                <h2 className="text-xl font-bold text-white">Event Passport</h2>
                <span className="bg-zinc-100/20 text-zinc-200 text-[10px] font-bold px-2 py-1 rounded border border-zinc-100/30 ml-auto uppercase tracking-wider">Unlocked</span>
              </div>

              {eventHistory && eventHistory.length > 0 ? (
                <div className="flex flex-col gap-3 relative z-10">
                  {eventHistory.map((entry: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-100 shrink-0">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white leading-tight">{entry.events.name}</div>
                          <div className="text-xs text-zinc-500 mt-1">{entry.events.location_name}</div>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-zinc-400 sm:text-right bg-zinc-900 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-md w-fit">
                        {new Date(entry.check_in_time).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm relative z-10">Passport unlocked, but no history found.</p>
              )}
            </div>
          ) : (
            <div className="card p-10 flex flex-col items-center justify-center text-center opacity-70 relative overflow-hidden border-dashed">
              <Trophy className="w-12 h-12 text-zinc-700 mb-4 relative z-10" />
              <h3 className="text-lg font-bold text-zinc-400 relative z-10">Event Passport Locked</h3>
              <p className="text-zinc-600 text-sm max-w-sm mt-2 relative z-10 leading-relaxed">This vehicle needs to scan into 3 physical meets to permanently unlock its Event History tab.</p>
            </div>
          )}

        </div>

        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-6">
          <div className="card p-6 sticky top-24">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Specs & Info</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-end border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-500">Make</span>
                <span className="text-white font-bold">{car.make}</span>
              </div>
              <div className="flex justify-between items-end border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-500">Model</span>
                <span className="text-white font-bold">{car.model}</span>
              </div>
              <div className="flex justify-between items-end border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-500">Year</span>
                <span className="text-white font-bold">{car.year}</span>
              </div>
              <div className="flex justify-between items-end border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-500">Trim</span>
                <span className="text-white font-bold text-right max-w-[150px] truncate" title={car.trim}>{car.trim || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-end pb-1">
                <span className="text-zinc-500">Chassis</span>
                <span className="text-zinc-300 font-mono text-xs">{car.chassis_code || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
