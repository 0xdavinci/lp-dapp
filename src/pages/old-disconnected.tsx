"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CheckCircle, Wallet, FileText, Users } from "lucide-react";

export default function OldDisconnected() {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const { top, bottom } = container.getBoundingClientRect();
        const isVisible = top < window.innerHeight && bottom >= 0;
        controls.start(isVisible ? "visible" : "hidden");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return (
    <>
      <Header />
      <motion.div
        className='bodyText bg-[var(--background)] min-h-screen flex flex-col items-center justify-center px-4 py-10'
        ref={containerRef}
        initial='hidden'
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <motion.main
          className='text-center max-w-7xl'
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <motion.h1
            className='text-4xl font-bold mb-6 pt-10 '
            variants={{ hidden: { y: -50 }, visible: { y: 0 } }}
          >
            Welcome to Pocket Ventures
          </motion.h1>
          <motion.h2
            className='text-2xl font-semibold'
            variants={{ hidden: { y: -50 }, visible: { y: 0 } }}
          >
            Limited Partner Access
          </motion.h2>
          <motion.p
            className='block block-color mb-6'
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Before getting started, please ensure you have answers to these
            questions:
          </motion.p>

          <motion.div
            className='grid grid-cols-1 gap-4 md:gap-0 md:grid-cols-12 mb-10 w-full'
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <motion.div
              className='col-span-5 border border-solid shadow-lg rounded-xl p-6 text-left'
              variants={{ hidden: { x: -50 }, visible: { x: 0 } }}
            >
              <h3 className='text-xl font-semibold mb-2 flex items-center gap-2'>
                <Users className='text-blue-500' /> Limited Partners
              </h3>
              <ul className='list-disc list-inside space-y-2'>
                <li>
                  Have you spoken with the Fund Partners about your investment?
                </li>
                <li>
                  Have you decided on your commitment amount and investment
                  timeline?
                </li>
                <li>Have you signed your Limited Partner Agreement?</li>
              </ul>
            </motion.div>

            <motion.div
              className='col-span-2 flex items-center justify-center text-3xl font-bold'
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              OR
            </motion.div>

            <motion.div
              className='col-span-5 border border-solid shadow-lg rounded-xl p-6 text-left'
              variants={{ hidden: { x: 50 }, visible: { x: 0 } }}
            >
              <h3 className='text-xl font-semibold mb-2 flex items-center gap-2'>
                <Wallet className='text-green-500' /> Token Holders
              </h3>
              <p>Do you own a $POCKET Token?</p>
            </motion.div>
          </motion.div>

          <motion.h2
            className='text-2xl font-bold mb-2'
            variants={{ hidden: { y: 50 }, visible: { y: 0 } }}
          >
            Let us go then you and I...
          </motion.h2>
          <motion.p
            className='block block-color'
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Once you have either become an LP or a $Pocket holder, you have
            established your SmartWallet address with the fund.
          </motion.p>
          <motion.p
            className='block block-color mb-6'
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Your SmartWallet address is registered; you can now access your
            Limited Partner dashboard.
          </motion.p>

          <motion.div
            className='border border-solid shadow-lg rounded-xl p-6 mb-6 w-full text-left'
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            <h3 className='text-xl font-semibold mb-2 flex items-center gap-2'>
              <FileText className='text-purple-500' /> How to Get Started:
            </h3>
            <ul className='list-decimal list-inside space-y-2'>
              <li>
                Connect your Ethereum wallet using the "Connect" button in the
                upper right corner.
              </li>
              <li>
                Review your commitment details, including transaction history
                and upcoming capital calls.
              </li>
              <li>Make payments when capital calls are issued.</li>
              <li>
                Track your investment, including fund allocations, social
                impact, performance, and returns.
              </li>
            </ul>
          </motion.div>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            If you have any questions, please{" "}
            <a
              href='https://www.pocketchange.fund/#contact'
              className='text-blue-500 underline'
            >
              ask here
            </a>
            .
          </motion.p>
        </motion.main>
      </motion.div>
      <Footer />
    </>
  );
}
