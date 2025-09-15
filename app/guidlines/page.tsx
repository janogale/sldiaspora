"use client";
import Link from "next/link";
import React from "react";
import BreadCamp from "../components/BreadCamp";
import Header2 from "../components/header2";

function Page() {
  const [selectedGuide, setSelectedGuide] = React.useState<number>(1);
  const data = [
    {
      id: 5,
      title: "Passport Application",
      desc: [
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada, and New Zealand. The highest IELT Academic module whether you have adequate possible band score is 9.0; most universities accept a score of 6.0 for undergraduate admission and 6.0-7.0 for graduate admission. There are two versions of the",
        },
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement English Language for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada,",
        },
      ],
      items: [
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
      ],
      image:
        "/assets/imgs/coaching/coaching-details/coaching-details-guides-img1.png",
    },
    {
      id: 1,
      title: "Voter Registration",
      desc: [
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada, and New Zealand. The highest IELT Academic module whether you have adequate possible band score is 9.0; most universities accept a score of 6.0 for undergraduate admission and 6.0-7.0 for graduate admission. There are two versions of the",
        },
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement English Language for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada,",
        },
      ],
      items: [
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
      ],
      image:
        "/assets/imgs/coaching/coaching-details/coaching-details-guides-img1.png",
    },
    {
      id: 2,
      title: "National ID Card",
      desc: [
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada, and New Zealand. The highest IELT Academic module whether you have adequate possible band score is 9.0; most universities accept a score of 6.0 for undergraduate admission and 6.0-7.0 for graduate admission. There are two versions of the",
        },
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement English Language for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada,",
        },
      ],
      items: [
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
      ],
      image:
        "/assets/imgs/coaching/coaching-details/coaching-details-guides-img1.png",
    },
    {
      id: 3,
      title: "Investment Guidelines",
      desc: [
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada, and New Zealand. The highest IELT Academic module whether you have adequate possible band score is 9.0; most universities accept a score of 6.0 for undergraduate admission and 6.0-7.0 for graduate admission. There are two versions of the",
        },
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement English Language for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada,",
        },
      ],
      items: [
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
      ],
      image:
        "/assets/imgs/coaching/coaching-details/coaching-details-guides-img1.png",
    },
    {
      id: 4,
      title: "Tax Regulations",
      desc: [
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada, and New Zealand. The highest IELT Academic module whether you have adequate possible band score is 9.0; most universities accept a score of 6.0 for undergraduate admission and 6.0-7.0 for graduate admission. There are two versions of the",
        },
        {
          body: "IELTS score is internationally recognized as an English Language proficiency requirement English Language for higher education, in almost all countries including the USA, the United Kingdom, Australia, Canada,",
        },
      ],
      items: [
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
        {
          title: "Safety Guides",
          desc: "Lorem ipsum dolor sit amet, cons ectetur adipiscing elit",
        },
      ],
      image:
        "/assets/imgs/coaching/coaching-details/coaching-details-guides-img1.png",
    },
  ];

  return (
    <div>
      <Header2 />
      <BreadCamp title="Guidelines & Resources" />
      <section className="coaching-details__area pt-100 section-space-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="coaching-details__category">
                {" "}
                {data.map((item) => (
                  <Link
                    className={`mb-15 wow fadeInLeft animated${
                      selectedGuide === item.id ? " active" : ""
                    }`}
                    data-wow-delay=".2s"
                    href="#"
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedGuide(item.id);
                    }}
                  >
                    {item.title}
                    <span>
                      <i className="fa-solid fa-angle-right"></i>
                    </span>
                  </Link>
                ))}
              </div>
              <div
                className="coaching-details__widget mt-30 wow fadeInLeft animated"
                data-wow-delay="1.6s"
              >
                <div className="coaching-details__widget-icon">
                  <svg
                    width="41"
                    height="42"
                    viewBox="0 0 41 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.9219 31.2344L38.0469 39.125C37.8125 40.2969 36.875 41.0781 35.7031 41.0781C16.0156 41 0 24.9844 0 5.29688C0 4.125 0.703125 3.1875 1.875 2.95312L9.76562 1.07812C10.8594 0.84375 12.0312 1.46875 12.5 2.48438L16.1719 11C16.5625 12.0156 16.3281 13.1875 15.4688 13.8125L11.25 17.25C13.9062 22.6406 18.2812 27.0156 23.75 29.6719L27.1875 25.4531C27.8125 24.6719 28.9844 24.3594 30 24.75L38.5156 28.4219C39.5312 28.9688 40.1562 30.1406 39.9219 31.2344Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="mt-15">GET TOUCH</h3>
                <a href="tel:+888123456765">(+888) 123 456 765</a>
              </div>
            </div>
            <div className="col-lg-8">
              {data
                .filter((guide) => guide.id === selectedGuide)
                .map((guide) => (
                  <>
                    <div className="coaching-details__content">
                      <div
                        className="coaching-details__content-top-img pb-20"
                        data-tilt
                      >
                        <img
                          src="/assets/imgs/coaching/coaching-details/coaching-details-top-img.png"
                          alt="img not found"
                        />
                      </div>
                      <h2
                        className="coaching-details__content-title mb-30 wow fadeInLeft animated"
                        data-wow-delay=".3s"
                      >
                        {guide.title}
                      </h2>
                      {guide.desc.map((d, idx) => (
                        <p
                          className=" wow fadeInLeft animated"
                          data-wow-delay=".4s"
                          key={idx}
                        >
                          {d.body}{" "}
                        </p>
                      ))}
                    </div>
                    <div className="coaching-details__guides d-flex mb-40 mt-30">
                      <div className="coaching-details__guides-card">
                        {guide.items.map((guide, idx) => (
                          <div
                            key={idx}
                            className={`coaching-details__guides-card-tetx${
                              idx > 0 ? " mt-30" : ""
                            } wow fadeInLeft animated`}
                            data-wow-delay=".4s"
                          >
                            <h5>
                              <i className="fa-solid fa-check"></i>
                              {guide.title}
                            </h5>
                            <p
                              dangerouslySetInnerHTML={{ __html: guide.desc }}
                            />
                          </div>
                        ))}
                      </div>
                      {/* The rest of the content was truncated in the input */}
                    </div>
                  </>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
