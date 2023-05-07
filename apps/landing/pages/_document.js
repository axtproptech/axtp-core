import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="pt">
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i"
            rel="stylesheet"
          />

          <link rel="icon" href="/favicon.png" />

          <meta name="theme-color" content="#FFC81D" />

          <meta
            name="keywords"
            content="blockchain, proptech, web3, signum, smart contracts, reit, real estate"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />

          <link rel="manifest" href="/site.webmanifest" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.axtp.com.br/" />
          <meta property="og:title" content="AXTP PropTech Company S/A" />
          <meta
            property="og:description"
            content="Welcome to the world of digital assets"
          />
          <meta
            property="og:image"
            content="https://www.axtp.com.br/axtp-seo.jpg"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://www.axtp.com.br/" />
          <meta property="twitter:title" content="AXTP PropTech Company S/A" />
          <meta
            property="twitter:description"
            content="Welcome to the world of digital assets"
          />
          <meta
            property="twitter:image"
            content="https://www.axtp.com.br/axtp-seo.jpg"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
