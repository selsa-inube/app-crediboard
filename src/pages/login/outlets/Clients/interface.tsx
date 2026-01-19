import React from "react";
import {
  Button,
  Searchfield,
  Stack,
  Text,
  useMediaQuery,
} from "@inubekit/inubekit";

import { IBusinessUnitsPortalStaff } from "@services/businessUnitsPortalStaff/types";
import { RadioBusinessUnit } from "@components/RadioBusinessUnit";
import { EnumType } from "@hooks/useEnum";

import { businessUnitsLabels } from "./config";
import { IBusinessUnitstate } from "./types";
import {
  StyledBusinessUnits,
  StyledBusinessUnitsList,
  StyledNoResults,
  StyledBusinessUnitsItem,
} from "./styles";

interface BusinessUnitsUIProps {
  businessUnits: IBusinessUnitsPortalStaff[];
  search: string;
  businessUnit: IBusinessUnitstate;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBussinessUnitChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  filterBusinessUnits: (
    businessUnits: IBusinessUnitsPortalStaff[],
    search: string
  ) => IBusinessUnitsPortalStaff[];
  handleSubmit: () => void;
  lang: EnumType;
}

interface INoResultsMessageProps {
  search: string;
  lang: EnumType;
}

function NoResultsMessage(props: INoResultsMessageProps) {
  const { search, lang } = props;
  return (
    <StyledNoResults>
      <Text size="medium">{businessUnitsLabels.noResultsFound.i18n[lang].replace("{search}", search)}</Text>
      <Text size="medium">
        {businessUnitsLabels.noResultsSuggestion.i18n[lang]}
      </Text>
    </StyledNoResults>
  );
}

function BusinessUnitsUI({
  businessUnits,
  search,
  businessUnit,
  handleSearchChange,
  filterBusinessUnits,
  handleBussinessUnitChange,
  handleSubmit,
  lang
}: BusinessUnitsUIProps) {
  const isMobile = useMediaQuery("(max-width: 532px)");
  return (
    <StyledBusinessUnits $isMobile={isMobile}>
      <Stack direction="column">
        <Text type="title" as="h2" textAlign="center">
          {businessUnitsLabels.title.i18n[lang]}
        </Text>
        <Text size="medium" textAlign="center">
          {businessUnitsLabels.subTitle.i18n[lang]}
        </Text>
      </Stack>
      <form>
        <Stack direction="column" alignItems="center" gap="16px">
          {businessUnits.length > 10 && (
            <Searchfield
              placeholder={businessUnitsLabels.searchPlaceholder.i18n[lang]}
              type="search"
              name="searchBusinessUnits"
              id="searchBusinessUnits"
              value={search}
              fullwidth={true}
              onChange={handleSearchChange}
            />
          )}
          {filterBusinessUnits(businessUnits, search).length === 0 && (
            <NoResultsMessage search={search} lang={lang} />
          )}
          <StyledBusinessUnitsList
            $scroll={businessUnits.length > 5}
            $isMobile={isMobile}
          >
            <Stack
              direction="column"
              padding="0px 8px"
              alignItems="center"
              gap="8px"
            >
              {filterBusinessUnits(businessUnits, search).map(
                (businessUnit) => (
                  <StyledBusinessUnitsItem
                    key={businessUnit.businessUnitPublicCode}
                  >
                    <RadioBusinessUnit
                      name="businessUnit"
                      label={businessUnit.abbreviatedName}
                      id={businessUnit.businessUnitPublicCode}
                      value={businessUnit.abbreviatedName}
                      logo={businessUnit.urlLogo}
                      handleChange={handleBussinessUnitChange}
                    />
                  </StyledBusinessUnitsItem>
                )
              )}
            </Stack>
          </StyledBusinessUnitsList>
          <Button
            type="button"
            disabled={businessUnit.value}
            onClick={handleSubmit}
          >
            {businessUnitsLabels.continueButton.i18n[lang]}
          </Button>
        </Stack>
      </form>
    </StyledBusinessUnits>
  );
}

export { BusinessUnitsUI };
