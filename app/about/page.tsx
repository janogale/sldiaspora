"use client";
import BreadCamp from "../components/BreadCamp";
import CoreValues from "../components/core-values";

import DepartmentHierarchy from "../components/department-hierarchy";
import Header from "../components/header";
import IntroductionSection from "../components/introduction-section";
import StrategicObjectives from "../components/strategic-objectives";

export default function AboutUs() {
  return (
    <>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="About Us" marginBottom="0rem" />
      <IntroductionSection />

      <div className="about-compact-sections">
        <section
          className="overview__area custom-width section-space bottom p-relative border overflow-hidden gray-bg"
          style={{ paddingTop: "2rem" }}
        >
          <div
            className="overview__bg-img"
            style={{
              backgroundImage:
                "url('/assets/imgs/process-over-view/process-over-view3-bg-img.png')",
            }}
          ></div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title2 mb-20 text-center">
                  <span
                    className="section-title2__wrapper-subtitle wow fadeInLeft animated"
                    data-wow-delay=".2s"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#006d21",
                    }}
                  >
                    <svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_vision)">
                        <path
                          d="M19.299 2.66986C19.2609 2.59008 19.1926 2.52868 19.1093 2.49911L12.195 0.0581985C12.0215 -0.00317634 11.831 0.0879901 11.7697 0.26149L10.199 4.70581H9.51204V3.57248C9.51202 3.41941 9.47686 3.26838 9.40926 3.13104C9.34166 2.9937 9.24343 2.87372 9.12214 2.78033C9.00085 2.68695 8.85974 2.62266 8.70968 2.59242C8.55962 2.56217 8.40462 2.56679 8.25663 2.6059L0.24744 4.7169V4.7229C0.176847 4.74064 0.114146 4.78133 0.0691834 4.83857C0.0242205 4.89581 -0.000457842 4.96636 -0.000976562 5.03915L-0.000976562 19.0391C-0.000976562 19.5914 0.446773 20.0391 0.999021 20.0391H10.3323C10.8846 20.0391 11.3323 19.5914 11.3323 19.0391V16.0145L14.0057 16.9582C14.1793 17.0194 14.3697 16.9285 14.431 16.7548L19.3133 2.92457C19.3278 2.88326 19.334 2.83949 19.3315 2.79578C19.329 2.75208 19.318 2.70928 19.2989 2.66986H19.299Z"
                          fill="#034833"
                        />
                      </g>
                    </svg>
                    Our Direction
                    <img
                      style={{ width: "52px", height: "10px" }}
                      src="./assets/imgs/shape2.svg"
                      alt=""
                    />
                  </span>
                  <h2
                    className="section-title2__wrapper-title wow fadeInLeft animated"
                    data-wow-delay=".3s"
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginTop: "12px",
                    }}
                  >
                    OUR VISION & MISSION
                  </h2>
                </div>
              </div>
            </div>
            <div className="row mb-minus-30">
              <div className="col-12 col-md-6">
                <div
                  className="overview__item mb-30 wow fadeInLeft animated"
                  data-wow-delay=".3s"
                >
                  <div className="overview__icon p-relative">
                    <div className="overview__icon-number">
                      <span>01</span>
                    </div>
                  </div>
                  <div className="overview__text">
                    <h5 className="overview__text-title mb-20">
                      Vision Statement
                    </h5>
                    <p>
                      To serve as the bridge between the Somaliland Diaspora
                      community and the home country for mutually beneficial
                      relationships in socioeconomic development and promotion of
                      Somaliland&apos;s positive national image abroad and
                      international standing.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div
                  className="overview__item mb-30 wow fadeInLeft animated"
                  data-wow-delay=".4s"
                >
                  <div className="overview__icon p-relative">
                    <div className="overview__icon-number">
                      <span>02</span>
                    </div>
                  </div>
                  <div className="overview__text">
                    <h5 className="overview__text-title mb-20">
                      Mission Statement
                    </h5>
                    <p>
                      To effectively mobilize and utilize the resources of the
                      Somaliland diaspora, promoting the country&apos;s economic,
                      social, technological, and political development by creating
                      an enabling environment for deeper and sustainable diaspora
                      engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <CoreValues />
        <StrategicObjectives />

        <DepartmentHierarchy />
      </div>

      <style jsx global>{`
        .about-compact-sections .section-space {
          padding-top: 2rem !important;
          padding-bottom: 2rem !important;
        }

        .about-compact-sections .section-title2__wrapper-title,
        .about-compact-sections .section__title-wrapper-title {
          font-size: 2.8rem !important;
          line-height: 1.3 !important;
        }

        .about-compact-sections .overview__text-title,
        .about-compact-sections h3,
        .about-compact-sections h4,
        .about-compact-sections h5 {
          font-size: 1.6rem !important;
          line-height: 1.4 !important;
        }

        .about-compact-sections .department-hierarchy-section {
          margin-top: 0 !important;
          padding-top: 2rem !important;
        }

        @media (max-width: 767px) {
          .about-compact-sections .section-title2__wrapper-title,
          .about-compact-sections .section__title-wrapper-title {
            font-size: 1.9rem !important;
            line-height: 1.3 !important;
          }

          .about-compact-sections .overview__item {
            padding: 1rem !important;
          }

          .about-compact-sections .overview__text-title,
          .about-compact-sections h3,
          .about-compact-sections h4,
          .about-compact-sections h5 {
            font-size: 1.25rem !important;
            margin-bottom: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
}
