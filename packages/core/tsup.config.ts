import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    "./index.ts",
    "./mailer/index.ts",
    "./crm/index.ts",
    "./file/index.ts",
  ],
  format: ["cjs", "esm"],
  minify: isProduction,
  sourcemap: true,
});
