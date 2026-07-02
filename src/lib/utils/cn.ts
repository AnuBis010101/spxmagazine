import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register the custom display type scale (globals.css @theme) as font-size
// utilities so tailwind-merge doesn't mistake e.g. `text-display-sm` for a
// text-color and drop it when it sits next to `text-white`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display-xl",
        "text-display-lg",
        "text-display-md",
        "text-display-sm",
        "text-display-xs",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
