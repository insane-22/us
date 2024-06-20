import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <div className="container mx-auto flex w-full h-96 flex-col justify-center space-y-6 sm:w-[400px] border-2 border-indigo-300 rounded-lg">
          <div className="flex flex-col space-y-5 text-center">
            <Logo />
            <h1 className="text-2xl font-semibold tracking-tight">Chat area</h1>
            <p className="text-sm max-w-xs mx-auto">
              By clicking the button, you would be entering into chat area.
              Share you conersations with &quot;Us&quot; Please check our User
              Agreement and Privacy Policy.
            </p>
          </div>
          <Link href={"/chat"}>
            <Button
              // isLoading={isLoading}
              type="button"
              size="sm"
              className="w-full"
              // onClick={loginWithGoogle}
              // disabled={isLoading}
            >
              Proceed to chat area!
            </Button>
          </Link>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Would be great fun!
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
