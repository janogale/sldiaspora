import React from "react";

const QuickStats = () => {
  const stats = [
    { label: "Diaspora Population", value: "1M+" },
    { label: "Remittances", value: "$1.3B" },
    { label: "Priority Sectors", value: "6+" },
  ];

  return (
    <section className="quick-stats__area section-space-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div
              className="quick-stats__wrapper d-flex justify-content-around align-items-center flex-wrap gap-4 p-4 rounded"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="quick-stats__item text-center">
                  <h3
                    className="quick-stats__value mb-2"
                    style={{
                      color: "#006d21",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {stat.value}
                  </h3>
                  <p
                    className="quick-stats__label mb-0"
                    style={{ fontSize: "1rem", color: "#666" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
