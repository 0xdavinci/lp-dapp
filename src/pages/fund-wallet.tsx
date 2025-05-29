"use client";

import type { NextPage } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FundWalletDashboard from "../components/FundWalletDashboard";

const FundWallet: NextPage = () => {
  return (
    <>
      <div className="bodyText ">
        <Header />
        <main className="min-h-[100vh] pt-24 max-w-[1440px] mx-auto">
          <FundWalletDashboard />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default FundWallet;