import Header from "./components/header";
import Hero from "./components/hero";
import ChooseUs from "./components/choose-us";
import LatestProject from "./components/latest-project";
import ProcessSection from "./components/process-section";
import VisaCategory2 from "./components/visa-category-2";
import VisaCategory from "./components/visa-category";
import Blogs from "./components/blogs";
import Testimonial from "./components/testimonial";
import TicketBooking from "./components/ticket-booking";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ChooseUs />
        <ProcessSection />
        <LatestProject />
        <VisaCategory2 />
        <div style={{ backgroundColor: "#006D21", height: "70px" }}></div>
        <VisaCategory />
        <Testimonial />
        <TicketBooking />
        <Blogs />
      </main>
      <Footer />
    </>
  );
}
