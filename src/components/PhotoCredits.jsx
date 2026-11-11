import React from "react";
import { ArrowUpRight } from "lucide-react";
import images from "../image-manifest.json";

export default function PhotoCredits() {
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
