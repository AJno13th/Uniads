import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // Legacy WordPress / old-host paths still indexed by Google
      { source: "/faqs", destination: "/about", permanent: true },
      { source: "/faqs/", destination: "/about", permanent: true },
      { source: "/contact", destination: "/book", permanent: true },
      { source: "/contact/", destination: "/book", permanent: true },
      { source: "/contact-us", destination: "/book", permanent: true },
      { source: "/contact-us/", destination: "/book", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/home/", destination: "/", permanent: true },
      { source: "/consultation", destination: "/book", permanent: true },
      { source: "/consultation/", destination: "/book", permanent: true },
      { source: "/book-free-consultation", destination: "/book", permanent: true },
      { source: "/book-free-consultation/", destination: "/book", permanent: true },
    ];
  },
};

export default nextConfig;
