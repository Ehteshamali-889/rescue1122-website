import React, { useState } from "react";
import { ArrowUpRight, ShieldCheck, Menu, X, Phone } from "lucide-react";

export default function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const closeMenu = () => setMenu(false);
  return (
    <>
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
      <header
        className="documentary-nav"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu) {
            closeMenu();
            event.currentTarget.querySelector(".menu-button")?.focus();
          }
        }}
      >
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
    </>
  );
}
