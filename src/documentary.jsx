import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  Phone,
  Pause,
  Play,
  X,
  LayoutGrid,
  List,
  ShieldCheck,
  Plus,
  Check,
} from "lucide-react";
import { Photo, services } from "./content.jsx";
import imageManifest from "./image-manifest.json";
import FrontlineContactSheet from "./FrontlineContactSheet.jsx";

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
    return () => delete document.body.dataset.motion;
  }, [motion]);
  return (
    <MotionContext.Provider value={{ motion, setMotion }}>
      {children}
    </MotionContext.Provider>
  );
}
function useVisible(ref) {
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    const update = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref]);
  return visible && tabVisible;
}
const heroScenes = [
  {
    image: "hero",
    label: "Courage in action",
    caption: "Fire & rescue · Punjab Emergency Service",
    alt: "Rescue 1122 firefighters practising as a team with a fire hose",
  },
  {
    image: "flood",
    label: "A way to safety",
    caption: "Flood response · Punjab",
    alt: "Rescue 1122 boat carrying people through floodwaters",
  },
  {
    image: "community",
    label: "A safer tomorrow",
    caption: "Community preparedness · CPR training",
    alt: "Students learning CPR with Rescue 1122 instructors",
  },
];
export function DocumentaryHero() {
  const { motion, setMotion } = useMotion();
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const hero = useRef(null);
  const visible = useVisible(hero);
  const cycling = motion && visible && !focused;
  useEffect(() => {
    if (!cycling) return;
    const timer = setTimeout(
      () => setActive((i) => (i + 1) % heroScenes.length),
      7000,
    );
    return () => clearTimeout(timer);
  }, [active, cycling]);
  return (
    <section
      className={"doc-hero " + (cycling ? "is-playing" : "is-paused")}
      ref={hero}
      aria-labelledby="hero-title"
      onFocusCapture={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="doc-hero-plates">
        {heroScenes.map((scene, i) => (
          <div
            key={scene.image}
            className={"doc-hero-plate " + (i === active ? "active" : "")}
            aria-hidden={i !== active}
          >
            <Photo
              name={scene.image}
              priority={i === 0}
              alt={scene.alt}
              sizes="(min-width: 1800px) 1500px, 100vw"
            />
          </div>
        ))}
      </div>
      <div className="doc-hero-shade" />
      <div className="doc-hero-content wrap">
        <div className="doc-hero-top">
          <span className="doc-label">
            <i className="ready-light" /> ALWAYS READY. ALWAYS HERE.
          </span>
          <button
            className="doc-motion"
            onClick={() => setMotion(!motion)}
            aria-label={
              motion ? "Pause website motion" : "Enable website motion"
            }
            aria-pressed={!motion}
          >
            {motion ? <Pause size={12} /> : <Play size={12} />}{" "}
            {motion ? "Pause motion" : "Enable motion"}
          </button>
        </div>
        <div className="doc-hero-copy">
          <span className="doc-label">PUNJAB EMERGENCY SERVICE</span>
          <h1 id="hero-title">
            <span>HERE FOR</span>
            <span>
              LIFE<span className="doc-red">.</span>
            </span>
          </h1>
          <p>
            Every second counts.
            <br />
            Every life matters.
          </p>
          <div className="doc-hero-actions">
            <a className="doc-call" href="tel:1122">
              <Phone size={20} />
              <span>
                EMERGENCY CALL <b>1122</b>
              </span>
              <ArrowUpRight size={23} />
            </a>
            <a href="#stories" className="doc-underlink">
              Explore our stories <ArrowDown size={17} />
            </a>
          </div>
          <span className="doc-assurance">
            <Check size={12} /> Free emergency service · 24 hours, every day
          </span>
        </div>
        <div className="doc-hero-foot">
          <div className="doc-scene-note" key={active}>
            <span className="doc-label">ON THE FRONTLINE / 0{active + 1}</span>
            <p>{heroScenes[active].label}</p>
            <small>{heroScenes[active].caption}</small>
          </div>
          <div className="doc-scenes" aria-label="Choose hero photograph">
            {heroScenes.map((scene, i) => (
              <button
                key={scene.image}
                aria-label={"Show " + scene.label}
                aria-pressed={active === i}
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
              >
                <span>0{i + 1}</span>
                <i key={`${active}-${cycling}`} />
              </button>
            ))}
          </div>
          <a
            href="#stories"
            className="doc-scroll"
            aria-label="Scroll to photo stories"
          >
            <ArrowDown size={23} />
          </a>
        </div>
      </div>
      <span className="doc-hero-side" aria-hidden="true">
        COURAGE. COMPASSION. COMMITMENT.
      </span>
    </section>
  );
}
const stories = [
  {
    image: "ambulance",
    category: "EMERGENCY MEDICAL RESPONSE",
    title: "The first link in care.",
    subtitle: "Respond",
    service: 0,
    body: "Emergency care begins before a patient reaches the hospital. Rescue 1122 brings medical response and patient transport together, helping people get assistance when they need it most.",
    note: "Emergency medical response & patient transport",
  },
  {
    image: "hero",
    category: "FIRE & RESCUE",
    title: "Courage is a team effort.",
    subtitle: "Rescue",
    service: 1,
    body: "A coordinated response depends on preparation, equipment and teamwork. Rescue 1122 combines firefighting and specialist rescue to help people facing fires and other dangerous incidents.",
    note: "Professional preparation & coordinated response",
  },
  {
    image: "flood",
    category: "FLOOD & WATER RESCUE",
    title: "A way through the water.",
    subtitle: "Reach",
    service: 3,
    body: "Floods can separate people from familiar roads and safe ground. Specialist rescue response helps people reach safety through water and flood emergencies.",
    note: "Water rescue & flood emergency response",
  },
  {
    image: "fire",
    category: "TECHNICAL & URBAN RESCUE",
    title: "Prepared for the complex.",
    subtitle: "Protect",
    service: 4,
    body: "Road crashes, building collapse and complex emergencies demand a coordinated approach. Specialist rescue brings trained people and equipment together when access and conditions are difficult.",
    note: "Technical rescue & complex emergencies",
  },
  {
    image: "community",
    category: "COMMUNITY SAFETY",
    title: "Knowledge that travels home.",
    subtitle: "Prepare",
    service: 5,
    body: "Practical training gives people a way to help. Community safety programmes introduce lifesaving skills and encourage citizens to take an active role in building safer communities.",
    note: "Community education & emergency preparedness",
  },
  {
    image: "rescue",
    category: "THE PEOPLE BEHIND THE RESPONSE",
    title: "The people who show up.",
    subtitle: "Together",
    service: 9,
    body: "Professional emergency response is built through training and teamwork. Behind the vehicles and equipment are people practising together and preparing to serve their communities.",
    note: "Training, teamwork & public service",
  },
];
function StoryViewer({ index, setIndex, onClose, origin, getOrigin }) {
  const dialog = useRef(null);
  const closing = useRef(false);
  const { motion } = useMotion();
  const story = stories[index];
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = "hidden";
    if (motion && origin && el.animate) {
      const target = el.getBoundingClientRect();
      const dx =
        origin.left + origin.width / 2 - target.left - target.width / 2;
      const dy =
        origin.top + origin.height / 2 - target.top - target.height / 2;
      el.animate(
        [
          {
            transform: `translate(${dx}px,${dy}px) scale(${Math.min(0.85, origin.width / target.width)})`,
            opacity: 0.4,
          },
          { transform: "none", opacity: 1 },
        ],
        { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    }
    return () => {
      el.getAnimations().forEach((a) => a.cancel());
      el.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const el = dialog.current;
    const source = getOrigin(index);
    if (!motion || !source || !el.animate) {
      onClose();
      return;
    }
    const r = el.getBoundingClientRect();
    el.animate(
      [
        { transform: "none", opacity: 1 },
        {
          transform: `translate(${source.left + source.width / 2 - r.left - r.width / 2}px,${source.top + source.height / 2 - r.top - r.height / 2}px) scale(${Math.min(0.8, source.width / r.width)})`,
          opacity: 0,
        },
      ],
      { duration: 380, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" },
    )
      .finished.then(() => {
        if (dialog.current?.open) onClose();
      })
      .catch(() => {});
  };
  const step = (direction) =>
    setIndex((i) => (i + direction + stories.length) % stories.length);
  return (
    <dialog
      ref={dialog}
      className="story-viewer"
      aria-labelledby="story-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
      }}
    >
      <div className="story-viewer-shell">
        <button
          className="story-close"
          onClick={close}
          aria-label="Close photo story"
        >
          <X size={21} />
        </button>
        <div className="story-viewer-photo" key={story.image}>
          <Photo
            name={story.image}
            alt={story.category + " - Rescue 1122"}
            sizes="(max-width: 800px) 92vw, 750px"
          />
          <span>RESCUE 1122 / DOCUMENTARY ARCHIVE</span>
        </div>
        <div className="story-viewer-copy">
          <span className="doc-label">{story.category}</span>
          <h2 id="story-title">{story.title}</h2>
          <p>{story.body}</p>
          <div className="story-fact">
            <ShieldCheck size={20} />
            <span>{story.note}</span>
          </div>
          <a
            className="doc-underlink"
            href={imageManifest[story.image].source}
            target="_blank"
            rel="noreferrer"
          >
            Photograph & original source <ArrowUpRight size={16} />
          </a>
          <div className="story-viewer-nav">
            <button onClick={() => step(-1)} aria-label="Previous photo story">
              <ArrowLeft size={19} />
            </button>
            <span>
              0{index + 1} <i>/ 0{stories.length}</i>
            </span>
            <button onClick={() => step(1)} aria-label="Next photo story">
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
export function SpatialGallery() {
  const [view, setView] = useState("gallery");
  const [selected, setSelected] = useState(null);
  const [origin, setOrigin] = useState(null);
  const panels = useRef([]);
  const stage = useRef(null);
  const { motion } = useMotion();
  const wave = useRef(null);
  useEffect(() => {
    if (!motion || view !== "gallery") return;
    let frame = 0,
      alive = true;
    const states = stories.map(() => ({
      position: 0,
      velocity: 0,
      target: 0,
      push: 0,
      targetPush: 0,
    }));
    let last = 0;
    const animate = (time) => {
      if (!alive) return;
      const dt = Math.min(2, (time - (last || time - 16.7)) / 16.7);
      last = time;
      let moving = false;
      states.forEach((state, i) => {
        const acceleration = (state.target - state.position) * 0.09;
        state.velocity =
          (state.velocity + acceleration * dt) * Math.pow(0.7, dt);
        state.position += state.velocity * dt;
        state.push += (state.targetPush - state.push) * 0.18;
        const y = [20, -10, 30, 0, 25, -5][i] - state.position;
        const angle = [-4, -2, 1, -2, 3, 5][i] * (1 - state.position / 130);
        const el = panels.current[i];
        if (el)
          el.style.transform = `translate3d(${state.push}px,${y}px,${state.position * 0.8}px) rotateY(${-16 + state.position * 0.17}deg) rotateZ(${angle}deg)`;
        moving ||=
          Math.abs(state.target - state.position) > 0.08 ||
          Math.abs(state.velocity) > 0.08 ||
          Math.abs(state.targetPush - state.push) > 0.08;
      });
      if (moving) frame = requestAnimationFrame(animate);
      else {
        frame = 0;
        last = 0;
      }
    };
    wave.current = {
      move(event) {
        if (event.pointerType !== "mouse" || innerWidth < 900) return;
        const r = stage.current.getBoundingClientRect();
        const x = event.clientX - r.left;
        states.forEach((state, i) => {
          const el = panels.current[i];
          if (!el) return;
          const distance = x - (el.offsetLeft + el.offsetWidth / 2);
          const influence = Math.max(0, 1 - Math.abs(distance) / 320);
          state.target = 110 * influence * influence;
          state.targetPush = -Math.sign(distance) * influence * 18;
        });
        if (!frame) frame = requestAnimationFrame(animate);
      },
      reset() {
        states.forEach((state) => {
          state.target = 0;
          state.targetPush = 0;
        });
        if (!frame) frame = requestAnimationFrame(animate);
      },
    };
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      wave.current = null;
      panels.current.forEach((panel) => {
        if (panel) panel.style.removeProperty("transform");
      });
    };
  }, [motion, view]);
  const open = (index, event) => {
    wave.current?.reset();
    setOrigin(event.currentTarget.getBoundingClientRect());
    setSelected(index);
  };
  return (
    <section id="stories" className="spatial-section">
      <div className="wrap doc-section-heading">
        <div>
          <span className="doc-label">
            <span className="doc-section-num">01</span> THE RESCUE ARCHIVE
          </span>
          <h2>
            EVERY LIFE,
            <br />
            <em>A STORY.</em>
          </h2>
        </div>
        <div className="gallery-intro">
          <p>
            A closer look at the people, preparation
            <br />
            and purpose behind every response.
          </p>
          <div
            className="gallery-view-switch"
            aria-label="Photo archive layout"
          >
            <button
              aria-pressed={view === "gallery"}
              onClick={() => setView("gallery")}
            >
              <LayoutGrid size={14} /> Gallery
            </button>
            <button
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List size={14} /> List
            </button>
          </div>
        </div>
      </div>
      <div
        className={"spatial-stage " + (view === "list" ? "list-view" : "")}
        ref={stage}
        onPointerMove={(event) => wave.current?.move(event)}
        onPointerLeave={() => wave.current?.reset()}
      >
        {stories.map((story, i) => (
          <button
            className="story-panel"
            ref={(el) => (panels.current[i] = el)}
            key={story.title}
            onClick={(event) => open(i, event)}
            style={{
              "--rest-y": `${[20, -10, 30, 0, 25, -5][i]}px`,
              "--rest-angle": `${[-4, -2, 1, -2, 3, 5][i]}deg`,
            }}
          >
            <div className="story-panel-photo">
              <Photo
                name={story.image}
                alt=""
                sizes="(max-width: 600px) 75vw, 380px"
              />
            </div>
            <span className="story-panel-top">
              <span>0{i + 1}</span>
              <ArrowUpRight size={18} />
            </span>
            <div className="story-panel-title">
              <span>{story.subtitle}</span>
              <h3>{story.title}</h3>
              <small>{story.category}</small>
            </div>
          </button>
        ))}
      </div>
      <div className="wrap gallery-footnote">
        <span>
          <i /> REAL PEOPLE. EXTRAORDINARY PURPOSE.
        </span>
        <span className="desktop-gallery-hint">
          Move to explore · Select a photograph to enter
        </span>
        <span className="mobile-gallery-hint">
          Swipe to explore · Tap to open
        </span>
      </div>
      {selected !== null && (
        <StoryViewer
          index={selected}
          setIndex={setSelected}
          origin={origin}
          getOrigin={(index) => panels.current[index]?.getBoundingClientRect()}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
const chapters = [
  {
    id: "respond",
    word: "RESPOND",
    number: "01",
    image: "ambulance",
    eyebrow: "WHEN EVERY SECOND COUNTS",
    title: "Care begins with the first response.",
    text: "Professional emergency care, from the call for help to patient transport. A connection to the right assistance when people need it most.",
    service: 0,
    link: "Explore medical response",
  },
  {
    id: "rescue",
    word: "RESCUE",
    number: "02",
    image: "flood",
    eyebrow: "THROUGH THE UNEXPECTED",
    title: "Finding a way. Bringing people to safety.",
    text: "Fire, water and complex emergencies require preparation and teamwork. Rescue 1122 brings specialist services together to help protect lives.",
    service: 8,
    link: "Explore rescue & disaster response",
  },
  {
    id: "prepare",
    word: "PREPARE",
    number: "03",
    image: "community",
    eyebrow: "SAFER COMMUNITIES START WITH US",
    title: "A little knowledge. A life-changing difference.",
    text: "Practical training helps citizens build lifesaving skills. Learn CPR, volunteer as a Rescue Scout, and take part in creating a safer community.",
    service: 5,
    link: "Explore community safety",
  },
];
export function FrontlineChapters({ onOpenService }) {
  const { motion } = useMotion();
  return (
    <FrontlineContactSheet
      chapters={chapters}
      motion={motion}
      onOpenService={onOpenService}
    />
  );
}
export function ServiceExplorer({ onOpenService }) {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const service = services[active];
  const move = (e, index) => {
    let next;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = (index + 1) % services.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = (index - 1 + services.length) % services.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = services.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <section id="services" className="service-experience">
      <div className="wrap">
        <div className="doc-section-heading">
          <div>
            <span className="doc-label">
              <span className="doc-section-num">03</span> ONE INTEGRATED SERVICE
            </span>
            <h2>
              READY FOR
              <br />
              <em>EVERY EMERGENCY.</em>
            </h2>
          </div>
          <p>
            Dedicated people. Specialist skills.
            <br />
            Explore the ways we serve.
          </p>
        </div>
        <div className="service-explorer-grid">
          <div
            className="service-tabs"
            role="tablist"
            aria-label="Rescue services"
          >
            {services.map((item, i) => (
              <button
                role="tab"
                key={item.name}
                id={"service-tab-" + i}
                aria-selected={i === active}
                aria-controls="service-panel"
                tabIndex={i === active ? 0 : -1}
                ref={(el) => (tabs.current[i] = el)}
                onKeyDown={(e) => move(e, i)}
                onClick={() => setActive(i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <item.icon size={17} />
                <span>{item.name}</span>
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
          <div
            id="service-panel"
            role="tabpanel"
            aria-labelledby={"service-tab-" + active}
            className="service-feature-panel"
          >
            <div className="service-explorer-photo" key={service.image}>
              <Photo
                name={service.image.split(".")[0]}
                alt={service.name + " - Rescue 1122"}
                sizes="(max-width: 800px) 90vw, 750px"
              />
              <span>RESCUE 1122 / {String(active + 1).padStart(2, "0")}</span>
            </div>
            <div className="service-explorer-copy" key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.text}</p>
              <button
                className="doc-underlink"
                onClick={() => onOpenService(active)}
              >
                Service information <Plus size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
