import BreadCamp from "@/app/components/BreadCamp";
import Header from "@/app/components/header";
import { getEventById } from "@/lib/events";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const dateTimeParts = event.datetime.split(" ");
  const timeLabel = dateTimeParts.length > 1 ? dateTimeParts.slice(1).join(" ") : "TBA";

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title={event.title} />

      <section className="visa-details__area coaching-details padding-t100 section-space-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="visa-details__content">
                <div className="coaching-details__content-top-img pb-20" data-tilt>
                  <img src={event.mainImg} alt={event.title} />
                </div>
                <h2
                  className="visa-details__content-title mb-20 wow fadeInLeft animated"
                  data-wow-delay=".2s"
                >
                  {event.title}
                </h2>
                <p className="wow fadeInLeft animated" data-wow-delay=".3s">
                  {event.description}
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
                      Time: <span>{timeLabel}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
