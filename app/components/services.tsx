import Link from "next/link";
import React from "react";
import { ServicesList } from "../data/services";

function Services() {
  return (
    <div id="services">
      {" "}
      <section className="visa-catagory__area section-space  overflow-hidden position-relative">
        <div className="container">
          <div className="section-title2 mb-60">
            <div className="section-title2__wrapper">
              <span
                className="section-title2__wrapper-subtitle wow fadeInLeft animated"
                data-wow-delay=".2s"
              >
                What We Do
                <img
                  style={{ width: "52px", height: "10px" }}
                  src="./assets/imgs/shape2.svg"
                  alt=""
                />
              </span>
              <h2
                className="section-title2__wrapper-title  wow fadeInLeft animated"
                data-wow-delay=".3s"
              >
                Empowering the Somaliland Diaspora
              </h2>
            </div>
            <div
              className="section-title2__button wow fadeInLeft animated"
              data-wow-delay=".4s"
            >
              <Link href="/contact">
                Get in Touch <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="row mb-minus-30">
                {ServicesList.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div className="col-sm-4" key={service.id}>
                      <div
                        className="visa-catagory__item mb-3 wow fadeInLeft animated"
                        data-wow-delay=".3s"
                      >
                        <div className="visa-catagory__item-icon">
                          <Icon size={34} color="#006d21" />
                        </div>
                        <div className="visa-catagory__item-content">
                          {/* <span>Financial Investment</span> */}
                          <h3
                            style={{ fontSize: "26px" }}
                            className="visa-catagory__title"
                          >
                            {service.title}
                          </h3>
                          <p>{service.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
