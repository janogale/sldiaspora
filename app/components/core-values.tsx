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
      icon: <Users size={30} />,
      title: "Solidarity",
      delay: ".2s",
    },
    {
      icon: <Heart size={30} />,
      title: "Commitment",
      delay: ".3s",
    },
    {
      icon: <Handshake size={30} />,
      title: "Teamwork",
      delay: ".4s",
    },
    {
      icon: <HandHeart size={30} />,
      title: "Volunteerism",
      delay: ".5s",
    },
    {
      icon: <MessageCircle size={30} />,
      title: "Communication",
      delay: ".6s",
    },
    {
      icon: <Shield size={30} />,
      title: "Responsibility",
      delay: ".7s",
    },
  ];

  return (
    <section className="section-space core-values-section">
      <div className="container">
        <div className="row mb-35">
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

        <div className="row core-values-grid">
          {values.map((value, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 mb-3">
              <div
                className="wow fadeInUp animated core-value-card"
                data-wow-delay={value.delay}
              >
                <span className="core-value-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="core-value-icon">
                  {value.icon}
                </div>
                <h3 className="core-value-title">{value.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .core-values-section {
          background: var(--rr-common-white);
          padding-top: 56px !important;
          padding-bottom: 56px !important;
        }

        .core-values-grid {
          margin-bottom: -0.25rem;
        }

        .core-value-card {
          position: relative;
          height: 100%;
          padding: 12px 14px;
          text-align: left;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(
            120deg,
            rgba(241, 245, 235, 0.55) 0%,
            var(--rr-common-white) 100%
          );
          border: 1px solid rgba(3, 72, 51, 0.12);
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            border-color 0.3s ease;
          box-shadow: 0 6px 14px rgba(3, 72, 51, 0.06);
          overflow: hidden;
        }

        .core-value-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(
            180deg,
            var(--rr-theme-primary) 0%,
            var(--rr-heading-primary) 100%
          );
        }

        .core-value-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 109, 33, 0.28);
          box-shadow: 0 12px 22px rgba(3, 72, 51, 0.14);
        }

        .core-value-number {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          font-size: 0.68rem;
          font-weight: var(--rr-fw-bold);
          letter-spacing: 0.08em;
          color: rgba(3, 72, 51, 0.32);
        }

        .core-value-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--rr-common-white);
          background: linear-gradient(
            135deg,
            var(--rr-theme-primary) 0%,
            var(--rr-heading-primary) 100%
          );
          box-shadow: 0 6px 12px rgba(3, 72, 51, 0.18);
          transition: transform 0.3s ease;
        }

        .core-value-card:hover .core-value-icon {
          transform: scale(1.04);
        }

        .core-value-title {
          margin: 0;
          font-size: 1.02rem;
          line-height: 1.3;
          color: var(--rr-heading-primary);
          font-weight: var(--rr-fw-bold);
          padding-right: 22px;
        }

        @media (max-width: 767px) {
          .core-values-section {
            padding-top: 42px !important;
            padding-bottom: 42px !important;
          }

          .core-value-card {
            padding: 10px 12px;
            border-radius: 10px;
            gap: 10px;
          }

          .core-value-icon {
            width: 34px;
            height: 34px;
            min-width: 34px;
            border-radius: 8px;
          }

          .core-value-title {
            font-size: 0.95rem;
            line-height: 1.25;
            padding-right: 18px;
          }

          .core-value-number {
            right: 8px;
            font-size: 0.62rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CoreValues;
