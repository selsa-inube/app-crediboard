import { Stack, Select } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";

import { IPaymentConfigurationUI, dataAmountEnum, paymentConfigurationEnum } from "../config";

export function PaymentConfigurationUI(props: IPaymentConfigurationUI) {
  const {
    paymentConfig,
    firstPaymentDateOptions,
    paymentCycleOptions,
    paymentMethodOptions,
    paymentConfiguration,
    handlePaymentMethodChange,
    handlePaymentCycleChange,
    handleFirstPaymentDateChange,
    hasOnlyOneFirstPaymentDate,
    hasOnlyOnePaymentCycle,
    hasOnlyOnePaymentMethod,
    lang
  } = props;

  return (
    <Stack direction="column" gap="24px" padding="0px 16px">
      {hasOnlyOnePaymentMethod ? (
        <CardGray
          label={dataAmountEnum.ordinaryPayment.i18n[lang]}
          placeHolder={paymentMethodOptions[0]?.label || ""}
        />
      ) : (
        <Select
          label={dataAmountEnum.ordinaryPayment.i18n[lang]}
          name="paymentMethod"
          id="paymentMethod"
          size="compact"
          placeholder={paymentConfiguration.paymentMethod.placeholder}
          options={paymentMethodOptions}
          value={paymentConfig.paymentMethod}
          onChange={(__, value) => {
            handlePaymentMethodChange(value);
          }}
          fullwidth
          required
        />
      )}

      {paymentConfig.paymentMethod && (
        <>
          {hasOnlyOnePaymentCycle ? (
            <CardGray
              label={paymentConfigurationEnum.paymentCycle.label.i18n[lang]}
              placeHolder={paymentCycleOptions[0]?.label || ""}
            />
          ) : (
            <Select
              label={paymentConfigurationEnum.paymentCycle.label.i18n[lang]}
              name="paymentCycle"
              id="paymentCycle"
              size="compact"
              placeholder={paymentConfiguration.paymentMethod.placeholder}
              options={paymentCycleOptions}
              value={paymentConfig.paymentCycle}
              onChange={(__, value) => {
                handlePaymentCycleChange(value);
              }}
              fullwidth
              required
            />
          )}
        </>
      )}

      {paymentConfig.paymentCycle && (
        <>
          {hasOnlyOneFirstPaymentDate ? (
            <CardGray
              label={paymentConfigurationEnum.firstPaymentDate.label.i18n[lang]}
              placeHolder={firstPaymentDateOptions[0]?.label || ""}
            />
          ) : (
            <Select
              label={paymentConfigurationEnum.paymentDate.label.i18n[lang]}
              name="firstPaymentDate"
              id="firstPaymentDate"
              size="compact"
              placeholder={paymentConfiguration.firstPaymentDate.placeholder}
              options={firstPaymentDateOptions}
              value={paymentConfig.firstPaymentDate}
              onChange={(__, value) => {
                handleFirstPaymentDateChange(value);
              }}
              fullwidth
              required
            />
          )}
        </>
      )}
    </Stack>
  );
}
