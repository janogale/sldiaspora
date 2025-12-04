"use client";

interface DepartmentSection {
  title: string;
  units: Unit[];
  responsibilities: string[];
}

interface LeadershipRole {
  title: string;
  responsibilities: string[];
}
interface Unit {
  title: string;
  responsibilities: string[];
}

const DepartmentStructureContent = () => {
  // const toggleSection = (index: number) => {
  //   const newExpanded = new Set(expandedSections);
  //   if (newExpanded.has(index)) {
  //     newExpanded.delete(index);
  //   } else {
  //     newExpanded.add(index);
  //   }
  //   setExpandedSections(newExpanded);
  // };

  // const visionStatement =
  //   "To serve as the bridge between the Somaliland Diaspora community and the home country for mutually beneficial relationships in socioeconomic development and promotion of Somaliland's positive national image abroad and international standing.";

  // const missionStatement =
  //   "To effectively mobilize and utilize the resources of the Somaliland diaspora, promoting the country's economic, social, technological, and political development by creating an enabling environment for deeper and sustainable diaspora engagement.";

  const leadership: LeadershipRole[] = [
    {
      title: "Department Director",
      responsibilities: [
        "Provides strategic leadership and oversight across all departmental functions",
        "Plans, directs, executes, and supervises day-to-day departmental operations",
        "Develops and implements departmental policies, operational plans, and strategies",
        "Supervises staff performance while offering guidance and fostering teamwork and collaboration",
        "Ensures alignment with ministerial, national priorities, and diaspora aspirations",
        "Coordinates with other Ministries, Departments, and Agencies (MDAs) and relevant private sector stakeholders",
        "Liaises with development partners and oversees the successful implementation of projects",
        "Ensures timely preparation and submission of departmental performance plans and reports",
        "Drives innovation and cultivates a culture of accountability and excellence",
        "Reports to the Director General and coordinates with other departments within the Ministry",
      ],
    },
    {
      title: "Deputy Director",
      responsibilities: [
        "Supports the Department Director in operational and management coordination",
        "Oversees daily operations, inter-sectional coordination, and staff performance",
        "Monitors the implementation of departmental plans and performance indicators",
        "Prepares monthly briefs, and quarterly, semi-annual, and annual department reports",
        "Acts as Department Director and presides over internal meetings when required",
        "Carries out any other duties delegated by the Department Director",
        "Provides guidance and leads internal capacity building for staff development",
        "Ensures departmental assets and supplies are adequate, secure, and efficiently utilized",
        "Reports to the Department Director",
      ],
    },
    {
      title: "Technical Advisor",
      responsibilities: [
        "Provides expert advice and guidance on policy development, investment, and international benchmarking related to diaspora engagement",
        "Offers direct administrative, technical, and research support to the department",
        "Drafts reports, policy briefs, concept notes, and proposals",
        "Coordinates communication between units and prepares proper documentation",
        "Assists in project monitoring, event organization, and follow-up on diaspora programs",
        "Advises on legal, economic, and cultural aspects of diaspora engagement",
        "Reviews and provides feedback on technical documents, reports, and proposals",
        "Benchmarks best practices and adapts them to Somaliland's context",
        "Facilitates partnerships with research institutions and development agencies",
        "Supports sections in aligning with global best practices while ensuring local relevance",
      ],
    },
  ];

  const departmentSections: DepartmentSection[] = [
    {
      title: "Policy & Strategic Engagement Section",
      units: [
        {
          title: "Investment & Economic Partnership Unit",
          responsibilities: [
            "Attracts and promotes diaspora-led investment, trade, and business initiatives",
            "Facilitates public-private partnerships and joint ventures",
            "Provides technical support and training to diaspora entrepreneurs",
            "Assesses, evaluates, and profiles diaspora participation at home",
            "Identifies investment opportunities appealing to the diaspora community",
            "Identifies challenges and barriers to diaspora development sector participation",
            "Ensures diaspora contributions and best practices are recognized",
            "Coordinates with relevant MDAs to offer incentives related to investment, real estate, dual citizenship, and political rights",
            "Assists in developing diaspora investment promotional strategies",
            "Develops investment guides and incentive packages for dissemination to the diaspora",
            "Profiles diaspora-led businesses and private sector investments domestically",
            "Maintains close relationships with key stakeholders like the Ministries of Trade & Tourism, Investment & Industry Development, and others",
            "Assists in developing operational plans and strategies to promote diaspora investment",
            "Supports the creation of attractive business plans for diaspora entrepreneurs",
            "Provides entrepreneurship training and mentorship for diaspora youth planning to start businesses upon return",
            "Tracks diaspora contributions to national economic development",
          ],
        },
        {
          title: "Knowledge & Skills Transfer Unit",
          responsibilities: [
            "Establishes and maintains a National Diaspora Skills Database",
            "Designs flexible diaspora volunteer models and knowledge transfer formats",
            "Conducts sectoral needs assessments to identify capacity gaps and priority areas",
            "Maps diaspora expertise to match with identified needs at home",
            "Facilitates and coordinates diaspora knowledge transfer and mentorship programs",
            "Collaborates with universities, MDAs, and public and private institutions",
            "Assists in developing strategies to promote diaspora knowledge and skills transfer",
            "Encourages short- and long-term placements for diaspora professionals and interns",
            "Develops motivational mechanisms to inspire diaspora professionals",
            "Creates and disseminates volunteer information packages and guiding materials",
          ],
        },
        {
          title: "Protection & Advocacy Unit",

          responsibilities: [
            "Identifies challenges and issues affecting diaspora engagement",
            "Advocates for and promotes diaspora rights and interests domestically",
            "Supports legal protection and services for diaspora both abroad and at home",
            "Promotes improved diaspora services across all government levels",
            "Addresses grievances and coordinates with support mechanisms",
            "Collaborates with diaspora focal persons in various MDAs",
            "Coordinates with judiciary, social, and governance institutions",
            "Recommends protection protocols and policy reforms",
            "Raises awareness of diaspora contributions, achievements, and challenges",
            "Prepares reports on rights violations, challenges, and discrimination affecting the diaspora",
            "Ensures that voices of youth, women, and vulnerable diaspora groups are heard",
          ],
        },
      ],
      responsibilities: [
        "Facilitates diaspora involvement in national socio-economic development",
        "Identifies and promotes investment opportunities attractive to diaspora communities",
        "Develops diaspora policies and strategies that reflect national priorities and global trends",
        "Creates strategic plans to guide diaspora engagement across development sectors",
        "Monitors global migration trends and their impact on Somaliland",
        "Regularly reviews and updates existing policies, ensuring relevance and effectiveness",
        "Integrates diaspora perspectives into broader national development frameworks",
        "Ensures alignment with national development goals and sectoral strategies, coordinating with other stakeholders to harmonize diaspora-related initiatives",
        "Facilitates structured dialogue among diaspora, government, and other stakeholders",
        "Provides technical advice and guidance to diaspora members on various sectors and issues",
        "Offers technical support and training to diaspora businesses and entrepreneurial initiatives",
        "Produces policy briefs, strategic reports, and evidence-based recommendations",
        "Coordinates with MDAs, foreign missions, and diaspora associations",
        "Supports cross-sectoral initiatives benefiting diaspora communities",
        "Ensures diaspora engagement efforts are integrated into national development plans",
        "Recognizes diaspora participation, contributions, and best practices domestically",
        "Identifies challenges and barriers to diaspora participation in development sectors",
        "Coordinates with competent MDAs to provide incentives for diaspora involvement in areas such as investment flow, real estate, dual citizenship, and political rights",
        "Assesses, evaluates, and profiles diaspora engagement data",
      ],
    },

    {
      title: "Cultural & Community Affairs Section",
      units: [
        {
          title: "Community Engagement Unit",

          responsibilities: [
            "Engages with diaspora communities abroad, including association leaders, philanthropists, and development activists, building trust and effective collaboration",
            "Identifies priority needs at home and communicates them to diaspora communities abroad",
            "Links diaspora contributors with relevant home communities and stakeholders, facilitating partnerships and coordination",
            "Coordinates with MDAs and other stakeholders on diaspora engagement",
            "Evaluates the effectiveness, impact, and sustainability of diaspora-led initiatives",
            "Encourages the formation, reorganization, and functionality of diaspora organizations abroad, including community, philanthropic, professional, youth associations, and knowledge networks in key Somaliland diaspora destinations",
            "Provides technical guidance on organizational formation, project planning, and related matters",
          ],
        },
        {
          title: "Airport Help Desk Unit",

          responsibilities: [
            "Post Arrival Service: Provides welcome and orientation through a Meet and Greet service",
            "Informs diaspora about airport facilities (immigration, baggage claim, customs, etc.)",
            "Offers language translation assistance if needed",
            "Supports families with children on the autism spectrum (ASD)",
            "Provides information packets (digital or physical) containing key Somaliland information (service guides, travel tips, local attractions, etc.)",
            "Assists with immigration and customs procedures",
            "Liaises with immigration officers to ensure smooth processing for diaspora travelers",
            "Guides on customs regulations and assists with any required paperwork",
            "Provides information on transportation options (taxis, car rentals) and helps arrange transport if needed",
            "Serves as a point of contact for emergencies or issues faced by diaspora passengers",
            "Provides contact information for local emergency services, government offices, and support services",
            "Pre-departure Service: Hand out an optional survey to the diaspora before their departure from Somaliland. The survey is designed to gather feedback on the diaspora expectations, concerns, and experiences related to their stay in Somaliland. It is voluntary and aims to improve services to diaspora. The data collected will help the Somaliland government and relevant ministries understand the needs of the diaspora, identify areas for improvement, and tailor services to better support returnees.",
          ],
        },
      ],
      responsibilities: [
        "Develops targeted initiatives for diaspora-born youth upon their return",
        "Establishes holiday and cultural orientation programs for diaspora youth",
        "Strengthens cultural diplomacy and preservation of diaspora identity",
        "Documents and promotes cultural heritage among diaspora communities",
        "Organizes Annual Diaspora Week homecoming programs, conferences, and cultural events",
        "Coordinates with missions and associations to host annual cultural events in major diaspora destinations",
        "Strengthens diaspora community associations and supports youth and women's groups",
        "Conducts capacity-building and empowerment programs for diaspora members, community leaders, organizations, and activists",
        "Profiles diaspora organizations abroad and maintains related databases",
        "Coordinates with MDAs and other stakeholders on diaspora engagement matters",
        "Encourages diaspora-led development programs that integrate cultural preservation",
        "Provides technical support to diaspora philanthropic and development organizations",
        "Promotes diaspora philanthropic initiatives and coordinates with partners",
        "Develops concept notes and proposals addressing priority humanitarian and community development needs for diaspora presentation",
        "Produces cultural and heritage tourism packages and visitor guides",
      ],
    },

    {
      title: "Research, Data & Digital Engagement Section",
      units: [
        {
          title: "Registration & Database Unit",

          responsibilities: [
            "Maintains diaspora registries and demographic profiles",
            "Develops secure digital data management platforms",
            "Analyzes migration trends and diaspora distribution",
            "Registers diaspora professionals abroad via online platforms",
            "Ensures compliance with data protection standards",
          ],
        },
        {
          title: "Research & Publications Unit",

          responsibilities: [
            "Conducts thematic research on diaspora engagement",
            "Analyzes trends and produces statistical reports",
            "Supports academic collaborations and diaspora studies",
            "Produces information packages and service guides",
            "Prepares quarterly magazines and outreach materials",
          ],
        },
      ],
      responsibilities: [
        "Oversees diaspora mapping initiatives, research, and profiling activities",
        "Promotes virtual engagement to identify and attract diaspora expertise",
        "Maintains diaspora databases and mapping systems for engagement efforts",
        "Analyzes diaspora demographics to inform targeted programs and investment opportunities",
        "Manages digital platforms for diaspora interaction",
        "Coordinates with national statistics entities and academic institutions",
      ],
    },
  ];

  return (
    <div className="department-structure">
      {/* Hero Section */}

      {/* Vision & Mission Section */}

      {/* Leadership Section */}
      <section className="leadership-section pt-100 pb-50">
        <div className="container">
          <div className="row justify-content-center mb-50">
            <div className="col-lg-8 text-center">
              <h2 className="section-title">Department Leadership</h2>
              <p className="section-subtitle">
                Key leadership roles and their responsibilities within the
                department
              </p>
            </div>
          </div>
          <div className="row ">
            {leadership.map((role, index) => (
              <div
                className="col-lg-4  "
                key={index}
                style={{ margin: "0", padding: ".5rem" }}
              >
                <div
                  className="countrie-details__title wow fadeInLeft animated"
                  data-wow-delay=".2s"
                >
                  <h4>{role.title}</h4>
                </div>
                <div
                  className="countrie-details__box wow fadeInLeft animated"
                  data-wow-delay=".3s"
                >
                  <div
                    className="countrie-details__box-content wow fadeInLeft animated"
                    data-wow-delay=".4s"
                  >
                    {role.responsibilities.map((responsibility, respIndex) => (
                      <a
                        href="#"
                        style={{ padding: "0", margin: "0" }}
                        key={respIndex}
                      >
                        <i className="fa-solid fa-check-circle"></i>
                        {responsibility}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Sections */}
      <section className="visa-details__area coaching-details padding-t100 section-space-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="visa-details__content">
                <div
                  className="visa-details__content-faq-title mt-30 mb-60 wow fadeInLeft animated"
                  data-wow-delay=".6s"
                >
                  {" "}
                  <h2 className="section-title">Department Sections & Units</h2>
                  <p className="section-subtitle">
                    Detailed breakdown of departmental sections and their
                    specialized units
                  </p>
                </div>
                <div className="visa-details__content-faq">
                  <div className="accordion" id="accordionExample">
                    {departmentSections.map((section, index) => (
                      <div
                        className="accordion-item  wow fadeInLeft animated"
                        data-wow-delay=".2s"
                        key={index}
                      >
                        <h5 className="accordion-header" id="headingThree">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseThree"
                            aria-expanded="true"
                            aria-controls="collapseThree"
                          >
                            {section.title}
                          </button>
                        </h5>
                        <div
                          id="collapseThree"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingThree"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body">
                            <p>
                              {section.responsibilities.map(
                                (resp, respIndex) => (
                                  <li key={respIndex}>{resp}</li>
                                )
                              )}
                            </p>
                            <div
                            // className="border"
                            >
                              <h6 style={{ margin: "1rem 0" }}>
                                Units & Specialized Responsibilities
                              </h6>
                              <div
                                className="row "
                                style={{ margin: "0", padding: "0" }}
                              >
                                {section.units.map((role, index) => (
                                  <div
                                    className="col-lg-12  "
                                    key={index}
                                    style={{ margin: "0", padding: ".5rem" }}
                                  >
                                    <div
                                      className="countrie-details__title wow fadeInLeft animated"
                                      style={{ padding: "1rem" }}
                                      data-wow-delay=".2s"
                                    >
                                      <h4 style={{ fontSize: "14px" }}>
                                        {role.title}
                                      </h4>
                                    </div>
                                    <div
                                      className="countrie-details__box wow fadeInLeft animated"
                                      data-wow-delay=".3s"
                                    >
                                      <div
                                        className="countrie-details__box-content wow fadeInLeft animated"
                                        data-wow-delay=".4s"
                                      >
                                        {role.responsibilities.map(
                                          (responsibility, respIndex) => (
                                            <a
                                              href="#"
                                              style={{
                                                padding: "0",
                                                margin: "0",
                                                fontSize: "13px",
                                              }}
                                              key={respIndex}
                                            >
                                              <i className="fa-solid fa-check"></i>
                                              {responsibility}
                                            </a>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="visa-details__widget mt-30 wow fadeInLeft animated"
                data-wow-delay=".3s"
              >
                <div className="visa-details__widget-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <h3 className="mt-15">GET TOUCH</h3>
                <a href="tel:+888123456765">(+888) 123 456 765</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
    </div>
  );
};

export default DepartmentStructureContent;
