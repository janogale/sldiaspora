"use client";

import { useEffect, useState } from "react";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";

type GalleryItem = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

export default function Galleries() {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        const response = await fetch("/api/galleries", { method: "GET" });
        const result = (await response.json().catch(() => null)) as
          | { data?: GalleryItem[] }
          | null;

        if (!response.ok) return;
        if (!Array.isArray(result?.data)) return;

        setGalleryData(result.data);
      } catch {
        setGalleryData([]);
      }
    };

    loadGalleries();
  }, []);

  const handleEventClick = (eventId: string) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
  };

  const openLightbox = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const filteredData = galleryData.filter(
    (event) => !selectedEvent || event.id === selectedEvent
  );

  return (
    <>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="Galleries" />

      <section className="gallery__area section-dspace">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title2 mb-60">
                <div className="section-title2__wrapper">
                  <span
                    className="section-title2__wrapper-subtitle wow fadeInLeft animated"
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
                      src="./assets/imgs/shape2.svg"
                      alt=""
                    />
                  </span>
                  <h2
                    className="section-title2__wrapper-title  wow fadeInLeft animated"
                    data-wow-delay=".3s"
                    style={{ fontSize: "3rem" }}
                  >
                    GALLERIES
                  </h2>
                  <p
                    className="wow fadeInUp animated"
                    data-wow-delay=".4s"
                    style={{
                      color: "#666",
                      fontSize: "1.5rem",
                      lineHeight: "1.6",
                    }}
                  >
                    Browse through our collection of memorable events and
                    initiatives
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div
                className="event-filters"
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "left",
                  flexWrap: "wrap",
                }}
              >
                {galleryData.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event.id)}
                    className={`event-filter-btn ${
                      selectedEvent === event.id ? "active" : ""
                    }`}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border:
                        selectedEvent === event.id
                          ? "2px solid #047a4c"
                          : "2px solid #e0e0e0",
                      background:
                        selectedEvent === event.id ? "#047a4c" : "#fff",
                      color: selectedEvent === event.id ? "#fff" : "#333",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="row">
              <div className="col-12">
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e6ece8",
                    borderRadius: 10,
                    padding: 24,
                    color: "#4b5563",
                  }}
                >
                  No gallery items found yet. Add tabs and multiple images in Directus.
                </div>
              </div>
            </div>
          )}

          {filteredData.map((event) => (
            <div key={event.id} className="event-section mb-5">
              <div className="row mb-4">
                <div className="col-12">
                  <h3
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "#047a4c",
                      marginBottom: "8px",
                    }}
                  >
                    {event.title}
                  </h3>
                  <p style={{ color: "#666", fontSize: "1rem" }}>
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="row g-3">
                {event.images.map((image, index) => (
                  <div key={`${event.id}-${index}`} className="col-lg-3 col-md-4 col-sm-6">
                    <div
                      className="gallery__item"
                      onClick={() => openLightbox(image)}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "8px",
                        cursor: "pointer",
                        aspectRatio: "1",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <img
                        src={image}
                        alt={`${event.title} - Image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/imgs/about/about-big-img.png";
                        }}
                      />
                      <div
                        className="gallery__overlay"
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          background:
                            "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                          padding: "20px",
                          transform: "translateY(100%)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <p
                          style={{
                            color: "white",
                            margin: 0,
                            fontSize: "0.9rem",
                          }}
                        >
                          Photo {index + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div
          className="lightbox-modal"
          onClick={closeLightbox}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              fontSize: "24px",
              cursor: "pointer",
              zIndex: 10000,
            }}
          >
            x
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx>{`
        .gallery__item:hover {
          transform: scale(1.02);
        }

        .gallery__item:hover .gallery__overlay {
          transform: translateY(0);
        }

        .event-filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(4, 122, 76, 0.2);
        }
      `}</style>
    </>
  );
}
