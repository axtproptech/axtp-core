import puppeteer, { Browser } from "puppeteer";

let headlessBrowser: Browser;

export async function getHeadlessBrowserInstance(): Promise<Browser> {
  if (!headlessBrowser) {
    headlessBrowser = await puppeteer.launch({ headless: true });
  }
  return headlessBrowser;
}
