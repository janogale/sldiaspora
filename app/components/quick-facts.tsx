import React from "react";
import { Flag, MapPin, Building2, Map, Waves, Languages } from "lucide-react";

const QuickFacts = () => {
  const facts = [
    {
      icon: Flag,
      label: "Independence",
      value: "June 26, 1960",
    },
    {
      icon: MapPin,
      label: "Capital",
      value: "Hargeisa",
    },
    {
      icon: Building2,
      label: "Government",
      value: "Presidential Republic",
    },
    {
      icon: Map,
      label: "Area",
      value: "176,119 km²",
    },
    {
      icon: Waves,
      label: "Coastline",
      value: "850 km",
    },
    {
      icon: Languages,
      label: "Languages",
      value: "Somali, Arabic, English",
    },
  ];

  return (
    <section className="quick-facts__area section-space gray-bg">
      <div className="container">
        <div className="section-title2 mb-60 text-center">
          <h2
            className="section-title2__wrapper-title wow fadeInLeft animated"
            data-wow-delay=".3s"
          >
            ABOUT SOMALILAND - QUICK FACTS
          </h2>
        </div>
        <div className="row">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <div
                  className="quick-facts__card p-4 bg-white rounded shadow-sm text-center h-100 wow fadeInUp animated"
                  data-wow-delay={`.${index + 2}s`}
                >
                  <div className="quick-facts__icon mb-3 d-flex justify-content-center">
                    <Icon size={48} color="#006d21" />
                  </div>
                  <h4
                    className="quick-facts__label mb-2"
                    style={{ fontSize: "1.1rem", color: "#666" }}
                  >
                    {fact.label}
                  </h4>
                  <p
                    className="quick-facts__value mb-0"
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      color: "#006d21",
                    }}
                  >
                    {fact.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickFacts;
