/** @type {import('next').NextConfig} */

const path = require("path");
withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withTranspileModules = require("next-transpile-modules")(["@axtp/core"]);
const nextConfig = withTranspileModules(
  withBundleAnalyzer({
    reactStrictMode: true,
    sassOptions: {
      includePaths: [path.join(__dirname, "styles/scss")],
    },
    staticPageGenerationTimeout: 1000,
  })
);

module.exports = nextConfig;
