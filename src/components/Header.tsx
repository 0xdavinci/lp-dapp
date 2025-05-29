"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId } from "wagmi";
import { HamburgerMenu } from "./HamburgerMenu";
// import ThemeToggleButton from "./ThemeToggleButton";
import Cookies from "js-cookie";
// import styles from "../app/Hero.module.css";
// import { add } from "date-fns";
// import { title } from "process";
// import { isExternal } from "util/types";
import useAdmins from "../hooks/useAdmins";
import { useTheme } from "../context/ThemeContext";
import { iconButtonClasses } from "@mui/material";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("Limited Partner");
  const { address, isConnected } = useAccount();
  const { theme } = useTheme();
  const chainId = useChainId();

  const { admins, isLoading } = useAdmins();

  const isAdmin = useMemo(() => {
    return isConnected && 
           address && 
           !isLoading && 
           admins.includes(address as `0x${string}`);
  }, [isConnected, address, admins, isLoading]);

  useEffect(() => {
    if (!isConnected && pathname !== "/disconnected") {
      Cookies.set("lastPage", pathname);
      router.push("/disconnected");
    } else if (isConnected && pathname === "/disconnected") {
      const lastPage = Cookies.get("lastPage");
      if (lastPage && lastPage !== "/disconnected") {
        router.push(lastPage);
      } else {
        router.push("/");
      }
    }
  }, [isConnected, pathname, router]);

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "Admin Dashboard";
      case "/fund-wallet":
        return "Fund Wallet";
      default:
        return "Dashboard";
    }
  };

  type NavItem = {
    href: string;
    title: string;
    isExternal: boolean;
    icon?: string;
  };

  const navItems: NavItem[] = isConnected
    ? [
        {
          href: "/",
          title: "Dashboard",
          icon: "/dashboard.png",
          isExternal: false,
        },
        {
          href: "/fund-wallet",
          title: "Fund Wallet",
          icon:
            theme === "dark" ? "/fund-wallet.png" : "/fund-wallet-light.png",
          isExternal: false,
        },
        ...(isAdmin
          ? [
              {
                href: "/admin",
                title: "Admin Dashboard",
                icon:
                  theme === "dark"
                    ? "/admin-setting.png"
                    : "/admin-setting-light.png",
                isExternal: false,
              },
            ]
          : []),
      ]
    : [
        {
          href: "https://www.pocketchange.fund/",
          isExternal: false,
          title: "Home",
        },
        {
          href: "https://www.pocketchange.fund/#about",
          isExternal: false,
          title: "About Us",
        },
        {
          href: "https://www.pocketchange.fund/#work",
          isExternal: false,
          title: "How It Works",
        },
        {
          href: "https://www.pocketchange.fund/#insight",
          isExternal: false,
          title: "Insight",
        },
        {
          href: "https://www.pocketchange.fund/#contact",
          isExternal: false,
          title: "Contact Us",
        },
        {
          href: "https://www.pocketchange.fund/#joinus",
          isExternal: false,
          title: "Join Us",
        },
      ];

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://widgets.coingecko.com/coingecko-coin-price-marquee-widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const links = document.querySelectorAll(".mobile-menu a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        setIsOpen(false);
      });
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        mobileMenuRef.current &&
        !event.target.matches(".hamburger-menu") &&
        !event.target.matches(".mobile-menu a") &&
        !event.target.matches(".mobile-menu") &&
        !event.target.matches(".hamburger-menu-open")
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className='flex justify-between items-center px-8 py-4 text-[var(--foreground)] w-full fixed z-20 bg-[var(--background)] border-b-0 z-30'>
        <div className='xl:hidden'>
          {!isConnected ? (
            <a href=' https://www.pocketchange.fund/' target='_blank'>
              <Image
                src={theme === "dark" ? "/lightLogo.png" : "/darkLogo.png"}
                width={140}
                height={120}
                alt='Logo'
              />
            </a>
          ) : (
            <div>
              <p className='text-2xl font-bold text-[var(--foreground)] hidden sm:block'>
                {getPageTitle()}
              </p>
              <p className='text-base text-[#8293aa] hidden sm:block'>
                Welcome back, {username}
              </p>
            </div>
          )}
        </div>
        <div className='hidden xl:block'>
          {!isConnected ? (
            <div>
              <a href='https://www.pocketchange.fund/' target='blank'>
                <Image
                  src={theme === "dark" ? "/lightLogo.png" : "/darkLogo.png"}
                  width={160}
                  height={120}
                  alt='Logo'
                />
              </a>
            </div>
          ) : (
            <div>
              <p className='text-2xl font-bold text-[var(--foreground)] hidden sm:block'>
                {getPageTitle()}
              </p>
              <p className='text-base text-[#8293aa] hidden sm:block'>
                Welcome back, {username}
              </p>
            </div>
          )}
        </div>
        <div className='flex flex-grow justify-end'>
          <nav
            className={`flex space-x-4 xl:space-x-8 items-center 
             
            `}
          >
            {/* {!isConnected ? (
              <ul className='hidden md:flex items-center gap-4'>
                <li>
                  <a
                    className='hover:underline'
                    target='blank'
                    href='https://www.pocketchange.fund/'
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    className='hover:underline'
                    target='blank'
                    href='https://www.pocketchange.fund/#about'
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    className='hover:underline'
                    target='blank'
                    href='https://www.pocketchange.fund/#work'
                  >
                    Work
                  </a>
                </li>
                <li>
                  <a
                    className='hover:underline'
                    target='blank'
                    href='https://www.pocketchange.fund/#insight'
                  >
                    Insight
                  </a>
                </li>
                <li>
                  <a
                    className='hover:underline'
                    target='blank'
                    href='https://www.pocketchange.fund/#contact'
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    className='hover:underline'
                    target='blank'
                    href='https://www.pocketchange.fund/#joinUs'
                  >
                    Join Us
                  </a>
                </li>
              </ul>
            ) : (
              ""
            )} */}
            {/* <ThemeToggleButton /> */}
            {navItems.map((item, index) => (
              <div key={index} className='hidden xl:flex items-center'>
                {isConnected ? (
                  <Link href={item.href}>
                    <div className='flex items-center bg-[var(--secondary-bg)] text-[var(--foreground)] text-base px-4 py-2 rounded-md hover:underline hover:underline-offset-4 transition-all duration-150'>
                      {item.icon && (
                        <Image
                          src={item.icon}
                          width={16}
                          height={16}
                          alt={item.title}
                        />
                      )}
                      <span className='ml-2'>{item.title}</span>
                    </div>
                  </Link>
                ) : (
                  <Link href={item.href} target='_blank'>
                    <span className='text-lg hover:underline'>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
            <ConnectButton />
            <div className='xl:hidden' ref={mobileMenuRef}>
              <HamburgerMenu
                navItems={navItems}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
