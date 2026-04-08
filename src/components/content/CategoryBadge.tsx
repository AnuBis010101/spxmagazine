import { cn } from "@/lib/utils/cn";

interface CategoryBadgeProps {
  name: string;
  color?: string;
  className?: string;
}

export default function CategoryBadge({
  name,
  color,
  className,
}: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
        "bg-gold-400 text-mag-black",
        className
      )}
      style={color ? { backgroundColor: color } : undefined}
    >
      {name}
    </span>
  );
}
