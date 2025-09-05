"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ThemeSwitch = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setChecked(theme === "dark"), [theme]);

  const handleCheckedChange = useCallback(
    (isChecked: boolean) => {
      setChecked(isChecked);
      setTheme(isChecked ? "dark" : "light");
    },
    [setTheme],
  );

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center", // center the whole control
        "h-9 w-20", // track sized to hug the icons
        className
      )}
      {...props}
    >
      {/* The real shadcn Switch (full-size, same structure) */}
      <Switch
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          // root (track)
          "peer absolute inset-0 h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
          // tune the default thumb size & z-index so it slides over icons
          "[&>span]:h-7 [&>span]:w-7 [&>span]:rounded-full [&>span]:bg-white [&>span]:shadow [&>span]:z-10",
          // override default translate distances so the thumb moves across 20px track padding + icon spacing
          "data-[state=unchecked]:[&>span]:translate-x-1",
          "data-[state=checked]:[&>span]:translate-x-[44px]" // 44 ≈ w-20(80) - padding - thumb(28)
        )}
      />

      {/* Icons overlaid inside the track, perfectly centered left/right */}
      <span
        className={cn(
          "pointer-events-none absolute left-2 inset-y-0 z-0",
          "flex items-center justify-center"
        )}
      >
        <SunIcon
          size={16}
          className={cn(
            "transition-all duration-200 ease-out",
            checked ? "text-gray-400" : "text-orange-500 scale-110"
          )}
        />
      </span>

      <span
        className={cn(
          "pointer-events-none absolute right-2 inset-y-0 z-0",
          "flex items-center justify-center"
        )}
      >
        <MoonIcon
          size={16}
          className={cn(
            "transition-all duration-200 ease-out",
            checked ? "text-blue-400 scale-110" : "text-gray-400"
          )}
        />
      </span>
    </div>
  );
};

export default ThemeSwitch;