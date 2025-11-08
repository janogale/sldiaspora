import BreadCamp from "../components/BreadCamp";
import ChooseUs from "../components/choose-us";
import DepartmentHierarchy from "../components/department-hierarchy";
import Header2 from "../components/header2";
import ProcessSection from "../components/process-section";
import Testimonial from "../components/testimonial";

export default function AboutUs() {
  return (
    <>
      <Header2 />
      <BreadCamp title="About Us" />
      <ChooseUs />
      <section className="overview__area custom-width section-space bottom p-relative border overflow-hidden gray-bg">
        <div
          className="overview__bg-img"
          style={{
            backgroundImage:
              "url('/assets/imgs/process-over-view/process-over-view3-bg-img.png')",
          }}
        ></div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title2 mb-60"></div>
            </div>
          </div>
          <div className="row mb-minus-30">
            <div className=" col-6 col-sm-6">
              <div
                className="overview__item mb-30 wow fadeInLeft animated"
                data-wow-delay=".3s"
              >
                <div className="overview__icon p-relative">
                  <div className="overview__icon-number">
                    <span>01</span>
                  </div>
                </div>
                <div className="overview__text">
                  <h5 className="overview__text-title mb-20">
                    Vision Statement
                  </h5>
                  <p>
                    To serve as the bridge between the Somaliland Diaspora
                    community and the home country for mutually beneficial
                    relationships in socioeconomic development and promotion of
                    Somaliland&apos;s positive national image abroad and
                    international standing.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-6 col-sm-6">
              <div
                className="overview__item mb-30 wow fadeInLeft animated"
                data-wow-delay=".4s"
              >
                <div className="overview__icon p-relative">
                  <div className="overview__icon-number">
                    <span>02</span>
                  </div>
                </div>
                <div className="overview__text">
                  <h5 className="overview__text-title mb-20">
                    Mission Statement
                  </h5>
                  <p>
                    To effectively mobilize and utilize the resources of the
                    Somaliland diaspora, promoting the country&apos;s economic,
                    social, technological, and political development by creating
                    an enabling environment for deeper and sustainable diaspora
                    engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProcessSection />
      <DepartmentHierarchy />
      {/* <TicketBooking /> */}
      <div style={{ marginTop: "10rem" }}></div>
      <Testimonial />
    </>
  );
}
