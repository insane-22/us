import { auth } from "@/auth";
import GeneralFeed from "@/components/Home/GeneralFeed";
import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await auth();
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      <GeneralFeed/>
    </>
  );
};

export default page;
