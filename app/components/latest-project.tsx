"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { projectData } from "../data/project-data";
import { Navigation } from "swiper/modules";

const LatestProject = () => {
  return (
    <section className="overflow-hidden ">
      <div
        className="top-bottom project-area banner-wrap  "
        style={{ background: "#006D21" }}
      >
        <div className="container">
          <div className="section-slider-title mb-60">
            <div className="section-slider-title-wrapper">
              <h6
                className="section-slider-title-wrapper-subtitle wow fadeInLeft animated"
                data-wow-delay=".2s"
              >
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3756_20)">
                    <path d="M19.3 2.66986C19.2618 2.59008 19.1936 2.52868 19.1103 2.49911L12.1959 0.0581985C12.0224 -0.00317634 11.832 0.0879901 11.7706 0.26149L10.2 4.70581H9.51302V3.57248C9.513 3.41941 9.47783 3.26838 9.41023 3.13104C9.34263 2.9937 9.2444 2.87372 9.12311 2.78033C9.00182 2.68695 8.86071 2.62266 8.71066 2.59242C8.5606 2.56217 8.4056 2.56679 8.25761 2.6059L0.248416 4.7169V4.7229C0.177823 4.74064 0.115123 4.78133 0.0701599 4.83857C0.0251971 4.89581 0.000518721 4.96636 0 5.03915L0 19.0391C0 19.5914 0.447749 20.0391 0.999998 20.0391H10.3333C10.8856 20.0391 11.3333 19.5914 11.3333 19.0391V16.0145L14.0066 16.9582C14.1803 17.0194 14.3707 16.9285 14.4319 16.7548L19.3143 2.92457C19.3287 2.88326 19.3349 2.83949 19.3325 2.79578C19.33 2.75208 19.319 2.70928 19.2999 2.66986H19.3ZM8.42769 3.24873C8.47703 3.23573 8.52869 3.23421 8.57871 3.24429C8.62873 3.25436 8.67577 3.27577 8.71623 3.30686C8.7567 3.33802 8.78947 3.37806 8.81202 3.42389C8.83456 3.46972 8.84628 3.52012 8.84627 3.57119V4.70581H2.90366L8.42769 3.24873ZM10.6666 19.0391C10.6666 19.1275 10.6315 19.2123 10.569 19.2748C10.5065 19.3373 10.4217 19.3724 10.3333 19.3724H0.999998C0.911593 19.3724 0.826808 19.3373 0.764296 19.2748C0.701784 19.2123 0.666665 19.1275 0.666665 19.0391V5.37248H10.3333C10.4217 5.37248 10.5065 5.4076 10.569 5.47011C10.6315 5.53262 10.6666 5.61741 10.6666 5.70581V19.0391ZM13.4067 6.64152L13.8333 6.43923L14.0366 6.86452L12.417 11.4481C12.3877 11.5315 12.3926 11.6231 12.4306 11.7029L12.7776 12.4288L12.6704 12.7331L12.0093 12.0485C11.9734 12.0112 11.9294 11.9827 11.8806 11.9653C11.8318 11.9479 11.7797 11.9422 11.7283 11.9485L11.3333 11.9985V11.5518L11.6176 11.4158C11.6974 11.3776 11.7588 11.3095 11.7884 11.2262L12.4551 9.34089L13.4067 6.64152ZM14.0353 8.86643L14.7121 9.95384L14.5963 10.2815L13.7866 9.57251L14.0353 8.86643ZM11.3333 10.5121V9.5961L11.6613 9.58243L11.3333 10.5121ZM11.9001 8.90551L11.3333 8.9288V8.4851L12.1494 8.20043L11.9001 8.90551ZM13.9141 16.2185L11.3333 15.3075..." />
                    <path d="M16.5439 5.12938L16.7657 4.50063L17.3374 4.7023L17.1155 5.33105L16.5439 5.12938ZM11.972 3.51526L12.194 2.88672L12.7654 3.08851L12.5434 3.71709L11.972 3.51526ZM15.4008 4.72588L15.6228 4.09713L16.1943 4.29897L15.9723 4.92755L15.4008 4.72588ZM13.115 3.91892L13.337 3.29034L13.9083 3.49218L13.6863 4.12076L13.115 3.91892ZM14.2579 4.32209L14.48 3.69351L15.0514 3.89534L14.8294 4.52388L14.2579 4.32209ZM5.51301 6.707C3.67202 6.707 2.17969 8.19933 2.17969 10.0403C2.17969 11.8813 3.67202 13.3737 5.51301 13.3737C7.35401 13.3737 8.84634 11.8813 8.84634 10.0403C8.84438 8.20033 7.35318 6.70909 5.51301 6.707ZM7.92005 8.90066L7.4653 8.80075C7.2653 8.75662 7.06522 8.72166 6.86322 8.69137C6.83297 8.48959 6.79646 8.2888 6.75372 8.08929L6.65359 7.63471C7.20852 7.89885 7.65568 8.34585 7.92005 8.90066ZM2.84631 10.0403C2.84698 9.90408 2.85806 9.76804 2.87969 9.63341L3.70393 9.45C3.83039 9.422 3.95768 9.39875 4.08527 9.37675C4.05304 9.8186 4.05304 10.2622 4.08527 10.7041C3.95764 10.6821 3.83039 10.6587 3.70393 10.6307L2.87969 10.4474C2.85809 10.3128 2.84695 10.1767 2.84635 10.0403H2.84631ZM4.76172 9.28937C5.26137 9.24478 5.76399 9.24478 6.26364 9.28937C6.30839 9.78901 6.30839 10.2916 6.26364 10.7913C5.76399 10.836 5.26133 10.836 4.76168 10.7913C4.71693 10.2916 4.71697 9.78901 4.76172 9.28937ZM6.93926 9.37675C7.06701 9.39875 7.1943 9.422 7.32059 9.45L8.14497 9.63341C8.19119 9.90278 8.19119 10.178 8.14497 10.4474L7.32059 10.6307C7.19434 10.6587 7.06701 10.6821 6.93926 10.7044C6.97165 10.2624 6.97165 9.81871 6.93926 9.37675ZM5.91972 7.40704L6.10301 8.23175C6.13101 8.35804 6.1546 8.48533 6.17676 8.61308C5.73474 8.58069 5.29095 8.58069 4.84893 8.61308C4.87106 8.48533 4.89435 8.35804 4.92268 8.23175L5.10593 7.40704C5.37527 7.36131 5.65039 7.36131 5.91972 7.40704ZM4.37306 7.63229L4.27293 8.08704C4.22898 8.28704 4.19397 8.48712 4.16373 8.68912C3.96195 8.71926 3.76116 8.75566 3.56164 8.79829L3.10689 8.89841C3.37146 8.34408 3.81845 7.89749 4.37302 7.63342L4.37306" />
                  </g>
                  <defs>
                    <clipPath id="clip0_3756_20">
                      <rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="translate(0 0.0390625)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                OUR DIASPORA HUBS
              </h6>
              <h2
                className="section-slider-title-wrapper-title wow fadeInLeft animated"
                data-wow-delay=".3s"
              >
                Building Bridges from Key <br />
                Nations to Somaliland
              </h2>
            </div>
            <div className="section-slider-title-button">
              <div className="d-none d-md-block">
                <button
                  className="section-slider-title-button-right mr-15 project__slider-button-prev wow fadeInLeft animated"
                  data-wow-delay=".4s"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  className="section-slider-title-button-right project__slider-button-next wow fadeInLeft animated"
                  data-wow-delay=".5s"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <div className="d-block d-md-none">
                <button
                  className="section-slider-title-button-right mr-15 project__slider-button-prev-2 wow fadeInLeft animated"
                  data-wow-delay=".4s"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  className="section-slider-title-button-right project__slider-button-next-2 wow fadeInLeft animated"
                  data-wow-delay=".5s"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="project-row-custom d-none d-md-block">
            <Swiper
              modules={[Navigation]}
              className="swiper project-slide slide-height"
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              navigation={{
                nextEl: ".project__slider-button-next",
                prevEl: ".project__slider-button-prev",
              }}
            >
              <div className="swiper-wrapper">
                <SwiperSlide className="p-relative">
                  <div className="project-three__single">
                    <ul className="slider_hover__item">
                      {projectData.map((item, index) => (
                        <li key={index}>
                          <div
                            className="project-three__single-inner wow fadeInLeft animated"
                            data-wow-delay=".2s"
                          >
                            <div className="project-small-img">
                              <img src={item.smallImg} alt="img not found" />
                            </div>
                            <div
                              className="project-three__single-img"
                              style={{ backgroundImage: `url(${item.img})` }}
                            ></div>
                            <div className="bg-overlay"></div>

                            <div className="project-three__single-content">
                              <h4>{item.title}</h4>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              ></p>

                              <div className="button">
                                <Link href={item.url}>
                                  Apply Now{" "}
                                  <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="p-relative">
                  <div className="project-three__single">
                    <ul className="slider_hover__item">
                      {projectData.map((item, index) => (
                        <li key={index}>
                          <div
                            className="project-three__single-inner wow fadeInLeft animated"
                            data-wow-delay=".2s"
                          >
                            <div className="project-small-img">
                              <img src={item.smallImg} alt="img not found" />
                            </div>
                            <div
                              className="project-three__single-img"
                              style={{ backgroundImage: `url(${item.img})` }}
                            ></div>
                            <div className="bg-overlay"></div>

                            <div className="project-three__single-content">
                              <h4>{item.title}</h4>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              ></p>

                              <div className="button">
                                <Link href={item.url}>
                                  Apply Now{" "}
                                  <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SwiperSlide>
              </div>
            </Swiper>
          </div>

          <div className="project-row-custom-2 d-block d-md-none">
            <Swiper
              modules={[Navigation]}
              className="swiper project-slide-2"
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              navigation={{
                nextEl: ".project__slider-button-next-2",
                prevEl: ".project__slider-button-prev-2",
              }}
            >
              <div className="swiper-wrapper">
                {projectData.map((item, index) => (
                  <SwiperSlide key={index} className="p-relative">
                    <div
                      className="project-three__single-inner min-vh-100 wow fadeInLeft animated"
                      data-wow-delay=".2s"
                    >
                      <div className="project-small-img">
                        <img src={item.smallImg} alt="img not found" />
                      </div>
                      <div
                        className="project-three__single-img mh-100"
                        style={{ backgroundImage: `url(${item.img})` }}
                      ></div>
                      <div className="bg-overlay"></div>

                      <div className="project-three__single-content">
                        <h4>{item.title}</h4>
                        <p
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></p>

                        <div className="button">
                          <Link href={item.url}>
                            Apply Now{" "}
                            <i className="fa-solid fa-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LatestProject;
