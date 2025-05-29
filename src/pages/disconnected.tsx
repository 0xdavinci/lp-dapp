"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CheckCircle, Wallet, FileText, Users } from "lucide-react";

export default function Disconnected() {
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
        className='bg-[var(--background)] flex flex-col items-center px-4 gap-4 py-4
        '
        ref={containerRef}
        initial='hidden'
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <motion.h1
          className='text-4xl font-bold mb-3 pt-14 '
          variants={{ hidden: { y: -50 }, visible: { y: 0 } }}
        >
          Welcome to Pocket Ventures
        </motion.h1>
        <motion.main
          className='max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-left'
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          {/* Left Column */}
          <motion.div variants={{ hidden: { x: -50 }, visible: { x: 0 } }}>
            <motion.h2
              className='text-2xl font-semibold'
              variants={{ hidden: { y: -50 }, visible: { y: 0 } }}
            >
              Limited Partner Access
            </motion.h2>
            <motion.p
              className='block block-color mb-3'
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              Before getting started, please ensure you have answers to these
              questions:
            </motion.p>
            <div className='mb-3 border border-solid shadow-lg rounded-xl p-6'>
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
            </div>
            <motion.div
              className='flex items-center justify-center text-3xl font-bold'
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              OR
            </motion.div>
            <div className='mt-3 border border-solid shadow-lg rounded-xl p-6'>
              <h3 className='text-xl font-semibold mb-2 flex items-center gap-2'>
                <Wallet className='text-green-500' /> Token Holders
              </h3>
              <p>Do you own a $POCKET Token?</p>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={{ hidden: { x: 50 }, visible: { x: 0 } }}>
            <h2 className='text-2xl font-bold mb-4'>
              Let us go then you and I...
            </h2>
            <p className='mb-3'>
              Once you have either become an LP or a $POCKET holder, you have
              established your SmartWallet address with the fund.
            </p>
            <p className='mb-3'>
              Your SmartWallet address is registered; you can now access your
              Limited Partner dashboard.
            </p>
            <div className='border border-solid shadow-lg rounded-xl p-6'>
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
            </div>
          </motion.div>
        </motion.main>
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          If you have any questions, please{" "}
          <a
            target='blank'
            href='https://www.pocketchange.fund/#contact'
            className='text-blue-500 underline'
          >
            ask here
          </a>
          .
        </motion.p>
      </motion.div>
      <Footer />
    </>
  );
}
