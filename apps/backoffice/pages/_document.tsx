import * as React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";

interface Props {}

export default class MyDocument extends Document<Props> {
  render() {
    return (
      <Html>
        {/* @ts-ignore */}
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content="#FFFFFF" />

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />

          {/* PWA SETUP */}
          <meta name="application-name" content="AXT PropTech Backoffice" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="AXT PropTech Backoffice"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#FFFFFF" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#FFFFFF" />

          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          {/* @ts-ignore */}
          <NextScript />
        </body>
      </Html>
    );
  }
}
