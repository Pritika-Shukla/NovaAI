import { login } from '@/app/login/actions'
import Link from 'next/link'
import OneTapComponent from '@/app/components/OneTapComponent'
import GoogleLoginButton from '@/app/components/GoogleLoginButton'
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-black border border-black dark:border-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-black dark:text-white opacity-70">
              Sign in to your account to continue
            </p>
          </div>
          
          <GoogleLoginButton />
          <OneTapComponent />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black dark:border-white opacity-20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-black text-black dark:text-white opacity-70">
                Or continue with email
              </span>
            </div>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-black dark:text-white"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 border border-black dark:border-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white placeholder-black dark:placeholder-white placeholder-opacity-50"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-black dark:text-white"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 border border-black dark:border-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white placeholder-black dark:placeholder-white placeholder-opacity-50"
                placeholder="Enter your password"
              />
            </div>

            <div className="space-y-3 pt-2">
              <button
                formAction={login}
                className="w-full bg-black dark:bg-white hover:opacity-80 text-white dark:text-black font-medium py-2.5 px-4 rounded-lg transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2"
              >
                Log in
              </button>
              <div className="text-center text-sm">
                <span className="text-black dark:text-white opacity-70">
                  Don&apos;t have an account?{' '}
                </span>
                <Link
                  href="/signup"
                  className="font-medium text-black dark:text-white hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}