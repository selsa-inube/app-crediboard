import {
  Stack,
  Text,
  Divider,
  useMediaQueries,
  Tag,
  Button,
} from "@inubekit/inubekit";

import { environment } from "@config/environment";
import { errorCodesEnum } from "@config/errorCodes";
import selsaLogo from "@assets/images/logoInube.png";
import errorImage from "@assets/images/img-team-building-68.png";
import { useEnum } from "@hooks/useEnum";

import { staticTranslations } from "./config";

import {
  StyledCompanyLogo,
  StyledErrorImage,
  StyledFooter,
  StyledCertificationsContainer,
  VerticalDivider,
  StyledMainContent,
  StyledContainer,
  StyledDiv,
} from "./styles";

interface ErrorPageProps {
  logo?: string;
  logoAlt?: string;
  heading?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  nameButton?: string;
  onClick?: () => void;
  errorCode?: number;
  addToFix?: string[];
}

const ListContent = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

function ErrorPage(props: ErrorPageProps) {
  const {
    logo = selsaLogo,
    logoAlt = "Sistemas Enlinea",
    heading = "¡Ups! Algo salió mal...",
    image = errorImage,
    imageAlt = "Ha surgido un error. Revisa la descripción",
    nameButton = "Regresar",
    onClick,
    errorCode = 0,
    addToFix,
  } = props;

  const mediaQueries = ["(max-width: 600px)"];
  const matches = useMediaQueries(mediaQueries);
  const queriesMatches = matches["(max-width: 600px)"];
  const { lang } = useEnum();

 const errorEntry = errorCodesEnum[errorCode as keyof typeof errorCodesEnum];

  const whatWentWrongItems = errorEntry?.whatWentWrong.i18n[lang] || [
    staticTranslations.fallbackError[lang],
  ];
  
  const howToFixItems = errorEntry?.howToFix.i18n[lang] || [
    staticTranslations.fallbackFix[lang],
  ];

  return (
    <StyledContainer>
      <StyledMainContent>
        <Stack justifyContent="center">
          <Stack gap="64px" direction="column" alignItems="center" width="100%">
            <Stack width="90%">
              <StyledCompanyLogo
                src={logo}
                alt={logoAlt}
                width={queriesMatches ? "40px" : "54px"}
                height={queriesMatches ? "40px" : "54px"}
              />
            </Stack>

            <Stack direction="column" alignItems="center">
              <Stack
                direction="column"
                alignItems="center"
                gap={queriesMatches ? "24px" : "32px"}
              >
                <Text
                  type="headline"
                  textAlign="center"
                  weight="bold"
                  size={queriesMatches ? "small" : "large"}
                >
                  {heading}
                </Text>
                <Tag
                  appearance="gray"
                  label={`Código de error: ${errorCode}`}
                />
                <StyledErrorImage
                  src={image}
                  alt={imageAlt}
                  width={queriesMatches ? "180px" : "256px"}
                  height={queriesMatches ? "160px" : "240px"}
                />
              </Stack>
            </Stack>

            <StyledCertificationsContainer $isMobile={queriesMatches}>
              <Stack
                direction={queriesMatches ? "column" : "row"}
                gap="32px"
                justifyContent="space-between"
                width="100%"
              >
                <Stack direction="column" gap="24px" width="100%">
                  <Text type="headline" size="medium" weight="bold">
                    {staticTranslations.whatWentWrong[lang]}
                  </Text>
                  <StyledDiv>
                    <ListContent items={whatWentWrongItems} />
                  </StyledDiv>
                </Stack>

                <VerticalDivider $isVertical={!queriesMatches} />
                {queriesMatches && <Divider dashed />}

                <Stack direction="column" gap="24px" width="100%">
                  <Text type="headline" size="medium" weight="bold">
                    {staticTranslations.howToFix[lang]}
                  </Text>
                  <StyledDiv>
                    <ListContent
                      items={[
                        ...howToFixItems,
                        ...(Array.isArray(addToFix) ? addToFix : []),
                      ]}
                    />
                  </StyledDiv>
                  <Stack justifyContent="center">
                    <Button
                      appearance="primary"
                      spacing="wide"
                      variant="filled"
                      fullwidth={queriesMatches}
                      onClick={() =>
                        onClick
                          ? onClick()
                          : window.open(environment.REDIRECT_URI, "_self")
                      }
                    >
                      {nameButton}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </StyledCertificationsContainer>
          </Stack>
        </Stack>
      </StyledMainContent>
      <StyledFooter>
        <Text appearance="gray" textAlign="center" size="small" weight="bold">
          © 2025 Inube
        </Text>
      </StyledFooter>
    </StyledContainer>
  );
}

export { ErrorPage };
export type { ErrorPageProps };
