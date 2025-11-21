import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="FoneOwner Logo"
      className={cn("w-auto h-10", className)}
    />
  );
}
