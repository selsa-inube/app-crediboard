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
import { txtFlagsEnum, errorMessages } from "../config";

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
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    commercialManager: Yup.string(),
    analyst: Yup.string(),
  });

  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.abbreviatedName;
  const { addFlag } = useFlag();

  const handleCommercialManagerChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue(name, value);
    const selectedManager = accountManagerList.find(
      (manager) => manager.staffName === value
    );
    if (selectedManager) {
      setSelectedCommercialManager(selectedManager);
    }
  };

  const handleAnalystChange = (
    name: string,
    value: string,
    setFieldValue: (field: string, value: string) => void
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
            "CredicarAccountManager",
            businessUnitPublicCode,
            businessManagerCode
          ),
          getCommercialManagerAndAnalyst(
            "CredicarAnalyst",
            businessUnitPublicCode,
            businessManagerCode
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
    previousUserName: string = ""
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
      justification: `Se realiza la asignación de un nuevo ${roleLabel}. Anterior: ${previousUserName || "N/A"}. Nuevo: ${user.staffName}`,
    };
  };

  const handleCreditRequests = async () => {
    const managerRequest = buildCreditRequest(
      "CredicarAccountManager",
      selectedCommercialManager,
      commercialManager
    );

    const analystRequest = buildCreditRequest(
      "CredicarAnalyst",
      selectedAnalyst,
      analyst
    );

    try {
      if (managerRequest) {
        await changeUsersByCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          managerRequest,
          eventData.user.identificationDocumentNumber || ""
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
          eventData.user.identificationDocumentNumber || ""
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
    } catch (error) {
      setErrorMessage(
        errorMessages.patchChangeUsersByCreditRequest.description
      );
      setErrorModal(true);
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
        {({ setFieldValue, values }) => (
          <Form>
            <BaseModal
              title={title}
              handleNext={handleCreditRequests}
              width={isMobile ? "280px" : "500px"}
              handleBack={onCloseModal}
              handleClose={onCloseModal}
              portalId={portalId}
              nextButton={buttonText}
            >
              <Stack direction="column" gap="24px">
                {hasSingleCommercialManager ? (
                  <Input
                    name="commercialManager"
                    id="commercialManager"
                    label="Gestor Comercial"
                    value={options.commercialManager[0]?.label || ""}
                    fullwidth
                    disabled
                  />
                ) : (
                  <Select
                    name="commercialManager"
                    id="commercialManager"
                    label="Gestor Comercial"
                    placeholder={
                      options.commercialManager.length > 0
                        ? "Selecciona una opción"
                        : "No hay gestores disponibles"
                    }
                    options={options.commercialManager}
                    onChange={(name, value) =>
                      handleCommercialManagerChange(name, value, setFieldValue)
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
                    label="Analista"
                    value={options.analyst[0]?.label || ""}
                    fullwidth
                    disabled
                  />
                ) : (
                  <Select
                    name="analyst"
                    id="analyst"
                    label="Analista"
                    placeholder={
                      options.analyst.length > 0
                        ? "Selecciona una opción"
                        : "No hay analistas disponibles"
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
        )}
      </Formik>
      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => {
            setErrorModal(false);
          }}
        />
      )}
    </>
  );
}
