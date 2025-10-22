import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showText?: boolean;
  text?: string;
}

export function ProgressBar({ 
  current, 
  total, 
  className, 
  showText = true,
  text 
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const isComplete = current >= total;

  return (
    <div className={cn("w-full", className)}>
      {showText && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {text || `${current} / ${total}`}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-in-out",
            isComplete 
              ? "bg-green-500" 
              : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
