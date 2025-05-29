"use client";
import React from "react";
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  return (
    <footer className={`flex flex-col justify-center items-center py-4 text-[var(--foreground)] ${theme === 'dark' ? 'bg-[#101625]' : 'bg-[var(--background)]'} w-full -mb-5 -mt-5`}>
      {/* <div className="flex space-x-4 mb-4">
        <a href="https://t.me" target="_blank" rel="noopener noreferrer">
          <img src="/telegram.png" alt="Telegram" className="w-8 h-8" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="/x.png" alt="X" className="w-8 h-8" />
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <img src="/discord.svg" alt="Discord" className="w-8 h-8" />
        </a>
      </div> */}
      <div className="text-center">
        <p className="mb-2">© 2025 PocketChange.fund</p>
        <a
          href="/privacy-policy"
          className="hover:underline hover:underline-offset-4 transition-all duration-150 hidden xl:block"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
