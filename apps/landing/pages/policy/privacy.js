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
`;

const PolicyPrivacyPage = () => {
  const [policyText, setPolicyText] = useState("");
  useEffect(() => {
    fetch("/policies/privacy_policy_pt.md")
      .then((response) => response.text())
      .then(setPolicyText);
  }, []);

  return (
    <>
      <Head>
        <title> Privacy Policy - AXT PropTech Company S/A</title>
        <meta
          name="Description"
          content="Privacy Policy - AXT PropTech Company S/A"
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

export default PolicyPrivacyPage;
