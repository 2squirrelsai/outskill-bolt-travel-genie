import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors focus-within:border-sky-400/70 focus-within:bg-sky-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-fade-in-up ${delay} flex items-start gap-3 rounded-3xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">{testimonial.name}</p>
      <p className="text-gray-500 dark:text-gray-400">{testimonial.handle}</p>
      <p className="mt-1 text-gray-700 dark:text-gray-300">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-gray-900 dark:text-white tracking-tighter">Welcome to TravelThread</span>,
  description = "Sign in to plan amazing trips with AI-powered recommendations",
  heroImageSrc = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2160&q=80",
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen flex flex-col md:flex-row w-screen bg-white dark:bg-gray-900">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="TravelThread Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">TravelThread</span>
            </div>
            
            <h1 className="animate-fade-in-up text-4xl md:text-5xl font-semibold leading-tight">{title}</h1>
            <p className="animate-fade-in-up animation-delay-200 text-gray-600 dark:text-gray-300">{description}</p>

            <form className="space-y-5" onSubmit={onSignIn}>
              <div className="animate-fade-in-up animation-delay-300">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Email Address</label>
                <GlassInputWrapper>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-fade-in-up animation-delay-400">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Enter your password" 
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? 
                        <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" /> : 
                        <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
                      }
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-fade-in-up animation-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="rememberMe" 
                    className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                  />
                  <span className="text-gray-700 dark:text-gray-300">Keep me signed in</span>
                </label>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} 
                  className="hover:underline text-sky-500 hover:text-sky-600 transition-colors"
                >
                  Reset password
                </a>
              </div>

              <button 
                type="submit" 
                className="animate-fade-in-up animation-delay-600 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-4 font-medium text-white hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="animate-fade-in-up animation-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
              <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 absolute">Or continue with</span>
            </div>

            <button 
              onClick={onGoogleSignIn} 
              className="animate-fade-in-up animation-delay-800 w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
                <GoogleIcon />
                Continue with Google
            </button>

            <p className="animate-fade-in-up animation-delay-900 text-center text-sm text-gray-600 dark:text-gray-400">
              New to TravelThread? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-sky-500 hover:text-sky-600 hover:underline transition-colors">Create Account</a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      <section className="hidden md:block flex-1 relative p-4">
        <div className="animate-slide-in-right animation-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
        {testimonials.length > 0 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
            <TestimonialCard testimonial={testimonials[0]} delay="animation-delay-1000" />
            {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animation-delay-1200" /></div>}
            {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="animation-delay-1400" /></div>}
          </div>
        )}
      </section>
    </div>
  );
};