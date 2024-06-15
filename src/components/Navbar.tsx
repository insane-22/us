import Link from "next/link";
import { Handshake } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { auth } from "@/auth";
import { UserAccountNav } from "./UserAccountNav";

async function Navbar() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 inset-x-5 hidden md:block">
      <div className="flex items-center h-14 flex-row justify-between gap-2 mx-5 text-2xl max-w-screen-3xl">
        <Link href="/" className="flex flex-row gap-2 mx-5">
          <Handshake className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-black dark:text-slate-50 font-medium md:block">
            Us
          </p>
        </Link>

        {user ? (
          <UserAccountNav user={user} />
        ) : (
          <Link href="/login" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
