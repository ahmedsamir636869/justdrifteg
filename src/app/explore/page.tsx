import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Car, Search } from "lucide-react";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("cars")
    .select("*, profiles:owner_id(username), car_images(*)")
    .order("created_at", { ascending: false });

  if (q && q.trim().length > 0) {
    query = query.or(`make.ilike.%${q}%,model.ilike.%${q}%,chassis_code.ilike.%${q}%`);
  }

  const { data: cars } = await query;

  return (
    <div className="w-full max-w-6xl px-4 py-8 sm:py-12 animate-in flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-zinc-800/50">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Explore</h1>
          <p className="text-zinc-500 mt-1 text-sm">Browse every build on the platform.</p>
        </div>
        <span className="text-xs text-zinc-600 mono">{cars?.length || 0} vehicles</span>
      </div>

      {/* Search */}
      <form className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search make, model, or chassis..."
            className="input-field !pl-11 !rounded-xl"
          />
        </div>
      </form>

      {/* Grid */}
      {cars && cars.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => {
            const coverImg = car.car_images?.find((img: any) => img.is_primary) || car.car_images?.[0];
            return (
              <Link href={`/cars/${car.id}`} key={car.id} className="card overflow-hidden group cursor-pointer">
                <div className="w-full h-48 bg-zinc-900 overflow-hidden relative">
                  {coverImg ? (
                    <Image src={coverImg.url} alt={`${car.year} ${car.make} ${car.model}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
                      <Car className="w-14 h-14 text-zinc-800" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-zinc-200 transition-colors">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-4">
                    {car.trim || "Base"} {car.chassis_code && `· ${car.chassis_code}`}
                  </p>
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/50">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-zinc-400">
                        {car.profiles?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-600">{car.profiles?.username}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
            <Car className="w-8 h-8 text-zinc-700" />
          </div>
          <h3 className="text-lg font-bold text-zinc-400">
            {q ? "No results found" : "No cars yet"}
          </h3>
          <p className="text-zinc-600 text-sm">
            {q ? "Try a different search term." : "Be the first to add your build!"}
          </p>
        </div>
      )}
    </div>
  );
}
