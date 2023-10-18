const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const wdyrPath = path.resolve(__dirname, "./scripts/wdyr.ts");
        const entries = await originalEntry();

        if (entries["main-app"] && !entries["main-app"].includes(wdyrPath)) {
          entries["main-app"].unshift(wdyrPath);
        }
        return entries;
      };
    }
    return config;
  },
};

module.exports = nextConfig;
