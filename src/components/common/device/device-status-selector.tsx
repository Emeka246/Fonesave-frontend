import { forwardRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { deviceStatuses } from '@/pages/app/devices/_lib';
import { cn } from '@/lib/utils';

interface DeviceStatusSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
  allowAllStatuses?: boolean; // If true, shows all statuses; if false, only shows STOLEN and LOST
}

const DeviceStatusSelector = forwardRef<HTMLButtonElement, DeviceStatusSelectorProps>(
  ({ 
    value, 
    onValueChange, 
    placeholder = "Select status", 
    className,
    error,
    label = "Device Status",
    showLabel = true,
    disabled = false,
    allowAllStatuses = true
  }, ref) => {
    // Filter statuses based on allowAllStatuses prop
    const availableStatuses = allowAllStatuses 
      ? deviceStatuses 
      : deviceStatuses.filter(status => ['STOLEN', 'LOST'].includes(status.value));

    return (
      <div className="space-y-2">
        {showLabel && (
          <Label htmlFor="deviceStatus">{label}</Label>
        )}
        <Select 
          value={value} 
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectTrigger 
            ref={ref}
            className={cn(
              "w-full",
              error && "border-red-500",
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`bg-${status.color}-50 text-${status.color}-700 border-${status.color}-200`}
                    >
                      {status.label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground block md:inline max-w-[15ch] truncate md:max-w-none">
                    {status.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

DeviceStatusSelector.displayName = "DeviceStatusSelector";

export default DeviceStatusSelector;
