import React from "react";
import { ArrowRight, ArrowUpRight, Phone, X } from "lucide-react";
import { services, Photo } from "../content.jsx";
import { useDialog } from "../hooks/useDialog.js";

export default function ServiceViewer({ index, onChange, onClose }) {
  const { dialog, close } = useDialog({ onClose });
  const service = services[index];
  const step = (direction) =>
    onChange((index + direction + services.length) % services.length);
  return (
    <dialog
      className="service-viewer"
      ref={dialog}
      aria-labelledby="service-title"
      onCancel={(event) => {
        event.preventDefault();
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
      <div className="viewer-shell">
        <button
          className="viewer-close"
          onClick={close}
          aria-label="Close service details"
        >
          <X size={20} />
        </button>
        <div className="viewer-photo">
          <Photo
            name={service.image}
            alt={service.name + " — Rescue 1122"}
            sizes="(max-width: 700px) 90vw, 540px"
          />
          <span className="viewer-photo-label">RESCUE 1122 / OUR SERVICES</span>
        </div>
        <div className="viewer-copy">
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
