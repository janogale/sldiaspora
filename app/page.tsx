import Blogs from "./components/blogs";
import ChooseUs from "./components/choose-us";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import LatestProject from "./components/latest-project";
import ProcessSection from "./components/process-section";
import Testimonial from "./components/testimonial";
import TicketBooking from "./components/ticket-booking";
import VisaCategory from "./components/visa-category";
import VisaCategory2 from "./components/visa-category-2";

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
      {/* <Footer /> */}
    </>
  );
}
