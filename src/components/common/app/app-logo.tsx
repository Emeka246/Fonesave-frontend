import { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function AppLogo({ className }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src="/logo.svg"
      alt="FoneOwner Logo"
      className={cn("h-10 w-auto", className)}
    />
  );
}
