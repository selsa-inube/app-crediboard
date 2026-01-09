import { Stack, Textfield, Icon } from "@inubekit/inubekit";
import { MdAttachMoney } from "react-icons/md";

import { IAmountCaptureUI } from "../config";
import { StyledAmountCapture } from "./styles";

export function AmountCaptureUI(props: IAmountCaptureUI) {
  const {
    displayValue,
    loanAmountError,
    amountCaptureTexts,
    handleCurrencyChange,
    isMobile
  } = props;

  return (
    <StyledAmountCapture
      isMobile={isMobile}
    >
      <Stack
        direction="column"
        gap="24px"
        padding="0px 16px"
        height="230px"
      >
        <Textfield
          label={amountCaptureTexts.label}
          name="creditAmount"
          id="creditAmount"
          placeholder={amountCaptureTexts.placeholder}
          value={displayValue}
          status={
            loanAmountError
              ? "invalid"
              : undefined
          }
          message={loanAmountError}
          iconBefore={
            <Icon
              icon={<MdAttachMoney />}
              appearance="success"
              size="18px"
              spacing="narrow"
            />
          }
          size="compact"
          onChange={handleCurrencyChange}
          required
          fullwidth

        />
      </Stack>
    </StyledAmountCapture>
  );
}
