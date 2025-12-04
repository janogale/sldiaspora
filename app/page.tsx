"use client";

import dynamic from "next/dynamic";
import Blogs from "./components/blogs";
import ChooseUs from "./components/choose-us";
import DiasporaInitiatives from "./components/diaspora-initiatives";
import DirectorMessage from "./components/director-message";
import ExploreSomaliland from "./components/explore-somaliland";
import GetInvolved from "./components/get-involved";
import Header from "./components/header";
import HelpDesk from "./components/helpDesk";
import Hero from "./components/hero";
import InvestmentOpportunities from "./components/investment-opportunities";
import NewsEvents from "./components/news-events";
import ProcessSection from "./components/process-section";
import Services from "./components/services";
import SomalilandFlagBanner from "./components/somaliland-flag-banner";
import SomalilandFlagBanner2 from "./components/somaliland-flag-banner2";
import VisaCategory from "./components/visa-category";
import VisaCategory2 from "./components/visa-category-2";

const WorldMap = dynamic(() => import("./components/WorldMap"), {
  ssr: false, // 👈 disables server-side rendering for this component
});

export default function Home() {
  return (
    <>
      <SomalilandFlagBanner2 />
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Somaliland Flag Banner */}

        {/* Director-General Welcome Message */}
        <DirectorMessage />

        <SomalilandFlagBanner />
        <ChooseUs />

        {/* Quick Stats Bar */}
        {/* <QuickStats /> */}

        {/* Services Overview - How We Serve You */}
        <Services />

        {/* Get Involved Now - Immediate Actions */}
        <SomalilandFlagBanner />
        <GetInvolved />

        {/* Investment Opportunities */}
        <InvestmentOpportunities />

        {/* Diaspora Initiatives */}
        <DiasporaInitiatives />

        {/* Explore Somaliland */}
        <ExploreSomaliland />

        <SomalilandFlagBanner />
        <WorldMap />
        <ProcessSection />
        {/* News & Events */}
        <VisaCategory2 />
        <VisaCategory />

        <SomalilandFlagBanner />
        <NewsEvents />

        {/* Additional Sections */}

        {/* <Testimonial /> */}
        <HelpDesk />

        <SomalilandFlagBanner />
        <Blogs />
      </main>
    </>
  );
}
