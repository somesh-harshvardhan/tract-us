import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function extractNameFromEmail(email: string) {
  const parts = email.split("@");
  if (parts.length === 2) {
    const p = parts[0].split(".");
    return (p[0].charAt(0) + p?.[1].charAt(0)).toUpperCase();
  }
}
