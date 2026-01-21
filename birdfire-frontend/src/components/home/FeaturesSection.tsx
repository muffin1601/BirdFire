"use client";

import {
  Leaf,
  Wrench,
  Recycle,
  Lightbulb
} from "lucide-react";

import "./FeaturesSection.css";

const features = [
  {
    icon: Leaf,
    title: "Eco-friendly Materials",
    description:
      "We craft our furniture using responsibly sourced, environmentally friendly materials."
  },
  {
    icon: Wrench,
    title: "Effortless Assembly",
    description:
      "Thoughtfully designed for quick setup, requiring minimal effort and no extra tools."
  },
  {
    icon: Recycle,
    title: "Giving Back To Nature",
    description:
      "Every purchase contributes to reforestation efforts, helping restore green spaces."
  },
  {
    icon: Lightbulb,
    title: "Sustainable Production",
    description:
      "Dedicated to reducing waste and promoting eco-conscious manufacturing practices."
  }
];

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-grid">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <Icon size={30} strokeWidth={2} />
              </div>
              <h4 className="feature-title">{item.title}</h4>
              <p className="feature-desc">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
