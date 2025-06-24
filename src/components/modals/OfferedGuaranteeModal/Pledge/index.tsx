import { Stack, Text, Grid, Divider } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { IPledges } from "@services/credit-request/query/guarantees/types";

import { dataPledge } from "./config";

interface IPledge {
  isMobile: boolean;
  initialValues: IPledges[];
}

export function Pledge(props: IPledge) {
  const { isMobile, initialValues } = props;

  const data = initialValues[0];

  return (
    <Fieldset>
      <Stack
        direction="column"
        width={isMobile ? "265px" : "568px"}
        height="274px"
        padding="8px"
        gap="16px"
      >
        {data ? (
          <>
            <Text type="label" weight="bold" size="large">
              {dataPledge.title}
            </Text>
            <Divider dashed />
            <Grid
              templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
              autoRows="auto"
              gap="20px"
            >
              <CardGray
                label={dataPledge.state}
                placeHolder={data.vehiculeState}
              />
              <CardGray
                label={dataPledge.years}
                placeHolder={data.vehiculeAge}
              />
              <CardGray
                label={dataPledge.value}
                placeHolder={`$ ${data.vehiculePrice}`}
              />
            </Grid>
            <CardGray
              label={dataPledge.description}
              placeHolder={data.descriptionUse}
            />
          </>
        ) : (
          <Stack margin="auto">
            <Text>{dataPledge.noContent}</Text>
          </Stack>
        )}
      </Stack>
    </Fieldset>
  );
}
