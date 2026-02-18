"use client";
import { useState } from "react";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";

// Gallery data organized by events
const galleryData = [
  {
    id: 1,
    title: "Diaspora Week 2025",
    description:
      "Annual celebration bringing together the Somaliland diaspora community",
    folder: "Diaspora Week 2025",
    images: [
      "526662922_1167327548769637_8258044179086207429_n.jpg",
      "526843704_1167334772102248_1967425005920803411_n.jpg",
      "527054742_1167225798779812_6423692539836071481_n.jpg",
      "527077783_1167227228779669_8491341035157829253_n.jpg",
      "527426570_1169233348579057_2900217355379882609_n.jpg",
      "527691517_1167226418779750_3577322439121286715_n.jpg",
      "528070011_1167334945435564_8790450703157594751_n.jpg",
      "528294853_1167925655376493_3014786838341524566_n.jpg",
      "528345424_1169233925245666_1511022412967923258_n.jpg",
      "528393697_1169233671912358_7811958595603563909_n.jpg",
      "528603324_1169233405245718_3332848329999857221_n.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.14_2a87fb34.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.14_946abe9e.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.15_bbb8408a.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.15_f81c9b5c.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.16_2e6f6949.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.16_76f64df3.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.16_208e5453.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.17_58c32d4c.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.17_183b0d2e.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.17_fa428c9a.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.18_504ff82f.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.18_e25eaf1b.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.19_1b472936.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.19_9135d25a.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.19_62261fd0.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.20_0c63c6c7.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.20_5a837c42.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.21_5f4b1d31.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.21_6b160b18.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.21_b894cd82.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.22_c78a94d5.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.35_cab44d91.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.36_2651c106.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.36_b2fe32eb (1).jpg",
      "WhatsApp Image 2025-11-09 at 13.46.10_ac1b8c97.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.10_c18ec1cf.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.11_00078f1a.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.11_520640e9.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.12_ed607ad8.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.13_8f2b5ab4.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.14_a0380627.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.14_f96c72b6.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.17_1e687017.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.17_c95bb352.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.18_2b3f0be0.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.18_50ac28f6.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.19_1bef5d62.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.19_c77633a9.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.21_4cb58c8b.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.21_faa68e56.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.22_00b5721d.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.23_9f6e0b40.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.24_80f352dc.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.24_42693ee7.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.24_fbd45521.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.25_e6f2ee81.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.25_ec995650.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.26_4a8ba8d7.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.26_07c6fa02.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.26_d0ed2764.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.27_5916b697.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.27_b8eec82a.jpg",
      "WhatsApp Image 2025-11-09 at 13.46.28_6f774296.jpg",
    ],
  },
  {
    id: 2,
    title: "Interministerial Task Force Establishment",
    description:
      "Establishment of the interministerial task force for diaspora coordination",
    folder:
      "Interministerial Task Force Establishment/Interministerial Task Force Establishment",
    images: [
      "490607389_1082087983960261_69337729245276194_n.jpg",
      "490765958_1082088283960231_483629678252474134_n.jpg",
      "490766625_1082091857293207_4134085627049957964_n.jpg",
      "490801733_1082090523960007_4654109309012119034_n.jpg",
      "490809887_1082091340626592_7852047398863199725_n.jpg",
      "490813029_1082088807293512_3552604498690149709_n.jpg",
      "490832210_1082091080626618_5540923479298453263_n.jpg",
      "490846791_1082087807293612_6314817420059089186_n.jpg",
      "490942044_1082089970626729_2671679415747552554_n.jpg",
      "490950079_1082088797293513_7782986496522644155_n.jpg",
      "490957578_1082088170626909_3551087103995353990_n.jpg",
      "491014241_1082087527293640_3821713726249598455_n.jpg",
      "491014576_1082090593960000_1599536228944686717_n.jpg",
      "491090273_1082088437293549_2097287284244528627_n.jpg",
      "491399956_1082089800626746_8628510449658434914_n.jpg",
      "491685244_1082089643960095_8893099722336638964_n.jpg",
      "491744264_1082087537293639_726881315310085947_n.jpg",
      "491745922_1082088400626886_3645293169472917727_n.jpg",
      "491844629_1082090697293323_6885668969458444554_n.jpg",
      "491882513_1082087773960282_6076536147904613314_n.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.07_b58c29b5.jpg",
    ],
  },
  {
    id: 3,
    title: "National Diaspora Policy Validation Workshop",
    description:
      "Workshop for validating the national diaspora policy framework",
    folder:
      "National Diaspora Policy Validation Workshop/National Diaspora Policy Validation Workshop",
    images: [
      "518328098_1155356866633372_1960477033848110088_n.jpg",
      "518331937_1155361416632917_2635698330612660050_n.jpg",
      "518335875_1155356293300096_3952208302164867614_n.jpg",
      "518336251_1155344049967987_4337742719814668059_n.jpg",
      "518358432_1155343423301383_529507315034644967_n.jpg",
      "518378266_1155361829966209_8571902266219499854_n.jpg",
      "518384959_1155355313300194_5959430091064404049_n.jpg",
      "518385522_1155362373299488_8065196909084698772_n.jpg",
      "518407752_1153978426771216_7045068734087327554_n.jpg",
      "518466355_1153978603437865_562584404352291335_n.jpg",
      "518996343_1153978960104496_3082626851905610866_n.jpg",
      "519521364_1153977623437963_1924384985897666471_n.jpg",
      "519601502_1153978560104536_2070504161726282997_n.jpg",
      "519603228_1153979263437799_7775110212598771105_n.jpg",
      "520263950_1153979176771141_7812108357250123153_n.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.07_01da476b.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.08_d6205ea0.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.08_dd287eee.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.09_69440b97.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.09_abe9de35.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.09_cf1f0dd4.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.10_1e2398b7.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.10_732a8385.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.11_4627852e.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.11_bd8db510.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.11_bf3928cd.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.12_51629a59.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.12_b990914a.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.13_506247a4.jpg",
      "WhatsApp Image 2025-11-09 at 13.32.13_d38cf339.jpg",
    ],
  },
];

export default function Galleries() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleEventClick = (eventId: number) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
  };

  const openLightbox = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

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

          {/* Event Categories */}
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
                    {/* ({event.images.length}) */}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Display selected event or all events */}
          {galleryData
            .filter((event) => !selectedEvent || event.id === selectedEvent)
            .map((event) => (
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
                  {event.images.map((image, index) => {
                    const imagePath = `/assets/imgs/${event.folder}/${image}`;
                    return (
                      <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                        <div
                          className="gallery__item"
                          onClick={() => openLightbox(imagePath)}
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
                            src={imagePath}
                            alt={`${event.title} - Image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "/assets/imgs/about/about-big-img.png";
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
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Lightbox Modal */}
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
            ×
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
