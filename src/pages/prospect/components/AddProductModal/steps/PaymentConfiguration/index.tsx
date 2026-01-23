import { useEffect, useMemo, useRef } from "react";

import { formatPrimaryDate } from "@utils/formatData/date";
import { useEnum } from "@hooks/useEnum";

import { PaymentConfigurationUI } from "./interface";
import { IPaymentConfigurationMain, paymentConfigurationEnum } from "../config";

export function PaymentConfiguration(props: IPaymentConfigurationMain) {
  const { paymentConfig, onChange, onFormValid } = props;
  const { lang } = useEnum();

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const flatChannels = useMemo(() => {
    return (
      paymentConfig.paymentChannelData?.flatMap(
        (item) => item.paymentChannels,
      ) ?? []
    );
  }, [paymentConfig.paymentChannelData]);

  const paymentMethodOptions = useMemo(() => {
    const unique = new Map(flatChannels.map((ch) => [ch.abbreviatedName, ch]));

    return Array.from(unique.values()).map((channel, index) => ({
      id: `${channel.abbreviatedName}-${index}`,
      value: channel.abbreviatedName,
      label: channel.abbreviatedName,
    }));
  }, [flatChannels]);

  const selectedChannel = useMemo(() => {
    return flatChannels.find(
      (channel) => channel.abbreviatedName === paymentConfig.paymentMethod,
    );
  }, [flatChannels, paymentConfig.paymentMethod]);

  const paymentCycleOptions = useMemo(() => {
    if (!selectedChannel) return [];

    const unique = Array.from(
      new Map(
        selectedChannel.regularCycles.map((cycle) => [
          cycle.cycleName,
          cycle.cycleName,
        ]),
      ).values(),
    );

    return unique.map((period, index) => ({
      id: `${period}-${index}`,
      value: period,
      label: period,
    }));
  }, [selectedChannel]);

  const selectedCycle = useMemo(() => {
    return selectedChannel?.regularCycles.find(
      (cycle) => cycle.cycleName === paymentConfig.paymentCycle,
    );
  }, [selectedChannel, paymentConfig.paymentCycle]);

  const firstPaymentDateOptions = useMemo(() => {
    if (!selectedCycle) return [];

    return Array.from(new Set(selectedCycle.detailOfPaymentDate)).map(
      (date, index) => ({
        id: `${date}-${index}`,
        value: date,
        label: formatPrimaryDate(new Date(date)),
      }),
    );
  }, [selectedCycle]);

  useEffect(() => {
    let shouldUpdate = false;
    const updates: Partial<IPaymentConfigurationMain["paymentConfig"]> = {};

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
      label: paymentConfigurationEnum.paymentMethod.label.i18n[lang],
      placeholder:
        paymentConfigurationEnum.paymentMethod.placeholder.i18n[lang],
    },
    paymentCycle: {
      label: paymentConfigurationEnum.paymentCycle.label.i18n[lang],
    },
    firstPaymentDate: {
      label: paymentConfigurationEnum.firstPaymentDate.label.i18n[lang],
      placeholder:
        paymentConfigurationEnum.paymentMethod.placeholder.i18n[lang],
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
      lang={lang}
    />
  );
}
