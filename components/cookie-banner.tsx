"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const KEY = "jeeni-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  function resolve(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl glass-strong rounded-2xl p-5 shadow-2xl sm:p-6"
        >
          <p className="text-sm font-semibold text-foreground">
            This website uses cookies.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We use cookies to analyze website traffic and optimize your website
            experience. By accepting our use of cookies, your data will be
            aggregated with all other user data.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => resolve("declined")}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              Decline
            </button>
            <button
              onClick={() => resolve("accepted")}
              className="rounded-full bg-gradient-to-r from-blue to-navy px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
