import { defineConfig } from "tsup";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    "./index.ts",
    "./aliases/index.ts",
    "./crm/index.ts",
    "./errors/index.ts",
    "./file/index.ts",
    "./mailer/index.ts",
    "./markets/index.ts",
    "./paymentRecord/index.ts",
    "./smartContractViewer/index.ts",
    "./withdrawalRecord/index.ts",
  ],
  format: ["cjs", "esm"],
  minify: isProduction,
  sourcemap: true,
});
