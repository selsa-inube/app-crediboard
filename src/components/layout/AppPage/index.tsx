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
  Stack,
} from "@inubekit/inubekit";

import { AppContext } from "@context/AppContext";
import { MenuSection } from "@components/navigation/MenuSection";
import { MenuUser } from "@components/navigation/MenuUser";
import { BusinessUnitChange } from "@components/inputs/BusinessUnitChange";
import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { getUserMenu } from "@config/menuMainConfiguration";
import { mockErrorBoard } from "@mocks/error-board/errorborad.mock";
import { BaseModal } from "@components/modals/baseModal";
import { CardNoveilties } from "@components/cards/CardsNoveilties";
import { IUnreadNoveltiesByUser } from "@services/creditRequest/query/getUnreadNoveltiesByUser/types";
import { getUnreadNoveltiesByUser } from "@services/creditRequest/query/getUnreadNoveltiesByUser";
import { formatPrimaryDate } from "@utils/formatData/date";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { useEnum } from "@hooks/useEnum";

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
  StyledCardsContainer,
  StyledUserImage,
} from "./styles";
import { emptyNoveltiesConfigEnum } from "./config/errorNovelties";

const renderLogo = (imgUrl: string, onTheFooter: boolean = false) => {
  return (
    <StyledContentImg to="/">
      <StyledLogo src={imgUrl} onTheFooter={onTheFooter} />
    </StyledContentImg>
  );
};

function AppPage() {
  const { eventData, businessUnitsToTheStaff, setBusinessUnitSigla } =
    useContext(AppContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [isLoadingBusinessUnit, setIsLoadingBusinessUnit] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const collapseMenuRef = useRef<HTMLDivElement>(null);
  const businessUnitChangeRef = useRef<HTMLDivElement>(null);
  const [noveltiesData, setNoveltiesData] = useState<IUnreadNoveltiesByUser[]>(
    []
  );
  const navigate = useNavigate();
  const { businessUnitSigla } = useContext(AppContext);
  const { lang } = useEnum();

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const getNotificationsCount = (): number => {
    return noveltiesData && noveltiesData.length > 0 ? noveltiesData.length : 0;
  };

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
  const isMobile: boolean = useMediaQuery("(max-width: 555px)");
  const [selectedClient, setSelectedClient] = useState<string>(
    eventData.businessUnit.abbreviatedName
  );

  const handleToggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
    setShowUserMenu(false);
  };

  const userMenuConfig = getUserMenu(
    handleToggleLogoutModal,
    getNotificationsCount()
  );

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

  const handleLogoClick = async (businessUnit: IBusinessUnitsPortalStaff) => {
    setIsLoadingBusinessUnit(true);

    const selectJSON = JSON.stringify(businessUnit);
    setBusinessUnitSigla(selectJSON);
    setSelectedClient(businessUnit.abbreviatedName);
    setCollapse(false);

    await new Promise((resolve) => setTimeout(resolve, 100));

    navigate("/");
  };

  const handleNoveltyActionClick = (referenceCode: string) => {
    navigate(`/extended-card/${referenceCode}`);
    setShowLogoutModal(false);
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

  useEffect(() => {
    const fetchNoveltiesData = async () => {
      try {
        const data = await getUnreadNoveltiesByUser(
          eventData.user.identificationDocumentNumber || "",
          businessUnitPublicCode,
          businessManagerCode
        );
        setNoveltiesData(data);
      } catch (error) {
        console.error("Error fetching novelties:", error);
      } finally {
        setIsLoadingBusinessUnit(false);
      }
    };

    fetchNoveltiesData();
  }, [
    eventData.user.identificationDocumentNumber,
    businessUnitPublicCode,
    businessManagerCode,
    businessUnitSigla,
  ]);

  if (isLoadingBusinessUnit) {
    return (
      <StyledAppPage>
        <Grid
          templateRows="auto 1fr"
          height="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingAppUI />
        </Grid>
      </StyledAppPage>
    );
  }

  return (
    <StyledAppPage>
      <Grid templateRows="auto auto 1fr" height="100vh" justifyContent="unset">
        <StyledPrint>
          <StyledHeaderContainer>
            <Header
              logoURL={renderLogo(eventData.businessUnit.urlLogo)}
              user={{
                username: eventData.user.userAccount,
                breakpoint: "848px",
                client: eventData.businessUnit.abbreviatedName,
              }}
              menu={userMenuConfig}
              unreadNotificationsAmount={getNotificationsCount()}
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
          <StyledPrint>
            <StyledCollapse ref={businessUnitChangeRef}>
              <BusinessUnitChange
                businessUnits={businessUnitsToTheStaff}
                selectedClient={selectedClient}
                onLogoClick={handleLogoClick}
              />
            </StyledCollapse>
          </StyledPrint>
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

          {showLogoutModal && (
            <BaseModal
              title={"Novedades"}
              width={isMobile ? "auto" : "500px"}
              height="700px"
              initialDivider
              nextButton="Cerrar"
              handleClose={() => setShowLogoutModal(false)}
              handleNext={() => setShowLogoutModal(false)}
            >
              <StyledCardsContainer>
                {noveltiesData.length > 0 ? (
                  noveltiesData.map((novelty) => (
                    <CardNoveilties
                      key={novelty.creditRequestCode}
                      userImage=""
                      userName={novelty.clientName}
                      dateTime={formatPrimaryDate(
                        new Date(novelty.executionDate),
                        true
                      )}
                      referenceCode={novelty.creditRequestCode}
                      description={novelty.traceValue}
                      actionText={emptyNoveltiesConfigEnum.novelties.actionText.i18n[lang]}
                      onActionClick={() =>
                        handleNoveltyActionClick(novelty.creditRequestCode)
                      }
                      actionIcon={emptyNoveltiesConfigEnum.novelties.actionIcon}
                    />
                  ))
                ) : (
                  <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    height="518px"
                    width={isMobile ? "300px" : "500px"}
                  >
                    <StyledUserImage
                      src={emptyNoveltiesConfigEnum.image.src}
                      alt={emptyNoveltiesConfigEnum.image.alt.i18n[lang]}
                    />
                    <Stack gap="4px" direction="column">
                      <Text size="large" appearance="gray" textAlign="center">
                        {emptyNoveltiesConfigEnum.messages.primary.i18n[lang]}
                      </Text>
                      <Text size="large" appearance="dark" textAlign="center">
                        {emptyNoveltiesConfigEnum.messages.secondary.i18n[lang]}
                      </Text>
                    </Stack>
                  </Stack>
                )}
              </StyledCardsContainer>
            </BaseModal>
          )}

          <StyledMain>
            <Outlet />
          </StyledMain>

          <StyledFooter>
            {renderLogo(eventData.businessManager.urlBrand, true)}
          </StyledFooter>
        </StyledContainer>
      </Grid>
    </StyledAppPage>
  );
}

export { AppPage };
