import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function LoginPage({
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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to your garage</p>
        </div>
        
        <form className="flex flex-col gap-5">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input className="input-field" name="email" id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input className="input-field" type="password" name="password" id="password" placeholder="••••••••" required />
          </div>
          
          <button formAction={login} className="btn-primary w-full !py-3 !rounded-xl mt-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>

          {message && (
            <div className="p-3 bg-red-500/10 text-red-400 text-center rounded-xl border border-red-500/20 text-sm">
              {message}
            </div>
          )}
        </form>

        <p className="text-zinc-600 text-center text-sm mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-zinc-100 hover:text-zinc-200 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
