"use client";

import { useEffect, useState } from "react";

const DEFAULT_DURATION_MS = 1200;

export function useAnimatedScore(value: number, durationMs = DEFAULT_DURATION_MS): number {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return displayValue;
}
