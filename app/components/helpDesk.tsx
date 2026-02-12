import React, { type ReactNode } from "react";

type IconType = "phone" | "email" | "location" | "clock";

const tabs = [
  {
    id: "nav-airport",
    title: "Airport",
    // Array of images for the carousel
    carouselImgs: [
      "/assets/slides/1.jpg",
      "/assets/slides/2.jpg",
      "/assets/slides/3.jpg",
    ],
  },
  {
    id: "nav-ministry",
    title: "Ministry",
    carouselImgs: [
      "/assets/slides/4.jpg",
      "/assets/slides/5.jpg",
    ],
  },
];

const contactItems = [
  { key: "call", label: "Requesting A Call:", href: "tel:6295550129", value: "(629) 555-0129", icon: "phone" },
  { key: "email", label: "E-mail", href: "mailto:info@example.com", value: "info@example.com", icon: "email" },
  { key: "location", label: "Location", href: "https://maps.google.com", value: "6391 Elgin St. Celina,\nDelaware 10299", icon: "location" },
] satisfies Array<{ key: string; label: string; href: string; value: string; icon: IconType }>;

const hours = [
  { key: "mon", label: "Monday", time: "9 am - 8 pm" },
  { key: "tue-fri", label: "Tuesday-Friday", time: "9 am - 8 pm" },
  { key: "sat", label: "Saturday", time: "9 am - 8 pm" },
];

// --- Sub-Components ---

const icons: Record<IconType, ReactNode> = {
  phone: <path d="M24.9512 19.0215L23.7793 23.9531C23.6328 24.6855 23.0469 25.1738 22.3145 25.1738C10.0098 25.125 0 15.1152 0 2.81055C0 2.07812 0.439453 1.49219 1.17188 1.3457L6.10352 0.173828C6.78711 0.0273438 7.51953 0.417969 7.8125 1.05273L10.1074 6.375C10.3516 7.00977 10.2051 7.74219 9.66797 8.13281L7.03125 10.2812C8.69141 13.6504 11.4258 16.3848 14.8438 18.0449L16.9922 15.4082C17.3828 14.9199 18.1152 14.7246 18.75 14.9688L24.0723 17.2637C24.707 17.6055 25.0977 18.3379 24.9512 19.0215Z" fill="#83CD20" />,
  email: <path d="M22.6562 0.25C23.9258 0.25 25 1.32422 25 2.59375C25 3.375 24.6094 4.05859 24.0234 4.49805L13.4277 12.457C12.8418 12.8965 12.1094 12.8965 11.5234 12.457L0.927734 4.49805C0.341797 4.05859 0 3.375 0 2.59375C0 1.32422 1.02539 0.25 2.34375 0.25H22.6562ZM10.5957 13.7266C11.7188 14.5566 13.2324 14.5566 14.3555 13.7266L25 5.71875V15.875C25 17.6328 23.584 19 21.875 19H3.125C1.36719 19 0 17.6328 0 15.875V5.71875L10.5957 13.7266Z" fill="#83CD20" />,
  location: <path d="M8.20312 24.5391C5.66406 21.3652 0 13.7969 0 9.5C0 4.32422 4.15039 0.125 9.375 0.125C14.5508 0.125 18.75 4.32422 18.75 9.5C18.75 13.7969 13.0371 21.3652 10.498 24.5391C9.91211 25.2715 8.78906 25.2715 8.20312 24.5391ZM9.375 12.625C11.084 12.625 12.5 11.2578 12.5 9.5C12.5 7.79102 11.084 6.375 9.375 6.375C7.61719 6.375 6.25 7.79102 6.25 9.5C6.25 11.2578 7.61719 12.625 9.375 12.625Z" fill="#83CD20" />,
  clock: <path d="M10 20.5C4.45312 20.5 0 16.0469 0 10.5C0 4.99219 4.45312 0.5 10 0.5C15.5078 0.5 20 4.99219 20 10.5C20 16.0469 15.5078 20.5 10 20.5ZM9.0625 10.5C9.0625 10.8125 9.21875 11.125 9.45312 11.2812L13.2031 13.7812C13.6328 14.0938 14.2188 13.9766 14.4922 13.5469C14.8047 13.1172 14.6875 12.5312 14.2578 12.2188L10.9375 10.0312V5.1875C10.9375 4.67969 10.5078 4.25 9.96094 4.25C9.45312 4.25 9.02344 4.67969 9.02344 5.1875L9.0625 10.5Z" fill="#83CD20" />
};

type IconWrapperProps = {
  type: IconType;
};

const IconWrapper: React.FC<IconWrapperProps> = ({ type }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 26 26" fill="none" className="me-3">
      {icons[type]}
    </svg>
  );
};

const HelpDesk = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold text-success small">Help Desk</span>
          <h2 className="display-5 fw-bold mt-2">We’ve got you covered</h2>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-pills justify-content-center mb-5" id="helpTab" role="tablist">
          {tabs.map((t, i) => (
            <li className="nav-item" key={t.id}>
              <button
                className={`nav-link px-4 py-2 mx-2 rounded-pill fw-bold ${i === 0 ? "active bg-success" : "text-dark bg-white border"}`}
                id={`${t.id}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#${t.id}-pane`}
                type="button"
                role="tab"
              >
                {t.title}
              </button>
            </li>
          ))}
        </ul>

        {/* Tab Content */}
        <div className="tab-content border rounded-4 bg-white shadow-sm p-4 p-md-5" id="helpTabContent">
          {tabs.map((t, i) => (
            <div
              key={t.id}
              className={`tab-pane fade ${i === 0 ? "show active" : ""}`}
              id={`${t.id}-pane`}
              role="tabpanel"
              tabIndex={0}
            >
              <div className="row g-4 align-items-center">
                {/* Contact Column */}
                <div className="col-lg-4 border-end-lg">
                  <h5 className="mb-4 fw-bold">Contact Info</h5>
                  {contactItems.map((item) => (
                    <div className="d-flex align-items-start mb-4" key={item.key}>
                      <IconWrapper type={item.icon} />
                      <div>
                        <small className="text-muted d-block">{item.label}</small>
                        <a href={item.href} className="text-decoration-none text-dark fw-bold">
                          {item.value.split("\n").map((line, idx) => (
                            <span key={idx}>{line}<br /></span>
                          ))}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hours Column */}
                <div className="col-lg-3 border-end-lg">
                  <h5 className="mb-4 fw-bold">Opening Hours</h5>
                  {hours.map((h) => (
                    <div className="mb-4" key={h.key}>
                      <small className="text-muted d-block">{h.label}</small>
                      <div className="d-flex align-items-center fw-bold">
                        <IconWrapper type="clock" />
                        <span>{h.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Small Carousel Column */}
                <div className="col-lg-5">
                  <div id={`carousel-${t.id}`} className="carousel slide carousel-fade shadow-sm rounded overflow-hidden" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      {t.carouselImgs.map((img, imgIdx) => (
                        <div className={`carousel-item ${imgIdx === 0 ? "active" : ""}`} key={imgIdx}>
                          <img 
                            src={img} 
                            className="d-block w-100 object-fit-cover" 
                            style={{ height: "300px" }} 
                            alt={`Slide ${imgIdx}`} 
                          />
                        </div>
                      ))}
                    </div>
                    {/* Carousel Controls */}
                    <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${t.id}`} data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${t.id}`} data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpDesk;