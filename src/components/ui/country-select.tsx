import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { countries, Country } from "@/lib/countries";

interface CountrySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const CountrySelect = forwardRef<HTMLButtonElement, CountrySelectProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Select country",
      className,
      error,
      label = "Country",
      showLabel = true,
      disabled = false,
      required = false,
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {showLabel && (
          <Label htmlFor="country">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            className={cn("w-full", error && "border-red-500", className)}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className="max-h-[300px]"
            onCloseAutoFocus={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {countries.map((country: Country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

CountrySelect.displayName = "CountrySelect";

export default CountrySelect;
