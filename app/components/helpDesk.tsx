import React, { type ReactNode, useState } from "react";

type IconType = "phone" | "email" | "location" | "clock";

type DeskContent = {
  id: string;
  title: string;
  phone: { href: string; value: string };
  email: { href: string; value: string };
  location: { href: string; value: string };
  officeHours: string;
  pickupMessage: string;
};

const deskTabs: DeskContent[] = [
  {
    id: "nav-airport",
    title: "Airport",
    phone: { href: "tel:252638880240", value: "+252 63 8880240" },
    email: { href: "mailto:info@sldiaspora.org", value: "info@sldiaspora.org" },
    location: {
      href: "https://maps.google.com/?q=Egal+International+Airport+Hargeisa",
      value: "Egal International Airport, Hargeisa, Somaliland",
    },
    officeHours: "7:30am - 3:00pm",
    pickupMessage:
      "Airport pickup desk is available 2 hours before departure flights and after all arrivals.",
  },
  {
    id: "nav-ministry",
    title: "Ministry",
    phone: { href: "tel:252637777000", value: "+252 63 7777000" },
    email: { href: "mailto:diaspora.mofa@sldgov.org", value: "diaspora.mofa@sldgov.org" },
    location: {
      href: "https://maps.app.goo.gl/qo96x3AZEVEfdxSX8",
      value: "Shacab Area, Wadada Madax-tooyada, Hargeisa",
    },
    officeHours: "7:00am - 2:00pm",
    pickupMessage:
      "Pickup coordination support is available during office hours through the help desk team.",
  },
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
    <span
      className="helpdesk-icon d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
      style={{ width: 44, height: 44, background: "#ecf7f0", border: "1px solid #d7ebde" }}
    >
      <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
        {icons[type]}
      </svg>
    </span>
  );
};

const HelpDesk = () => {
  const [activeDeskId, setActiveDeskId] = useState(deskTabs[0].id);

  const getContactItems = (desk: DeskContent) => [
    { key: "call", label: "Phone", href: desk.phone.href, value: desk.phone.value, icon: "phone" as IconType },
    { key: "email", label: "Email", href: desk.email.href, value: desk.email.value, icon: "email" as IconType },
    {
      key: "contact",
      label: "Contact",
      href: desk.location.href,
      value: desk.location.value,
      icon: "location" as IconType,
    },
  ];

  const activeDesk = deskTabs.find((desk) => desk.id === activeDeskId) ?? deskTabs[0];

  return (
    <section className="helpdesk-section py-4" style={{ background: "linear-gradient(180deg, #f8fbff 0%, #f3f7fb 100%)" }}>
      <div className="container">
        {/* Header */}
        <div className="helpdesk-header text-center mb-4">
          <span
            className="text-uppercase fw-bold small d-inline-block px-3 py-2 rounded-pill"
            style={{ color: "#0b6b35", background: "#eaf7ef", letterSpacing: "0.08em" }}
          >
            Help Desk
          </span>
          <h2 className="display-6 fw-bold mt-2 mb-2">We’ve got you covered</h2>
          <p className="text-muted mb-0">Choose a desk to view direct contact information and working hours.</p>
        </div>

        {/* Tab Navigation */}
        <ul
          className="helpdesk-tabs nav nav-pills justify-content-center mb-4 p-2 rounded-pill shadow-sm"
          id="helpTab"
          role="tablist"
          style={{ background: "#ffffff", border: "1px solid #e6edf5", maxWidth: 420, margin: "0 auto" }}
        >
          {deskTabs.map((t) => {
            const isActive = t.id === activeDeskId;

            return (
            <li className="nav-item" key={t.id}>
              <button
                className={`helpdesk-tab-btn nav-link px-4 py-2 mx-1 rounded-pill fw-semibold ${isActive ? "active text-white" : "text-dark bg-white"}`}
                id={`${t.id}-tab`}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDeskId(t.id)}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #0a7f3f, #0b6b35)",
                        boxShadow: "0 8px 18px rgba(10,127,63,0.25)",
                      }
                    : { border: "1px solid #e4eaf2" }
                }
              >
                {t.title}
              </button>
            </li>
          );
          })}
        </ul>

        {/* Tab Content */}
        <div className="helpdesk-content tab-content rounded-4 bg-white shadow-sm p-3 p-md-4 border" id="helpTabContent" style={{ borderColor: "#e4eaf2" }}>
          <div className="row g-3 align-items-stretch">
            {/* Contact Column */}
            <div className="col-lg-7 d-flex">
              <div className="w-100 h-100">
                <h5 className="helpdesk-title mb-3 fw-bold text-dark">Contact Information</h5>
                <div className="d-flex flex-column gap-2 h-100">
                  {getContactItems(activeDesk).map((item) => (
                    <div
                      className="helpdesk-card d-flex align-items-start p-3 rounded-3 border shadow-sm"
                      style={{ background: "#f8fafc", borderColor: "#e7edf4", minHeight: 84 }}
                      key={item.key}
                    >
                      <IconWrapper type={item.icon} />
                      <div>
                        <small className="text-muted d-block mb-1">{item.label}</small>
                        <a href={item.href} className="text-decoration-none text-dark fw-semibold" style={{ whiteSpace: "pre-line" }}>
                          {item.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hours + Pickup Message Column */}
            <div className="col-lg-5 d-flex">
              <div className="w-100 h-100 d-flex flex-column">
                <h5 className="helpdesk-title mb-3 fw-bold text-dark">Opening Hours</h5>
                <div
                  className="helpdesk-card helpdesk-side-card p-3 rounded-3 border mb-3 shadow-sm d-flex flex-column justify-content-center"
                  style={{ background: "#f8fafc", borderColor: "#e7edf4", minHeight: 132 }}
                >
                  <small className="text-muted d-block mb-2">Office Hours</small>
                  <div className="d-flex align-items-start fw-semibold text-dark">
                    <IconWrapper type="clock" />
                    <span>{activeDesk.officeHours}</span>
                  </div>
                </div>

                <div
                  className="helpdesk-card helpdesk-side-card p-3 mb-3 rounded-3 border shadow-sm d-flex flex-column justify-content-center"
                  style={{ background: "#f2f9f4", borderColor: "#dceee3", minHeight: 132 }}
                >
                  <small className="text-muted d-block mb-2">Pickup Message</small>
                  <div className="d-flex align-items-start ">
                    <IconWrapper type="clock" />
                    <span className="text-dark fw-medium">{activeDesk.pickupMessage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 767.98px) {
          .helpdesk-section {
            padding-top: 1.25rem !important;
            padding-bottom: 1.25rem !important;
          }

          .helpdesk-header {
            margin-bottom: 0.875rem !important;
          }

          .helpdesk-header h2 {
            font-size: 1.45rem;
            margin-bottom: 0.4rem !important;
          }

          .helpdesk-tabs {
            margin-bottom: 0.95rem !important;
            padding: 0.35rem !important;
          }

          .helpdesk-tab-btn {
            padding: 0.42rem 0.85rem !important;
            font-size: 0.88rem;
          }

          .helpdesk-content {
            padding: 0.75rem !important;
          }

          .helpdesk-title {
            margin-bottom: 0.65rem !important;
            font-size: 1rem;
          }

          .helpdesk-card {
            padding: 0.65rem !important;
            min-height: 72px !important;
          }

          .helpdesk-side-card {
            min-height: 106px !important;
          }

          .helpdesk-icon {
            width: 36px !important;
            height: 36px !important;
            margin-right: 0.6rem !important;
          }

          .helpdesk-icon :global(svg) {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default HelpDesk;