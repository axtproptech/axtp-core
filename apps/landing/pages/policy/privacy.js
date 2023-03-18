import Head from "next/head";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "common/theme/cryptoModern";
import ResetCSS from "common/assets/css/style";
import Sticky from "react-stickynode";
import Navbar from "containers/CryptoModern/Navbar";
import Footer from "containers/CryptoModern/Footer";
import GlobalStyle, {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

export const TextWrapper = styled.div`
  padding: 1rem;
  max-width: 1170px;
  text-align: justify;
  margin: 64px auto 0;
  color: white;
  opacity: 0.8;
`;

const CryptoModern = () => {
  const [policyText, setPolicyText] = useState("");
  useEffect(() => {
    fetch("./policies/privacy_policy_pt.md")
      .then((response) => response.text())
      .then(setPolicyText);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <Head>
          <title>AXT PropTech Company S/A - Privacy Policy</title>
          <meta
            name="Description"
            content="AXT PropTech Company S/A - Privacy Policy"
          />
          <meta name="theme-color" content="#2563FF" />
          <meta
            name="keywords"
            content="blockchain, proptech, web3, signum, smart contracts"
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
        </Head>
        {/* end of head */}

        <ResetCSS />
        <GlobalStyle />
        {/* end of global and reset style */}

        {/* start app classic landing */}
        <CryptoWrapper>
          <Sticky top={0} innerZ={9999} activeClass="sticky-active">
            <Navbar noMenu={true} />
          </Sticky>
          <ContentWrapper>
            <TextWrapper>
              <ReactMarkdown>{policyText}</ReactMarkdown>
            </TextWrapper>
          </ContentWrapper>
          <Footer />
        </CryptoWrapper>
        {/* end of app classic landing */}
      </>
    </ThemeProvider>
  );
};
export default CryptoModern;
