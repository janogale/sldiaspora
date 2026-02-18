"use client";

import "swiper/css";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Testimonial = () => {
  return (
    <section className="testimonial__area section-space-bottom ">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="testimonial__media" data-tilt>
              <img
                src="/assets/imgs/testimonial/testimonial2-left-img.png"
                alt="img not found"
                className="height-693"
              />
            </div>
          </div>
          <div className="col-lg-5">
            <Swiper
              modules={[Pagination, Autoplay]}
              className="testimonial__content testimonial__content-2 swiper wow fadeInLeft animated"
              data-wow-delay=".3s"
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              pagination={{
                el: ".testimonial__content-2-swiper-pagination",
                clickable: true,
                renderBullet: (index, className) => {
                  // render an arrow-shaped SVG for each pagination bullet
                  // use `currentColor` so CSS can control active/inactive coloring
                  return `\n                    <span class="${className} testimonial-dot" aria-label="Go to slide ${
                    index + 1
                  }">\n                      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M4 2L10 6L4 10\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                      </svg>\n                    </span>`;
                },
              }}
            >
              <SwiperSlide>
                <div className="testimonial__content-text testimonial__content-2-text">
                  <div className="testimonial__content-text-icon">
                    <svg
                      width="69"
                      height="56"
                      viewBox="0 0 69 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.43939 26.8064V26.8069C7.43939 28.1023 8.47095 29.1339 9.76631 29.1339H27.0513V52.6373H3.54785V26.8069C3.54785 14.7491 12.7638 4.80069 24.5036 3.63028V7.536C19.9667 8.0915 15.7593 10.2317 12.6344 13.5947C9.29795 17.1854 7.44223 21.9048 7.43939 26.8064ZM66.8325 29.1339V52.6373H43.329V26.8069C43.329 14.7489 52.5455 4.79947 64.3113 3.63006V7.5342C54.6836 8.69306 47.2205 16.8812 47.2205 26.8069C47.2205 28.1023 48.2521 29.1339 49.5475 29.1339H66.8325Z"
                        stroke="#50FEA8"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <p>
                    We have been operating for over an providin top-notch
                    services to our clients and build strong track record in the
                    industry.We have been operating for over a decad providi ina
                    top-notch We have been operating
                  </p>
                  <div className="testimonial__content-text-title">
                    <div className="testimonial__content-text-title-img">
                      <img
                        src="/assets/imgs/testimonial/testimonial2-title-img.png"
                        alt="img not found"
                      />
                    </div>
                    <div className="testimonial__content-text-title-name testimonial__content-2-text-name">
                      <h6>Kadthleen Smith</h6>
                      <span>Fuel Company</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonial__content-text testimonial__content-2-text">
                  <div className="testimonial__content-text-icon">
                    <svg
                      width="69"
                      height="56"
                      viewBox="0 0 69 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.43939 26.8064V26.8069C7.43939 28.1023 8.47095 29.1339 9.76631 29.1339H27.0513V52.6373H3.54785V26.8069C3.54785 14.7491 12.7638 4.80069 24.5036 3.63028V7.536C19.9667 8.0915 15.7593 10.2317 12.6344 13.5947C9.29795 17.1854 7.44223 21.9048 7.43939 26.8064ZM66.8325 29.1339V52.6373H43.329V26.8069C43.329 14.7489 52.5455 4.79947 64.3113 3.63006V7.5342C54.6836 8.69306 47.2205 16.8812 47.2205 26.8069C47.2205 28.1023 48.2521 29.1339 49.5475 29.1339H66.8325Z"
                        stroke="#50FEA8"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <p>
                    We have been operating for over an providin top-notch
                    services to our clients and build strong track record in the
                    industry.We have been operating for over a decad providi ina
                    top-notch We have been operating
                  </p>
                  <div className="testimonial__content-text-title">
                    <div className="testimonial__content-text-title-img">
                      <img
                        src="/assets/imgs/testimonial/testimonial2-title-img.png"
                        alt="img not found"
                      />
                    </div>
                    <div className="testimonial__content-text-title-name testimonial__content-2-text-name">
                      <h6>Kathleen Smith</h6>
                      <span>Fuel Company</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonial__content-text testimonial__content-2-text">
                  <div className="testimonial__content-text-icon">
                    <svg
                      width="69"
                      height="56"
                      viewBox="0 0 69 56"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.43939 26.8064V26.8069C7.43939 28.1023 8.47095 29.1339 9.76631 29.1339H27.0513V52.6373H3.54785V26.8069C3.54785 14.7491 12.7638 4.80069 24.5036 3.63028V7.536C19.9667 8.0915 15.7593 10.2317 12.6344 13.5947C9.29795 17.1854 7.44223 21.9048 7.43939 26.8064ZM66.8325 29.1339V52.6373H43.329V26.8069C43.329 14.7489 52.5455 4.79947 64.3113 3.63006V7.5342C54.6836 8.69306 47.2205 16.8812 47.2205 26.8069C47.2205 28.1023 48.2521 29.1339 49.5475 29.1339H66.8325Z"
                        stroke="#50FEA8"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <p>
                    We have been operating for over an providin top-notch
                    services to our clients and build strong track record in the
                    industry.We have been operating for over a decad providi ina
                    top-notch We have been operating
                  </p>
                  <div className="testimonial__content-text-title">
                    <div className="testimonial__content-text-title-img">
                      <img
                        src="/assets/imgs/testimonial/testimonial2-title-img.png"
                        alt="img not found"
                      />
                    </div>
                    <div className="testimonial__content-text-title-name testimonial__content-2-text-name">
                      <h6>Kathleen Smith</h6>
                      <span>Fuel Company</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <div className="swiper-pagination testimonial__content-2-swiper-pagination"></div>
              {/* Navigation buttons removed as requested */}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
