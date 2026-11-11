import React from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import PhotoCredits from "./PhotoCredits.jsx";

export default function SiteFooter() {
  return (
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
          <a href="https://www.rescue.gov.pk/" target="_blank" rel="noreferrer">
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
        <span>Rescue 1122 · Independent portfolio project</span>
        <span>UI redesign concept · No official affiliation.</span>
        <a href="#">Back to top ↑</a>
      </div>
    </footer>
  );
}
