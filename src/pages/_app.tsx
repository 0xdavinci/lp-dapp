import { ThemeProvider, useTheme } from '../context/ThemeContext';
import '../styles/global.css';
import "../styles/HamburgerMenu.css";
import '../styles/dark-theme-datepicker.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head'; // Import Head component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme, type Locale } from '@rainbow-me/rainbowkit';

import { config } from '../wagmi';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const title = "Pocket Ventures";
const description =
  "We leverage emerging technologies to provide essential services like decentralized energy, sustainable agriculture, community-owned finance, and independent information networks.";

function MyApp({ Component, pageProps, router }: AppProps) {
  const { locale } = useRouter() as { locale: Locale };

  return (
    <ThemeProvider>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="og:image" content="/image_og.jpg" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/image_og.jpg" />

        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Pocket Ventures" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <InnerApp Component={Component} pageProps={pageProps} locale={locale} router={router} />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

type InnerAppProps = AppProps & {
  locale: Locale;
};

const InnerApp = ({ Component, pageProps, locale, router }: InnerAppProps) => {
  const { theme } = useTheme();
  const rainbowKitTheme = theme === 'dark' ? darkTheme() : lightTheme();

  return (
    <RainbowKitProvider locale={locale} theme={rainbowKitTheme}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Component {...pageProps} key={router.route} />
    </RainbowKitProvider>
  );
};

export default MyApp;
