import Link from "next/link";
import HeroMap from "./HeroMap";

const Hero = () => {
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
              <div className="col-lg-12 col-md-12">
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
                  <Link
                    href="/register"
                    className="banner2__button mt-40 mt-xs-25 wow fadeInLeft animated d-inline-block"
                    data-wow-delay=".6s"
                  >
                    Become a Member
                  </Link>
                </div>
              </div>
              <div
                className="col-lg-12 col-md-12"
                // style={{ background: "red" }}
              >
                <HeroMap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
