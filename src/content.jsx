import React from "react";
import {
  HeartPulse,
  Flame,
  Bike,
  Waves,
  LifeBuoy,
  HandHeart,
  PawPrint,
  Building2,
  ShieldCheck,
} from "lucide-react";
import images from "./image-manifest.json";
export const services = [
  {
    name: "Ambulance service",
    text: "Expert care, from the first response to the hospital.",
    image: "ambulance",
    icon: HeartPulse,
    detail:
      "Emergency medical response and patient transport. Call 1122 and share your exact location and the nature of the emergency.",
  },
  {
    name: "Fire & rescue",
    text: "Trained to respond when every second matters.",
    image: "fire",
    icon: Flame,
    detail:
      "Firefighting, technical rescue and response to hazardous incidents. Move to a safe location and call 1122.",
  },
  {
    name: "Motorbike rescue",
    text: "Reaching you through the busiest streets.",
    image: "motorbike",
    icon: Bike,
    detail:
      "Motorbike responders bring emergency care through congested streets while ambulance support is coordinated.",
  },
  {
    name: "Water rescue",
    text: "Specialist response, on and beneath the water.",
    image: "water",
    icon: Waves,
    detail:
      "Specialist teams respond to water and flood emergencies. Stay away from floodwater and call 1122 for rescue assistance.",
  },
  {
    name: "Technical rescue",
    text: "Skilled teams. Complex situations. One mission.",
    image: "rescue",
    icon: LifeBuoy,
    detail:
      "Specialized rescue operations for road crashes, building collapse and other complex emergencies.",
  },
  {
    name: "Community safety",
    text: "Building a safer Punjab, together.",
    image: "community",
    icon: HandHeart,
    detail:
      "Community education and practical training help citizens learn lifesaving skills. Explore the training programmes below.",
  },
  {
    name: "Animal rescue",
    text: "Compassionate help for animals in distress.",
    image: "animal",
    icon: PawPrint,
    detail:
      "Rescue support for animals trapped or in dangerous situations. Call 1122 to describe the incident and location.",
  },
  {
    name: "Building safety",
    text: "Safer spaces start with prevention.",
    image: "building",
    icon: Building2,
    detail:
      "Building safety guidance supports prevention and safer communities. Visit the official Rescue website for regulations and guidance.",
  },
  {
    name: "Disaster response",
    text: "Coordinated care through complex emergencies.",
    image: "flood",
    icon: ShieldCheck,
    detail:
      "Rescue 1122 brings medical response, firefighting and specialist rescue together for emergencies including floods and building collapse. Call 1122 for emergency assistance.",
  },
  {
    name: "Emergency rescue training",
    text: "Preparation, practice and professional teamwork.",
    image: "rescue",
    icon: LifeBuoy,
    detail:
      "Training and preparedness support professional emergency response. Visit the official Rescue 1122 website for Emergency Services Academy information; community CPR and volunteer programmes are linked on this page.",
  },
];

export function Photo({
  name,
  alt = "",
  className = "",
  priority = false,
  sizes = "(max-width: 560px) 90vw, 50vw",
}) {
  const image = images[name];
  return (
    <img
      className={className}
      src={"/images/" + name + ".webp"}
      srcSet={image.variants.map((v) => `${v.src} ${v.width}w`).join(", ")}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
