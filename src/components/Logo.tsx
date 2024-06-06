import Link from "next/link";
import { Handshake } from "lucide-react";
import { buttonVariants } from "./ui/button";

function Logo() {
  return (
    <Link
      href={"/dashboard"}
      className={buttonVariants({
        className:
          "hidden md:flex navLink !mb-10 lg:hover:bg-transparent lg:!p-0",
        variant: "ghost",
        size: "lg",
      })}
    >
      <Handshake className="h-6 w-6 shrink-0 lg:hidden" />
      <p
        className={"font-semibold text-xl hidden lg:block"}
      >
        Home
      </p>
    </Link>
  );
}

export default Logo;
