import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  ShieldCheck,
  HeartPulse,
  Flame,
  Waves,
  Bike,
  Building2,
  HandHeart,
  PawPrint,
  Menu,
  X,
  Plus,
  Minus,
  MapPin,
  Mail,
  Check,
  LifeBuoy,
} from "lucide-react";
import "./styles.css";
import images from "./image-manifest.json";
import { services, Photo } from "./content.jsx";
import {
  MotionProvider,
  useMotion,
  DocumentaryHero,
  SpatialGallery,
  FrontlineChapters,
  ServiceExplorer,
} from "./documentary.jsx";
import "./documentary.css";
function ServiceViewer({ index, onChange, onClose }) {
  const dialog = useRef(null);
  const service = services[index];
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  const step = (direction) =>
    onChange((index + direction + services.length) % services.length);
  return (
    <dialog
      className="service-viewer"
      ref={dialog}
      aria-labelledby="service-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
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
      <div className="viewer-shell">
        <button
          className="viewer-close"
          onClick={onClose}
          aria-label="Close service details"
        >
          <X size={20} />
        </button>
        <div className="viewer-photo">
          <Photo
            name={service.image.split(".")[0]}
            alt={service.name + " — Rescue 1122"}
            sizes="(max-width: 700px) 90vw, 540px"
          />
          <span className="viewer-photo-label">RESCUE 1122 / OUR SERVICES</span>
        </div>
        <div className="viewer-copy" key={index}>
          <div className="viewer-counter">
            <span>
              {String(index + 1).padStart(2, "0")}{" "}
              <i>/ {String(services.length).padStart(2, "0")}</i>
            </span>
            <service.icon size={27} strokeWidth={1.5} />
          </div>
          <div className="eyebrow">HERE WHEN IT MATTERS</div>
          <h2 id="service-title">{service.name}</h2>
          <p>{service.detail}</p>
          <a className="call" href="tel:1122">
            <Phone size={18} /> Call 1122 <ArrowUpRight size={18} />
          </a>
          <div className="viewer-navigation">
            <button onClick={() => step(-1)} aria-label="Previous service">
              <ArrowRight className="previous-arrow" size={19} /> Previous
            </button>
            <button onClick={() => step(1)} aria-label="Next service">
              Next service <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
function PhotoCredits() {
  return (
    <details className="photo-credits wrap">
      <summary>Photography & sources</summary>
      <div>
        {Object.entries(images).map(([name, photo]) => (
          <a key={name} href={photo.source} target="_blank" rel="noreferrer">
            {name === "hero"
              ? "Hero · Punjab Emergency Service"
              : name === "flood"
                ? "Flood rescue · Dawn"
                : name === "building"
                  ? "Building - Punjab Emergency Service"
                  : name.charAt(0).toUpperCase() + name.slice(1)}{" "}
            <ArrowUpRight size={12} />
          </a>
        ))}
      </div>
    </details>
  );
}
function App() {
  const { motion } = useMotion();
  const [menu, setMenu] = useState(false),
    [selected, setSelected] = useState(null),
    [faq, setFaq] = useState(0);
  const closeMenu = () => setMenu(false);
  useEffect(() => {
    if (!motion || !Element.prototype.animate) return;
    const animations = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animations.push(
              entry.target.animate(
                [
                  { opacity: 0, transform: "translateY(24px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" },
              ),
            );
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(
        ".section-head,.about-grid,.community-grid,.resources,.doc-section-heading,.chapter-copy,.people-heading",
      )
      .forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      animations.forEach((a) => a.cancel());
    };
  }, [motion]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="utility">
        <div className="wrap">
          <span>
            <ShieldCheck size={13} /> Emergency Services Department · Government
            of the Punjab
          </span>
          <a href="tel:1192">
            Feedback & complaints <b>1192</b>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <header className="documentary-nav">
        <div className="wrap nav">
          <a href="#" className="brand" aria-label="Rescue 1122 home">
            <img src="/images/logo.png" alt="Rescue 1122 emblem" />
            <div>
              RESCUE <b>1122</b>
              <small>EMERGENCY SERVICES · PUNJAB</small>
            </div>
          </a>
          <button
            className="menu-button"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="main-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            className={menu ? "open" : ""}
            aria-label="Main navigation"
            id="main-navigation"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                closeMenu();
                document.querySelector(".menu-button")?.focus();
              }
            }}
          >
            {[
              ["Stories", "stories"],
              ["Services", "services"],
              ["About", "about"],
              ["Training", "community"],
              ["Resources", "resources"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <a onClick={closeMenu} key={id} href={"#" + id}>
                {label}
              </a>
            ))}
          </nav>
          <a
            className="call nav-call"
            href="tel:1122"
            aria-label="Emergency? Call 1122"
          >
            <Phone size={17} /> <span>Emergency? Call 1122</span>
          </a>
        </div>
      </header>
      <main id="main">
        <DocumentaryHero />
        <SpatialGallery />
        <FrontlineChapters onOpenService={setSelected} />
        <ServiceExplorer onOpenService={setSelected} />
        <section id="about" className="about-section people-section">
          <div className="wrap about-grid">
            <div className="about-image">
              <Photo
                name="rescue"
                alt="Rescue 1122 personnel practising together at the Emergency Services Academy"
                sizes="(max-width: 800px) 90vw, 650px"
              />
              <span className="photo-label">
                <ShieldCheck size={17} /> SERVICE ABOVE SELF
              </span>
            </div>
            <div className="about-copy">
              <div className="eyebrow">
                <span className="section-marker">02</span> THE PEOPLE BEHIND THE
                PROMISE
              </div>
              <h2>
                Courage has
                <br />a <em>human face.</em>
              </h2>
              <p>
                Rescue 1122 brings medical response, firefighting and specialist
                rescue together. Behind every response is a team committed to
                protecting lives with care, courage and professionalism.
              </p>
              <div className="values">
                <span>
                  <ShieldCheck /> Professional response
                </span>
                <span>
                  <HandHeart /> Compassionate care
                </span>
              </div>
              <a
                className="text-link"
                href="https://www.rescue.gov.pk/"
                target="_blank"
                rel="noreferrer"
              >
                Discover our story <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>
        <section id="community" className="section wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">
                <span className="section-marker">03</span> SAFER COMMUNITIES
                START WITH US
              </div>
              <h2>You can be someone’s lifeline.</h2>
            </div>
            <p>
              Learn a skill. Lend a hand.
              <br />
              Help make your community safer.
            </p>
          </div>
          <div className="community-grid">
            <article className="feature-training">
              <Photo
                name="community"
                className="training-photo"
                alt="Students practising CPR with Rescue 1122 instructors"
                sizes="(max-width: 560px) 90vw, 600px"
              />
              <div className="training-content">
                <div className="eyebrow">LEARN TO SAVE A LIFE</div>
                <HeartPulse size={60} strokeWidth={1} />
                <h3>
                  Your hands.
                  <br />
                  Someone’s second chance.
                </h3>
                <p>
                  Learn CPR through the national training programme. A little
                  knowledge can make a life-changing difference.
                </p>
                <a href="https://cpr.gov.pk/" target="_blank" rel="noreferrer">
                  Explore CPR training <ArrowUpRight size={20} />
                </a>
              </div>
            </article>
            <div className="training-list">
              <a
                href="https://scout.rescue.gov.pk/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="training-icon">
                  <HandHeart size={30} />
                </span>
                <div>
                  <span className="eyebrow">VOLUNTEER WITH PURPOSE</span>
                  <h3>Join the Rescue Scout Corps</h3>
                  <p>
                    Be part of a community that cares. Learn, volunteer and make
                    a difference.
                  </p>
                </div>
                <ArrowUpRight />
              </a>
              <a
                href="https://www.rescue.gov.pk/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="training-icon">
                  <Building2 size={30} />
                </span>
                <div>
                  <span className="eyebrow">PREVENTION IS PROTECTION</span>
                  <h3>Build a safer tomorrow</h3>
                  <p>
                    Explore building safety guidance and help create safer
                    places to live and work.
                  </p>
                </div>
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>
        <section id="resources" className="resources wrap">
          <div>
            <div className="eyebrow">A LITTLE CLARITY. WHEN IT MATTERS.</div>
            <h2>Know what to do.</h2>
            <p>Helpful information for getting the right assistance.</p>
          </div>
          <div className="faq">
            {[
              [
                "When should I call 1122?",
                "Call 1122 for an emergency requiring an ambulance, firefighting or rescue response. For feedback, complaints or lost-property enquiries, call 1192.",
              ],
              [
                "What should I tell the call operator?",
                "Give your exact location, a nearby landmark and a clear description of what happened. Answer the operator’s questions and follow their instructions.",
              ],
              [
                "Is the emergency service available at night?",
                "Yes. Rescue 1122 emergency services are available 24 hours a day, seven days a week.",
              ],
            ].map(([q, a], i) => (
              <div className="faq-item" key={q}>
                <button
                  onClick={() => setFaq(faq === i ? null : i)}
                  aria-expanded={faq === i}
                  aria-controls={"answer-" + i}
                >
                  {q}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                <p id={"answer-" + i} hidden={faq !== i}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="emergency-band">
          <div className="wrap">
            <div className="emergency-symbol">
              <Phone size={32} />
            </div>
            <div>
              <span>IN AN EMERGENCY, DON’T WAIT.</span>
              <h2>Help starts with a call.</h2>
            </div>
            <a href="tel:1122">
              1122 <ArrowUpRight size={44} />
            </a>
          </div>
        </section>
      </main>
      <footer id="contact">
        <div className="wrap footer-grid">
          <div>
            <a className="brand" href="#">
              <img src="/images/logo.png" alt="" />
              <div>
                RESCUE <b>1122</b>
                <small>EMERGENCY SERVICES · PUNJAB</small>
              </div>
            </a>
            <p>
              Saving lives. Changing minds.
              <br />
              Building safer communities.
            </p>
          </div>
          <div>
            <h3>Get in touch</h3>
            <a href="mailto:pio@rescue.gov.pk">
              <Mail size={16} /> pio@rescue.gov.pk
            </a>
            <p className="address">
              <MapPin size={17} />
              <span>
                Emergency Services Headquarters,
                <br />
                Thokhar Niaz Baig, Lahore, Pakistan
              </span>
            </p>
          </div>
          <div>
            <h3>Useful links</h3>
            <a href="#services">
              Our services <ArrowUpRight size={14} />
            </a>
            <a href="#community">
              Training & volunteering <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.rescue.gov.pk/"
              target="_blank"
              rel="noreferrer"
            >
              Official website <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="feedback">
            <span>FEEDBACK & COMPLAINTS</span>
            <a href="tel:1192">
              1192 <ArrowUpRight size={24} />
            </a>
            <p>We’re listening. Help us serve you better.</p>
          </div>
        </div>
        <PhotoCredits />
        <div className="wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} Emergency Services Department · Punjab
          </span>
          <span>UI redesign concept · Built for the people.</span>
          <a href="#">Back to top ↑</a>
        </div>
      </footer>
      {selected !== null && (
        <ServiceViewer
          index={selected}
          onChange={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <MotionProvider>
    <App />
  </MotionProvider>,
);
