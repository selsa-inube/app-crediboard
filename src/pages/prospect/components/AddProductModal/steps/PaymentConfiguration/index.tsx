import { useEffect, useMemo, useRef } from "react";

import { formatPrimaryDate } from "@utils/formatData/date";
import { useEnum } from "@hooks/useEnum";

import { PaymentConfigurationUI } from "./interface";
import { IPaymentConfigurationMain, paymentConfigurationEnum, IResponsePaymentDatesChannel, IRegularCycle } from "../config";

export function PaymentConfiguration(props: IPaymentConfigurationMain) {
  const { paymentConfig, onChange, onFormValid } = props;
  const language = useEnum().lang;

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const allChannels = useMemo(() => {
    if (!paymentConfig.paymentChannelData) return [];

    return paymentConfig.paymentChannelData.flatMap((item) => {
      const itemWithNest = item as IResponsePaymentDatesChannel & {
        paymentChannels?: IResponsePaymentDatesChannel[];
      };

      if (
        Array.isArray(itemWithNest.paymentChannels) &&
        itemWithNest.paymentChannels.length > 0
      ) {
        return itemWithNest.paymentChannels;
      }

      return item;
    });
  }, [paymentConfig.paymentChannelData]);

  const paymentMethodOptions = useMemo(() => {
    return allChannels.map((channel: IResponsePaymentDatesChannel, index: number) => ({
      id: `${channel.abbreviatedName}-${channel.paymentChannel}-${index}`,
      value: channel.abbreviatedName,
      label: channel.abbreviatedName,
    }));
  }, [allChannels]);

  const selectedChannel = useMemo(
    () =>
      allChannels.find(
        (channel: IResponsePaymentDatesChannel) => channel.abbreviatedName === paymentConfig.paymentMethod
      ),
    [allChannels, paymentConfig.paymentMethod]
  );

  const paymentCycleOptions = useMemo(() => {
    return (
      selectedChannel?.regularCycles?.map((cycle: IRegularCycle, index: number) => ({
        id: `${cycle.cycleName}-${index}`,
        value: cycle.cycleName,
        label: cycle.cycleName,
      })) || []
    );
  }, [selectedChannel]);

  const selectedCycle = useMemo(
    () =>
      selectedChannel?.regularCycles?.find(
        (cycle: IRegularCycle) => cycle.cycleName === paymentConfig.paymentCycle
      ),
    [selectedChannel, paymentConfig.paymentCycle]
  );

  const firstPaymentDateOptions = useMemo(() => {
    return (
      selectedCycle?.detailOfPaymentDate?.map((date: string, index: number) => ({
        id: `${date}-${index}`,
        value: date,
        label: formatPrimaryDate(new Date(date)),
      })) || []
    );
  }, [selectedCycle]);

  useEffect(() => {
    const updates: Partial<typeof paymentConfig> = {};
    let shouldUpdate = false;

    if (paymentMethodOptions.length === 1) {
      const singleMethod = paymentMethodOptions[0].value;
      if (paymentConfig.paymentMethod !== singleMethod) {
        updates.paymentMethod = singleMethod;
        shouldUpdate = true;
      }
    }

    const currentMethod = updates.paymentMethod || paymentConfig.paymentMethod;
    if (currentMethod && paymentCycleOptions.length === 1) {
      const singleCycle = paymentCycleOptions[0].value;
      if (paymentConfig.paymentCycle !== singleCycle) {
        updates.paymentCycle = singleCycle;
        shouldUpdate = true;
      }
    }

    const currentCycle = updates.paymentCycle || paymentConfig.paymentCycle;
    if (currentCycle && firstPaymentDateOptions.length === 1) {
      const singleDate = firstPaymentDateOptions[0].value;
      if (paymentConfig.firstPaymentDate !== singleDate) {
        updates.firstPaymentDate = singleDate;
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      onChangeRef.current(updates);
    }
  }, [
    paymentMethodOptions,
    paymentCycleOptions,
    firstPaymentDateOptions,
    paymentConfig.paymentMethod,
    paymentConfig.paymentCycle,
    paymentConfig.firstPaymentDate,
  ]);

  useEffect(() => {
    const isValid =
      Boolean(paymentConfig.paymentMethod) &&
      Boolean(paymentConfig.paymentCycle) &&
      Boolean(paymentConfig.firstPaymentDate);

    onFormValid(isValid);
  }, [
    paymentConfig.paymentMethod,
    paymentConfig.paymentCycle,
    paymentConfig.firstPaymentDate,
    onFormValid,
  ]);

  const handlePaymentMethodChange = (value: string) => {
    onChange({
      paymentMethod: value,
      paymentCycle: "",
      firstPaymentDate: "",
    });
  };

  const handlePaymentCycleChange = (value: string) => {
    onChange({
      paymentCycle: value,
      firstPaymentDate: "",
    });
  };

  const handleFirstPaymentDateChange = (value: string) => {
    onChange({ firstPaymentDate: value });
  };

  const configUI = {
    paymentMethod: {
      label: paymentConfigurationEnum.paymentMethod.label.i18n[language],
      placeholder: paymentConfigurationEnum.paymentMethod.placeholder.i18n[language],
    },
    paymentCycle: {
      label: paymentConfigurationEnum.paymentCycle.label.i18n[language],
    },
    firstPaymentDate: {
      label: paymentConfigurationEnum.firstPaymentDate.label.i18n[language],
      placeholder: paymentConfigurationEnum.paymentMethod.placeholder.i18n[language],
    },
  };

  const hasOnlyOnePaymentMethod = paymentMethodOptions.length === 1;
  const hasOnlyOnePaymentCycle = paymentCycleOptions.length === 1;
  const hasOnlyOneFirstPaymentDate = firstPaymentDateOptions.length === 1;
  return (
    <PaymentConfigurationUI
      paymentConfig={paymentConfig}
      paymentMethodOptions={paymentMethodOptions}
      paymentCycleOptions={paymentCycleOptions}
      firstPaymentDateOptions={firstPaymentDateOptions}
      paymentConfiguration={configUI}
      handlePaymentMethodChange={handlePaymentMethodChange}
      handlePaymentCycleChange={handlePaymentCycleChange}
      handleFirstPaymentDateChange={handleFirstPaymentDateChange}
      hasOnlyOnePaymentMethod={hasOnlyOnePaymentMethod}
      hasOnlyOnePaymentCycle={hasOnlyOnePaymentCycle}
      hasOnlyOneFirstPaymentDate={hasOnlyOneFirstPaymentDate}
      language={language}
    />
  );
}
