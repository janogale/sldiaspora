import React from "react";
import { Quote } from "lucide-react";

const DirectorMessage = () => {
  return (
    <section
      className="director-message__area section-space"
      style={{
        background: "linear-gradient(135deg, #f8faf9 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: "linear-gradient(135deg, #006d21 0%, #50FEA8 100%)",
          opacity: 0.05,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background: "linear-gradient(135deg, #006d21 0%, #50FEA8 100%)",
          opacity: 0.03,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row align-items-center g-5">
          {/* Director Photo Column */}
          <div
            className="col-lg-4 wow fadeInLeft animated"
            data-wow-delay=".2s"
          >
            <div
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0, 109, 33, 0.15)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(0, 109, 33, 0.4) 100%)",
                  zIndex: 1,
                }}
              />
              <img
                src="/director.png"
                alt="Director-General"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "24px",
                  zIndex: 2,
                  background:
                    "linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
                }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    marginBottom: "4px",
                  }}
                >
                  Ougbad Nassir Omar
                </h3>
                <p
                  style={{
                    color: "#50FEA8",
                    fontSize: "1.2rem",
                    lineHeight: "1.4",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  Director, Diaspora Department Ministry of Foreign Affairs and
                  International Cooperation Republic of Somaliland
                </p>
              </div>
            </div>
          </div>

          {/* Message Content Column */}
          <div
            className="col-lg-8 wow fadeInRight animated"
            data-wow-delay=".3s"
          >
            <div style={{ position: "relative" }}>
              {/* Quote Icon */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "70px",
                  height: "70px",
                  background:
                    "linear-gradient(135deg, #006d21 0%, #009b2e 100%)",
                  borderRadius: "20px",
                  marginBottom: "24px",
                  boxShadow: "0 8px 24px rgba(0, 109, 33, 0.2)",
                }}
              >
                <Quote size={36} color="#ffffff" strokeWidth={2.5} />
              </div>

              {/* Welcome Title with Flag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    lineHeight: "1.2",
                    margin: 0,
                  }}
                >
                  Welcome to the{" "}
                  <span style={{ color: "#006d21" }}>
                    Somaliland Diaspora Department
                  </span>
                </h2>
                {/* Somaliland Flag */}
              </div>

              {/* Message Text */}
              <div
                style={{
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  color: "#555",
                  marginBottom: "24px",
                }}
              >
                <p style={{ marginBottom: "20px" }}>
                  Dear Members of the Somaliland Diaspora Community,
                </p>
                <p style={{ marginBottom: "20px" }}>
                  Welcome to the Diaspora Service Guidebook, created by the
                  Diaspora Department to serve as your essential resource and
                  connection to Somaliland. This guide was developed to support
                  and strengthen the vital relationship between Somaliland and
                  its global diaspora community, recognizing your powerful role
                  in the country’s social, economic, and political development.
                </p>
                <p style={{ marginBottom: "20px" }}>
                  Your contributions are central to Somaliland’s progress, and
                  this guide reaffirms our commitment to facilitating your
                  involvement and maximizing your impact. We invite you to
                  explore the guide, connect with our services, and join us in
                  building a stronger, united Somaliland.
                </p>
                <p
                  style={{
                    marginBottom: 0,
                    fontWeight: "600",
                    color: "#006d21",
                  }}
                >
                  Thank you for your ongoing dedication
                </p>
              </div>

              {/* Signature */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  paddingTop: "24px",
                  borderTop: "2px solid rgba(0, 109, 33, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    alignItems: "baseline",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2rem",
                      color: "#006d21",
                      fontWeight: "400",
                    }}
                  >
                    Ougbad Nassir Omar
                  </div>

                  <div>
                    <img
                      src="/signature-ugbad.png"
                      alt="signature of Ougbad Nassir Omar"
                      style={{
                        objectFit: "cover",
                        width: "60%",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;
