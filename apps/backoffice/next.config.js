/** @type {import('next').NextConfig} */

const path = require("path");
const withTranspileModules = require("next-transpile-modules")(["@axtp/core"]);
const nextConfig = withTranspileModules({
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles/scss")],
  },
  staticPageGenerationTimeout: 1000,
});

module.exports = nextConfig;
