import { useEffect, useRef } from "react";

/** Native modal lifecycle shared by service, archive and frontline dialogs. */
export function useDialog({ motion = false, origin, getOrigin, onClose } = {}) {
  const dialog = useRef(null);
  const closing = useRef(false);
  // The opening geometry belongs to this mount, even when the user changes slides.
  const opening = useRef({ motion, origin });

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const { motion, origin } = opening.current;
    element.showModal();
    document.body.style.overflow = "hidden";

    // Keep Tab/Shift+Tab within the dialog instead of moving to browser chrome.
    const containFocus = (event) => {
      if (event.key !== "Tab") return;
      const controls = [
        ...element.querySelectorAll(
          'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((control) => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    element.addEventListener("keydown", containFocus);

    if (motion && origin && element.animate) {
      const target = element.getBoundingClientRect();
      element.animate(
        [
          {
            opacity: 0.3,
            transform: `translate(${origin.left + origin.width / 2 - target.left - target.width / 2}px, ${origin.top + origin.height / 2 - target.top - target.height / 2}px) scale(${Math.min(0.85, origin.width / target.width)})`,
          },
          { opacity: 1, transform: "none" },
        ],
        { duration: 550, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }

    return () => {
      element.removeEventListener("keydown", containFocus);
      element.getAnimations().forEach((animation) => animation.cancel());
      element.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const element = dialog.current;
    const target = getOrigin?.();
    if (!motion || !target || !element.animate) {
      onClose();
      return;
    }
    const current = element.getBoundingClientRect();
    element
      .animate(
        [
          { opacity: 1, transform: "none" },
          {
            opacity: 0,
            transform: `translate(${target.left + target.width / 2 - current.left - current.width / 2}px, ${target.top + target.height / 2 - current.top - current.height / 2}px) scale(${Math.min(0.8, target.width / current.width)})`,
          },
        ],
        { duration: 320, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" },
      )
      .finished.then(() => {
        if (element.isConnected && element.open) onClose();
      })
      .catch(() => {
        // Unmount cancels in-flight animations; its cleanup already closes the dialog.
      });
  };

  return { dialog, close };
}
