import { useState, useCallback, useEffect, useMemo } from "react";

import { IProspect } from "@services/prospect/types";
import { searchAllModesOfDisbursementTypes } from "@services/lineOfCredit/getSearchAllModesOfDisbursementTypes";
import { IProspectSummaryById } from "@services/prospect/types";
import { getSearchProspectSummaryById } from "@services/creditRequest/query/ProspectSummaryById";
import { IModeOfDisbursement } from "@services/creditRequest/query/types";

import { disbursemenTabs } from "./disbursementGeneral/config";
import { DisbursementGeneral } from "./disbursementGeneral";
import {
  IDisbursementGeneral,
  dataTabsDisbursement,
  FormAccountType,
  DisbursementAccountKeys,
} from "../types";
import {
  mapModesToFormikInitialValues,
  DATA_TO_TAB_ID_MAP
} from "./utils";
import { DisbursementModal } from "..";

export interface IDisbursementFlowManagerProps {
  isMobile: boolean;
  handleClose: () => void;
  parentLoading: boolean;
  initialDisbursementData: {
    internal: IModeOfDisbursement | null;
    external: IModeOfDisbursement | null;
    checkEntity: IModeOfDisbursement | null;
    checkManagement: IModeOfDisbursement | null;
    cash: IModeOfDisbursement | null;
  };
  dataDefault: dataTabsDisbursement;
  identificationNumber: string;
  modesOfDisbursement: string[];
  prospectData: IProspect;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  prospectSummaryData: IProspectSummaryById | undefined;
  creditRequestCode: string;
}

