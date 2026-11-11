import React, { createContext, useContext, useEffect, useState } from "react";

const MotionContext = createContext(null);
export function useMotion() {
  return useContext(MotionContext);
}
export function MotionProvider({ children }) {
  const [motion, setMotion] = useState(
    () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.body.dataset.motion = motion ? "on" : "off";
    document.documentElement.dataset.motion = motion ? "on" : "off";
    return () => {
      delete document.body.dataset.motion;
      delete document.documentElement.dataset.motion;
    };
  }, [motion]);
  return (
    <MotionContext.Provider value={{ motion, setMotion }}>
      {children}
    </MotionContext.Provider>
  );
}
