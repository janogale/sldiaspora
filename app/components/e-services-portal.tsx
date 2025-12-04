import Link from "next/link";
import React from "react";
import {
  FileText,
  Briefcase,
  Users,
  Database,
  AlertCircle,
  Download,
  Phone,
  MessageSquare,
} from "lucide-react";

const EServicesPortal = () => {
  const services = [
    {
      icon: FileText,
      title: "Register in Database",
      link: "/register",
    },
    {
      icon: Briefcase,
      title: "Business Inquiry Form",
      link: "/contact",
    },
    {
      icon: Users,
      title: "Volunteer Sign-Up",
      link: "/contact",
    },
    {
      icon: Database,
      title: "Update Your Information",
      link: "/register",
    },
    {
      icon: AlertCircle,
      title: "Submit Grievance",
      link: "/contact",
    },
    {
      icon: Download,
      title: "Download Center",
      link: "/guidlines",
    },
    {
      icon: Phone,
      title: "Emergency Contacts",
      link: "/contact",
    },
    {
      icon: MessageSquare,
      title: "Feedback Portal",
      link: "/contact",
    },
  ];

  return (
    <section className="e-services__area section-space gray-bg">
      <div className="container">
        <div className="section-title2 mb-60 text-center">
          <span
            className="section-title2__wrapper-subtitle wow fadeInLeft animated"
            data-wow-delay=".2s"
          >
            Quick Access to Essential Services
            <img
              style={{ width: "52px", height: "10px" }}
              src="./assets/imgs/shape2.svg"
              alt=""
            />
          </span>
          <h2
            className="section-title2__wrapper-title wow fadeInLeft animated"
            data-wow-delay=".3s"
          >
            E-SERVICES PORTAL
          </h2>
        </div>
        <div className="row">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                <Link href={service.link} className="text-decoration-none">
                  <div
                    className="e-service-card p-4 bg-white rounded shadow-sm text-center h-100 wow fadeInUp animated"
                    data-wow-delay={`.${index + 2}s`}
                    style={{ transition: "all 0.3s" }}
                  >
                    <div className="e-service-card__icon mb-3 d-flex justify-content-center">
                      <Icon size={40} color="#006d21" />
                    </div>
                    <h4
                      className="e-service-card__title mb-0"
                      style={{ fontSize: "1rem", color: "#333" }}
                    >
                      {service.title}
                    </h4>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EServicesPortal;
