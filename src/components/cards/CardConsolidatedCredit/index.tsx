import { useState, useRef } from "react";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { Stack, Text, Tag, Button, ITag, Icon } from "@inubekit/inubekit";

import { CustomValueModal } from "@components/modals/CustomValueModal";
import { currencyFormat } from "@utils/formatData/currency";
import { IPaymentOption } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { EPaymentOptionType } from "@services/portfolioObligation/SearchAllPortfolioObligationPayment/types";
import { EnumType } from "@hooks/useEnum";

import { 
  StyledCardContainer, 
  StyledInputContainer,
  StyledInputRadio 
} from "./styles";
import { 
  dataConsolidatedCreditEnum,
  IApplyPayOption
 } from "./config";

export interface ICardConsolidatedCreditProps {
  onUpdateTotal: (
    oldValue: number,
    newValue: number,
    label?: string,
    title?: string,
    electedDate?: Date,
  ) => void;
  title: string;
  code: string;
  expiredValue: number;
  nextDueDate: number;
  fullPayment: number;
  description: string;
  date: Date;
  tags: ITag[];
  lang: EnumType;
  isMobile?: boolean;
  initialValue?: number;
  allowCustomValue?: boolean;
  initialType?: string;
  onApplyPayOption?: (
    id: string,
    applyPayOption: IApplyPayOption,
    value: number,
  ) => void;
  handleRemoveCredit?: (code: string) => void;
  arrears?: boolean;
}

export function CardConsolidatedCredit(props: ICardConsolidatedCreditProps) {
  const {
    onUpdateTotal,
    title,
    code,
    expiredValue,
    nextDueDate,
    fullPayment,
    description,
    date,
    tags,
    initialValue,
    initialType,
    allowCustomValue,
    handleRemoveCredit,
    lang
  } = props;
  
const hasInitialValue = initialValue !== undefined && initialValue > 0;

  const [isRadioSelected, setIsRadioSelected] = useState(
    hasInitialValue || initialType !== undefined,
  );
  const [selectedValue, setSelectedValue] = useState<number | null>(
    hasInitialValue ? initialValue : null,
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    hasInitialValue && initialType ? initialType : null,
  );
  const [showModal, setShowModal] = useState(false);
  const radioRefs = useRef<HTMLInputElement[]>([]);

  const paymentOptions = [
    {
      id: "nextPayment",
      label: dataConsolidatedCreditEnum.expiredValue.i18n[lang],
      value: expiredValue,
    },
    {
      id: "nextDueDate",
      label: dataConsolidatedCreditEnum.nextDueDate.i18n[lang],
      value: nextDueDate,
      description: description,
      date: date,
    },
    {
      id: "fullPayment",
      label: dataConsolidatedCreditEnum.fullPayment.i18n[lang],
      value: fullPayment,
    },
  ];

  const handleSelectionChange = (
    value: number,
    label: string,
    optionId: string = "",
    optionDate?: Date,
  ) => {
    if (selectedValue !== value || selectedOptionId !== optionId) {
      onUpdateTotal(selectedValue || 0, value, label, title, optionDate);
      setSelectedValue(value);
      setSelectedOptionId(optionId);
    }
    setIsRadioSelected(true);
  };

  const handleClearSelection = () => {
    if (
      isRadioSelected &&
      selectedValue !== null &&
      selectedOptionId !== null
    ) {
      onUpdateTotal(selectedValue, 0, selectedOptionId, title);
      setSelectedValue(null);
      setSelectedOptionId(null);
      setIsRadioSelected(false);
      radioRefs.current.forEach((radio) => {
        if (radio) radio.checked = false;
      });
      handleRemoveCredit && handleRemoveCredit(code);
    } else if (isRadioSelected && selectedValue !== null) {
      onUpdateTotal(selectedValue, 0);
      setSelectedValue(null);
      setSelectedOptionId(null);
      setIsRadioSelected(false);
      radioRefs.current.forEach((radio) => {
        if (radio) radio.checked = false;
      });
    }
  };

  const handleApplyPayOption = (
    applyPayOption: IApplyPayOption,
    value: number,
  ) => {
    const customOption = {
      id: EPaymentOptionType.OTHERVALUE,
      label: `Otro valor / ${applyPayOption.label}`,
      value,
    };

    handleSelectionChange(value, customOption.label);
  };

  const handleChangeOption = (option: IPaymentOption) => {
    handleSelectionChange(option.value, option.label);
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <StyledCardContainer>
        <Stack direction="column" gap="4px">
          <Text type="label" size="large" ellipsis weight="bold">
            {title}
          </Text>
          <Text type="body" size="medium" appearance="gray">
            {code}
          </Text>
          <Stack gap={"8px"} wrap="wrap">
            {tags.length > 0 &&
              tags.map((tag) => <Tag {...tag} key={tag.label} />)}
          </Stack>
        </Stack>
        <Stack direction="column" gap="8px">
          {paymentOptions.map((option, index) => (
            <StyledInputContainer
              key={index}
              onClick={() => {
                radioRefs.current[index]?.click();
              }}
            >
              <Stack gap="12px">
                <StyledInputRadio
                  type="radio"
                  name={`paymentOption-${code}`}
                  ref={(el) => (radioRefs.current[index] = el!)}
                  checked={
                    (selectedOptionId === option.label && isRadioSelected) ||
                    undefined
                  }
                  onChange={() =>
                    handleSelectionChange(
                      option.value,
                      option.label,
                      option.label,
                      option.date,
                    )
                  }
                />
                <Stack direction="column">
                  <Text type="label" size="medium" weight="bold">
                    {option.label}
                  </Text>
                  {option.description && (
                    <Text type="body" size="small" appearance="gray">
                      {option.description}
                    </Text>
                  )}
                </Stack>
              </Stack>

              <Text type="body" size="small" appearance="gray">
                {currencyFormat(option.value)}
              </Text>
            </StyledInputContainer>
          ))}
        </Stack>
        <Stack justifyContent="space-between" alignItems="center" width="100%">
          <Button
            iconBefore={<MdOutlineDelete />}
            variant="outlined"
            appearance="danger"
            spacing="compact"
            onClick={handleClearSelection}
            disabled={(selectedValue || 0) === 0}
          />
          <Stack gap="8px" alignItems="center">
            {allowCustomValue && (
              <Icon
                icon={<MdOutlineEdit />}
                appearance="primary"
                size="16px"
                onClick={handleToggleModal}
                cursorHover
              />
            )}
            <Text type="title" size="medium">
              {currencyFormat(selectedValue || 0)}
            </Text>
          </Stack>
        </Stack>
      </StyledCardContainer>
      {showModal && (
        <CustomValueModal
          portalId="portal"
          id={code}
          nextPaymentDate={date}
          lineCode={title}
          value={selectedValue || 0}
          nextPaymentValue={nextDueDate || 0}
          totalPaymentValue={fullPayment || 0}
          expiredValue={expiredValue || 0}
          onCloseModal={handleToggleModal}
          onApplyPayOption={handleApplyPayOption}
          onChangeOtherValue={handleChangeOption}
          lang={lang}
        />
      )}
    </>
  );
}