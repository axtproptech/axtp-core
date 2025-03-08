/** @type {import("next").NextConfig} */

const { i18n } = require("./next-i18next.config");
const runtimeCaching = require("next-pwa/cache");
const { withAxiom } = require("next-axiom");
const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
});
const withTM = require("next-transpile-modules")([
  "react-daisyui",
  "@axtp/core",
]);
module.exports = withAxiom(
  withPWA(
    withTM({
      reactStrictMode: true,
      i18n,
    })
  )
);
