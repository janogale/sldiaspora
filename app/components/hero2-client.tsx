"use client";
import dynamic from "next/dynamic";

const HeroMap = dynamic(() => import("./hero2"), { ssr: false });

export default function HeroMapClient() {
  return <HeroMap />;
}
