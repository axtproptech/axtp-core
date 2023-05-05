import "common/assets/css/tailwind.css";
import "common/assets/css/flaticon.css";
// import "reactjs-popup/dist/index.css";
import "../containers/CryptoModern/CountDown/timer.css";
import "common/assets/css/icon-example-page.css";
// swiper bundle styles
import "swiper/css/bundle";
import "common/assets/css/react-slick.css";
import "common/assets/css/rc-collapse.css";
import "common/assets/css/embla.css";
import "rc-collapse/assets/index.css";
import { SessionProvider } from "next-auth/react";

export default function CustomApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
