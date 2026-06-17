import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Shield, ShieldAlert, CheckCircle2 } from "lucide-react";
import AdminRoleToggle from "@/components/AdminRoleToggle";
import Image from "next/image";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify Admin
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!currentUserProfile?.is_admin) {
    redirect("/dashboard");
  }

  // Fetch all users
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl px-4 py-8 sm:py-12 animate-in items-center mx-auto">
      
      <div className="flex flex-col items-center text-center gap-3 mb-10 w-full border-b border-zinc-800/50 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-zinc-500/10 flex items-center justify-center text-zinc-500 mb-2 border border-zinc-500/20">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">Admin Panel</h1>
        <p className="text-zinc-400 font-medium">
          Manage platform users and organizer permissions.
        </p>
      </div>

      <div className="w-full card overflow-hidden">
        <div className="p-4 sm:p-6 bg-zinc-900/50 border-b border-zinc-800/50 flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-sm text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200">Organizer Permissions:</strong> Organizers have the ability to create events and generate QR codes that allow users to check-in and unlock badges. Grant this role only to trusted community leaders.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-900/80 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Admin Status</th>
                <th className="px-6 py-4">Organizer Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {users?.map((profile) => (
                <tr key={profile.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700">
                      {profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt={profile.username} fill sizes="32px" className="object-cover" />
                      ) : (
                        <span className="text-xs">{profile.username?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    {profile.username}
                  </td>
                  <td className="px-6 py-4">
                    {profile.is_admin ? (
                      <span className="inline-flex items-center gap-1.5 text-zinc-500 bg-zinc-500/10 border border-zinc-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-xs font-medium">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {profile.is_admin ? (
                      <span className="inline-flex items-center gap-1 text-zinc-500 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Implicit Access
                      </span>
                    ) : (
                      <AdminRoleToggle userId={profile.id} isOrganizer={profile.is_organizer} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
