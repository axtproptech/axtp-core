/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/public/policies/:path",
        headers: [
          {
            key: "Content-Type",
            value: "text/markdown",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
    ];
  },
  // sassOptions: {
  //   includePaths: [path.join(__dirname, "styles/scss")],
  // },
};

module.exports = nextConfig;
