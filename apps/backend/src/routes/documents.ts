import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import MarkdownIt from "markdown-it";
import puppeteer, { Browser } from "puppeteer";

// Initialize browser at global scope
let headlessBrowser: Browser;
(async () => {
  headlessBrowser = await puppeteer.launch({ headless: true });
})();

export const documents = new Hono().post(
  "/pdf",
  zValidator(
    "json",
    z.object({
      content: z.string(),
      isMarkdown: z.boolean().optional().default(false),
      filename: z.string().optional().default("convert.pdf"),
      options: z
        .object({
          pageSize: z
            .enum([
              "letter",
              "legal",
              "tabloid",
              "ledger",
              "a0",
              "a1",
              "a2",
              "a3",
              "a4",
              "a5",
              "a6",
            ])
            .optional()
            .default("a4"),
          orientation: z
            .enum(["landscape", "portrait"])
            .optional()
            .default("portrait"),
          margin: z.object({
            top: z.string().optional(),
            bottom: z.string().optional(),
            left: z.string().optional(),
            right: z.string().optional(),
          }),
        })
        .optional(),
    })
  ),

  async (c) => {
    const { content, options, isMarkdown, filename } = c.req.valid("json");

    // Convert markdown to HTML if needed
    const htmlContent = isMarkdown ? new MarkdownIt().render(content) : content;

    const page = await headlessBrowser.newPage();

    // Set page options
    await page.setContent(htmlContent);
    const pdf = await page.pdf({
      format: options?.pageSize,
      landscape: options?.orientation === "landscape",
      margin: options?.margin || {
        top: "20px",
        bottom: "20px",
        left: "10px",
        right: "10px",
      },
    });
    await page.close();

    // Return PDF
    // @ts-ignore
    return c.body(pdf, 200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${filename}`,
    });
  }
);
