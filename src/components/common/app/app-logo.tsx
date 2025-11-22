import { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function AppLogo({ className }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src="/logo.svg"
      alt="FoneOwner Logo"
      className={cn(
        "h-12 w-auto md:h-14", // mobile = 12, desktop = 14
        className
      )}
    />
  );
}
