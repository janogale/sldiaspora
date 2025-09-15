import BreadCamp from "../components/BreadCamp";
import ChooseUs from "../components/choose-us";
import Header2 from "../components/header2";
import ProcessSection from "../components/process-section";
import Testimonial from "../components/testimonial";
import TicketBooking from "../components/ticket-booking";

export default function AboutUs() {
  return (
    <>
      <Header2 />
      <BreadCamp title="About Us" />
      <ChooseUs />
      <ProcessSection />
      <TicketBooking />
      <div style={{ marginTop: "10rem" }}></div>
      <Testimonial />
    </>
  );
}
