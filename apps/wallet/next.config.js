/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");
const withPWA = require("next-pwa");

module.exports = withPWA({
  debug: process.env.NODE_ENV === "development",
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
  reactStrictMode: true,
  i18n,
});
