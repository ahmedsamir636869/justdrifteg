import { signup } from '@/app/auth/actions'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex-1 flex w-full justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm animate-in">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100/10 flex items-center justify-center mx-auto mb-6 text-zinc-100 border border-zinc-100/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create account</h1>
          <p className="text-zinc-500 text-sm mt-2">Join the JUST DRIFT community</p>
        </div>

        <form className="flex flex-col gap-5">
          <div>
            <label className="label" htmlFor="username">Username</label>
            <input className="input-field" name="username" id="username" placeholder="driftking99" required />
          </div>

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input className="input-field" name="email" id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input className="input-field" type="password" name="password" id="password" placeholder="••••••••" minLength={6} required />
          </div>
          
          <button formAction={signup} className="btn-primary w-full !py-3 !rounded-xl mt-2">
            Create Account <ArrowRight className="w-4 h-4" />
          </button>

          {message && (
            <div className="p-3 bg-red-500/10 text-red-400 text-center rounded-xl border border-red-500/20 text-sm">
              {message}
            </div>
          )}
        </form>

        <p className="text-zinc-600 text-center text-sm mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-100 hover:text-zinc-200 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
