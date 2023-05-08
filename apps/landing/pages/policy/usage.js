import Head from "next/head";
import styled from "styled-components";
import Sticky from "react-stickynode";
import Navbar from "containers/CryptoModern/Navbar";
import Footer from "containers/CryptoModern/Footer";
import {
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

  a {
    color: #69c9ff;
  }

  li {
    list-style-type: auto;
    margin-left: 1rem;
  }
`;

const PolicyUsagePage = () => {
  const [policyText, setPolicyText] = useState("");
  useEffect(() => {
    fetch("/policies/terms_of_use_pt.md")
      .then((response) => response.text())
      .then(setPolicyText);
  }, []);

  return (
    <>
      <Head>
        <title>Terms of Use - AXT PropTech Company S/A</title>
        <meta
          name="Description"
          content="Terms of Use - AXT PropTech Company S/A"
        />
      </Head>

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
    </>
  );
};

export default PolicyUsagePage;
