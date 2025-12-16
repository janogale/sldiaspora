"use client";
import React, { useState, useEffect } from "react";
import styles from "./introduction-section.module.css";
import {
  Book,
  DollarSign,
  HandHelping,
  Handshake,
  Map,
  Network,
  Plane,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Diaspora Mapping",
    text: "Building a comprehensive, dynamic database to identify skilled professionals, entrepreneurs, investors, and philanthropists and connect them with opportunities.",
    icon: <Map />,
  },
  {
    id: 2,
    title: "Liaison with Government",
    text: "Serving as the primary point of contact to ensure diaspora voices are heard and integrated into national development planning.",
    icon: <Handshake />,
  },
  {
    id: 3,
    title: "Airport Help Desk",
    text: "Dedicated desk at Egal International Airport offering arrival and departure assistance, guidance on immigration, customs and transport.",
    icon: <Plane />,
  },
  {
    id: 4,
    title: "Knowledge Transfer",
    text: "Facilitating diaspora experts to share knowledge and build capacity with local institutions, businesses, and government agencies.",
    icon: <Book />,
  },
  {
    id: 5,
    title: "Private Investment",
    text: "Supporting diaspora investors with guidance on opportunities, regulations, and business development to stimulate growth and jobs.",
    icon: <DollarSign />,
  },
  {
    id: 6,
    title: "Community Development",
    text: "Partnering with diaspora-led organizations on education, healthcare, infrastructure and social welfare initiatives for lasting impact.",
    icon: <HandHelping />,
  },
  {
    id: 7,
    title: "Network Building & Engagement",
    text: "Engaging diaspora communities worldwide through partnerships with committees, associations and youth groups.",
    icon: <Network />,
  },
  {
    id: 8,
    title: "Coordination with Stakeholders",
    text: "Collaborating with government agencies, international organizations and private partners to deliver coordinated initiatives.",
    icon: <UserCog />,
  },
];

const sliderImages = [
  {
    id: 1,
    src: "/assets/imgs/visa/visa-offers/visa-offer-img3.png",
    alt: "Diaspora community gathering",
  },
  {
    id: 2,
    src: "/assets/imgs/about/about-big-img.png",
    alt: "Community development",
  },
  {
    id: 3,
    src: "/banner.png",
    alt: "Somaliland diaspora",
  },
  {
    id: 4,
    src: "/assets/imgs/about/about-medium-img.png",
    alt: "Cultural heritage",
  },
];

const IntroductionSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying || showAllImages) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000); // Auto-play every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, showAllImages]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => {
    setShowAllImages(true);
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setShowAllImages(false);
    setIsAutoPlaying(true);
  };
  return (
    <section className={styles.root} aria-labelledby="diaspora-heading">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.lead}>
            <div className={styles.eyebrow}>About</div>
            <h2 id="diaspora-heading" className={styles.heading}>
              About the Diaspora Department
            </h2>

            <div className={styles.introText}>
              <p>
                The Diaspora Department serves as a vital link between the
                global Somaliland diaspora and the government of Somaliland,
                acting as a bridge to facilitate seamless access to resources,
                services, and opportunities for Somalilanders living abroad and
                when they return.
              </p>

              <p>
                Our mandate is to empower the diaspora community by providing
                tailored support, fostering engagement, and ensuring their
                contributions are maximized for the benefit of Somaliland’s
                prosperity. As a one-stop-shop for information, programs, and
                services, we are committed to addressing the unique needs of the
                diaspora both when they are in Somaliland and when they are
                abroad.
              </p>

              <p>
                We strive to create a strong network of collaboration,
                knowledge-sharing, and mutual support that aligns with the
                broader Somaliland agenda.
              </p>
            </div>

            <div className={styles.ctaRow}>
              <Link href="/contact">
                <button className={styles.cta}>Get Involved</button>
              </Link>
              <Link
                target="_blank"
                href="https://mfa.govsomaliland.org/article/diaspora-department"
              >
                <button className={`${styles.cta} ${styles.secondary}`}>
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          <div
            className={styles.imageBox}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`${styles.slider} ${
                showAllImages ? styles.gridView : ""
              }`}
            >
              {!showAllImages ? (
                <>
                  <div className={styles.sliderTrack}>
                    {sliderImages.map((image, index) => (
                      <div
                        key={image.id}
                        className={`${styles.slide} ${
                          index === currentSlide ? styles.active : ""
                        }`}
                        style={{
                          transform: `translateX(${
                            (index - currentSlide) * 100
                          }%)`,
                        }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className={styles.sliderImage}
                        />
                      </div>
                    ))}
                  </div>

                  <div className={styles.dots}>
                    {sliderImages.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.dot} ${
                          index === currentSlide ? styles.activeDot : ""
                        }`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.galleryGrid}>
                  {sliderImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={styles.galleryItem}
                      onClick={() => {
                        setCurrentSlide(index);
                        setShowAllImages(false);
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className={styles.galleryImage}
                      />
                      <div className={styles.galleryOverlay}>
                        <span className={styles.galleryNumber}>
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.subSection}>
          <h3 className={styles.subTitle}>Our Mandate and Areas of Service</h3>
          <p className={styles.subLead}>
            We operate with a dual focus: supporting the diaspora during their
            time in Somaliland and maintaining a strong connection while they
            are abroad.
          </p>

          <div className={styles.grid}>
            {services.map((s) => (
              <article
                key={s.id}
                className={styles.card}
                aria-labelledby={`svc-${s.id}`}
              >
                <div className={styles.icon} aria-hidden>
                  {s.icon}
                </div>
                <div>
                  <h4 id={`svc-${s.id}`} className={styles.cardTitle}>
                    {s.title}
                  </h4>
                  <p className={styles.cardText}>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
