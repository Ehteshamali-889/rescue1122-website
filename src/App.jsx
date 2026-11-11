import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Phone,
  ShieldCheck,
  HeartPulse,
  HandHeart,
  Building2,
  Plus,
  Minus,
} from "lucide-react";
import { Photo } from "./content.jsx";
import { useMotion } from "./context/MotionContext.jsx";
import {
  DocumentaryHero,
  SpatialGallery,
  FrontlineChapters,
  ServiceExplorer,
} from "./documentary.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ServiceViewer from "./components/ServiceViewer.jsx";

export default function App() {
  const { motion } = useMotion();
  const [selected, setSelected] = useState(null);
  const [faq, setFaq] = useState(0);
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
      <SiteHeader />
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
      <SiteFooter />
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
