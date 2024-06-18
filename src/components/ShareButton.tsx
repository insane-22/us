"use client";

import ActionIcon from "@/components/ActionIcon";
import { Link, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function ShareButton({ postId }: { postId: string }) {
  return (
    <ActionIcon
      onClick={() => {
        navigator.clipboard.writeText(
          `${window.location.origin}/dashboard/p/${postId}`
        );
        toast({
          title: "Copied successfully",
          description: "Link copied to clipboard",
          // variant: "destructive",
        });}}
    >
      <Send className={"h-6 w-6"} />
    </ActionIcon>
  );
}

export default ShareButton;
