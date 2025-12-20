import { useEffect, useState } from "react";
import { Stack, Tabs, SkeletonLine, Grid } from "@inubekit/inubekit";

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
  handleOpenEdit: () => void;
  isMobile: boolean;
  currentTab: string;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
  data: {
    internal: dataTabsDisbursement;
    external: dataTabsDisbursement;
    CheckEntity: dataTabsDisbursement;
    checkManagementData: dataTabsDisbursement;
    cash: dataTabsDisbursement;
  };
  handleDisbursement?: () => void;
  loading?: boolean;
}

export function DisbursementModal(
  props: IDisbursementModalProps
): JSX.Element | null {
  const {
    handleClose,
    isMobile,
    data,
    handleDisbursement,
    handleOpenEdit,
    setCurrentTab,
    currentTab,
    loading: loading = false,
  } = props;

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

  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.some((tab) => tab.id === currentTab)
    ) {
      setCurrentTab(availableTabs[0].id);
    }
  }, [availableTabs, currentTab, setCurrentTab]);

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
      backButton="Editar"
      handleBack={handleOpenEdit}
      width={isMobile ? "340px" : "682px"}
      height={isMobile ? "auto" : "700px"}
      marginBottom="32px"
      marginTop="32px"
    >
      <Stack>
        {!loading && availableTabs.length > 0 ? (
          <Tabs
            scroll={isMobile}
            selectedTab={currentTab}
            tabs={availableTabs}
            onChange={onChange}
          />
        ) : (
          <></>
        )}
      </Stack>

      <Fieldset
        heightFieldset={isMobile ? "auto" : "490px"}
        alignContent={loading || error ? "center" : "start"}
      >
        {loading ? (
          <Stack
            direction="column"
            gap="16px"
            width={isMobile ? "100%" : "582px"}
            height="auto"
            padding="16px 10px"
          >
            <Grid
              templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
              gap="16px 20px"
              autoRows="auto"
            >
              {Array.from({ length: 7 }).map((_, index) => (
                <Stack key={index} width="100%" gap="10px">
                  <SkeletonLine width="100%" height="40px" animated />
                  <SkeletonLine width="100%" height="40px" animated />
                </Stack>
              ))}
            </Grid>
          </Stack>
        ) : (
          <></>
        )}

        {!loading && error ? (
          <ItemNotFound
            image={userNotFound}
            title={dataDisbursement.noDataTitle}
            description={dataDisbursement.noDataDescription}
            buttonDescription={dataDisbursement.retry}
            onRetry={handleRetry}
          />
        ) : (
          <></>
        )}

        {!loading && !error ? (
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
        ) : (
          <></>
        )}
      </Fieldset>
    </BaseModal>
  );  
}