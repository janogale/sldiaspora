import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section
      className="overflow-hidden p-relative gray-bg section-space-bottom-170 overflow-hidden"
      style={{ background: "#006D21" }}
    >
      <div className="banner2__area p-relative">
        <div
          className="banner2__shape"
          style={{
            backgroundImage: "url(/assets/imgs/banner-2/banner2-shape.svg)",
          }}
        ></div>
        <div className="banner2__padding-space2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-12">
                <div className="banner2__content p-relative">
                  <h6
                    className="banner2__subtitle wow fadeInLeft animated"
                    data-wow-delay=".2s"
                  >
                     Connecting the Global Somaliland Community
                    <img
                      style={{
                        width: "62px",
                        height: "10px",
                        objectFit: "fill",
                      }}
                      src="/assets/imgs/shape.svg"
                      alt=""
                    />
                  </h6>
                  <h1
                    className="banner2__title wow fadeInLeft animated"
                    data-wow-delay=".4s"
                  >
                    Your official portal for engagement, investment and
                    nation-building.
                  </h1>
                  <Link
                    href="/contact"
                    className="banner2__button mt-40 mt-xs-25 wow fadeInLeft animated"
                    data-wow-delay=".6s"
                  >
                    Contact Us <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="col-lg-5 col-md-12">
                <div
                  className="banner2__right-thumb d-flex position-relative wow fadeInLeft animated"
                  data-wow-delay=".8s"
                >
                  <div className="banner2__right-img position-relative">
                    <div className="banner2__item">
                      <div className="banner2__item-germany upDown">
                        <div className="banner2__item-indonesia-small-img">
                          <img
                            src="/assets/imgs/banner-2/germany-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-germany-text">
                          <span>Germany</span>
                        </div>
                      </div>
                      <div className="banner2__item-south-korea upDown-top">
                        <div className="banner2__item-indonesia-small-img">
                          <img
                            src="/assets/imgs/banner-2/south-korea-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-south-korea-text">
                          <span>South Korea</span>
                        </div>
                      </div>
                      <div className="banner2__item-south-africa upDown-bottom">
                        <div className="banner2__item-south-africa-small-img">
                          <img
                            src="/assets/imgs/banner-2/south-africa-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-south-africa-text">
                          <span>South Africa</span>
                        </div>
                      </div>
                      <div className="banner2__item-turkey leftRight">
                        <div className="banner2__item-turkey-small-img">
                          <img
                            src="/assets/imgs/banner-2/turkey-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-turkey-text">
                          <span>Turkey</span>
                        </div>
                      </div>
                      <div className="banner2__item-indonesia rightLeft">
                        <div className="banner2__item-indonesia-small-img">
                          <img
                            src="/assets/imgs/banner-2/indonesia-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-indonesia-text">
                          <span>Tndonesia</span>
                        </div>
                      </div>
                    </div>
                    <img
                      src="/assets/imgs/banner-2/banner2-img.png"
                      alt="img not found"
                      data-tilt
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
