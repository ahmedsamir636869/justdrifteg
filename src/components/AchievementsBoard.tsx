import { Trophy, Wrench, Calendar, MapPin, Zap, Star } from "lucide-react";

export interface UserStats {
  eventCheckins: number;
  maintenanceLogs: number;
  carsOwned: number;
  hostedMeets: number;
}

export default function AchievementsBoard({ stats }: { stats: UserStats }) {
  const badges = [
    {
      id: 'early_adopter',
      title: 'Early Adopter',
      description: 'Joined during the first season of JUST DRIFT.',
      icon: <Star className="w-6 h-6" />,
      color: 'from-zinc-300 to-zinc-600',
      textColor: 'text-zinc-500',
      unlocked: true, // Always true for now
    },
    {
      id: 'first_meet',
      title: 'Grid Initiate',
      description: 'Checked into your very first car meet.',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-white to-zinc-500',
      textColor: 'text-zinc-200',
      unlocked: stats.eventCheckins > 0,
    },
    {
      id: 'gearhead',
      title: 'Grease Monkey',
      description: 'Added your first maintenance log to a build.',
      icon: <Wrench className="w-6 h-6" />,
      color: 'from-zinc-400 to-zinc-600',
      textColor: 'text-zinc-300',
      unlocked: stats.maintenanceLogs > 0,
    },
    {
      id: 'collector',
      title: 'Fleet Commander',
      description: 'Registered 3 or more vehicles to your garage.',
      icon: <Car className="w-6 h-6" />,
      color: 'from-zinc-200 to-zinc-700',
      textColor: 'text-zinc-400',
      unlocked: stats.carsOwned >= 3,
    },
    {
      id: 'veteran',
      title: 'Street Veteran',
      description: 'Checked into 5 or more official meets.',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-zinc-100 to-zinc-500',
      textColor: 'text-zinc-300',
      unlocked: stats.eventCheckins >= 5,
    },
    {
      id: 'organizer',
      title: 'Host / Organizer',
      description: 'Created and hosted a live car meet.',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-zinc-400 to-zinc-800',
      textColor: 'text-zinc-400',
      unlocked: stats.hostedMeets > 0,
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="card p-6 sm:p-8 w-full border-zinc-100/20 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100/10 flex items-center justify-center border border-zinc-100/20">
            <Zap className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-wider">Driver Achievements</h2>
            <p className="text-xs text-zinc-400 font-medium">Unlock badges by participating in the community.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{unlockedCount}</span>
          <span className="text-zinc-500 font-medium text-sm"> / {badges.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              badge.unlocked 
                ? 'bg-zinc-900/80 border-white/10 hover:border-white/20' 
                : 'bg-zinc-900/30 border-transparent opacity-50 grayscale'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
              badge.unlocked ? `bg-gradient-to-br ${badge.color} text-white` : 'bg-zinc-800 text-zinc-600'
            }`}>
              {badge.icon}
            </div>
            <div>
              <h4 className={`font-bold text-sm ${badge.unlocked ? badge.textColor : 'text-zinc-500'}`}>
                {badge.title}
              </h4>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Car(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
