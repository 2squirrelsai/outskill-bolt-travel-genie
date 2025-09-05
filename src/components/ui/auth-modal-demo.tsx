import React from 'react';
import { cn } from '@/lib/utils';
import { AuthModal } from "@/components/ui/auth-modal";
import { Button } from '@/components/ui/button';

export default function AuthModalDemo() {
	const [open, setAuthOpen] = React.useState(false);

	const handleGoogleSignIn = () => {
		console.log('Google sign in clicked');
		// Integrate with your Google OAuth flow
	};

	const handleEmailContinue = (email: string) => {
		console.log('Email continue clicked with:', email);
		// Integrate with your email authentication flow
		setAuthOpen(false);
	};

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center">
			<div
				aria-hidden="true"
				className={cn(
					'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
					'bg-[radial-gradient(ellipse_at_center,hsl(var(--foreground)/.1),transparent_50%)]',
					'blur-[30px]',
				)}
			/>

			<Button onClick={() => setAuthOpen(true)}>Open Auth Modal</Button>

			<AuthModal 
				open={open} 
				onOpenChange={setAuthOpen}
				onGoogleSignIn={handleGoogleSignIn}
				onEmailContinue={handleEmailContinue}
			/>
		</div>
	);
}

export { AuthModalDemo as DemoOne };