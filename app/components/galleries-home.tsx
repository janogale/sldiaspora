"use client";
import Link from "next/link";
import { useState } from "react";

// Gallery preview data - showing 6 images from recent events
const galleryPreviewData = [
  {
    image:
      "/assets/imgs/Diaspora Week 2025/526662922_1167327548769637_8258044179086207429_n.jpg",
    title: "Diaspora Week 2025",
    category: "Community Event",
  },
  {
    image:
      "/assets/imgs/National Diaspora Policy Validation Workshop/National Diaspora Policy Validation Workshop/518328098_1155356866633372_1960477033848110088_n.jpg",
    title: "Policy Validation Workshop",
    category: "Workshop",
  },
  {
    image:
      "/assets/imgs/Diaspora Week 2025/527426570_1169233348579057_2900217355379882609_n.jpg",
    title: "Diaspora Week Celebration",
    category: "Community Event",
  },
  {
    image:
      "/assets/imgs/Interministerial Task Force Establishment/Interministerial Task Force Establishment/490607389_1082087983960261_69337729245276194_n.jpg",
    title: "Task Force Establishment",
    category: "Official Event",
  },
  {
    image:
      "/assets/imgs/Diaspora Week 2025/528070011_1167334945435564_8790450703157594751_n.jpg",
    title: "Cultural Activities",
    category: "Community Event",
  },
  {
    image:
      "/assets/imgs/National Diaspora Policy Validation Workshop/National Diaspora Policy Validation Workshop/518407752_1153978426771216_7045068734087327554_n.jpg",
    title: "Workshop Participants",
    category: "Workshop",
  },
];

const GalleriesHome = () => {
  return (
    <section className="gallery-home__area section-space">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title2 mb-60 text-center">
              <div className="section-title2__wrapper">
                <span
                  className="section-title2__wrapper-subtitle wow fadeInUp animated"
                  data-wow-delay=".2s"
                >
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_vision)">
                      <path
                        d="M19.299 2.66986C19.2609 2.59008 19.1926 2.52868 19.1093 2.49911L12.195 0.0581985C12.0215 -0.00317634 11.831 0.0879901 11.7697 0.26149L10.199 4.70581H9.51204V3.57248C9.51202 3.41941 9.47686 3.26838 9.40926 3.13104C9.34166 2.9937 9.24343 2.87372 9.12214 2.78033C9.00085 2.68695 8.85974 2.62266 8.70968 2.59242C8.55962 2.56217 8.40462 2.56679 8.25663 2.6059L0.24744 4.7169V4.7229C0.176847 4.74064 0.114146 4.78133 0.0691834 4.83857C0.0242205 4.89581 -0.000457842 4.96636 -0.000976562 5.03915L-0.000976562 19.0391C-0.000976562 19.5914 0.446773 20.0391 0.999021 20.0391H10.3323C10.8846 20.0391 11.3323 19.5914 11.3323 19.0391V16.0145L14.0057 16.9582C14.1793 17.0194 14.3697 16.9285 14.431 16.7548L19.3133 2.92457C19.3278 2.88326 19.334 2.83949 19.3315 2.79578C19.329 2.75208 19.318 2.70928 19.2989 2.66986H19.299Z"
                        fill="#034833"
                      />
                    </g>
                  </svg>
                  Our Memories
                  <img
                    style={{ width: "52px", height: "10px" }}
                    src="/assets/imgs/shape2.svg"
                    alt=""
                  />
                </span>
                <h2
                  className="section-title2__wrapper-title wow fadeInUp animated"
                  data-wow-delay=".3s"
                >
                  Photo Galleries
                </h2>
                <p className="wow fadeInUp animated" data-wow-delay=".4s">
                  Explore our collection of memorable events and initiatives
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {galleryPreviewData.map((item, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 wow fadeInUp animated"
              data-wow-delay={`.${index + 2}s`}
            >
              <div className="gallery-home__item">
                <div className="gallery-home__thumb">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/imgs/about/about-big-img.png";
                    }}
                  />
                  <div className="gallery-home__overlay">
                    <div className="gallery-home__content">
                      <span className="gallery-home__category">
                        {item.category}
                      </span>
                      <h4 className="gallery-home__title">{item.title}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-50">
          <div
            className="col-12 text-center wow fadeInUp animated"
            data-wow-delay=".8s"
          >
            <Link href="/galleries" className="rr-btn">
              <span>View All Galleries</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gallery-home__area {
          background: #f8f9fa;
        }

        .gallery-home__item {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          height: 350px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .gallery-home__item:hover {
          transform: translateY(-5px);
        }

        .gallery-home__thumb {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .gallery-home__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-home__item:hover .gallery-home__thumb img {
          transform: scale(1.1);
        }

        .gallery-home__overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          padding: 30px 20px;
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .gallery-home__item:hover .gallery-home__overlay {
          transform: translateY(0);
          opacity: 1;
        }

        .gallery-home__category {
          display: inline-block;
          padding: 4px 12px;
          background: #047a4c;
          color: white;
          font-size: 12px;
          font-weight: 600;
          border-radius: 4px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .gallery-home__title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        .rr-btn {
          padding: 15px 30px;
          background: #047a4c;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .rr-btn:hover {
          background: #035a38;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(4, 122, 76, 0.3);
        }

        .rr-btn i {
          transition: transform 0.3s ease;
        }

        .rr-btn:hover i {
          transform: translateX(5px);
        }
      `}</style>
    </section>
  );
};

export default GalleriesHome;
