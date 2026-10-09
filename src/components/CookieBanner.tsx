"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "rb-consent";
const EVT = "rb-open-consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setTimeout(() => setShow(true), 1200);
    } catch {}
    const open = () => setShow(true);
    window.addEventListener(EVT, open);
    return () => window.removeEventListener(EVT, open);
  }, []);
  const choose = (v: "all" | "essential") => {
    try { localStorage.setItem(KEY, v); } catch {}
    // Hook analytics here: only load GA4 / ad pixels when v === "all".
    window.dispatchEvent(new CustomEvent("rb-consent", { detail: v }));
    setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="cookie" role="dialog" aria-label="Cookie preferences" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
          <p>
            We use essential cookies to run this site and, with your permission, analytics cookies to improve it. See our <Link href="/privacy-policy/">privacy policy</Link>.
          </p>
          <div className="cookie-actions">
            <button className="btn btn-red btn-sm" onClick={() => choose("all")}>Accept all</button>
            <button className="btn btn-ghost btn-sm" style={{ ["--fg" as string]: "#fff", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.4)" }} onClick={() => choose("essential")}>Essential only</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event(EVT))}>Cookie settings</button>;
}
