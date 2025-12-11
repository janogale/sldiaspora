"use client";
import BreadCamp from "@/app/components/BreadCamp";
import Header2 from "@/app/components/header2";
import { events } from "@/app/data/events";
import { useParams } from "next/navigation";

const EventDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const event = events.find((e) => e.id === parseInt(params.id));

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <Header2 />
      <BreadCamp title={event.title} />

      <section className="visa-details__area coaching-details padding-t100 section-space-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="visa-details__content">
                <div
                  className="coaching-details__content-top-img pb-20"
                  data-tilt
                >
                  <img src={event.mainImg} alt="img not found" />
                </div>
                <h2
                  className="visa-details__content-title mb-20 wow fadeInLeft animated"
                  data-wow-delay=".2s"
                >
                  {event.title}
                </h2>
                <p className=" wow fadeInLeft animated" data-wow-delay=".3s">
                  {event.description}
                </p>

                <p>
                  Aliquam eros justo, posuere loborti viverra laoreet matti
                  ullamcorper posuere viverra .Aliquam eros justo, posuere
                  lobortis viverra laoreet augue mattis fmentum ullamcorper
                  viverra laoreet Aliquam eros justo, posuere loborti viverra
                  laoreet matti ullamcorper posuere viverra .Aliquam eros justo,
                  posu
                </p>
                <div
                  className="visa-details__content-list mb-30 mt-20 wow fadeInLeft animated"
                  data-wow-delay=".5s"
                >
                  <ul>
                    <li>
                      Location: <span>{event.location}</span>
                    </li>
                    <li className="mt-20">
                      Date: <span>{event.datetime}</span>
                    </li>
                    <li className="mt-20">
                      Time:{" "}
                      <span>
                        {event.datetime.split(" ")[1] +
                          " " +
                          event.datetime.split(" ")[2]}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4">
              <div
                className="visa-details__widget mt-30 wow fadeInLeft animated"
                data-wow-delay=".3s"
              >
                <div className="visa-details__widget-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <h3 className="mt-15">GET TOUCH</h3>
                <a href="tel:+888123456765">(+888) 123 456 765</a>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailsPage;
