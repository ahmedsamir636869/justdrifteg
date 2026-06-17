import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AvatarUpload from "@/components/AvatarUpload";
import { UserCog } from "lucide-react";
import UpdateUsernameForm from "@/components/UpdateUsernameForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return <div>Error loading profile.</div>;
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-xl px-4 py-8 sm:py-12 animate-in items-center mx-auto">
      
      <div className="flex flex-col items-center text-center gap-3 mb-10 w-full border-b border-zinc-800/50 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100/10 flex items-center justify-center text-zinc-100 mb-2 border border-zinc-100/20">
          <UserCog className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">Profile Settings</h1>
        <p className="text-zinc-400 font-medium">
          Manage your public identity and avatar.
        </p>
      </div>

      <div className="w-full card p-6 sm:p-8 relative overflow-hidden flex flex-col gap-8">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-100/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center pb-8 border-b border-zinc-800/50">
          <AvatarUpload currentUrl={profile.avatar_url} username={profile.username} />
        </div>

        <div className="relative z-10">
          <UpdateUsernameForm initialUsername={profile.username} />
        </div>
      </div>
    </div>
  );
}
