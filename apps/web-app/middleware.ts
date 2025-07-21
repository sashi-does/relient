export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/settings",
    "/portals",
    "/portals/(.*)",
    "/portal",
    "/portal/(.*)"
  ]
};
