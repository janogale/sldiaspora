import React from "react";

const IntroductionSection = () => {
  return (
    <section
      className="section-space overflow-hidden"
      style={{ background: "#f8faf9" }}
    >
      <div className="container">
        <div className="row align-items-center g-5">
          <div
            className="col-lg-5 wow fadeInLeft animated"
            data-wow-delay=".2s"
          >
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0, 109, 33, 0.1)",
              }}
            >
              <img
                src="/assets/imgs/about/about-big-img.png"
                alt="Diaspora community"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
          </div>

          <div
            className="col-lg-7 wow fadeInRight animated"
            data-wow-delay=".3s"
          >
            <div className="section__title-wrapper mb-20">
              <h6 className="section__title-wrapper-black-subtitle mb-10">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_intro)">
                    <path
                      d="M19.299 2.66986C19.2609 2.59008 19.1926 2.52868 19.1093 2.49911L12.195 0.0581985C12.0215 -0.00317634 11.831 0.0879901 11.7697 0.26149L10.199 4.70581H9.51204V3.57248C9.51202 3.41941 9.47686 3.26838 9.40926 3.13104C9.34166 2.9937 9.24343 2.87372 9.12214 2.78033C9.00085 2.68695 8.85974 2.62266 8.70968 2.59242C8.55962 2.56217 8.40462 2.56679 8.25663 2.6059L0.24744 4.7169V4.7229C0.176847 4.74064 0.114146 4.78133 0.0691834 4.83857C0.0242205 4.89581 -0.000457842 4.96636 -0.000976562 5.03915L-0.000976562 19.0391C-0.000976562 19.5914 0.446773 20.0391 0.999021 20.0391H10.3323C10.8846 20.0391 11.3323 19.5914 11.3323 19.0391V16.0145L14.0057 16.9582C14.1793 17.0194 14.3697 16.9285 14.431 16.7548L19.3133 2.92457C19.3278 2.88326 19.334 2.83949 19.3315 2.79578C19.329 2.75208 19.318 2.70928 19.2989 2.66986H19.299Z"
                      fill="#034833"
                    />
                  </g>
                </svg>
                Introduction
              </h6>
              <h2 className="section__title-wrapper-title">
                About the Diaspora Department
              </h2>
            </div>

            <div
              style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#555" }}
            >
              <p style={{ marginBottom: "20px" }}>
                The Republic of Somaliland has a vibrant diaspora of over one
                million people across the UK, Europe, North America, Middle
                East, East Africa, and Australia.
              </p>

              <p style={{ marginBottom: "20px" }}>
                Our diaspora contributes an estimated{" "}
                <strong style={{ color: "#006d21" }}>
                  $1.3 billion annually
                </strong>{" "}
                in remittances (45% of GDP), driving private sector growth
                through investments in real estate, hospitality, education,
                healthcare, and technology.
              </p>

              <p style={{ marginBottom: 0 }}>
                Established in <strong>August 2010</strong> within the Ministry
                of Foreign Affairs & International Cooperation (MoFAIC), the
                Diaspora Department works to fully integrate the diaspora into
                Somaliland&apos;s development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
