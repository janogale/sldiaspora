"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";

function Page() {
  const [selectedGuide, setSelectedGuide] = React.useState<number>(1);
  const taxDoc = {
    title: "Tax Rate Document",
    description:
      "Reference this document for common tax rates and standard tax categories used in Somaliland.",
    filePath: "/doc/Common%20Tax%20Rates%20in%20Somaliland.docx.pdf",
  };

  const investmentDoc = {
    title: "Investment Guide Document",
    description:
      "Review this investment document for current opportunities, sectors, and strategic guidance for investors in Somaliland.",
    filePath: "/doc/Invest%20in%20Somaliland%202026.pdf",
  };

  const data = [
    {
      id: 5,
      title: "Passport Application",
      desc: [
        {
          body: "A Somaliland passport is issued only to individuals who are recognized as citizens of Somaliland and can prove their citizenship. Applicants must also meet the following requirements:",
        },
      ],
      items: [
        {
          title:
            "Provide your National ID for proof of nationality.",
          desc: "",
        },
        {
          title:
            "Obtain a clearance letter from the Criminal Investigation Department (CID) confirming that they have no criminal record.",
          desc: "",
        },
        {
          title:
            "Obtain a verification letter from the District Attorney’s Office confirming that they have not committed any crime.",
          desc: "",
        },
        {
          title: "Provide three (3) recent passport-sized photographs.",
          desc: "",
        },
        { title: "Submit a completed Passport Application Form.", desc: "" },
      ],

      image: "/passport.png",
    },
    {
      id: 1,
      title: "Voter Registration",
      desc: [
        {
          body: "This document outlines a comprehensive civil and voter registration process to be implemented by Somaliland's National Electoral Commission (NEC). The registration is a joint effort conducted by teams comprising staff from the NEC, the Ministry of Internal Affairs (MINT), and the Appeals Court (AC).",
        },
        {
          body: "The process is rolled out region by region and consists of three main phases:",
        },
      ],
      items: [
        {
          title:
            "A 25-day kick-off period for public information and distribution of forms at district offices.",
          desc: "",
        },
        {
          title:
            "A 5-day core registration period at designated registration centres, where eligible citizens register in person. Officials verify eligibility and then use electronic kits to capture personal data, a digital photograph, and fingerprints. A civil ID card and a voter card are printed on the spot, laminated, and issued immediately. Indelible ink is applied to a finger to prevent immediate duplicate registration.",
          desc: "",
        },
        {
          title:
            "A 15-day supplemental registration period at district offices for those who missed the core registration.",
          desc: "",
        },
      ],
      image: "/vote.jpg",
    },
    {
      id: 2,
      title: "National ID Card",
      desc: [
        {
          body: "Districts facilitate issuance of national identity card. They perform the initial screening and verification process to ensure that only eligible citizens are granted the national ID card. Now, the districts can carry out this function by online, and if you want, you can apply in person.",
        },
        { body: "Steps to apply for a new National ID card are:" },
      ],
      items: [
        {
          title: "Login or register an account as an applicant",
          desc: "",
        },
        {
          title:
            "From your dashboard select apply new National ID. Fill out the application form and submit it. The technical officers at the Local government will review and verify the application.",
          desc: "",
        },
        {
          title:
            "After approval, an invoice will be generated and a notification for payment shall be sent via SMS or email. Open the invoice from your dashboard and select Pay Now.",
          desc: "",
        },
        {
          title:
            "Upon successful payment, the application will proceed to the Director of Tax for approval/revert.",
          desc: "",
        },
        { title: "Download and print your national ID card form ", desc: "" },
        {
          title:
            "Ministry of Interior issues the National ID and the applicant shall collect the ID in person from the district’s civic registration department",
          desc: "",
        },
      ],
      image: "/id.jpg",
    },
    {
      id: 3,
      title: "Investment Guidelines",
      desc: [
        {
          body: "Somaliland is a land of unexploited potential and emerging opportunities. Strategically located in the Horn of Africa, with an 850-kilometer coastline along the Gulf of Aden, it is a natural gateway to African and Middle Eastern markets. Blessed with abundant natural resources, a resilient and youthful population, and a deep-rooted cultural heritage, Somaliland offers a stable and investor-friendly environment.",
        },
        {
          body: "The government is prioritizing key growth sectors: agriculture, livestock, fisheries, technology, trade & logistics, mining, and renewable energy, each supported by a government committed to economic transformation and sustainable development. With competitive business policies, improving infrastructure, and a growing appetite for innovation, Somaliland stands ready to welcome forward-thinking investors and partners. We invite you to explore the opportunities that await in Somaliland, where tradition meets ambition and investment drives impact.",
        },
      ],
      image: "/investment.jpg",
    },
    {
      id: 4,
      title: "Tax Regulations",
      desc: [
        {
          body: "The Somaliland tax system, administered by the Ministry of Finance, includes several key types of taxes:",
        },
      ],
      items: [
        {
          title:
            "Income Tax: A tax on the income of individuals and businesses, including:",
          desc: "Business Profit Tax: Tax on company profits",
        },
        {
          title:
            "Indirect Taxes: Taxes on consumption and transactions, primarily",
          desc: "Sales Tax: A general tax applied to the sale of goods and services.",
        },
        {
          title: "Other Taxes: This category includes:",
          desc: "Presumptive Tax: A simplified tax for small businesses based on an estimate of their earnings rather than detailed accounts.",
        },
      ],
      image: "/taxes.jpg",
    },
    {
      id: 6,
      title: "Key Links for Diaspora",
      desc: [
        {
          body: "Access essential government services and resources through these official portals. These links provide direct access to various services including business registration, tax services, document authentication, and emergency contacts.",
        },
      ],
      items: [
        {
          title: "Visit Somaliland Government Portal",
          desc: '<a href="https://www.govsomaliland.org/" target="_blank" rel="noopener noreferrer">https://www.govsomaliland.org/</a>',
        },
        {
          title: "Apply for a Trade License",
          desc: '<a href="https://som.slmof.org/tacriifadda-liisanka-ganacsiga/" target="_blank" rel="noopener noreferrer">https://som.slmof.org/tacriifadda-liisanka-ganacsiga/</a>',
        },
        {
          title: "View Somaliland Tax Tariffs",
          desc: '<a href="https://som.slmof.org/buug-tacriifada/" target="_blank" rel="noopener noreferrer">https://som.slmof.org/buug-tacriifada/</a>',
        },
        {
          title: "Register a Business in Somaliland",
          desc: '<a href="https://mott.govsomaliland.org/article/steps-business-registration" target="_blank" rel="noopener noreferrer">https://mott.govsomaliland.org/article/steps-business-registration</a>',
        },
        {
          title: "Register a New Local NGO",
          desc: '<a href="https://mopnd.govsomaliland.org/articles/new-registration-2" target="_blank" rel="noopener noreferrer">https://mopnd.govsomaliland.org/articles/new-registration-2</a>',
        },
        {
          title: "Request a Tax Exemption in Somaliland",
          desc: '<a href="https://som.slmof.org/cashuur-dhaaf/" target="_blank" rel="noopener noreferrer">https://som.slmof.org/cashuur-dhaaf/</a>',
        },
        {
          title: "Submit a Tax-Related Complaint",
          desc: '<a href="https://som.slmof.org/cabashooyin/" target="_blank" rel="noopener noreferrer">https://som.slmof.org/cabashooyin/</a>',
        },
        {
          title: "Document Authentication Service",
          desc: "Contact the Diaspora Department for document authentication services",
        },
        {
          title: "Contact SL Diaspora Associations & Networks",
          desc: "Directory of contacts will be available soon",
        },
        {
          title: "Contact SL Missions Abroad",
          desc: "Directory of contacts will be available soon",
        },
        {
          title: "Contact the Somaliland Police",
          desc: '<a href="https://police.govsomaliland.org/article/contact-us#0" target="_blank" rel="noopener noreferrer">https://police.govsomaliland.org/article/contact-us</a>',
        },
        {
          title: "Reach out to Somaliland Fire Safety and Rescue Services",
          desc: '<a href="https://fire.govsomaliland.org/article/contact-us" target="_blank" rel="noopener noreferrer">https://fire.govsomaliland.org/article/contact-us</a>',
        },
      ],
      image: "/help.jpg",
    },
  ];

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="Guidelines & Resources" />
      <section className="coaching-details__area pt-100 section-space-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="coaching-details__category">
                {" "}
                {data.map((item) => (
                  <Link
                    className={`mb-15 wow fadeInLeft animated${
                      selectedGuide === item.id ? " active" : ""
                    }`}
                    data-wow-delay=".2s"
                    href="#"
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedGuide(item.id);
                    }}
                  >
                    {item.title}
                    <span>
                      <i className="fa-solid fa-angle-right"></i>
                    </span>
                  </Link>
                ))}
              </div>
              {/* <div
                className="coaching-details__widget mt-30 wow fadeInLeft animated"
                data-wow-delay="1.6s"
              >
                <div className="coaching-details__widget-icon">
                  <svg
                    width="41"
                    height="42"
                    viewBox="0 0 41 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.9219 31.2344L38.0469 39.125C37.8125 40.2969 36.875 41.0781 35.7031 41.0781C16.0156 41 0 24.9844 0 5.29688C0 4.125 0.703125 3.1875 1.875 2.95312L9.76562 1.07812C10.8594 0.84375 12.0312 1.46875 12.5 2.48438L16.1719 11C16.5625 12.0156 16.3281 13.1875 15.4688 13.8125L11.25 17.25C13.9062 22.6406 18.2812 27.0156 23.75 29.6719L27.1875 25.4531C27.8125 24.6719 28.9844 24.3594 30 24.75L38.5156 28.4219C39.5312 28.9688 40.1562 30.1406 39.9219 31.2344Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="mt-15">GET TOUCH</h3>
                <a href="tel:+888123456765">(+888) 123 456 765</a>
              </div> */}
            </div>
            <div className="col-lg-8">
              {data
                .filter((guide) => guide.id === selectedGuide)
                .map((guide) => (
                  <>
                    <div className="coaching-details__content">
                      <div
                        className="coaching-details__content-top-img pb-20"
                        data-tilt
                      >
                        <Image
                          src={guide.image}
                          alt={guide.title}
                          width={900}
                          height={500}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <h2
                        className="coaching-details__content-title mb-30 wow fadeInLeft animated"
                        data-wow-delay=".3s"
                      >
                        {guide.title}
                      </h2>
                      {guide.desc.map((d, idx) => (
                        <p
                          className=" wow fadeInLeft animated"
                          data-wow-delay=".4s"
                          key={idx}
                        >
                          {d.body}{" "}
                        </p>
                      ))}
                    </div>
                    {guide.id === 6 ? (
                      // Grid layout for Key Links
                      <div className="row mt-30">
                        {guide.items?.map((item, idx) => {
                          const isGreen = idx % 2 === 0;
                          const bgColor = isGreen ? "#006D21" : "#DC143C";
                          const hoverShadow = isGreen
                            ? "0 8px 30px rgba(0,109,33,0.25)"
                            : "0 8px 30px rgba(220,20,60,0.25)";

                          return (
                            <div
                              key={idx}
                              className="col-md-6 mb-30 wow fadeInLeft animated"
                              data-wow-delay={`.${idx + 2}s`}
                            >
                              <div
                                style={{
                                  background: `linear-gradient(135deg, ${bgColor} 0%, ${
                                    isGreen ? "#004d17" : "#a01030"
                                  } 100%)`,
                                  padding: "25px",
                                  borderRadius: "12px",
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                  height: "100%",
                                  border: "none",
                                  transition:
                                    "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  position: "relative",
                                  overflow: "hidden",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(-8px) scale(1.02)";
                                  e.currentTarget.style.boxShadow = hoverShadow;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(0) scale(1)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 20px rgba(0,0,0,0.1)";
                                }}
                              >
                                {/* Decorative overlay */}
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "-50%",
                                    right: "-50%",
                                    width: "200%",
                                    height: "200%",
                                    background:
                                      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                                    pointerEvents: "none",
                                  }}
                                />

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "15px",
                                    position: "relative",
                                  }}
                                >
                                  <div
                                    style={{
                                      minWidth: "40px",
                                      height: "40px",
                                      background: "rgba(255,255,255,0.2)",
                                      backdropFilter: "blur(10px)",
                                      color: "#fff",
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "700",
                                      fontSize: "18px",
                                      border: "2px solid rgba(255,255,255,0.3)",
                                      transition: "all 0.3s ease",
                                    }}
                                  >
                                    {idx + 1}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <h5
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#fff",
                                        marginBottom: "10px",
                                        lineHeight: "1.4",
                                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      {item.title}
                                    </h5>
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        color: "rgba(255,255,255,0.95)",
                                        marginBottom: "0",
                                        lineHeight: "1.6",
                                      }}
                                    >
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: item.desc.replace(
                                            /<a /g,
                                            '<a style="color: #fff; text-decoration: underline; font-weight: 500;" ',
                                          ),
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Original layout for other guides
                      <>
                        {guide.items && guide.items.length > 0 && (
                          <div className="coaching-details__guides d-flex mb-40 mt-30">
                            <div className="coaching-details__guides-card">
                              {guide.items?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`coaching-details__guides-card-tetx${
                                    idx > 0 ? " mt-30" : ""
                                  } wow fadeInLeft animated`}
                                  data-wow-delay=".4s"
                                >
                                  <h5>
                                    <i className="fa-solid fa-check"></i>
                                    {item.title}
                                  </h5>
                                  <p
                                    dangerouslySetInnerHTML={{ __html: item.desc }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {guide.id === 3 && (
                          <div className="mt-10 wow fadeInLeft animated" data-wow-delay=".4s">
                            <div
                              style={{
                                border: "1px solid #dfe8e2",
                                borderRadius: "12px",
                                padding: "20px",
                                background: "#fff",
                                marginBottom: "18px",
                              }}
                            >
                              <h4
                                style={{
                                  fontSize: "1.1rem",
                                  fontWeight: 700,
                                  color: "#111827",
                                  marginBottom: "10px",
                                }}
                              >
                                {investmentDoc.title}
                              </h4>
                              <p
                                style={{
                                  color: "#4b5563",
                                  marginBottom: "12px",
                                  lineHeight: 1.65,
                                }}
                              >
                                {investmentDoc.description}
                              </p>
                              <a
                                href={investmentDoc.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  background: "#006D21",
                                  color: "#fff",
                                  textDecoration: "none",
                                  padding: "10px 16px",
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                }}
                              >
                                Open Document
                              </a>
                            </div>
                          </div>
                        )}

                        {guide.id === 4 && (
                          <div className="mt-10 wow fadeInLeft animated" data-wow-delay=".4s">
                            <div
                              style={{
                                border: "1px solid #dfe8e2",
                                borderRadius: "12px",
                                padding: "20px",
                                background: "#fff",
                                marginBottom: "18px",
                              }}
                            >
                              <h4
                                style={{
                                  fontSize: "1.1rem",
                                  fontWeight: 700,
                                  color: "#111827",
                                  marginBottom: "10px",
                                }}
                              >
                                {taxDoc.title}
                              </h4>
                              <p
                                style={{
                                  color: "#4b5563",
                                  marginBottom: "12px",
                                  lineHeight: 1.65,
                                }}
                              >
                                {taxDoc.description}
                              </p>
                              <a
                                href={taxDoc.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  background: "#006D21",
                                  color: "#fff",
                                  textDecoration: "none",
                                  padding: "10px 16px",
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                }}
                              >
                                Open Document
                              </a>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
