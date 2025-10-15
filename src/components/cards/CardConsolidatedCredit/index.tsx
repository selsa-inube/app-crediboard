//CREDIBOARD - CardConsolidatedCredit refactorizado
import { useState, useRef } from "react";
import { MdClear } from "react-icons/md";
import { Stack, Text, Tag, Divider, Button } from "@inubekit/inubekit";

import { formatPrimaryDate } from "@utils/formatData/date";
import { currencyFormat } from "@utils/formatData/currency";

import { StyledContainer, StyledInput } from "./styles";
import { dataConsolidatedCredit } from "./config";
import { getInitialLabel } from "./utils";

export interface ICardConsolidatedCreditProps {
  onUpdateTotal: (
    oldValue: number,
    newValue: number,
    label?: string,
    title?: string,
    selectedDate?: Date,
    code?: string
  ) => void;
  title: string;
  code: string;
  expiredValue: number;
  nextDueDate: number;
  fullPayment: number;
  date: Date;
  isMobile?: boolean;
  arrears?: boolean;
  initialValue?: number;
  initialType?: string;
  handleRemoveCredit?: (code: string) => void;
}

export function CardConsolidatedCredit(props: ICardConsolidatedCreditProps) {
  const {
    onUpdateTotal,
    title,
    code,
    expiredValue,
    nextDueDate,
    fullPayment,
    isMobile,
    arrears,
    date = new Date(),
    initialValue,
    initialType,
    handleRemoveCredit,
  } = props;
  console.log("initialType: ", initialType);
  const hasInitialValue = initialValue !== undefined && initialValue > 0;

  const [isRadioSelected, setIsRadioSelected] = useState(
    hasInitialValue || initialType !== undefined
  );
  const [selectedValue, setSelectedValue] = useState<number | null>(
    hasInitialValue ? initialValue : null
  );

  const radioRefs = useRef<HTMLInputElement[]>([]);

  const paymentOptions = [
    {
      label: dataConsolidatedCredit.expiredValue,
      value: expiredValue,
    },
    {
      label: dataConsolidatedCredit.nextDueDate,
      value: nextDueDate,
      date: date,
    },
    {
      label: dataConsolidatedCredit.fullPayment,
      value: fullPayment,
    },
  ];

  const initialLabel = getInitialLabel(initialValue || 0, initialType || "", paymentOptions);

  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(
    initialLabel
  );

  const handleSelectionChange = (
    value: number,
    label: string,
    optionDate?: Date
  ) => {
    if (selectedValue !== value || selectedOptionLabel !== label) {
      onUpdateTotal(selectedValue || 0, value, label, title, optionDate, code);
      setSelectedValue(value);
      setSelectedOptionLabel(label);
    }
    setIsRadioSelected(true);
  };

  const handleClearSelection = () => {
    if (isRadioSelected && selectedValue !== null) {
      onUpdateTotal(selectedValue, 0, selectedOptionLabel || "", title);
      setSelectedValue(null);
      setSelectedOptionLabel(null);
      setIsRadioSelected(false);
      radioRefs.current.forEach((radio) => {
        if (radio) radio.checked = false;
      });

      // Llamar a handleRemoveCredit si existe
      if (handleRemoveCredit) {
        handleRemoveCredit(code);
      }
    }
  };

  return (
    <StyledContainer disabled={isRadioSelected} $isMobile={isMobile}>
      <Stack
        direction="column"
        padding={isMobile ? "16px 10px" : "16px 20px"}
        gap="16px"
        width="256px"
      >
        <Text type="label" size="large" weight="bold">
          {title}
        </Text>
        <Divider dashed />
        <Text type="body" size="medium" appearance="gray">
          {code}
        </Text>
        <Stack justifyContent="space-between">
          <Tag
            label={dataConsolidatedCredit.regularPayroll}
            appearance="gray"
          />
          {arrears && (
            <Tag label={dataConsolidatedCredit.arrears} appearance="danger" />
          )}
        </Stack>
        <Stack direction="column" gap="8px">
          {paymentOptions.map((option, index) => (
            <StyledInput
              key={index}
              onClick={() => radioRefs.current[index]?.click()}
            >
              <Stack alignItems="center" justifyContent="space-between">
                <Stack>
                  <input
                    type="radio"
                    name={`paymentOption-${code}`}
                    ref={(el) => (radioRefs.current[index] = el!)}
                    checked={
                      selectedOptionLabel === option.label
                    }
                    onChange={() =>
                      handleSelectionChange(
                        option.value,
                        option.label,
                        option.date
                      )
                    }
                  />
                  <Stack direction="column">
                    <Text type="label" size="medium" weight="bold">
                      {option.label}
                    </Text>
                    {option.date && (
                      <Text type="body" size="small" appearance="gray">
                        {formatPrimaryDate(option.date)}
                      </Text>
                    )}
                  </Stack>
                </Stack>
                <Text type="body" size="small" appearance="gray">
                  {currencyFormat(option.value)}
                </Text>
              </Stack>
            </StyledInput>
          ))}
        </Stack>
        <Stack justifyContent="space-between" alignItems="end">
          <Button
            children="Desmarcar"
            iconBefore={<MdClear />}
            variant="outlined"
            appearance={isRadioSelected ? "primary" : "gray"}
            spacing="compact"
            onClick={handleClearSelection}
          />
          <Text type="title" size="medium" weight="bold" appearance="gray">
            {currencyFormat(selectedValue || 0)}
          </Text>
        </Stack>
      </Stack>
    </StyledContainer>
  );
}