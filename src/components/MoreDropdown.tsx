"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Activity, Bookmark, LogOut, Menu, Moon, Settings, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

function MoreDropdown() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!event.target) return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, setOpen]);

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={() => setOpen(!open)}
          variant={"ghost"}
          size={"lg"}
          className="md:w-full !justify-start space-x-2 !px-3"
        >
          <Menu />
          <div className="hidden lg:block">More</div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={ref}
        className={cn(
          "dark:bg-neutral-800 w-52 !rounded-xl !p-0 transition-opacity"
          // !open && "opacity-0"
        )}
        align="end"
        alignOffset={-40}
      >
        <DropdownMenuItem className="menuItem">
          <Settings size={20} />
          <p>Settings</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="menuItem">
          <Activity size={20} />
          <p>Your activity</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="menuItem">
          <Bookmark size={20} />
          <p>Saved</p>
        </DropdownMenuItem>

        <DropdownMenuItem className="menuItem" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <p>{theme==="dark" ? "Light" : "Dark"} Mode</p>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="menuItem"
          // onClick={() => signOut()}
        >
          <LogOut size={20} />
          <p>Log out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MoreDropdown;
