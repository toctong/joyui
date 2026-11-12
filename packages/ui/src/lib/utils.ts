import { clsx, type ClassValue } from "clsx";
import { cx as mergeCx } from "../utils/cx";

/** Merge Tailwind classes the JoyUI way (clsx + typography-aware tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return mergeCx(clsx(inputs));
}

/** Alias used in agent rules / JoyUI docs. */
export const cx = cn;
