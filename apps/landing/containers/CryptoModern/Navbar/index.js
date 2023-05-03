import React, { useState, useRef, useMemo } from "react";
import Fade from "react-reveal/Fade";
import ScrollSpyMenu from "common/components/ScrollSpyMenu";
import Scrollspy from "react-scrollspy";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { Icon } from "react-icons-kit";
import { menu } from "react-icons-kit/feather/menu";
import { x } from "react-icons-kit/feather/x";
import Logo from "common/components/UIElements/Logo";
import Button from "common/components/Button";
import Container from "common/components/UI/Container";
import useOnClickOutside from "common/hooks/useOnClickOutside";
import NavbarWrapper, { MenuArea, MobileMenu, Search } from "./navbar.style";
import LogoImage from "common/assets/image/cryptoModern/logo-light.svg";
import LogoImageAlt from "common/assets/image/cryptoModern/logo.svg";
import { signIn, useSession, signOut } from "next-auth/react";

import { navbar } from "common/data/CryptoModern";
import { useRouter } from "next/router";

const Navbar = ({ noMenu }) => {
  const { navMenu } = navbar;

  const { data: session, status } = useSession();
  const router = useRouter();

  const [state, setState] = useState({
    search: "",
    searchToggle: false,
    mobileMenu: false,
  });

  const userName = useMemo(() => {
    if (!session) return "";
    if (!session.user) return "";
    console.log("session", session);

    return session.user.name[0].toUpperCase() + session.user.name.substring(1);
  }, [session]);

  const searchRef = useRef(null);
  useOnClickOutside(searchRef, () =>
    setState({ ...state, searchToggle: false })
  );

  const toggleHandler = (type) => {
    if (type === "search") {
      setState({
        ...state,
        search: "",
        searchToggle: !state.searchToggle,
        mobileMenu: false,
      });
    }

    if (type === "menu") {
      setState({
        ...state,
        mobileMenu: !state.mobileMenu,
      });
    }
  };

  const scrollItems = [];

  navMenu.forEach((item) => {
    scrollItems.push(item.path.slice(1));
  });

  const handleRemoveMenu = () => {
    setState({
      ...state,
      mobileMenu: false,
    });
  };

  const handleLogin = async () => {
    if (status === "unauthenticated") {
      await signIn("auth0", {
        callbackUrl: `${window.location.origin}/exclusive`,
      });
    }

    if (status === "authenticated") {
      await router.push("/exclusive");
    }
  };

  const handleLogout = async () => {
    if (status === "authenticated") {
      await signOut({
        callbackUrl: `${window.location.origin}/api/logout`,
      });
    }
  };

  return (
    <NavbarWrapper className="navbar">
      <Container>
        <Logo
          href="/"
          logoSrc={LogoImage}
          title="AXT PropTech Company S/A"
          className="main-logo"
        />
        <Logo
          href="/"
          logoSrc={LogoImageAlt}
          title="AXT PropTech Company S/A"
          className="logo-alt"
        />
        {/* end of logo */}

        {session && (
          <>
            <div className="user">
              {`Bem vindo, ${userName}`}
              <div className="logout" onClick={handleLogout}>
                Sair
              </div>
            </div>
            <div className="user-alt">
              {`Bem vindo, ${userName}`}
              <div className="logout" onClick={handleLogout}>
                Sair
              </div>
            </div>
          </>
        )}
        {!noMenu && (
          <MenuArea className={state.searchToggle ? "active" : ""}>
            <ScrollSpyMenu className="menu" menuItems={navMenu} offset={-84} />
            {/* end of main menu */}

            {/*<Search className="search" ref={searchRef}>*/}
            {/*  <form onSubmit={handleSearchForm}>*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      value={state.search}*/}
            {/*      placeholder="Enter your keyword"*/}
            {/*      onChange={handleOnChange}*/}
            {/*    />*/}
            {/*  </form>*/}
            {/*  <Button*/}
            {/*    className="text"*/}
            {/*    variant="textButton"*/}
            {/*    icon={<Icon icon={state.searchToggle ? x : search} />}*/}
            {/*    onClick={() => toggleHandler("search")}*/}
            {/*  />*/}
            {/*</Search>*/}
            {/* end of search */}

            <Button
              className="text"
              variant="textButton"
              title="Área Exclusiva"
              style={{ marginLeft: "2rem" }}
              onClick={handleLogin}
            />

            <Button
              className="menubar"
              icon={
                state.mobileMenu ? (
                  <Icon className="bar" icon={x} />
                ) : (
                  <Fade>
                    <Icon className="close" icon={menu} />
                  </Fade>
                )
              }
              color="#0F2137"
              variant="textButton"
              onClick={() => toggleHandler("menu")}
            />
          </MenuArea>
        )}
      </Container>

      {/* start mobile menu */}
      {!noMenu && (
        <MobileMenu
          className={`mobile-menu ${state.mobileMenu ? "active" : ""}`}
        >
          <Container>
            <Button
              className="text"
              variant="textButton"
              title="Área Exclusiva"
              onClick={handleLogin}
            />
            <Scrollspy
              className="menu"
              items={scrollItems}
              offset={-84}
              currentClassName="active"
            >
              {navMenu.map((menu, index) => (
                <li key={`menu_key${index}`}>
                  <AnchorLink
                    href={menu.path}
                    offset={menu.offset}
                    onClick={handleRemoveMenu}
                  >
                    {menu.label}
                  </AnchorLink>
                </li>
              ))}
            </Scrollspy>
          </Container>
        </MobileMenu>
      )}
    </NavbarWrapper>
  );
};

export default Navbar;
