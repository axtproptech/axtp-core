/** @type {import("next").NextConfig} */

const { i18n } = require("./next-i18next.config");
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
const withTM = require("next-transpile-modules")(["react-daisyui"]);
module.exports = withPWA(
  withTM({
    debug: process.env.NODE_ENV === "development",
    pwa: {
      dest: "public",
      // runtimeCaching,
      disable: process.env.NODE_ENV === "development",
      // buildExcludes: [/middleware-manifest\.json$/]
    },
    reactStrictMode: true,
    i18n,
  })
);
