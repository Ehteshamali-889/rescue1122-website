import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Photo } from "./content.jsx";
import images from "./image-manifest.json";
import "./FrontlineContactSheet.css";

// Existing organizational photographs and existing chapter narratives only.
const photographs = [
  {
    image: "ambulance",
    chapter: 0,
    position: "medical",
    note: "The first response",
    alt: "Rescue 1122 ambulance fleet",
    anchor: "chapter-respond",
  },
  {
    image: "rescue",
    chapter: 2,
    position: "team",
    note: "Preparation. Practice. Teamwork.",
    alt: "Rescue 1122 personnel training together",
  },
  {
    image: "hero",
    chapter: 1,
    position: "fire",
    note: "Courage in action",
    alt: "Rescue 1122 firefighters working together in a hose training exercise",
    anchor: "chapter-rescue",
  },
  {
    image: "flood",
    chapter: 1,
    position: "water",
    note: "A way to safety",
    alt: "Rescue 1122 boat carrying people through floodwaters",
  },
  {
    image: "community",
    chapter: 2,
    position: "training",
    note: "Lifesaving skills, shared",
    alt: "Students practising CPR alongside Rescue 1122 instructors",
    anchor: "chapter-prepare",
  },
];

function FrontlineStory({
  index,
  setIndex,
  chapters,
  motion,
  origin,
  getOrigin,
  onClose,
  onOpenService,
}) {
  const dialog = useRef(null);
  const closing = useRef(false);
  const photograph = photographs[index];
  const chapter = chapters[photograph.chapter];
  const source = images[photograph.image];

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    if (motion && origin && element.animate) {
      const target = element.getBoundingClientRect();
      element.animate(
        [
          {
            opacity: 0.25,
            transform: `translate(${origin.left + origin.width / 2 - target.left - target.width / 2}px, ${origin.top + origin.height / 2 - target.top - target.height / 2}px) scale(${Math.min(0.8, origin.width / target.width)})`,
          },
          { opacity: 1, transform: "none" },
        ],
        { duration: 550, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
    return () => {
      element.getAnimations().forEach((animation) => animation.cancel());
      element.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const element = dialog.current;
    const target = getOrigin(index);
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
        if (dialog.current?.open) onClose();
      })
      .catch(() => {});
  };
  const step = (direction) =>
    setIndex(
      (current) =>
        (current + direction + photographs.length) % photographs.length,
    );

  return (
    <dialog
      ref={dialog}
      className="frontline-story-dialog"
      aria-labelledby="frontline-story-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <div className="frontline-story-shell">
        <button
          className="frontline-story-close"
          onClick={close}
          aria-label="Close frontline photograph"
        >
          <X size={21} />
        </button>
        <div
          className="frontline-story-image"
          style={{
            "--source-display-width": `${Math.min(900, Math.floor(source.width / 2))}px`,
          }}
        >
          <Photo
            name={photograph.image}
            alt={photograph.alt}
            sizes={`${Math.min(900, Math.floor(source.width / 2))}px`}
          />
          <span>RESCUE 1122 / {chapter.word}</span>
        </div>
        <div className="frontline-story-copy" key={index}>
          <span className="frontline-kicker">
            CHAPTER {chapter.number} / {chapter.word}
          </span>
          <h3 id="frontline-story-title">{chapter.title}</h3>
          <p>{chapter.text}</p>
          <button
            className="frontline-story-service"
            onClick={() => {
              onClose();
              onOpenService(chapter.service);
            }}
          >
            {chapter.link}
            <ArrowUpRight size={17} />
          </button>
          <div className="frontline-story-navigation">
            <button
              onClick={() => step(-1)}
              aria-label="Previous frontline photograph"
            >
              <ArrowLeft size={18} />
            </button>
            <span>
              {String(index + 1).padStart(2, "0")} <i>/ 05</i>
            </span>
            <button
              onClick={() => step(1)}
              aria-label="Next frontline photograph"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function FrontlineContactSheet({
  chapters,
  motion,
  onOpenService,
}) {
  const [selected, setSelected] = useState(null);
  const [origin, setOrigin] = useState(null);
  const photoRefs = useRef([]);
  const frame = useRef(0);
  const pointer = useRef(null);

  const reset = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    photoRefs.current.forEach((photo) => {
      photo?.style.removeProperty("--proximity-lift");
      photo?.style.removeProperty("--proximity-x");
    });
  };
  useEffect(() => {
    reset();
    return reset;
  }, [motion]);

  const follow = (event) => {
    if (!motion || event.pointerType !== "mouse" || innerWidth <= 900) return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      photoRefs.current.forEach((photo) => {
        if (!photo) return;
        const rect = photo.getBoundingClientRect();
        const dx = pointer.current.x - rect.left - rect.width / 2;
        const dy = pointer.current.y - rect.top - rect.height / 2;
        const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 340);
        photo.style.setProperty(
          "--proximity-lift",
          `${(influence * 7).toFixed(2)}px`,
        );
        photo.style.setProperty(
          "--proximity-x",
          `${((dx / 340) * influence * 4).toFixed(2)}px`,
        );
      });
    });
  };

  return (
    <section
      id="frontline"
      className="frontline-contact-sheet"
      aria-labelledby="frontline-contact-title"
      data-contact-motion={motion ? "on" : "off"}
    >
      <div className="frontline-contact-top">
        <span className="frontline-kicker">
          02 / THE WORK. THE PEOPLE. THE PURPOSE.
        </span>
        <span className="frontline-kicker">A LIVING CONTACT SHEET</span>
      </div>
      <div
        className="frontline-contact-composition"
        onPointerMove={follow}
        onPointerLeave={reset}
      >
        <div className="frontline-contact-center">
          <span className="frontline-kicker">EVERY SECOND MATTERS.</span>
          <h2 id="frontline-contact-title">
            ON THE
            <br />
            <em>
              FRONTLINE<span>.</span>
            </em>
          </h2>
          <p>
            These are the people who respond
            <br />
            when it matters.
          </p>
        </div>
        <div
          className="frontline-contact-photos"
          aria-label="Frontline photographs"
        >
          {photographs.map((photograph, index) => {
            const chapter = chapters[photograph.chapter];
            return (
              <button
                key={photograph.image}
                id={photograph.anchor}
                ref={(element) => (photoRefs.current[index] = element)}
                className={`frontline-contact-photo frontline-photo-${photograph.position}`}
                aria-label={`Open ${chapter.word.toLowerCase()} photograph: ${photograph.note}`}
                aria-haspopup="dialog"
                onClick={(event) => {
                  reset();
                  setOrigin(event.currentTarget.getBoundingClientRect());
                  setSelected(index);
                }}
              >
                <div className="frontline-contact-image">
                  <Photo
                    name={photograph.image}
                    alt={photograph.alt}
                    sizes="(max-width: 600px) 78vw, (max-width: 900px) 340px, 320px"
                  />
                </div>
                <div className="frontline-contact-caption">
                  <span>{chapter.word}</span>
                  <p>{photograph.note}</p>
                  <ArrowUpRight size={18} />
                </div>
                <span className="frontline-contact-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")} / {chapter.word}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="frontline-contact-bottom">
        <span>REAL PEOPLE. SHARED PURPOSE.</span>
        <span className="frontline-desktop-hint">
          Move closer. Select a photograph.
        </span>
        <span className="frontline-touch-hint">
          Swipe to explore. Tap a photograph.
        </span>
      </div>
      {selected !== null && (
        <FrontlineStory
          index={selected}
          setIndex={setSelected}
          chapters={chapters}
          motion={motion}
          origin={origin}
          getOrigin={(index) =>
            photoRefs.current[index]?.getBoundingClientRect()
          }
          onClose={() => setSelected(null)}
          onOpenService={onOpenService}
        />
      )}
    </section>
  );
}
