"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import GlobeMapContainer from "./globemap-container";

// dynamic import MapContainer from "../components/map";
// const MapContainer = dynamic(
//   () => import("./flatmap"),
//   { ssr: false }
// );

const MapSection = () => {
  return (
    <section
      className="overflow-hidden p-relative gray-bg section-space-bottom-170 overflow-hidden"
      style={{ background: "#006D21", paddingBottom: "0rem" }}
    >
      <div className="banner2__area p-relative">
        <div
          className="banner2__shape"
          style={
            {
              // backgroundImage: "url(/banner.png)",
            }
          }
        ></div>
        <div className="banner2__padding-space2">
          <div className="contdainer">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-12 col-md-12 pb-50">
                <div className="banner2__content p-relative text-center">
                  <h6
                    className="banner2__subtitled wow fadeInLeft animated"
                    data-wow-delay=".2s"
                    style={{ color: "white", paddingBottom: "5rem" }}
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
                    className="banner2__title wow fadeInLeft animated mx-auto"
                    data-wow-delay=".4s"
                    style={{ maxWidth: 900 }}
                  >
                    Your official portal for engagement, investment and
                    nation-building.
                  </h1>
                  <div className="d-flex justify-content-center align-items-center my-4 h-25">
                    <Link
                      href="https://admin.sldiaspora.org/admin/register"
                      className="btn btn-lg cta-register-btn d-flex align-items-center justify-content-center gap-2 shadow-lg h-25"
                    >
                      <span className="fw-bold text-uppercase text-xl">
                        Become a Member
                      </span>
                      <i className="fa-solid fa-arrow-right animate-arrow"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <GlobeMapContainer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
