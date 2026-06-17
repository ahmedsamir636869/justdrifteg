import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Car, MapPin, Trophy, Zap, Shield, QrCode, Play, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = await createClient();
  const { data: latestCars } = await supabase
    .from("cars")
    .select("id, make, model, year, car_images(url, is_primary)")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {/* Minimalist Editorial Hero Section */}
      <section className="w-full min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-end pb-8 sm:pb-12 relative overflow-hidden bg-black">
        
        {/* Massive Background Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 sm:opacity-15 pointer-events-none select-none font-heading font-black tracking-tighter leading-[0.8] text-white z-0 -mt-20 sm:-mt-10">
          <div className="text-[28vw] sm:text-[22vw] whitespace-nowrap">JUST</div>
          <div className="text-[28vw] sm:text-[22vw] whitespace-nowrap">DRIFT</div>
          <div className="text-[28vw] sm:text-[22vw] whitespace-nowrap">CLUB</div>
        </div>

        {/* Hero Subject Image */}
        <div className="absolute bottom-[10vh] sm:bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[100vw] h-[60vh] sm:h-[85vh] flex justify-center items-end pointer-events-none z-10 px-4 sm:px-0">
          <Image 
            src="/hero1.png" 
            alt="Hero Subject" 
            fill
            priority
            className="object-contain object-bottom drop-shadow-2xl mix-blend-lighten scale-100 sm:scale-[1.4] origin-bottom" 
          />
          {/* Smooth bottom fade to match background */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 sm:h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-4xl mt-auto animate-in-delay-1">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6">
            <span>Digital Garage</span>
            <span className="text-zinc-700">+</span>
            <span>Event Check-ins</span>
            <span className="text-zinc-700">+</span>
            <span>Aesthetic Badges</span>
          </div>
          
          <p className="text-base sm:text-lg text-zinc-500 max-w-2xl font-medium leading-relaxed mb-10">
            Helping drivers and enthusiasts build legendary, high-performing automotive profiles designed for total digital dominance.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link href="/signup" className="btn-primary !px-10 !py-4 !text-sm group !bg-white !text-black hover:!bg-zinc-200">
              Start Your Engine <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full max-w-6xl px-6 relative z-10 -mt-10 animate-in-delay-1">
        <div className="glass-heavy rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/5 via-zinc-500/5 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-3xl sm:text-4xl font-heading font-black text-white">4.2k</span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Vehicles</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-3xl sm:text-4xl font-heading font-black text-white">850</span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Meets</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-3xl sm:text-4xl font-heading font-black text-white">12k</span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Check-ins</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-3xl sm:text-4xl font-heading font-black text-white">100%</span>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Enthusiasts</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl px-6 py-24 sm:py-32 flex flex-col items-center relative z-10">
        <div className="text-center mb-16 sm:mb-24 flex flex-col items-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">ENGINEERED FOR <span className="text-gradient">THE STREETS</span></h2>
          <p className="text-zinc-400 text-lg max-w-2xl font-medium">Everything you need to showcase your build and verify your presence at global car meets.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 w-full">
          <div className="card p-8 group">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-100/20">
              <Car className="w-7 h-7 text-zinc-200" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-3">Digital Garage</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Create stunning profiles for your vehicles. Log maintenance, upload high-res photos, and document every modification.
            </p>
          </div>

          <div className="card p-8 group border-zinc-500/20 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <div className="w-14 h-14 rounded-2xl bg-zinc-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-500/20">
              <MapPin className="w-7 h-7 text-zinc-400" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-3">GPS Check-ins</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Organizers generate QR codes for their meets. Attendees scan them, and our system verifies physical GPS proximity to prevent spoofing.
            </p>
          </div>

          <div className="card p-8 group">
            <div className="w-14 h-14 rounded-2xl bg-zinc-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-500/20">
              <Trophy className="w-7 h-7 text-zinc-400" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-3">Event Passport</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Attend meets to unlock exclusive badges and a permanent Event History tab on your car's profile to prove its pedigree.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Cars Showcase */}
      <section className="w-full max-w-7xl px-6 py-10 sm:py-20 flex flex-col items-center relative z-10">
        <div className="w-full flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">Latest Additions</h2>
            <p className="text-zinc-400 font-medium mt-2">Fresh builds straight from the garage.</p>
          </div>
          <Link href="/explore" className="hidden sm:flex text-zinc-200 hover:text-zinc-300 font-bold text-sm tracking-widest uppercase items-center gap-1 group">
            View Grid <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {latestCars?.map(car => {
            const coverImg = car.car_images?.find((img: any) => img.is_primary) || car.car_images?.[0];
            return (
              <Link key={car.id} href={`/cars/${car.id}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/5 shadow-xl block">
                {coverImg ? (
                  <Image src={coverImg.url} alt={`${car.make} ${car.model}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-zinc-800" />
                  </div>
                )}
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              {/* Car Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col">
                <span className="text-zinc-200 font-bold text-xs tracking-widest uppercase mb-1">{car.year}</span>
                <span className="font-heading font-black text-xl text-white uppercase tracking-wide group-hover:text-zinc-200 transition-colors">{car.make} {car.model}</span>
              </div>
            </Link>
          )})}
        </div>
        <Link href="/explore" className="sm:hidden mt-8 btn-secondary !px-8 !py-3 w-full max-w-sm">
          View Full Grid <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-5xl px-6 py-20 mb-20 relative z-10">
        <div className="card !rounded-[2.5rem] p-10 sm:p-16 text-center flex flex-col items-center relative overflow-hidden !border-zinc-100/30">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-zinc-950/40"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <Zap className="w-12 h-12 text-zinc-200 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-bounce" />
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">READY TO JOIN THE GRID?</h2>
            <p className="text-zinc-300 text-lg max-w-xl mb-10 font-medium">
              Create your account in seconds and add your first vehicle to the global registry.
            </p>
            <Link href="/signup" className="btn-primary !px-10 !py-5 !text-lg !rounded-2xl group">
              Create Free Account <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
