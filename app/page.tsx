"use client";
import dynamic from "next/dynamic";
import Blogs from "./components/blogs";
import ChooseUs from "./components/choose-us";
import Header from "./components/header";
import HelpDesk from "./components/helpDesk";
import Hero from "./components/hero";
import ProcessSection from "./components/process-section";
import Services from "./components/services";
import Testimonial from "./components/testimonial";
import VisaCategory from "./components/visa-category";
import VisaCategory2 from "./components/visa-category-2";

const WorldMap = dynamic(() => import("./components/WorldMap"), {
  ssr: false, // 👈 disables server-side rendering for this component
});
export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <ChooseUs />
        <ProcessSection />
        <Services />
        <WorldMap />
        {/* <LatestProject /> */}
        <VisaCategory2 />
        <div style={{ backgroundColor: "#006D21", height: "70px" }}></div>
        <VisaCategory />
        <Testimonial />
        <HelpDesk />
        {/* <TicketBooking /> */}
        <Blogs />
      </main>
      {/* <Footer /> */}
    </>
  );
}
