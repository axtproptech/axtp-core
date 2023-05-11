import { Icon } from "react-icons-kit";
import { logOut } from "react-icons-kit/feather/logOut";

import Link from "next/link";
import Slide from "react-reveal/Slide";
import Button from "common/components/Button";

const Sidebar = ({ userName, handleLogout }) => {
  if (!userName) return null;

  return (
    <Slide bottom>
      <div className="drawer drawer-end">
        <div className="drawer-side">
          <label className="drawer-overlay"></label>
          <ul className="flex flex-col gap-8 p-4 mt-4 rounded-2xl w-full h-screen text-black bg-white">
            <li>
              <Link href="/exclusive/blog">
                <a className="block text-black text-center font-medium">Blog</a>
              </Link>
            </li>

            <li>
              <Link
                href={process.env.NEXT_PUBLIC_WALLET_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <a className="block text-black text-center font-medium">
                  Wallet
                </a>
              </Link>
            </li>

            <li>
              <Link href="/exclusive/whitepaper" passHref>
                <a className="block text-black text-center font-medium">
                  Whitepaper
                </a>
              </Link>
            </li>

            <li>
              <Link href="mailto:info@axtp.com.br" passHref>
                <a className="block text-black text-center font-medium">
                  Contact
                </a>
              </Link>
            </li>
            <hr class="w-full p-0.5"></hr>

            <li>
              <div className="flex flex-row items-center justify-center gap-2 mb-2">
                <span className="text-center">{userName}</span>

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
                className="w-full"
                title="Sair"
                onClick={handleLogout}
              />
            </li>
          </ul>
        </div>
      </div>
    </Slide>
  );
};

export default Sidebar;
