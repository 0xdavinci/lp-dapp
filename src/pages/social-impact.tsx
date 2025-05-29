"use client";

import type { NextPage } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SocialImpactMetrics from "../components/SocialImpactMetrics";

const SocialImpact: NextPage = () => {
  return (
    <>
      <div className="bodyText bg-[#101625]">
        <Header />
        <main className="min-h-[100vh] pt-24 max-w-[1440px] mx-auto">
          <SocialImpactMetrics />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default SocialImpact;
