"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Blogs from "./components/blogs";
import DiasporaInitiatives from "./components/diaspora-initiatives";
import DirectorMessage from "./components/director-message";
import ExploreSomaliland from "./components/explore-somaliland";
import GalleriesHome from "./components/galleries-home";
import GetInvolved from "./components/get-involved";
import Header from "./components/header";
import HelpDesk from "./components/helpDesk";
import HeroMap from "./components/hero2";
import InvestmentOpportunities from "./components/investment-opportunities";
import NewsEvents from "./components/news-events";
import ProcessSection from "./components/process-section";
import Services from "./components/services";
import SomalilandFlagBanner from "./components/somaliland-flag-banner";
import SomalilandFlagBanner2 from "./components/somaliland-flag-banner2";
import VisaCategory from "./components/visa-category";
import { GlobeMarkerData } from "./types";
interface ApiLocation {
  id: string;
  city: string;
  country: string;
  map: {
    type: string;
    coordinates: number[]; // [lng, lat] per GeoJSON spec
  } | null;
}

export default function Home() {
  return (
    <>
      <SomalilandFlagBanner2 />
      <Header />

      <main>
        <HeroMap />
        <ProcessSection />

        <DirectorMessage />

        <Services />
        <SomalilandFlagBanner />
        <GetInvolved />

        <InvestmentOpportunities />

        <DiasporaInitiatives />

        <ExploreSomaliland />
        <SomalilandFlagBanner />

        <VisaCategory />

        <NewsEvents />

        <GalleriesHome />
        <SomalilandFlagBanner />

        <HelpDesk />
        <SomalilandFlagBanner />
        <Blogs />
      </main>
    </>
  );
}
