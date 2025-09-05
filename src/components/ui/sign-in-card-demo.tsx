import * as React from "react";
import { SignInCard } from "./sign-in-card-2";

const SignInCardDemo = () => {
  const handleSignIn = async (email: string, password: string) => {
    console.log('Sign in:', { email, password });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSignUp = () => {
    console.log('Navigate to sign up');
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  return (
    <div className="w-full h-screen">
      <SignInCard
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onForgotPassword={handleForgotPassword}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
};

export { SignInCardDemo as DemoOne };
export default SignInCardDemo;