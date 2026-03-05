import { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Stack,
  useMediaQuery,
  Select,
  useFlag,
  Input,
} from "@inubekit/inubekit";

import { getCommercialManagerAndAnalyst } from "@services/staff/commercialManagerAndAnalyst";

import { AppContext } from "@context/AppContext";
import { textFlagsUsersEnum } from "@config/pages/staffModal/addFlag";
import { BaseModal } from "@components/modals/baseModal";
import { IToDo } from "@services/creditRequest/query/types";
import { ICommercialManagerAndAnalyst } from "@services/staff/types";
import { ICreditRequests } from "@services/creditRequest/command/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { useEnum } from "@hooks/useEnum";

import { changeUsersByCreditRequest } from "./utils";
import { txtFlagsEnum, staffModalTextsEnum } from "../config";
import { traceObserver } from "../../config";

export interface StaffModalProps {
  commercialManager: string;
  analyst: string;
  buttonText: string;
  title: string;
  portalId?: string;
  handleNext?: () => void;
  onChange: (key: string) => void;
  onSubmit?: (values: { commercialManager: string; analyst: string }) => void;
  onCloseModal?: () => void;
  taskData?: IToDo | null;
  setAssignedStaff: React.Dispatch<
    React.SetStateAction<{
      commercialManager: string;
      analyst: string;
    }>
  >;
  handleRetry?: () => void;
}

