import { useEffect, useState } from "react";
import { Stack, Tabs } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { BaseModal } from "@components/modals/baseModal";
import { Fieldset } from "@components/data/Fieldset";
import { ItemNotFound } from "@components/layout/ItemNotFound";

import { dataDisbursement, dataTabs } from "./config";
import { DisbursementInternal } from "./Internal";
import { DisbursementExternal } from "./External";
import { DisbursementCheckEntity } from "./CheckEntity";
import { DisbursementChequeManagement } from "./ChequeManagement";
import { DisbursementCash } from "./Cash";
import { dataTabsDisbursement } from "./types";

export interface IDisbursementModalProps {
  handleClose: () => void;
  isMobile: boolean;
  loading?: boolean;
  data: {
    internal: dataTabsDisbursement;
    external: dataTabsDisbursement;
    CheckEntity: dataTabsDisbursement;
    checkManagementData: dataTabsDisbursement;
    cash: dataTabsDisbursement;
  };
  handleDisbursement?: () => void;
}

export function DisbursementModal(
  props: IDisbursementModalProps
): JSX.Element | null {
  const { handleClose, isMobile, data, handleDisbursement } = props;
  const [error] = useState(false);
  const availableTabs = dataTabs.filter((tab) => {
    const hasValidData = (tabData: dataTabsDisbursement) =>
      tabData && Object.values(tabData).some((value) => value !== "");

    switch (tab.id) {
      case "Internal":
        return hasValidData(data.internal);
      case "External":
        return hasValidData(data.external);
      case "CheckEntity":
        return hasValidData(data.CheckEntity);
      case "CheckManagement":
        return hasValidData(data.checkManagementData);
      case "Cash":
        return hasValidData(data.cash);
      default:
        return false;
    }
  });

  const [currentTab, setCurrentTab] = useState(() =>
    availableTabs.length > 0 ? availableTabs[0].id : ""
  );

  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.some((tab) => tab.id === currentTab)
    ) {
      setCurrentTab(availableTabs[0].id);
    }
  }, [availableTabs, currentTab]);

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };
  const handleRetry = () => {
    handleDisbursement?.();
  };
  return (
    <BaseModal
      title={dataDisbursement.title}
      finalDivider={true}
      handleClose={handleClose}
      handleNext={handleClose}
      nextButton={dataDisbursement.close}
      width={isMobile ? "300px" : "652px"}
    >
      <Stack>
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={availableTabs}
          onChange={onChange}
        />
      </Stack>
      <Fieldset heightFieldset="469px" alignContent="center">
        {error || availableTabs.length === 0 ? (
          <ItemNotFound
            image={userNotFound}
            title={dataDisbursement.noDataTitle}
            description={dataDisbursement.noDataDescription}
            buttonDescription={dataDisbursement.retry}
            onRetry={handleRetry}
          />
        ) : (
          <>
            {currentTab === "Internal" && (
              <DisbursementInternal isMobile={isMobile} data={data.internal} />
            )}
            {currentTab === "External" && (
              <DisbursementExternal isMobile={isMobile} data={data.external} />
            )}
            {currentTab === "CheckEntity" && (
              <DisbursementCheckEntity
                isMobile={isMobile}
                data={data.CheckEntity}
              />
            )}
            {currentTab === "CheckManagement" && (
              <DisbursementChequeManagement
                isMobile={isMobile}
                data={data.checkManagementData}
              />
            )}
            {currentTab === "Cash" && (
              <DisbursementCash isMobile={isMobile} data={data.cash} />
            )}
          </>
        )}
      </Fieldset>
    </BaseModal>
  );
}
