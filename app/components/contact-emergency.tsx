import Link from "next/link";
import React from "react";
import { Mail, Phone } from "lucide-react";

const ContactEmergency = () => {
  return (
    <section className="contact-emergency__area section-space">
      <div className="container">
        <div className="section-title2 mb-60 text-center">
          <h2
            className="section-title2__wrapper-title wow fadeInLeft animated"
            data-wow-delay=".3s"
          >
            NEED HELP? CONTACT US
          </h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 mb-4">
            <div
              className="contact-card p-5 bg-white rounded shadow-sm text-center h-100 wow fadeInLeft animated"
              data-wow-delay=".4s"
            >
              <div className="contact-card__icon mb-4 d-flex justify-content-center">
                <Mail size={56} color="#006d21" />
              </div>
              <h3
                className="contact-card__title mb-3"
                style={{ fontSize: "1.5rem", color: "#006d21" }}
              >
                General Inquiries
              </h3>
              <p
                className="contact-card__email mb-4"
                style={{ fontSize: "1.1rem", color: "#666" }}
              >
                diaspora@mfaic.sl
              </p>
              <Link
                href="/contact"
                className="btn btn-primary px-5 py-3"
                style={{ backgroundColor: "#006d21", border: "none" }}
              >
                Contact Form <i className="fa-solid fa-paper-plane ms-2"></i>
              </Link>
            </div>
          </div>
          <div className="col-lg-5 col-md-6 mb-4">
            <div
              className="contact-card p-5 bg-white rounded shadow-sm text-center h-100 wow fadeInRight animated"
              data-wow-delay=".4s"
            >
              <div className="contact-card__icon mb-4 d-flex justify-content-center">
                <Phone size={56} color="#006d21" />
              </div>
              <h3
                className="contact-card__title mb-3"
                style={{ fontSize: "1.5rem", color: "#006d21" }}
              >
                Emergency Contacts
              </h3>
              <div
                className="contact-card__phones mb-4"
                style={{ fontSize: "1.1rem", color: "#666" }}
              >
                <p className="mb-2">
                  <strong>Hargeisa:</strong> +252 63 4445000
                </p>
                <p className="mb-0">
                  <strong>Airport Help Desk:</strong> +252 63 4445001
                </p>
              </div>
              <Link
                href="/contact"
                className="btn btn-outline-primary px-5 py-3"
                style={{ borderColor: "#006d21", color: "#006d21" }}
              >
                More Contacts <i className="fa-solid fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactEmergency;