export function DisbursementFlowManager(props: IDisbursementFlowManagerProps) {
  const {
    isMobile,
    handleClose,
    parentLoading,
    initialDisbursementData,
    dataDefault,
    identificationNumber,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
    prospectSummaryData,
    creditRequestCode,
  } = props;
  console.log('initialDisbursementData: ', initialDisbursementData);
  const [modesOfDisbursement, setModesOfDisbursement] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<IDisbursementGeneral>(mapModesToFormikInitialValues(initialDisbursementData));
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const [currentTab, setCurrentTab] = useState<string>("");
  const [internalLoading, setInternalLoading] = useState(true);
  const [editableFormData, setEditableFormData] = useState<IDisbursementGeneral>(() =>
    mapModesToFormikInitialValues(initialDisbursementData)
  );
  const [formInitialSnapshot, setFormInitialSnapshot] = useState<IDisbursementGeneral>(() =>
    mapModesToFormikInitialValues(initialDisbursementData)
  );
  const [loadingDisbursementData, setLoadingDisbursementData] = useState<boolean>(false);

  useEffect(() => {
    const newData = mapModesToFormikInitialValues(initialDisbursementData);
    setFormInitialSnapshot(newData);
    setEditableFormData(newData);
  }, [initialDisbursementData]);

  const handleOpenEdit = useCallback(() => {
    setViewMode('edit');
  }, []);

  useEffect(() => {
    const getAmountDisbursement = async () => {
      try {
        setInternalLoading(false);
        const data = await getSearchProspectSummaryById(businessUnitPublicCode, businessManagerCode, creditRequestCode);
        setInitialValues({ ...initialValues, amount: data.netAmountToDisburse });
      } finally {
        setInternalLoading(false);
      }
    }

    getAmountDisbursement();
  }, [prospectData, businessUnitPublicCode, businessManagerCode, creditRequestCode, initialValues]);

  useEffect(() => {
    const fetchDisbursementData = async () => {
      if (
        !prospectData.borrowers?.[0]?.borrowerIdentificationNumber ||
        !prospectData.creditProducts?.[0]?.lineOfCreditAbbreviatedName ||
        !prospectData.moneyDestinationAbbreviatedName
      ) {
        return;
      }

      try {
        setInternalLoading(false);
        const creditData = await searchAllModesOfDisbursementTypes(
          businessUnitPublicCode,
          businessManagerCode,
          prospectData.borrowers[0].borrowerIdentificationNumber,
          prospectData.creditProducts[0].lineOfCreditAbbreviatedName,
          prospectData.moneyDestinationAbbreviatedName,
          prospectData.creditProducts[0].loanAmount.toString(),
        );

        if (
          creditData?.modesOfDisbursementTypes &&
          creditData.modesOfDisbursementTypes.length > 0
        ) {
          setModesOfDisbursement(creditData.modesOfDisbursementTypes);
        } else {
          setModesOfDisbursement([]);
        }
      } catch (error) {
        setModesOfDisbursement([]);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchDisbursementData();
  }, [businessUnitPublicCode, businessManagerCode, prospectData, viewMode]);

  const sortedModes = useMemo(() => {
    if (!modesOfDisbursement.length) return [];

    return [...modesOfDisbursement].sort((firstModeKey, secondModeKey) => {
      const keyA = firstModeKey as DisbursementAccountKeys;
      const keyB = secondModeKey as DisbursementAccountKeys;

      const dataA = editableFormData[keyA];
      const dataB = editableFormData[keyB];

      const amountA = Number(dataA?.amount) || 0;
      const amountB = Number(dataB?.amount) || 0;

      return amountB - amountA;
    });
  }, [modesOfDisbursement, editableFormData]);

  const availableTabs = useMemo(() => {
    const hasValidData = (tabData: FormAccountType) => {
      if (!tabData) return false;

      if (Number(tabData.amount) > 0) return true;

      return Object.values(tabData).some(value => value !== null && value !== undefined && value !== "" && value !== 0 && value !== false);
    };

    const allTabs = Object.values(disbursemenTabs);

    return allTabs.filter((tab) => {
      switch (tab.id) {
        case "Internal": return hasValidData(editableFormData.Internal_account);
        case "External": return hasValidData(editableFormData.External_account);
        case "CheckEntity": return hasValidData(editableFormData.Certified_check);
        case "CheckManagement": return hasValidData(editableFormData.Business_check);
        case "Cash": return hasValidData(editableFormData.Cash);
        default: return false;
      }
    });
  }, [editableFormData]);

  useEffect(() => {
    if (currentTab !== "") return;
    if (availableTabs.length > 0) {
      setCurrentTab(availableTabs[0].id);
      return;
    }

    if (sortedModes.length > 0) {
      const firstModeKey = sortedModes[0];
      const mappedTabId = DATA_TO_TAB_ID_MAP[firstModeKey];

      if (mappedTabId) {
        setCurrentTab(mappedTabId);
      }
    }
  }, [availableTabs, currentTab, sortedModes]);

  const mapToDisplayData = (
    formData: FormAccountType,
    defaultData: dataTabsDisbursement
  ): dataTabsDisbursement => {
    if (!formData || !Object.keys(formData).length) return defaultData;

    const mappedData: dataTabsDisbursement = {
      ...defaultData,
      disbursementAmount: Number(formData.amount) || 0,
      isInTheNameOfBorrower: formData.toggle ? "Y" : "N",
      payeeName: formData.name || "",
      payeeSurname: formData.lastName || "",
      payeeBiologicalSex: formData.sex || "",
      payeeIdentificationType: formData.documentType || "",
      payeeIdentificationNumber: formData.identification || "",
      payeeBirthday: formData.birthdate || "",
      payeePhoneNumber: formData.phone || "",
      payeeEmail: formData.mail || "",
      payeeCityOfResidence: formData.city || "",
      observation: formData.description || "",
      accountBankName: "",
      accountType: "",
      accountNumber: "",
    };

    if ('bank' in formData) {
      mappedData.accountBankName = (formData as IDisbursementGeneral['External_account']).bank || "";
    }
    if ('accountType' in formData) {
      mappedData.accountType = (formData as IDisbursementGeneral['External_account']).accountType || "";
    }
    if ('accountNumber' in formData) {
      mappedData.accountNumber = (formData as IDisbursementGeneral['Internal_account']).accountNumber || "";
    }

    return mappedData;
  };

  const handleSave = () => {
    try {
      setLoadingDisbursementData(true);
    } finally {
      handleClose();
      setLoadingDisbursementData(false);
    }
  }

  const areAllPropertiesNull = (data: object): boolean => {
    if (!data) return true;
    return Object.values(data).every((value) => value === null);
  };

  const isLoading = parentLoading || internalLoading || areAllPropertiesNull(initialDisbursementData);

  return (
    viewMode === 'edit' ? (
      <DisbursementGeneral
        isMobile={isMobile}
        initialValues={formInitialSnapshot}
        handleOnChange={setInitialValues}
        isSelected={currentTab}
        onFormValid={() => { }}
        handleTabChange={setCurrentTab}
        prospectData={prospectData}
        identificationNumber={identificationNumber}
        prospectSummaryData={prospectSummaryData}
        modesOfDisbursement={sortedModes}
        handleClose={handleClose}
        handleSave={handleSave}
        isLoading={loadingDisbursementData}
      />
    ) : (
      <DisbursementModal
        isMobile={isMobile}
        handleClose={handleClose}
        loading={isLoading}
        data={{
          internal: mapToDisplayData(editableFormData.Internal_account, dataDefault),
          external: mapToDisplayData(editableFormData.External_account, dataDefault),
          CheckEntity: mapToDisplayData(editableFormData.Certified_check, dataDefault),
          checkManagementData: mapToDisplayData(editableFormData.Business_check, dataDefault),
          cash: mapToDisplayData(editableFormData.Cash, dataDefault),
        }}
        handleOpenEdit={handleOpenEdit}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    )
  );
}