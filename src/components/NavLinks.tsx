"use client";

import {
  Compass,
  Heart,
  MessageCircle,
  PlusSquare,
  Search,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  {
    name: "Search",
    href: "/dashboard/search",
    icon: Search,
    hideOnMobile: true,
  },
  { name: "Explore", href: "/dashboard/explore", icon: Compass },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageCircle,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Heart,
    hideOnMobile: true,
  },
  {
    name: "Create",
    href: "/dashboard/createPost",
    icon: PlusSquare,
  },
];

function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn("navLink", { "hidden md:flex": link.hideOnMobile }),
              size: "lg",
            })}
          >
            <LinkIcon className="w-6" />
            <p
              className={`${cn("hidden lg:block", {
                "font-extrabold": isActive,
              })}`}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}

export default NavLinks;
