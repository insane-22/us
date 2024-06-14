import Link from "next/link";
import { Handshake } from "lucide-react";
import { buttonVariants } from "./ui/button";

function Logo() {
  return (
    <Link
      href={"/dashboard"}
      className={buttonVariants({
        className:
          "hidden md:flex navLink lg:hover:bg-transparent",
        variant: "ghost",
        size: "lg",
      })}
    >
      <Handshake className="h-6 w-6 shrink-0" />
      <p
        className={"font-semibold text-xl hidden lg:block"}
      >
        Us
      </p>
    </Link>
  );
}

export default Logo;
