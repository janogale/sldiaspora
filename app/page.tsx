import Header from "./components/header";
import Hero from "./components/hero";
import ChooseUs from "./components/choose-us";
import LatestProject from "./components/latest-project";
import ProcessSection from "./components/process-section";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ChooseUs />
        <ProcessSection />
        <LatestProject />
      </main>
    </>
  );
}
