import React from "react";
import { cn } from "@/lib/utils/cn";

/* Magic UI's orbiting-circles, adapted for this codebase.

   Two changes from upstream: cn comes from @/lib/utils/cn, and the orbit path
   is drawn in the site's gold rather than a black/white stroke.

   Worth noting why this is cheaper than what it replaces: each icon rides ONE
   CSS keyframe animating transform only, where the previous orbit ran two or
   three JS-driven Framer loops per element. This renders on every route, so
   that difference matters. */

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  iconSize?: number;
  speed?: number;
  /** Opacity of the drawn orbit path. */
  pathOpacity?: number;
}

export function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
  pathOpacity = 0.09,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed;
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="var(--color-gold-400)"
            strokeOpacity={pathOpacity}
            strokeWidth={1}
          />
        </svg>
      )}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / React.Children.count(children)) * index;
        return (
          <div
            style={
              {
                "--duration": calculatedDuration,
                "--radius": radius,
                "--angle": angle,
                "--icon-size": `${iconSize}px`,
              } as React.CSSProperties
            }
            className={cn(
              "animate-orbit absolute flex size-(--icon-size) transform-gpu items-center justify-center rounded-full",
              { "[animation-direction:reverse]": reverse },
              className,
            )}
            {...props}
          >
            {child}
          </div>
        );
      })}
    </>
  );
}
