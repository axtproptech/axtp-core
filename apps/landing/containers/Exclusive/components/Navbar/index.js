import { useState } from "react";
import { Icon } from "react-icons-kit";
import { x } from "react-icons-kit/feather/x";
import { menu } from "react-icons-kit/feather/menu";
import { ic_account_balance_wallet } from "react-icons-kit/md/ic_account_balance_wallet";

import Link from "next/link";
import Fade from "react-reveal/Fade";
import Sidebar from "./components/Sidebar";
import Button from "common/components/Button";
import NextImage from "common/components/NextImage";
import LogoImage from "common/assets/image/axt-white-text-logo.svg";

const Navbar = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const handleSidebar = () => setIsOpenSidebar(!isOpenSidebar);

  return (
    <header
      className="fixed left-0 right-0 z-10 w-full"
      style={{ top: "2rem", maxWidth: "67.5rem", margin: "0 auto" }}
    >
      <nav>
        <ul
          className="w-full max-w-6xl m-auto rounded-2xl text-white"
          style={{
            background: "rgba(0,0,0,0.5)",
            boxShadow: "inset 0 -1px 0 0 hsla(0,0%,100%,.1)",
            height: "4rem",
            backdropFilter: "blur(24px)",
            transition: "background-color .2s ease",
          }}
        >
          <div className="w-full flex flex-row items-center justify-between h-full p-4">
            <Link href="/exclusive">
              <a className="flex items-center">
                <NextImage src={LogoImage} alt="" width={118} height={37} />
              </a>
            </Link>

            <div className="xs:hidden md:flex items-center justify-center gap-4">
              <Link href="/exclusive" passHref>
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Home
                </a>
              </Link>

              <Link href="/exclusive/blog">
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Blog
                </a>
              </Link>

              <Link href="/exclusive/contact">
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Contact
                </a>
              </Link>

              <Link href="/exclusive/whitepaper" passHref>
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Whitepaper
                </a>
              </Link>
            </div>

            <div className="xs:hidden md:flex flex-row items-center justify-center gap-4">
              <div className="flex flex-row items-center justify-center gap-2">
                <span className="text-white opacity-80 text-center">
                  Hello, Armando
                </span>

                <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-600">
                  <span class="font-medium text-gray-600 dark:text-gray-300">
                    AH
                  </span>
                </div>
              </div>

              <Button
                icon={<Icon icon={ic_account_balance_wallet} />}
                iconPosition="left"
                variant="extenfabvdedFab"
                title="Get Started"
                onClick={() => alert("Click now")}
              />
            </div>

            <div className="xs:flex md:hidden">
              <Button
                icon={
                  isOpenSidebar ? (
                    <Icon size={32} icon={x} />
                  ) : (
                    <Fade>
                      <Icon size={32} icon={menu} />
                    </Fade>
                  )
                }
                color="#FFFFFF"
                variant="textButton"
                onClick={handleSidebar}
              />
            </div>
          </div>
        </ul>
      </nav>

      {isOpenSidebar && <Sidebar />}
    </header>
  );
};

export default Navbar;
