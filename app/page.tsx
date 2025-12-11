"use client";

import Blogs from "./components/blogs";
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
import SomalilandFlagBanner2 from "./components/somaliland-flag-banner2";
import VisaCategory from "./components/visa-category";

export default function Home() {
  return (
    <>
      <SomalilandFlagBanner2 />
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />
        <ProcessSection />

        <DirectorMessage />

        <Services />

        <GetInvolved />

        <InvestmentOpportunities />

        <DiasporaInitiatives />

        <ExploreSomaliland />

        <VisaCategory />

        <NewsEvents />

        <HelpDesk />

        <Blogs />
      </main>
    </>
  );
}
