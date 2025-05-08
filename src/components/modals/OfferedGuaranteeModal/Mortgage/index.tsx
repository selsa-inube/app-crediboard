import { Stack, Text, Grid, Divider } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { IMortgages } from "@services/guarantees/types";

import { dataMortgage } from "./config";

interface IMortgage {
  isMobile: boolean;
  initialValues: IMortgages[];
}

export function Mortgage(props: IMortgage) {
  const { isMobile, initialValues } = props;

  const data = initialValues[0];

  return (
    <Fieldset>
      <Stack
        direction="column"
        width={isMobile ? "265px" : "582px"}
        height={isMobile ? "294px" : "auto"}
        padding="8px"
        gap="16px"
      >
        <Text type="label" weight="bold" size="large">
          {dataMortgage.title}
        </Text>
        <Divider dashed />
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
          autoRows="auto"
          gap="20px"
        >
          <CardGray
            label={dataMortgage.property}
            placeHolder={data.propertyType}
          />
          <CardGray
            label={dataMortgage.state}
            placeHolder={data.propertyState}
          />
          <CardGray label={dataMortgage.years} placeHolder={data.propertyAge} />
          <CardGray
            label={dataMortgage.value}
            placeHolder={`$ ${data.propertyPrice}`}
          />
        </Grid>
        <CardGray
          label={dataMortgage.description}
          placeHolder={data.descriptionUse}
        />
      </Stack>
    </Fieldset>
  );
}
