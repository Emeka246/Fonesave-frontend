import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))

}
export function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>){
    if (event.key === "Enter") {
      const nextInput = event.currentTarget.nextElementSibling as HTMLInputElement
      if (nextInput) {
        nextInput.focus()
      } else {
        event.currentTarget.form?.dispatchEvent(new Event("submit", { cancelable: true }))
      }
    }
}

export function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: "$",       // US Dollar
    NGN: "₦",       // Nigerian Naira
  };

  return symbols[code.toUpperCase()] || code; // fallback to code itself
}

export function dateFormat(date: string): string {
  return moment(date).format('DD/MM/YYYY')
}

export function numberFormat(number: number): string {
  return number.toLocaleString()
}