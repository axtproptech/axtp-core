export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/exclusive/:path*", "/api/exclusive/:path*"],
};
