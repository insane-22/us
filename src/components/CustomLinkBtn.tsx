import React from "react";
import { useRouter } from "next/router";
import { buttonVariants } from "./ui/button";

interface CustomLinkButtonProps {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const CustomLinkButton = React.forwardRef<
  HTMLButtonElement,
  CustomLinkButtonProps
>(({ href, onClick, children }, ref) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    router.push(href);
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={buttonVariants({ variant: "outline" })}
    >
      {children}
    </button>
  );
});

CustomLinkButton.displayName = "CustomLinkButton";

export default CustomLinkButton;