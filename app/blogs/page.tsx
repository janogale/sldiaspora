import Link from "next/link";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { blogs } from "../data/blogs";

function Page() {
  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="News & Development" />{" "}
      <section className="blog__area section-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {blogs.map((blog, idx) => (
                <div className="blog__content mb-80" key={blog.title + idx}>
                  <div className="blog__content-thumb">
                    <img
                      src="./assets/imgs/blog/blog-1img.png"
                      alt="img not found"
                    />
                  </div>
                  <ul
                    className="blog__content-meta mt-20 d-flex wow fadeInLeft animated"
                    data-wow-delay=".2s"
                  >
                    <li>
                      <Link href={`/blogs/${blog.id}`}>
                        <svg
                          width="11"
                          height="13"
                          viewBox="0 0 11 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.375 7.625C8.64844 7.625 10.5 9.47656 10.5 11.75C10.5 12.1719 10.1484 12.5 9.75 12.5H0.75C0.328125 12.5 0 12.1719 0 11.75C0 9.47656 1.82812 7.625 4.125 7.625H6.375ZM1.125 11.375H9.35156C9.16406 9.89844 7.89844 8.75 6.375 8.75H4.125C2.57812 8.75 1.3125 9.89844 1.125 11.375ZM5.25 6.5C3.58594 6.5 2.25 5.16406 2.25 3.5C2.25 1.85938 3.58594 0.5 5.25 0.5C6.89062 0.5 8.25 1.85938 8.25 3.5C8.25 5.16406 6.89062 6.5 5.25 6.5ZM5.25 1.625C4.19531 1.625 3.375 2.46875 3.375 3.5C3.375 4.55469 4.19531 5.375 5.25 5.375C6.28125 5.375 7.125 4.55469 7.125 3.5C7.125 2.46875 6.28125 1.625 5.25 1.625Z"
                            fill="#111214"
                          />
                        </svg>
                        {blog.author}
                      </Link>
                    </li>
                    <li>
                      <span>
                        <svg
                          width="11"
                          height="13"
                          viewBox="0 0 11 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.5625 2H6.9375V1.0625C6.9375 0.757812 7.17188 0.5 7.5 0.5C7.80469 0.5 8.0625 0.757812 8.0625 1.0625V2H9C9.82031 2 10.5 2.67969 10.5 3.5V11C10.5 11.8438 9.82031 12.5 9 12.5H1.5C0.65625 12.5 0 11.8438 0 11V3.5C0 2.67969 0.65625 2 1.5 2H2.4375V1.0625C2.4375 0.757812 2.67188 0.5 3 0.5C3.30469 0.5 3.5625 0.757812 3.5625 1.0625V2ZM1.125 6.3125H3V5H1.125V6.3125ZM1.125 7.4375V8.9375H3V7.4375H1.125ZM4.125 7.4375V8.9375H6.375V7.4375H4.125ZM7.5 7.4375V8.9375H9.375V7.4375H7.5ZM9.375 5H7.5V6.3125H9.375V5ZM9.375 10.0625H7.5V11.375H9C9.1875 11.375 9.375 11.2109 9.375 11V10.0625ZM6.375 10.0625H4.125V11.375H6.375V10.0625ZM3 10.0625H1.125V11C1.125 11.2109 1.28906 11.375 1.5 11.375H3V10.0625ZM6.375 5H4.125V6.3125H6.375V5Z"
                            fill="#111214"
                          />
                        </svg>
                        {blog.date}
                      </span>
                    </li>
                    <li>
                      <a href="#">
                        <svg
                          width="17"
                          height="13"
                          viewBox="0 0 17 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.875 0.5C8.54688 0.5 10.75 2.35156 10.75 4.625C10.75 6.92188 8.54688 8.75 5.875 8.75C5.42969 8.75 5.00781 8.70312 4.58594 8.60938C3.88281 9.05469 2.85156 9.5 1.5625 9.5C1.32812 9.5 1.11719 9.38281 1.04688 9.14844C0.953125 8.9375 0.976562 8.70312 1.14062 8.51562C1.16406 8.51562 1.67969 7.95312 2.05469 7.20312C1.39844 6.5 1 5.60938 1 4.625C1 2.35156 3.17969 0.5 5.875 0.5ZM4.84375 7.50781C5.19531 7.60156 5.52344 7.625 5.875 7.625C7.9375 7.625 9.625 6.28906 9.625 4.625C9.625 2.98438 7.9375 1.625 5.875 1.625C3.78906 1.625 2.125 2.98438 2.125 4.625C2.125 5.46875 2.52344 6.07812 2.875 6.42969L3.4375 7.01562L3.0625 7.74219C2.96875 7.88281 2.875 8.04688 2.78125 8.21094C3.20312 8.09375 3.60156 7.90625 4 7.64844L4.39844 7.41406L4.84375 7.50781ZM11.3359 3.52344C13.9375 3.61719 16 5.42188 16 7.625C16 8.60938 15.5781 9.5 14.9219 10.2031C15.2969 10.9531 15.8125 11.5156 15.8359 11.5156C16 11.7031 16.0234 11.9375 15.9297 12.1484C15.8594 12.3828 15.6484 12.5 15.4141 12.5C14.125 12.5 13.0938 12.0547 12.3906 11.6094C11.9688 11.7031 11.5469 11.75 11.125 11.75C9.20312 11.75 7.53906 10.8125 6.74219 9.45312C7.14062 9.40625 7.53906 9.3125 7.89062 9.17188C8.54688 10.0625 9.74219 10.625 11.125 10.625C11.4531 10.625 11.7812 10.6016 12.1328 10.5078L12.5781 10.4141L12.9766 10.6484C13.375 10.9062 13.7734 11.0938 14.1953 11.2109C14.1016 11.0469 14.0078 10.8828 13.9141 10.7422L13.5391 10.0156L14.1016 9.42969C14.4531 9.07812 14.875 8.46875 14.875 7.625C14.875 6.07812 13.375 4.8125 11.4766 4.64844L11.5 4.625C11.5 4.25 11.4297 3.875 11.3359 3.52344Z"
                            fill="#111214"
                          />
                        </svg>
                        Comments ({blog.comments})
                      </a>
                    </li>
                  </ul>
                  <div className="blog__content-text mt-20">
                    <h2
                      className="blog__content-text-title wow fadeInLeft animated"
                      data-wow-delay=".3s"
                    >
                      <a href={`/blogs/${blog.id}`}>{blog.title}</a>
                    </h2>
                    <p
                      className=" wow fadeInLeft animated"
                      data-wow-delay=".8s"
                    >
                      {blog.desc}
                    </p>
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="rr-btn mt-40 wow fadeInLeft animated"
                      data-wow-delay="1s"
                    >
                      Learn More
                      <svg
                        width="15"
                        height="10"
                        viewBox="0 0 15 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7266 5.37891L10.2266 8.87891C9.89844 9.23438 9.32422 9.23438 8.99609 8.87891C8.64062 8.55078 8.64062 7.97656 8.99609 7.64844L10.9922 5.625H0.875C0.382812 5.625 0 5.24219 0 4.75C0 4.23047 0.382812 3.875 0.875 3.875H10.9922L8.99609 1.87891C8.64062 1.55078 8.64062 0.976562 8.99609 0.648438C9.32422 0.292969 9.89844 0.292969 10.2266 0.648438L13.7266 4.14844C14.082 4.47656 14.082 5.05078 13.7266 5.37891Z"
                          fill="white"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <div className="sidebar">
                <div
                  className="sidebar__widget wow fadeInLeft animated"
                  data-wow-delay=".4s"
                >
                  <h5 className="sidebar__widget-title mb-30">Search Here </h5>

                  <div className="sidebar__widget-search">
                    <div className="search__bar position-relative">
                      <input type="text" id="search" placeholder="Search" />
                      <div className="icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="sidebar__widget wow fadeInLeft animated"
                  data-wow-delay=".5s"
                >
                  <h5 className="sidebar__widget-title">Popular Post</h5>

                  <div className="sidebar-post__wrapper mt-20">
                    <div className="sidebar-post">
                      <a
                        href="blog-details.html"
                        className="sidebar-post_thumb"
                      >
                        <img
                          src="assets/imgs/blog/blog-right-small-img1.png"
                          alt="post"
                        />
                      </a>

                      <div className="sidebar-post_content">
                        <ul className="post-meta">
                          <li>
                            <svg
                              width="11"
                              height="13"
                              viewBox="0 0 11 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.5625 2H6.9375V1.0625C6.9375 0.757812 7.17188 0.5 7.5 0.5C7.80469 0.5 8.0625 0.757812 8.0625 1.0625V2H9C9.82031 2 10.5 2.67969 10.5 3.5V11C10.5 11.8438 9.82031 12.5 9 12.5H1.5C0.65625 12.5 0 11.8438 0 11V3.5C0 2.67969 0.65625 2 1.5 2H2.4375V1.0625C2.4375 0.757812 2.67188 0.5 3 0.5C3.30469 0.5 3.5625 0.757812 3.5625 1.0625V2ZM1.125 6.3125H3V5H1.125V6.3125ZM1.125 7.4375V8.9375H3V7.4375H1.125ZM4.125 7.4375V8.9375H6.375V7.4375H4.125ZM7.5 7.4375V8.9375H9.375V7.4375H7.5ZM9.375 5H7.5V6.3125H9.375V5ZM9.375 10.0625H7.5V11.375H9C9.1875 11.375 9.375 11.2109 9.375 11V10.0625ZM6.375 10.0625H4.125V11.375H6.375V10.0625ZM3 10.0625H1.125V11C1.125 11.2109 1.28906 11.375 1.5 11.375H3V10.0625ZM6.375 5H4.125V6.3125H6.375V5Z"
                                fill="#83CD20"
                              />
                            </svg>
                            October 19, 2022
                          </li>
                        </ul>

                        <a href="blog-details.html">
                          <h3 className="title rr-fw-medium">
                            Find Your Adventure Live Your Passion
                          </h3>
                        </a>
                      </div>
                    </div>

                    <div className="sidebar-post">
                      <a
                        href="blog-details.html"
                        className="sidebar-post_thumb"
                      >
                        <img
                          src="assets/imgs/blog/blog-right-small-img2.png"
                          alt="post"
                        />
                      </a>

                      <div className="sidebar-post_content">
                        <ul className="post-meta">
                          <li>
                            <svg
                              width="11"
                              height="13"
                              viewBox="0 0 11 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.5625 2H6.9375V1.0625C6.9375 0.757812 7.17188 0.5 7.5 0.5C7.80469 0.5 8.0625 0.757812 8.0625 1.0625V2H9C9.82031 2 10.5 2.67969 10.5 3.5V11C10.5 11.8438 9.82031 12.5 9 12.5H1.5C0.65625 12.5 0 11.8438 0 11V3.5C0 2.67969 0.65625 2 1.5 2H2.4375V1.0625C2.4375 0.757812 2.67188 0.5 3 0.5C3.30469 0.5 3.5625 0.757812 3.5625 1.0625V2ZM1.125 6.3125H3V5H1.125V6.3125ZM1.125 7.4375V8.9375H3V7.4375H1.125ZM4.125 7.4375V8.9375H6.375V7.4375H4.125ZM7.5 7.4375V8.9375H9.375V7.4375H7.5ZM9.375 5H7.5V6.3125H9.375V5ZM9.375 10.0625H7.5V11.375H9C9.1875 11.375 9.375 11.2109 9.375 11V10.0625ZM6.375 10.0625H4.125V11.375H6.375V10.0625ZM3 10.0625H1.125V11C1.125 11.2109 1.28906 11.375 1.5 11.375H3V10.0625ZM6.375 5H4.125V6.3125H6.375V5Z"
                                fill="#83CD20"
                              />
                            </svg>
                            October 19, 2022
                          </li>
                        </ul>

                        <a href="blog-details.html">
                          <h3 className="title rr-fw-medium">
                            Ravel Beyond Your Imagination
                          </h3>
                        </a>
                      </div>
                    </div>

                    <div className="sidebar-post">
                      <a
                        href="blog-details.html"
                        className="sidebar-post_thumb"
                      >
                        <img
                          src="assets/imgs/blog/blog-right-small-img3.png"
                          alt="post"
                        />
                      </a>

                      <div className="sidebar-post_content">
                        <ul className="post-meta">
                          <li>
                            <svg
                              width="11"
                              height="13"
                              viewBox="0 0 11 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.5625 2H6.9375V1.0625C6.9375 0.757812 7.17188 0.5 7.5 0.5C7.80469 0.5 8.0625 0.757812 8.0625 1.0625V2H9C9.82031 2 10.5 2.67969 10.5 3.5V11C10.5 11.8438 9.82031 12.5 9 12.5H1.5C0.65625 12.5 0 11.8438 0 11V3.5C0 2.67969 0.65625 2 1.5 2H2.4375V1.0625C2.4375 0.757812 2.67188 0.5 3 0.5C3.30469 0.5 3.5625 0.757812 3.5625 1.0625V2ZM1.125 6.3125H3V5H1.125V6.3125ZM1.125 7.4375V8.9375H3V7.4375H1.125ZM4.125 7.4375V8.9375H6.375V7.4375H4.125ZM7.5 7.4375V8.9375H9.375V7.4375H7.5ZM9.375 5H7.5V6.3125H9.375V5ZM9.375 10.0625H7.5V11.375H9C9.1875 11.375 9.375 11.2109 9.375 11V10.0625ZM6.375 10.0625H4.125V11.375H6.375V10.0625ZM3 10.0625H1.125V11C1.125 11.2109 1.28906 11.375 1.5 11.375H3V10.0625ZM6.375 5H4.125V6.3125H6.375V5Z"
                                fill="#83CD20"
                              />
                            </svg>
                            October 19, 2022
                          </li>
                        </ul>

                        <a href="blog-details.html">
                          <h3 className="title rr-fw-medium">
                            Adventure Awaits Around Every Corner
                          </h3>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="sidebar__widget wow fadeInLeft animated"
                  data-wow-delay=".6s"
                >
                  <h5 className="sidebar__widget-title sidebar__widget-title__have-bar">
                    Category
                  </h5>

                  <div className="sidebar__widget-category">
                    <a className="mt-20" href="blog-details.html">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="5"
                          viewBox="0 0 5 5"
                          fill="none"
                        ></svg>{" "}
                        Flight Booking
                      </span>
                    </a>
                    <a className="mt-15" href="blog-details.html">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="5"
                          viewBox="0 0 5 5"
                          fill="none"
                        ></svg>{" "}
                        Vacation Packages
                      </span>
                    </a>
                    <a className="mt-15" href="blog-details.html">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="5"
                          viewBox="0 0 5 5"
                          fill="none"
                        ></svg>{" "}
                        Car Rental Services
                      </span>
                    </a>
                    <a className="mt-15" href="blog-details.html">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="5"
                          viewBox="0 0 5 5"
                          fill="none"
                        ></svg>{" "}
                        Adventure Travel Planning
                      </span>
                    </a>
                    <a className="mt-15" href="blog-details.html">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="5"
                          viewBox="0 0 5 5"
                          fill="none"
                        ></svg>{" "}
                        Group Travel Organization
                      </span>
                    </a>
                    <a className="mt-15" href="blog-details.html">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="5"
                          viewBox="0 0 5 5"
                          fill="none"
                        ></svg>{" "}
                        Insurance Services
                      </span>
                    </a>
                  </div>
                </div>

                <div
                  className="sidebar__widget wow fadeInLeft animated"
                  data-wow-delay=".7s"
                >
                  <h5 className="sidebar__widget-title">Popular Tags</h5>

                  <div className="sidebar__widget-tags mt-20">
                    <div className="tags">
                      <a href="blog-details.html">Travel Planning</a>
                      <a href="blog-details.html">Safety Guides</a>
                      <a href="blog-details.html">Spa Retreats</a>
                      <a href="blog-details.html">Wine Tours</a>
                      <a href="blog-details.html">Travel Pack</a>
                      <a href="blog-details.html">Solo Travel</a>
                      <a href="blog-details.html">Travel Programs</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
