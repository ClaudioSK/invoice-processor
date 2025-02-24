/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      worker_threads: false,
    };
    return config;
  },
  images: {
    domains: ['unpkg.com', 'tessdata.projectnaptha.com'],
  }
};

module.exports = nextConfig;