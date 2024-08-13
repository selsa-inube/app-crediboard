import { useContext, useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header, Grid, useMediaQuery } from "@inube/design-system";
import { MdLogout } from "react-icons/md";
import { Nav } from "@inubekit/nav";

import { AppContext } from "@context/AppContext";
import { MenuSection } from "@components/navigation/MenuSection";
import { MenuUser } from "@components/navigation/MenuUser";
import { LogoutModal } from "@components/feedback/LogoutModal";

import {
  navigationConfig,
  logoutConfig,
  navigationMock,
} from "./config/apps.config";
import {
  StyledAppPage,
  StyledContainer,
  StyledContentImg,
  StyledLogo,
  StyledMain,
  StyledMenuContainer,
} from "./styles";

const renderLogo = (imgUrl: string) => {
  return (
    <StyledContentImg to="/">
      <StyledLogo src={imgUrl} />
    </StyledContentImg>
  );
};

function AppPage() {
  const { user } = useContext(AppContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      if (userMenuRef.current && event.target !== userMenuRef.current) {
        setShowUserMenu(false);
      }
    }
  };

  useEffect(() => {
    const selectUser = document.querySelector("header div div:nth-child(2)");
    const handleToggleuserMenu = () => {
      setShowUserMenu(!showUserMenu);
    };

    document.addEventListener("mousedown", handleClickOutside);
    selectUser?.addEventListener("mouseup", handleToggleuserMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleToggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
    setShowUserMenu(false);
  };

  const smallScreen = useMediaQuery("(max-width: 849px)");

  const sections = [
    {
      links: [
        {
          title: "Cerrar sesión",
          iconBefore: <MdLogout />,
          onClick: handleToggleLogoutModal,
        },
      ],
    },
  ];

  return (
    <StyledAppPage>
      <Grid templateRows="auto 1fr" height="100vh" justifyContent="unset">
        <Header
          portalId="portal"
          navigation={navigationConfig}
          logoURL={renderLogo(user.operator.logo)}
          userName={user.username}
          client={user.company}
        />
        {showUserMenu && (
          <StyledMenuContainer ref={userMenuRef}>
            <MenuUser userName={user.username} businessUnit={user.company} />
            <MenuSection sections={sections} divider={true} />
          </StyledMenuContainer>
        )}
        {showLogoutModal && (
          <LogoutModal
            logoutPath={logoutConfig.logoutPath}
            handleShowBlanket={handleToggleLogoutModal}
          />
        )}
        <StyledContainer>
          <Grid
            templateColumns={smallScreen ? "1fr" : "auto 1fr"}
            alignContent="unset"
          >
            {!smallScreen && <Nav navigation={navigationMock} />}

            <StyledMain>
              <Outlet />
            </StyledMain>
          </Grid>
        </StyledContainer>
      </Grid>
    </StyledAppPage>
  );
}

export { AppPage };

/* 


 <StyledContainer>
          <Grid
            templateColumns={smallScreen ? "1fr" : "auto 1fr"}
            alignContent="unset"
          >
            {!smallScreen && (
              <StyledContainerNav>
                <Nav
                  navigation={navigationConfig}
                  logoutPath={logoutConfig.logoutPath}
                  logoutTitle={logoutConfig.logoutTitle}
                />
              </StyledContainerNav>
            )}

            <StyledMain>
              <Outlet />
            </StyledMain>
          </Grid>
        </StyledContainer>



<Nav navigation={navigationMock} />
        <StyledContainer>
          {showUserMenu && (
            <StyledMenuContainer ref={userMenuRef}>
              <MenuUser userName={user.username} businessUnit={user.company} />
              <MenuSection sections={sections} divider={true} />
            </StyledMenuContainer>
          )}
          {showLogoutModal && (
            <LogoutModal
              logoutPath={logoutConfig.logoutPath}
              handleShowBlanket={handleToggleLogoutModal}
            />
          )}
          <StyledMain>
            <Outlet />
          </StyledMain>
        </StyledContainer>
*/
