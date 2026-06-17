import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import AddCarForm from "@/components/AddCarForm";
import Link from "next/link";
import { Car, Wrench, Plus, QrCode, Settings, Image as ImageIcon } from "lucide-react";
import AchievementsBoard, { UserStats } from "@/components/AchievementsBoard";
import AvatarUpload from "@/components/AvatarUpload";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: cars },
    { count: checkinCount },
    { count: hostedCount }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("cars").select("*, car_images(*)").eq("owner_id", user.id).order("created_at", { ascending: false }),
    supabase.from('event_attendees').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('organizer_id', user.id)
  ]);
  
  // Get all car IDs to count maintenance logs
  const carIds = cars?.map(c => c.id) || [];
  let maintenanceCount = 0;
  if (carIds.length > 0) {
    const { count } = await supabase.from('maintenance_logs').select('*', { count: 'exact', head: true }).in('car_id', carIds);
    maintenanceCount = count || 0;
  }

  const stats: UserStats = {
    eventCheckins: checkinCount || 0,
    hostedMeets: hostedCount || 0,
    maintenanceLogs: maintenanceCount,
    carsOwned: cars?.length || 0
  };

  return (
    <div className="w-full max-w-6xl px-4 py-8 sm:py-12 animate-in flex flex-col gap-8">
      {/* Achievements Section */}
      <AchievementsBoard stats={stats} />

      {/* Header with Avatar Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-white/5">
        <div className="flex items-center gap-5">
          <div className="shrink-0">
            <AvatarUpload currentUrl={profile?.avatar_url} username={profile?.username || 'User'} hideText={true} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">{profile?.username}'s Garage</h1>
            <p className="text-zinc-200 mt-1 text-xs font-bold tracking-widest uppercase">Registered Driver</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/settings" className="btn-secondary !py-2.5 !px-4 hover:border-zinc-100/50 group" title="Profile Settings">
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" /> <span className="hidden sm:inline">Settings</span>
          </Link>
          <Link href="/scan" className="btn-primary !py-2.5">
            <QrCode className="w-4 h-4" /> Scan Event
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Cars Grid */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Vehicles <span className="text-zinc-600 font-normal">({cars?.length || 0})</span></h2>
          </div>

          {cars && cars.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {cars.map((car) => {
                const coverImg = car.car_images?.find((img: any) => img.is_primary) || car.car_images?.[0];
                return (
                  <Link href={`/cars/${car.id}`} key={car.id} className="card group hover:scale-[1.02] cursor-pointer p-0 overflow-hidden flex flex-col">
                    <div className="aspect-[16/9] w-full bg-zinc-900 border-b border-white/5 flex items-center justify-center overflow-hidden relative">
                      {coverImg ? (
                        <Image src={coverImg.url} alt="Car" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-zinc-800" />
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <h3 className="font-bold text-white leading-tight">{car.year} {car.make} {car.model}</h3>
                      <p className="text-zinc-500 text-sm mt-0.5">{car.trim || 'Base'} {car.chassis_code && `· ${car.chassis_code}`}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="card p-12 flex flex-col items-center justify-center text-center border-dashed !border-zinc-800">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-5">
                <Wrench className="w-8 h-8 text-zinc-700" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No vehicles yet</h3>
              <p className="text-zinc-500 max-w-xs text-sm">Add your first car using the form to start building your digital garage.</p>
            </div>
          )}
        </div>

        {/* Add Car Form Sidebar */}
        <div className="card p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-zinc-100" />
            <h2 className="text-lg font-semibold text-white">Add Vehicle</h2>
          </div>
          <AddCarForm />
        </div>
      </div>
    </div>
  );
}
