"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <>
      <div className="bodyText">
        <Header />
        <main
          className="min-h-[100vh] flex items-center justify-center"
          style={{
            backgroundColor: "var(--background)",
            backgroundImage: theme === 'light' ? "url(/background-decoration.png)" : 'none',
            backgroundSize: "auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom right",
          }}
        >
          <div className="w-full max-w-md">
            <div className="serviceBox">
              <div className="relative overflow-hidden rounded-t-lg bg-[var(--primary-color)] p-4 flex items-center">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4">
                    <Image src="/login.jpg" alt="Login Icon" className="rounded-full" layout="fill" objectFit="cover" />
                  </div>
                  <h1 className="text-5xl font-bold text-white">Login</h1>
                </div>
              </div>
              <div className="p-4">
                <form>
                  <div className="mb-4">
                    <label className="block block-color">Username</label>
                    <input type="text" className="border p-2 w-full bg-[var(--secondary-bg)] border-[var(--border-color)]" />
                  </div>
                  <div className="mb-4">
                    <label className="block block-color">Password</label>
                    <input type="password" className="border p-2 w-full bg-[var(--secondary-bg)] border-[var(--border-color)]" />
                  </div>
                  <button type="submit" className="ctaButton w-full">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
