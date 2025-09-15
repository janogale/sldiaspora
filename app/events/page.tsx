import Link from "next/link";
import BreadCamp from "../components/BreadCamp";
import Header2 from "../components/header2";
import { events } from "../data/events";

function Page() {
  return (
    <div>
      <Header2 />
      <BreadCamp title="Events & Opportunities" />
      <section className="visa-offer__area pt-100 section-space-bottom">
        <div className="container">
          <div className="row mb-minus-30">
            {events.map((event, idx) => (
              <div className="col-lg-6 col-md-6" key={event.title + idx}>
                <div
                  className="visa-offer__item mb-30 wow fadeInLeft animated"
                  data-wow-delay={event.delay}
                >
                  <div className="visa-offer__item-thumb">
                    <div className="visa-offer__item-thumb-small-img">
                      <img src={event.smallImg} alt="img not found" />
                    </div>
                    <img src={event.mainImg} alt="img not found" />
                  </div>
                  <div className="visa-offer__item-content">
                    <div className="visa-offer__item-content-text">
                      <div className="visa-offer__item-content-text-title">
                        <h5>{event.title}</h5>
                        <p>{event.description}</p>
                      </div>
                      <div className="visa-offer__item-content-text-button">
                        <span>
                          <i className="fa-solid fa-location-dot"></i>{" "}
                          {event.location}
                        </span>
                        <br />
                        <span>
                          <i className="fa-solid fa-calendar"></i>{" "}
                          {event.datetime}
                        </span>
                      </div>
                    </div>
                    <div className="visa-offer__item-content-btn mt-30">
                      <Link href={`/events/${event.id}`}>
                        Join Now <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
