"use client";

import type { NextPage } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";

const Home: NextPage = () => {
  return (
    <>
      <div
        className="bodyText bg-[var(--background)]"
      >
        <Header />
        <main className="min-h-[100vh] pt-24 max-w-[1440px] mx-auto">
          <Dashboard />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Home;
