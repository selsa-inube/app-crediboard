import { MdInfoOutline } from "react-icons/md";
import { Stack, Icon, Text } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";

import { dataBail } from "./config";

interface IBailProps {
  data: number;
}

export function Bail(props: IBailProps) {
  const { data } = props;

  return (
    <Fieldset>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        padding="12px"
        gap="20px"
        height="266px"
      >
        {data ? (
          <>
            <Stack direction="column" gap="8px" alignItems="center">
              <Text
                type="headline"
                weight="bold"
                size="large"
                appearance="primary"
              >
                {currencyFormat(data)}
              </Text>
              <Text type="body" size="small" appearance="gray">
                {dataBail.bail}
              </Text>
            </Stack>
            <Text type="label" size="large">
              {dataBail.customer}
            </Text>
            <Stack gap="4px">
              <Icon icon={<MdInfoOutline />} appearance="dark" size="16px" />
              <Text type="body" size="medium" appearance="gray">
                {dataBail.disbursement}
              </Text>
            </Stack>
          </>
        ) : (
          <Stack margin="auto">
            <Text>{dataBail.noContent}</Text>
          </Stack>
        )}
      </Stack>
    </Fieldset>
  );
}
