import { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function AppLogo({ className }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src="/logo.svg"
      alt="FoneOwner Logo"
      className={cn("h-14 w-auto", className)}
    />
  );
}
