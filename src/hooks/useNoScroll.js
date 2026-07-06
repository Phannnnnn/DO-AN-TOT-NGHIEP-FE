import { useEffect } from "react";

export function useNoScroll(isOpen) {
  useEffect(() => {
    if (!isOpen) return;

    window.__activeModalsCount = (window.__activeModalsCount || 0) + 1;
    if (window.__activeModalsCount > 0) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.__activeModalsCount = Math.max(
        0,
        (window.__activeModalsCount || 0) - 1,
      );
      if (window.__activeModalsCount === 0) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);
}
