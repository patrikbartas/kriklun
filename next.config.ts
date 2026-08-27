import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Jedna appka, jedna adresa. Kto napise www, skonci na apexe.
      // Napisane bez mena domeny, nech to plati aj keby sa raz zmenila.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.(?<domain>.*)" }],
        destination: "https://:domain/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
