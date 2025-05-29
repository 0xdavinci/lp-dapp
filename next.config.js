/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  images: {
    unoptimized: true,
  },
  /*i18n: {
    locales: ['en-US', 'zh-CN'],
    defaultLocale: 'en-US',
  },*/
};

module.exports = nextConfig;
