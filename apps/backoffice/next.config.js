/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles/scss")],
  },
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;
