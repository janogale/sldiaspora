import React from "react";
import {
  Users,
  Heart,
  Handshake,
  HandHeart,
  MessageCircle,
  Shield,
} from "lucide-react";

const CoreValues = () => {
  const values = [
    {
      icon: <Users size={40} />,
      title: "Solidarity",
      delay: ".2s",
    },
    {
      icon: <Heart size={40} />,
      title: "Commitment",
      delay: ".3s",
    },
    {
      icon: <Handshake size={40} />,
      title: "Teamwork",
      delay: ".4s",
    },
    {
      icon: <HandHeart size={40} />,
      title: "Volunteerism",
      delay: ".5s",
    },
    {
      icon: <MessageCircle size={40} />,
      title: "Communication",
      delay: ".6s",
    },
    {
      icon: <Shield size={40} />,
      title: "Responsibility",
      delay: ".7s",
    },
  ];

  return (
    <section className="section-space" style={{ background: "#ffffff" }}>
      <div className="container">
        <div className="row mb-50">
          <div className="col-12 text-center">
            <div className="section__title-wrapper">
              <h6 className="section__title-wrapper-black-subtitle mb-10">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_values)">
                    <path
                      d="M19.299 2.66986C19.2609 2.59008 19.1926 2.52868 19.1093 2.49911L12.195 0.0581985C12.0215 -0.00317634 11.831 0.0879901 11.7697 0.26149L10.199 4.70581H9.51204V3.57248C9.51202 3.41941 9.47686 3.26838 9.40926 3.13104C9.34166 2.9937 9.24343 2.87372 9.12214 2.78033C9.00085 2.68695 8.85974 2.62266 8.70968 2.59242C8.55962 2.56217 8.40462 2.56679 8.25663 2.6059L0.24744 4.7169V4.7229C0.176847 4.74064 0.114146 4.78133 0.0691834 4.83857C0.0242205 4.89581 -0.000457842 4.96636 -0.000976562 5.03915L-0.000976562 19.0391C-0.000976562 19.5914 0.446773 20.0391 0.999021 20.0391H10.3323C10.8846 20.0391 11.3323 19.5914 11.3323 19.0391V16.0145L14.0057 16.9582C14.1793 17.0194 14.3697 16.9285 14.431 16.7548L19.3133 2.92457C19.3278 2.88326 19.334 2.83949 19.3315 2.79578C19.329 2.75208 19.318 2.70928 19.2989 2.66986H19.299Z"
                      fill="#034833"
                    />
                  </g>
                </svg>
                Our Values
              </h6>
              <h2 className="section__title-wrapper-title">OUR CORE VALUES</h2>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {values.map((value, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div
                className="wow fadeInUp animated"
                data-wow-delay={value.delay}
                style={{
                  background:
                    "linear-gradient(135deg, #f8faf9 0%, #ffffff 100%)",
                  borderRadius: "16px",
                  padding: "40px 30px",
                  textAlign: "center",
                  border: "2px solid rgba(0, 109, 33, 0.1)",
                  transition: "all 0.3s ease",
                  height: "100%",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.borderColor = "#006d21";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0, 109, 33, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(0, 109, 33, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "linear-gradient(135deg, #006d21 0%, #009b2e 100%)",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "#ffffff",
                  }}
                >
                  {value.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: 0,
                  }}
                >
                  {value.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
