import { IModeOfDisbursement } from "@services/creditRequest/query/types";

import { IDisbursementGeneral } from "../types";
import { IDisbursementFlowManagerProps } from ".";

export const mapModeDataToForm = (modeData: IModeOfDisbursement) => {
  return {
    ...modeData,
    amount: modeData.disbursementAmount
      ? Number(modeData.disbursementAmount)
      : 0,
    toggle:
      modeData.isInTheNameOfBorrower === "Y" ||
      modeData.isInTheNameOfBorrower === "true",
    check: Number(modeData.disbursementAmount) > 0,
    name: modeData.payeeName || "",
    lastName: modeData.payeeSurname || "",
    sex: modeData.payeeBiologicalSex || "",
    documentType: modeData.payeeIdentificationType || "",
    identification: modeData.payeeIdentificationNumber || "",
    birthdate: modeData.payeeBirthday || "",
    phone: modeData.payeePhoneNumber || "",
    mail: modeData.payeeEmail || "",
    city: modeData.payeeCityOfResidence || "",
    bank: modeData.accountBankName || "",
    accountType: modeData.accountType || "",
    accountNumber: modeData.accountNumber || "",
    description: modeData.observation || "",
  };
};

export const mapModesToFormikInitialValues = (
  modes: IDisbursementFlowManagerProps["initialDisbursementData"],
): IDisbursementGeneral => {
  const getAmount = (data: IModeOfDisbursement | null) =>
    data && data.disbursementAmount ? Number(data.disbursementAmount) : 0;

  const totalAmount =
    getAmount(modes.internal) +
    getAmount(modes.external) +
    getAmount(modes.checkEntity) +
    getAmount(modes.checkManagement) +
    getAmount(modes.cash);

  return {
    amount: totalAmount,
    Internal_account: modes.internal ? mapModeDataToForm(modes.internal) : {},
    External_account: modes.external ? mapModeDataToForm(modes.external) : {},
    Certified_check: modes.checkEntity
      ? mapModeDataToForm(modes.checkEntity)
      : {},
    Business_check: modes.checkManagement
      ? mapModeDataToForm(modes.checkManagement)
      : {},
    Cash: modes.cash ? mapModeDataToForm(modes.cash) : {},
  } as IDisbursementGeneral;
};

export const DataToTabIdMap: Record<string, string> = {
  Internal_account: "Internal",
  External_account: "External",
  Certified_check: "CheckEntity",
  Business_check: "CheckManagement",
  Cash: "Cash",
};

export const formatYesNo = (value: string | undefined | null): string => {
  return value === "Y" ? "Sí" : "No";
};

export const formatObservation = (value: string | undefined | null): string => {
  if (!value || value.trim() === "") {
    return "No tiene observaciones";
  }
  return value;
};

export const formatNoData = (value: string | undefined | null): string => {
  if (!value || value.trim() === "") {
    return "No se ha generado ";
  }
  return value;
};

export const formatBiologicalSex = (
  value: string | undefined | null,
): string => {
  if (value === "F") return "Femenino";
  if (value === "M") return "Masculino";
  return value || "";
};

export const capitalizeFirstLetter = (string: string): string => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const mapDataIdToTabId = (dataId: string): string => {
  const map: Record<string, string> = {
    Internal: "Internal_account",
    External: "External_account",
    CheckEntity: "Certified_check",
    CheckManagement: "Business_check",
    Cash: "Cash",
  };

  return map[dataId] || dataId;
};