export function StaffModal(props: StaffModalProps) {
  const {
    commercialManager,
    analyst,
    portalId = "portal",
    onSubmit,
    onCloseModal,
    taskData,
    setAssignedStaff,
    title,
    buttonText,
    handleRetry,
  } = props;
  const [analystList, setAnalystList] = useState<
    ICommercialManagerAndAnalyst[]
  >([]);
  const [accountManagerList, setAccountManagerList] = useState<
    ICommercialManagerAndAnalyst[]
  >([]);
  const [selectedCommercialManager, setSelectedCommercialManager] =
    useState<ICommercialManagerAndAnalyst | null>(null);
  const [selectedAnalyst, setSelectedAnalyst] =
    useState<ICommercialManagerAndAnalyst | null>(null);
  const [initialValues, setInitialValues] = useState({
    commercialManager: "",
    analyst: "",
  });
  const isMobile = useMediaQuery("(max-width: 700px)");
  const { lang } = useEnum();

  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");

  const validationSchema = Yup.object().shape({
    commercialManager: Yup.string(),
    analyst: Yup.string(),
  });

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.publicCode;
  const { addFlag } = useFlag();

  const handleCommercialManagerChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    const selectedManager = accountManagerList.find(
      (manager) => manager.staffName === value,
    );
    if (selectedManager) {
      setSelectedCommercialManager(selectedManager);
    }
  };

  const handleAnalystChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    setFieldValue(name, value);
    const selected = analystList.find((analyst) => analyst.staffName === value);
    if (selected) {
      setSelectedAnalyst(selected);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountManagers, analysts] = await Promise.all([
          getCommercialManagerAndAnalyst(
            "Gestor Comercial",
            businessUnitPublicCode,
            businessManagerCode,
            eventData.token || "",
          ),
          getCommercialManagerAndAnalyst(
            "Analista de Crédito",
            businessUnitPublicCode,
            businessManagerCode,
            eventData.token || "",
          ),
        ]);

        setAccountManagerList(accountManagers);
        setAnalystList(analysts);
      } catch (error) {
        addFlag({
          title: txtFlagsEnum.titleDanger.i18n[lang],
          description: txtFlagsEnum.descriptionDanger.i18n[lang],
          appearance: "danger",
          duration: 5000,
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accountManagerList.length === 1) {
      const singleManager = accountManagerList[0];
      setInitialValues((prev) => ({
        ...prev,
        commercialManager: singleManager.staffName,
      }));
      setSelectedCommercialManager(singleManager);
    }
  }, [accountManagerList]);

  useEffect(() => {
    if (analystList.length === 1) {
      const singleAnalyst = analystList[0];
      setInitialValues((prev) => ({
        ...prev,
        analyst: singleAnalyst.staffName,
      }));
      setSelectedAnalyst(singleAnalyst);
    }
  }, [analystList]);

  const buildCreditRequest = (
    role: string,
    user: ICommercialManagerAndAnalyst | null,
    previousUserName: string = "",
  ): ICreditRequests | null => {
    if (!user) return null;

    let roleLabel = "usuario";

    if (role.includes("Manager")) {
      roleLabel = "gestor";
    } else if (role.includes("Analyst")) {
      roleLabel = "analista";
    }

    return {
      creditRequestId: taskData?.creditRequestId || "",
      creditRequestCode: "",
      executedTask: taskData?.taskToBeDone || "",
      executionDate: new Date().toISOString(),
      identificationNumber: user.identificationDocumentNumber || "",
      identificationType: "C",
      role: role,
      justification: staffModalTextsEnum.justification.i18n[lang](
        roleLabel,
        previousUserName,
        user.staffName,
      ),
    };
  };

  const handleCreditRequests = async () => {
    const managerRequest = buildCreditRequest(
      "AccountManager",
      selectedCommercialManager,
      commercialManager,
    );

    const analystRequest = buildCreditRequest(
      "CreditAnalyst",
      selectedAnalyst,
      analyst,
    );

    try {
      if (managerRequest) {
        await changeUsersByCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          managerRequest,
          eventData.user.identificationDocumentNumber || "",
          eventData.token || "",
        );
        setAssignedStaff((prev) => ({
          ...prev,
          commercialManager: selectedCommercialManager?.staffName || "",
        }));
      }

      if (analystRequest) {
        await changeUsersByCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          analystRequest,
          eventData.user.identificationDocumentNumber || "",
          eventData.token || "",
        );
        setAssignedStaff((prev) => ({
          ...prev,
          analyst: selectedAnalyst?.staffName || "",
        }));
      }

      addFlag({
        title: textFlagsUsersEnum.titleSuccess.i18n[lang],
        description: textFlagsUsersEnum.descriptionSuccess.i18n[lang],
        appearance: "success",
        duration: 5000,
      });
      traceObserver.notify({});
    } catch (error) {
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      setShowErrorModal(true);
      setMessageError(description);
    } finally {
      if (onCloseModal) onCloseModal();
      handleToggleModal();
    }
  };

  const handleToggleModal = () => {
    if (handleRetry) {
      handleRetry();
    }
    setShowModal(!showModal);
  };

  const options = {
    commercialManager: accountManagerList.map((official) => ({
      id: official.identificationDocumentNumber,
      label: official.staffName,
      value: official.staffName,
      document: official.identificationDocumentNumber,
    })),
    analyst: analystList.map((official) => ({
      id: official.identificationDocumentNumber,
      label: official.staffName,
      value: official.staffName,
      document: official.identificationDocumentNumber,
    })),
  };

  const hasSingleCommercialManager = options.commercialManager.length === 1;
  const hasSingleAnalyst = options.analyst.length === 1;

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit?.(values);
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, values }) => {
          const isCommercialManagerReady =
            hasSingleCommercialManager || Boolean(values.commercialManager);
          const isAnalystReady = hasSingleAnalyst || Boolean(values.analyst);
          const isNextDisabled = !isCommercialManagerReady && !isAnalystReady;

          return (
            <Form>
              <BaseModal
                title={title}
                handleNext={handleCreditRequests}
                width={isMobile ? "280px" : "500px"}
                handleBack={onCloseModal}
                handleClose={onCloseModal}
                portalId={portalId}
                nextButton={buttonText}
                disabledNext={isNextDisabled}
              >
                <Stack direction="column" gap="24px">
                  {hasSingleCommercialManager ? (
                    <Input
                      name="commercialManager"
                      id="commercialManager"
                      label={
                        staffModalTextsEnum.commercialManagerLabel.i18n[lang]
                      }
                      value={options.commercialManager[0]?.label || ""}
                      fullwidth
                      disabled
                    />
                  ) : (
                    <Select
                      name="commercialManager"
                      id="commercialManager"
                      label={
                        staffModalTextsEnum.commercialManagerLabel.i18n[lang]
                      }
                      placeholder={
                        options.commercialManager.length > 0
                          ? staffModalTextsEnum.commercialManagerPlaceholder
                              .i18n[lang]
                          : staffModalTextsEnum
                              .commercialManagerEmptyPlaceholder.i18n[lang]
                      }
                      options={options.commercialManager}
                      onChange={(name, value) =>
                        handleCommercialManagerChange(
                          name,
                          value,
                          setFieldValue,
                        )
                      }
                      value={values.commercialManager}
                      fullwidth
                      disabled={options.commercialManager.length === 0}
                    />
                  )}

                  {hasSingleAnalyst ? (
                    <Input
                      name="analyst"
                      id="analyst"
                      label={staffModalTextsEnum.analystLabel.i18n[lang]}
                      value={options.analyst[0]?.label || ""}
                      fullwidth
                      disabled
                    />
                  ) : (
                    <Select
                      name="analyst"
                      id="analyst"
                      label={staffModalTextsEnum.analystLabel.i18n[lang]}
                      placeholder={
                        options.analyst.length > 0
                          ? staffModalTextsEnum.analystPlaceholder.i18n[lang]
                          : staffModalTextsEnum.analystEmptyPlaceholder.i18n[
                              lang
                            ]
                      }
                      options={options.analyst}
                      onChange={(name, value) =>
                        handleAnalystChange(name, value, setFieldValue)
                      }
                      value={values.analyst}
                      fullwidth
                      disabled={options.analyst.length === 0}
                    />
                  )}
                </Stack>
              </BaseModal>
            </Form>
          );
        }}
      </Formik>
      {showErrorModal && (
        <ErrorModal
          handleClose={() => {
            setShowErrorModal(false);
          }}
          isMobile={isMobile}
          message={messageError}
        />
      )}
    </>
  );
}
