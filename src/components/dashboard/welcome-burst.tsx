"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Confetti } from "@/components/motion/confetti";

const KEY = "animlogin:welcome-shown";

export function WelcomeBurst() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let shouldShow = false;
    try {
      if (sessionStorage.getItem(KEY) !== "1") {
        sessionStorage.setItem(KEY, "1");
        shouldShow = true;
      }
    } catch {
      // ignore
    }
    if (!shouldShow) return;
    const id = window.setTimeout(() => setShow(true), 50);
    const t = window.setTimeout(() => setShow(false), 1800);
    return () => {
      clearTimeout(id);
      clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
        >
          <Confetti count={50} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
