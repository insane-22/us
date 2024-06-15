import React from 'react'
import Logo from './Logo';
import UserAuthForm from './UserAuthForm';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full h-96 flex-col justify-center space-y-6 sm:w-[400px]  border-2 border-indigo-300 rounded-lg">
      <div className="flex flex-col space-y-2 text-center">
        <Logo />
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up an account with &quot;Us&quot; and
          agree to our User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default SignUp
