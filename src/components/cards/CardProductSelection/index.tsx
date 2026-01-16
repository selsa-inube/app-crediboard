import { Stack, Text } from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { currencyFormat } from "@utils/formatData/currency";
import { EnumType } from "@hooks/useEnum";

import { selectDataEnum } from "./config";

export interface ICardProductSelectionProps {
  lang?: EnumType;
  amount?: number;
  rate?: number;
  term?: number;
  description: string;
  disabled?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  typeCheck?: string;
  isMobile?: boolean;
  viewOnly?: boolean;
}

export function CardProductSelection(props: ICardProductSelectionProps) {
  const {
    amount = 10000000,
    rate = 1,
    term = 12,
    description,
    disabled,
    onSelect,
    isSelected,
    typeCheck,
    isMobile,
    viewOnly = false,
    lang = "es",
  } = props;

  return (
    <Stack width={isMobile ? "250px" : "455px"} direction="column">
      <Stack gap="4px">
        {!viewOnly && (
          <input
            type={typeCheck ? typeCheck : "checkbox"}
            disabled={disabled}
            checked={isSelected}
            onChange={onSelect}
            name="productSelection"
          />
        )}
        <Text
          type="title"
          size="medium"
          appearance={disabled ? "gray" : "dark"}
        >
          {description}
        </Text>
      </Stack>
      <Fieldset
        isClickable={!disabled}
        selectedState={isSelected}
        onSelectionChange={viewOnly ? undefined : onSelect}
      >
        <Stack direction="column" gap="16px" padding="4px 16px">
          <Stack justifyContent="space-between">
            <Text
              appearance={disabled ? "gray" : "dark"}
              type="label"
              size="large"
              weight="bold"
            >
              {selectDataEnum.amount.i18n[lang]}
            </Text>
            <Text appearance="gray" size="medium">
              <Text as="span" appearance="primary" size="small" weight="bold">
                ${" "}
              </Text>
              {currencyFormat(amount, false)}
            </Text>
          </Stack>
          <Stack justifyContent="space-between">
            <Text
              appearance={disabled ? "gray" : "dark"}
              type="label"
              size="large"
              weight="bold"
            >
              {selectDataEnum.rate.i18n[lang]}
            </Text>
            <Text appearance="gray" size="medium">
              {rate.toFixed(3)} % M.V
            </Text>
          </Stack>
          <Stack justifyContent="space-between">
            <Text
              appearance={disabled ? "gray" : "dark"}
              type="label"
              size="large"
              weight="bold"
            >
              {selectDataEnum.term.i18n[lang]}
            </Text>
            <Text appearance="gray" size="medium">
              {term} {selectDataEnum.months.i18n[lang]}
            </Text>
          </Stack>
        </Stack>
      </Fieldset>
    </Stack>
  );
}
