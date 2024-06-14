import React from 'react'
import Logo from './Logo';
import Link from 'next/link';
import UserAuthForm from './UserAuthForm';

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full h-96 flex-col justify-center space-y-6 sm:w-[400px] border-2 border-indigo-300 rounded-lg">
      <div className="flex flex-col space-y-5 text-center">
        <Logo />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are setting up an account with &quot;Us&quot; and
          agree to our User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default SignIn
