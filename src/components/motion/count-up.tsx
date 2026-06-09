"use client";

import { useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  to: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
};

export function CountUp({ to, duration = 1.4, className, format }: CountUpProps) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const controls = animate(mv, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(format ? format(v) : Math.round(v).toString()),
    });
    return () => controls.stop();
  }, [to, duration, format, mv]);

  return <span className={className}>{display}</span>;
}
