import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import HelpDesk from "../components/helpDesk";
import styles from "./page.module.css";

function Page() {
  return (
    <div>
      {" "}
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="Contact Us" marginBottom="2rem" titleTopPadding="1rem" />
      <section
        className="contact-us__area section section-space-bottom overflow-hidden"
        style={{ background: "#f8f9fa", paddingTop: "0" }}
      >
        <div className="container">
          <div className="row align-items-stretch g-4">
            <div className="col-lg-6 d-flex">
              <div
                className={`contact-us__widget mb-0 shadow-sm ${styles.contactMediaCard}`}
                data-tilt
                style={{ borderRadius: "16px", overflow: "hidden", width: "100%" }}
              >
                <img
                  src="/assets/imgs/about/image3.jpg"
                  alt="img not found"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className={`contact-us__title-wrapper bg-white shadow-sm ${styles.contactFormCard}`}
                style={{ borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <div className={`section__title-wrapper mb-40 ${styles.contactTitleWrapper}`}>
                  <h6
                    className="section__title-wrapper-black-subtitle mb-10 wow fadeInLeft animated"
                    data-wow-delay=".2s"
                  >
                    Contact Information
                    <svg
                      width="14"
                      height="12"
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_3843_1169)">
                        <path
                          d="M4.92578 10.3748L6.49623 9.68052L5.62583 9.07031L4.92578 10.3748Z"
                          fill="#83CD20"
                        />
                        <path
                          d="M4.92578 10.3743L5.00073 8L13.9088 0L5.66505 9.1113L4.92578 10.3743Z"
                          fill="#83CD20"
                        />
                        <path d="M5 8L13.908 0L0 6.22704L5 8Z" fill="#83CD20" />
                        <path
                          d="M5.66406 9.1113L9.95686 12L13.9078 0L5.66406 9.1113Z"
                          fill="#034833"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3843_1169">
                          <rect width="13.908" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </h6>
                  <h2
                    className={`section__title-wrapper-title wow fadeInLeft animated ${styles.contactTitle}`}
                    data-wow-delay=".3s"
                    style={{ fontSize: "2.2rem", lineHeight: 1.2 }}
                  >
                    Let Your Wanderlust Guide You
                  </h2>
                </div>

                <div className="contact-us__form-wrapper">
                  <form
                    className="contact-us__form"
                    // id="contact-us__form"
                    // method="POST"
                    // action="./mail.php"
                  >
                    <div className="row">
                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".4s"
                        >
                          <span>Your Email</span>
                          <input
                            name="email"
                            id="email"
                            type="email"
                            placeholder="Your Email"
                          />
                          <div className="icon">
                            <i className="fa-solid fa-paper-plane"></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".5s"
                        >
                          <span>Your Phone</span>
                          <input
                            name="phone"
                            id="phone"
                            type="tel"
                            placeholder="Your Phone"
                          />
                          <div className="icon icon-2">
                            <i className="fa-solid fa-phone"></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div
                          className="contact-us__input wow fadeInLeft animated"
                          data-wow-delay=".6s"
                        >
                          <span>Your Address</span>
                          <input
                            name="address"
                            id="address"
                            type="text"
                            placeholder="Your Address"
                          />
                          <div className="icon">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div
                          className="contact-us__textarea wow fadeInLeft animated"
                          data-wow-delay=".7s"
                        >
                          <span>Message</span>
                          <textarea
                            name="textarea"
                            id="textarea"
                            placeholder="Write Message.."
                          ></textarea>
                          <div className="icon">
                            <i className="fa-solid fa-envelope"></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className={`contact-btn mt-30 wow fadeInLeft animated ${styles.contactBtn}`}
                          data-wow-delay=".8s"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HelpDesk />
    </div>
  );
}

export default Page;
