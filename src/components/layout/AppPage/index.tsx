import { useContext, useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MdLogout, MdOutlineChevronRight } from "react-icons/md";
import {
  Icon,
  Grid,
  useFlag,
  useMediaQuery,
  Header,
  Text,
} from "@inubekit/inubekit";

import { AppContext } from "@context/AppContext";
import { MenuSection } from "@components/navigation/MenuSection";
import { MenuUser } from "@components/navigation/MenuUser";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { getUserMenu } from "@config/menuMainConfiguration";
import { mockErrorBoard } from "@mocks/error-board/errorborad.mock";

import {
  StyledAppPage,
  StyledContainer,
  StyledContentImg,
  StyledLogo,
  StyledMain,
  StyledMenuContainer,
  StyledHeaderContainer,
  StyledCollapseIcon,
  StyledCollapse,
  StyledFooter,
  StyledPrint,
} from "./styles";
import { BaseModal } from "@components/modals/baseModal";

const renderLogo = (imgUrl: string) => {
  return (
    <StyledContentImg to="/">
      <StyledLogo src={imgUrl} />
    </StyledContentImg>
  );
};

function AppPage() {
  const { eventData, businessUnitsToTheStaff, setBusinessUnitSigla } =
    useContext(AppContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const collapseMenuRef = useRef<HTMLDivElement>(null);
  const businessUnitChangeRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target as Node) &&
      event.target !== userMenuRef.current
    ) {
      setShowUserMenu(false);
    }

    if (
      collapseMenuRef.current &&
      !collapseMenuRef.current.contains(event.target as Node) &&
      event.target !== collapseMenuRef.current &&
      businessUnitChangeRef.current &&
      !businessUnitChangeRef.current.contains(event.target as Node)
    ) {
      setCollapse(false);
    }
  };

  const isTablet: boolean = useMediaQuery("(max-width: 1024px)");
  const [selectedClient, setSelectedClient] = useState<string>(
    eventData.businessUnit.abbreviatedName
  );

  // Función para manejar el toggle del modal de logout
  const handleToggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
    setShowUserMenu(false); // Cierra el menú de usuario cuando se abre el modal
  };

  // Genera el menú pasando la función del modal
  const userMenuConfig = getUserMenu(handleToggleLogoutModal);

  useEffect(() => {
    const selectUser = document.querySelector("header div div:nth-child(0)");
    const handleToggleuserMenu = () => {
      setShowUserMenu(!showUserMenu);
    };

    document.addEventListener("mousedown", handleClickOutside);
    selectUser?.addEventListener("mouseup", handleToggleuserMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogoClick = (businessUnit: IBusinessUnitsPortalStaff) => {
    const selectJSON = JSON.stringify(businessUnit);
    setBusinessUnitSigla(selectJSON);
    setSelectedClient(businessUnit.abbreviatedName);
    setCollapse(false);
    navigate("/");
  };

  const { addFlag } = useFlag();

  const handleFlag = () => {
    const errorData = mockErrorBoard[0].business;
    addFlag({
      title: errorData[0],
      description: errorData[1],
      appearance: "danger",
      duration: 5000,
    });
  };

  useEffect(() => {
    if (!businessUnitsToTheStaff || businessUnitsToTheStaff.length === 0) {
      handleFlag();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitsToTheStaff]);

  return (
    <StyledAppPage>
      <Grid templateRows="auto 1fr" height="100vh" justifyContent="unset">
        <StyledPrint>
          <StyledHeaderContainer>
            <Header
              logoURL={renderLogo(eventData.businessUnit.urlLogo)}
              user={{
                username: eventData.user.userName,
                breakpoint: "848px",
                client: eventData.businessUnit.abbreviatedName,
              }}
              // Usa la configuración generada dinámicamente
              menu={userMenuConfig}
            />
          </StyledHeaderContainer>
          <StyledCollapseIcon
            $collapse={collapse}
            onClick={() => setCollapse(!collapse)}
            $isTablet={isTablet}
            ref={collapseMenuRef}
          >
            <Icon
              icon={<MdOutlineChevronRight />}
              appearance="primary"
              size="24px"
              cursorHover
            />
          </StyledCollapseIcon>
        </StyledPrint>
        {collapse && (
          <StyledCollapse ref={businessUnitChangeRef}>
            <BusinessUnitChange
              businessUnits={businessUnitsToTheStaff}
              selectedClient={selectedClient}
              onLogoClick={handleLogoClick}
            />
          </StyledCollapse>
        )}
        <StyledContainer>
          {showUserMenu && (
            <StyledMenuContainer ref={userMenuRef}>
              <MenuUser
                userName={eventData.user.userName}
                businessUnit={eventData.businessUnit.abbreviatedName}
              />
              <MenuSection
                sections={[
                  {
                    links: [
                      {
                        title: "Cerrar sesión",
                        iconBefore: <MdLogout />,
                        onClick: handleToggleLogoutModal,
                      },
                    ],
                  },
                ]}
                divider={true}
              />
            </StyledMenuContainer>
          )}

          {/* Modal de logout con renderizado condicional */}
          {showLogoutModal && (
            <BaseModal title={"aaa"}>
              <Text>aaa</Text>
            </BaseModal>
          )}

          <StyledMain>
            <Outlet />
          </StyledMain>
          <StyledFooter>
            {renderLogo(eventData.businessManager.urlBrand)}
          </StyledFooter>
        </StyledContainer>
      </Grid>
    </StyledAppPage>
  );
}

export { AppPage };
