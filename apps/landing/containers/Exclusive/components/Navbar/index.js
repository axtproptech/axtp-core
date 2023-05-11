import { useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { Icon } from "react-icons-kit";
import { x } from "react-icons-kit/feather/x";
import { menu } from "react-icons-kit/feather/menu";
import { logOut } from "react-icons-kit/feather/logOut";

import Link from "next/link";
import Fade from "react-reveal/Fade";
import Sidebar from "./components/Sidebar";
import Button from "common/components/Button";
import NextImage from "common/components/NextImage";
import LogoImage from "common/assets/image/axt-white-text-logo.svg";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const handleSidebar = () => setIsOpenSidebar(!isOpenSidebar);

  const userName = useMemo(() => {
    if (!session) return "";
    if (!session.user) return "";

    return session.user.name[0].toUpperCase() + session.user.name.substring(1);
  }, [session]);

  const handleLogout = async () => {
    if (status === "authenticated") {
      await signOut({
        callbackUrl: `${window.location.origin}/api/logout`,
      });
    }
  };

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

            <div className="xs:hidden md:flex items-center justify-center gap-8">
              <Link href="/exclusive/blog">
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Blog
                </a>
              </Link>

              <Link
                href={process.env.NEXT_PUBLIC_WALLET_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Wallet
                </a>
              </Link>

              <Link href="/exclusive/whitepaper" passHref>
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Whitepaper
                </a>
              </Link>

              <Link href="mailto:info@axtp.com.br" passHref>
                <a className="text-white opacity-80 hover:opacity-100 hover:text-white">
                  Contact
                </a>
              </Link>
            </div>

            {session && (
              <div className="xs:hidden md:flex flex-row items-center justify-center gap-4">
                <div className="flex flex-row items-center justify-center gap-2">
                  <span className="text-white opacity-80 text-center">
                    {userName}
                  </span>

                  <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-md dark:bg-gray-600">
                    <span class="font-medium text-gray-600 dark:text-gray-300">
                      {userName.substring(0, 2).toLocaleUpperCase()}
                    </span>
                  </div>
                </div>

                <Button
                  icon={<Icon icon={logOut} />}
                  iconPosition="left"
                  variant="extenfabvdedFab"
                  colors="secondaryWithBg"
                  title="Sair"
                  onClick={handleLogout}
                />
              </div>
            )}

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

      {isOpenSidebar && (
        <Sidebar userName={userName} handleLogout={handleLogout} />
      )}
    </header>
  );
};

export default Navbar;
