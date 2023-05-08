import Sticky from "react-stickynode";
import Navbar from "containers/CryptoModern/Navbar";
import Banner from "containers/CryptoModern/Banner";
import Features from "containers/CryptoModern/FeatureSection";
import ExpertsTeam from "containers/CryptoModern/ExpertsTeam";
import MarketsPortal from "containers/CryptoModern/Markets";
import BlockchainProjects from "containers/CryptoModern/BlockchainProjects";
import FaqSection from "containers/CryptoModern/FaqSection";
import Register from "containers/CryptoModern/Newsletter";
import Footer from "containers/CryptoModern/Footer";
import {
  CryptoWrapper,
  ContentWrapper,
} from "containers/CryptoModern/cryptoModern.style";
import { MessageBox } from "containers/CryptoModern/MessageBox";
import Compliance from "containers/CryptoModern/Compliance";

const HomePage = () => (
  <CryptoWrapper>
    <MessageBox />
    <Sticky top={0} innerZ={9999} activeClass="sticky-active">
      <Navbar />
    </Sticky>
    <ContentWrapper>
      <Banner />
      {/*<CountDown />*/}
      <Features />
      <ExpertsTeam />
      <MarketsPortal />
      <BlockchainProjects />
      <Compliance />
      {/*<WalletSection />*/}
      {/*<MapSection />*/}
      <FaqSection />
      <Register />
    </ContentWrapper>
    <Footer />
  </CryptoWrapper>
);

export default HomePage;
