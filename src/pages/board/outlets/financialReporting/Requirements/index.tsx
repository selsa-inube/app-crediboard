import { useState, isValidElement, useEffect } from "react";
import { MdOutlineHowToReg, MdOutlineRemoveRedEye } from "react-icons/md";
import { Stack, Icon, useFlag } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { SystemValidationApprovalModal } from "@components/modals/RequirementsModals/SystemValidationApprovalModal";
import { AddRequirement } from "@components/modals/RequirementsModals/AddRequirement";
import { saveRequirements } from "@components/modals/RequirementsModals/AddRequirement/utils";
import { DocumentValidationApprovalModal } from "@components/modals/RequirementsModals/DocumentValidationApprovalModal";
import { HumanValidationApprovalModal } from "@components/modals/RequirementsModals/HumanValidationApprovalModal";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { TraceDetailsModal } from "@components/modals/TraceDetailsModal";
import { IAction, IEntries, ITitle } from "@components/data/TableBoard/types";
import {
  AddRequirementMock,
  AddRequirementMockSistemValidations,
} from "@mocks/addRequirement";
import { getAllPackagesOfRequirementsById } from "@services/requirementsPackages/packagesOfRequirements";
import { AddSystemValidation } from "@components/modals/RequirementsModals/AddSystemValidation";
import {
  IPackagesOfRequirementsById,
  IPatchOfRequirements,
} from "@services/requirementsPackages/types";
import { useEnum } from "@hooks/useEnum";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { ICrediboardData } from "@context/AppContext/types";

import {
  infoItems,
  maperDataRequirements,
  maperEntries,
  getDataButton,
  textFlagsRequirementsEnum,
  dataAddRequirementEnum,
  getActionsMobileIcon,
  questionToBeAskedInModalText,
} from "./config";
import { DocumentItem, MappedRequirements, RequirementType } from "./types";
import { errorMessagesEnum } from "../config";

interface IRequirementsData {
  id: string;
  titlesRequirements: ITitle[];
  entriesRequirements: IEntries[];
  actionsMovile: IAction[];
}

export interface IRequirementsProps {
  id: string;
  user: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  creditRequestCode: string;
  eventData: ICrediboardData;
  isMobile: boolean;
}

export const Requirements = (props: IRequirementsProps) => {
  const {
    isMobile,
    id,
    user,
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestCode,
    eventData,
  } = props;
  const { lang } = useEnum();

  const [showSeeDetailsModal, setShowSeeDetailsModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [showAprovalsModal, setShowAprovalsModal] = useState(false);
  const [showAddRequirementModal, setShowAddRequirementModal] = useState(false);
  const [approvalSystemValues, setApprovalSystemValues] = useState<
    Record<
      string,
      {
        observations: string;
        toggleChecked: boolean;
        labelText: string;
      }
    >
  >({});
  const [approvalDocumentValues, setApprovalDocumentValues] = useState<
    Record<
      string,
      {
        answer: string;
        observations: string;
        selectedDocuments?: DocumentItem[];
      }
    >
  >({});
  const [approvalHumanValues, setApprovalHumanValues] = useState<
    Record<
      string,
      {
        answer: string;
        observations: string;
      }
    >
  >({});

  const [dataRequirements, setDataRequirements] = useState<IRequirementsData[]>(
    [],
  );
  const [requirementName, setRequirementName] = useState("");
  const [descriptionUseValue, setDescriptionUseValue] = useState("");
  const [descriptionUseValues, setDescriptionUseValues] = useState("");
  const [typeOfRequirementToEvaluated, setTypeOfRequirementToEvaluated] =
    useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [rawRequirements, setRawRequirements] = useState<
    IPackagesOfRequirementsById[]
  >([]);
  const [justificationRequirement, setJustificationRequirement] = useState(
    dataAddRequirementEnum.descriptionJustification.i18n[lang],
  );
  const [sentData, setSentData] = useState<IPatchOfRequirements | null>(null);
  const { addFlag } = useFlag();
  const [showAddSystemValidationModal, setShowAddSystemValidationModal] =
    useState(false);
  const [seenDocuments, setSeenDocuments] = useState<string[]>([]);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        if (!creditRequestCode) {
          return;
        }

        const data = await getAllPackagesOfRequirementsById(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode,
          eventData.token || "",
        );

        setRawRequirements(data);

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No hay requisitos disponibles.");
        }

        const mapped: MappedRequirements = {
          credit_request_id: data[0].uniqueReferenceNumber,
          SYSTEM_VALIDATION: {},
          DOCUMENT: {},
          HUMAN_VALIDATION: {},
        };

        const systemVals: Record<
          string,
          {
            observations: string;
            toggleChecked: boolean;
            labelText: string;
          }
        > = {};

        const documentVals: Record<
          string,
          {
            answer: string;
            observations: string;
            selectedDocuments?: DocumentItem[];
          }
        > = {};

        const humanVals: Record<
          string,
          {
            answer: string;
            observations: string;
          }
        > = {};

        const typeCounters = {
          SYSTEM_VALIDATION: 0,
          DOCUMENT: 0,
          HUMAN_VALIDATION: 0,
        };

        const getAnswerFromStatus = (status: string): string => {
          if (!status) return "";
          const passedStatuses = [
            "PASSED_WITH_SYSTEM_VALIDATION",
            "DOCUMENT_STORED_WITHOUT_VALIDATION",
            "PASSED_WITH_HUMAN_VALIDATION",
            "DOCUMENT_VALIDATED_BY_THE_USER",
            "IGNORED_BY_THE_USER",
            "PASSED_HUMAN_VALIDATION",
            "DOCUMENT_STORED_AND_VALIDATED",
            "IGNORED_BY_THE_USER_HUMAN_VALIDATION",
            "DOCUMENT_IGNORED_BY_THE_USER",
          ];

          const failedStatuses = [
            "FAILED_SYSTEM_VALIDATION",
            "IGNORED_BY_THE_USER_SYSTEM_VALIDATION",
            "FAILED_DOCUMENT_VALIDATION",
            "FAILED_HUMAN_VALIDATION",
          ];

          if (passedStatuses.includes(status)) {
            return "Cumple";
          } else if (failedStatuses.includes(status)) {
            return "No Cumple";
          }

          return "";
        };

        data.forEach((item) => {
          item.requirementsByPackage.forEach((req) => {
            const type = req.typeOfRequirementToEvaluate;
            const key = req.descriptionUse;
            const value = req.requirementStatus;
            if (
              type &&
              key &&
              Object.prototype.hasOwnProperty.call(mapped, type)
            ) {
              (mapped as MappedRequirements)[type as RequirementType][key] =
                value;
            }
            if (type === "SYSTEM_VALIDATION") {
              typeCounters.SYSTEM_VALIDATION += 1;
              const entryId = `sistema-${typeCounters.SYSTEM_VALIDATION}`;
              const answer = getAnswerFromStatus(req.requirementStatus || "");

              systemVals[entryId] = {
                observations:
                  req.statusChangeJustification ||
                  req.descriptionEvaluationRequirement ||
                  "",
                toggleChecked: answer === "Cumple",
                labelText: answer,
              };
            } else if (type === "DOCUMENT") {
              typeCounters.DOCUMENT += 1;
              const entryId = `documento-${typeCounters.DOCUMENT}`;
              const answer = getAnswerFromStatus(req.requirementStatus || "");

              documentVals[entryId] = {
                answer: answer,
                observations:
                  req.statusChangeJustification ||
                  req.descriptionEvaluationRequirement ||
                  "",
                selectedDocuments: [],
              };
            } else if (type === "HUMAN_VALIDATION") {
              typeCounters.HUMAN_VALIDATION += 1;
              const entryId = `humano-${typeCounters.HUMAN_VALIDATION}`;
              const answer = getAnswerFromStatus(req.requirementStatus || "");

              humanVals[entryId] = {
                answer: answer,
                observations:
                  req.statusChangeJustification ||
                  req.descriptionEvaluationRequirement ||
                  "",
              };
            }
          });
        });

        setApprovalSystemValues(systemVals);
        setApprovalDocumentValues(documentVals);
        setApprovalHumanValues(humanVals);

        const processedEntries = maperEntries(mapped, lang);
        const processedRequirements = maperDataRequirements(
          processedEntries,
          lang,
        );
        setDataRequirements(processedRequirements);
      } catch (error) {
        console.error("Error fetching requirements:", error);
        setError(true);
      }
    };

    fetchRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditRequestCode, sentData]);

  const toggleAprovalsModal = () => setShowAprovalsModal(!showAprovalsModal);

  const handleToggleSeeDetailsModal = (tableId?: string, entryId?: string) => {
    if (tableId && entryId) {
      setSelectedTableId(tableId);
      setSelectedEntryId(entryId);
    }
    setShowSeeDetailsModal((prevState) => !prevState);
  };

  const closeAdd = () => {
    setShowAddRequirementModal(false);
    setShowAddSystemValidationModal(false);
  };

  const renderAddIcon = (entry: IEntries, tableId: string) => {
    let isDisabled = false;

    const label = isValidElement(entry?.tag) ? entry?.tag?.props?.label : "";

    if (label === "Sin Evaluar") {
      isDisabled = true;
    } else if (label === "Cumple") {
      isDisabled = false;
    } else {
      if (tableId === "tableApprovalSystem") {
        isDisabled =
          !approvalSystemValues[entry.id] ||
          (approvalSystemValues[entry.id].observations === "" &&
            approvalSystemValues[entry.id].labelText === "");
      } else if (tableId === "tableDocumentValues") {
        isDisabled =
          !approvalDocumentValues[entry.id] ||
          (approvalDocumentValues[entry.id].observations === "" &&
            approvalDocumentValues[entry.id].answer === "");
      } else if (tableId === "tableApprovalHuman") {
        isDisabled =
          !approvalHumanValues[entry.id] ||
          (approvalHumanValues[entry.id].observations === "" &&
            approvalHumanValues[entry.id].answer === "");
      }
    }

    return (
      <Stack justifyContent="center">
        <Icon
          icon={<MdOutlineRemoveRedEye />}
          appearance="primary"
          onClick={() => handleToggleSeeDetailsModal(tableId, entry.id)}
          spacing="compact"
          variant="empty"
          size="32px"
          cursorHover
          disabled={isDisabled}
        />
      </Stack>
    );
  };

  const openApprovalsModal = (tableId: string, entryId: string) => {
    setSelectedTableId(tableId);
    setSelectedEntryId(entryId);
    setShowAprovalsModal(true);
  };

  const renderCheckIcon = (entry: IEntries, tableId: string) => (
    <Stack justifyContent="center">
      <Icon
        icon={<MdOutlineHowToReg />}
        appearance="primary"
        spacing="compact"
        cursorHover
        size="32px"
        onClick={() => openApprovalsModal(tableId, entry.id)}
        disabled={
          isValidElement(entry?.tag) && entry?.tag?.props?.label === "Cumple"
        }
      />
    </Stack>
  );

  const handleAddRequirement = async (creditRequests: IPatchOfRequirements) => {
    await saveRequirements(
      businessUnitPublicCode,
      businessManagerCode,
      creditRequests,
      eventData.token || "",
      eventData.user.identificationDocumentNumber || "",
    )
      .then(() => {
        setSentData(creditRequests);
      })
      .catch((error) => {
        const err = error as {
          message?: string;
          status: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + err?.message + (err?.data?.description || "");

        addFlag({
          title: textFlagsRequirementsEnum.titleError.i18n[lang],
          description,
          appearance: "danger",
          duration: 5000,
        });
      })
      .finally(() => {
        if (closeAdd) closeAdd();
        handleToggleModal();
      });
  };
  const createInitialRequirementValues = ({
    requirementCatalogName,
    descriptionUse,
    typeOfRequirementToEvaluate,
    rawRequirements,
    creditRequestCode,
  }: {
    requirementCatalogName: string;
    descriptionUse: string;
    typeOfRequirementToEvaluate: string;
    rawRequirements: IPackagesOfRequirementsById[];
    creditRequestCode: string;
  }): IPatchOfRequirements => ({
    packageId: rawRequirements[0]?.packageId,
    uniqueReferenceNumber: creditRequestCode,
    packageDate: rawRequirements[0]?.packageDate,
    packageDescription: `Requisitos para la solicitud de crédito ${creditRequestCode}`,
    modifyJustification: "modifyJustification",
    requirementsByPackage: [
      {
        packageId: rawRequirements[0]?.packageId,
        requirementCatalogName,
        requirementDate: rawRequirements[0]?.packageDate,
        requirementStatus: "UNVALIDATED",
        descriptionEvaluationRequirement: "Requisitos no evaluados",
        descriptionUse,
        typeOfRequirementToEvaluate,
        transactionOperation: "Insert",
      },
    ],
  });

  const initialValues = createInitialRequirementValues({
    requirementCatalogName: descriptionUseValue,
    descriptionUse: requirementName,
    typeOfRequirementToEvaluate: typeOfRequirementToEvaluated,
    rawRequirements,
    creditRequestCode,
  });

  const initialValuesSystemValidation = createInitialRequirementValues({
    requirementCatalogName: justificationRequirement,
    descriptionUse: descriptionUseValues,
    typeOfRequirementToEvaluate: "SYSTEM_VALIDATION",
    rawRequirements,
    creditRequestCode,
  });

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  const [entryIdToRequirementMap, setEntryIdToRequirementMap] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (
      rawRequirements.length > 0 &&
      rawRequirements[0]?.requirementsByPackage
    ) {
      const map: Record<string, string> = {};
      const typeCounters = { sistema: 0, documento: 0, humano: 0 };

      rawRequirements[0].requirementsByPackage.forEach((req) => {
        const prefixMap = {
          SYSTEM_VALIDATION: "sistema",
          DOCUMENT: "documento",
          HUMAN_VALIDATION: "humano",
        } as const;

        const prefix =
          prefixMap[req.typeOfRequirementToEvaluate as keyof typeof prefixMap];

        if (prefix) {
          typeCounters[prefix] += 1;
          map[`${prefix}-${typeCounters[prefix]}`] = req.requirementByPackageId;
        }
      });

      setEntryIdToRequirementMap(map);
    }
  }, [rawRequirements]);
  const { disabledButton: canAddRequirements } = useValidateUseCase({
    useCase: getUseCaseValue("canAddRequirements"),
  });

  let hasEntriesRequirements = [];
  hasEntriesRequirements = dataRequirements.filter(
    (item) => item.entriesRequirements.length >= 1,
  );
  const refreshRequirementsData = async () => {
    try {
      if (!creditRequestCode) return;

      const data = await getAllPackagesOfRequirementsById(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequestCode,
        eventData.token || "",
      );
      setRawRequirements(data);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No hay requisitos disponibles.");
      }

      const mapped: MappedRequirements = {
        credit_request_id: data[0].uniqueReferenceNumber,
        SYSTEM_VALIDATION: {},
        DOCUMENT: {},
        HUMAN_VALIDATION: {},
      };

      data.forEach((item) => {
        item.requirementsByPackage.forEach((req) => {
          const type = req.typeOfRequirementToEvaluate;
          const key = req.descriptionUse;
          const value = req.requirementStatus;

          if (
            type &&
            key &&
            Object.prototype.hasOwnProperty.call(mapped, type)
          ) {
            (mapped as MappedRequirements)[type as RequirementType][key] =
              value;
          }
        });
      });

      const processedEntries = maperEntries(mapped, lang);
      const processedRequirements = maperDataRequirements(
        processedEntries,
        lang,
      );
      setDataRequirements(processedRequirements);
    } catch (error) {
      console.error("Error refreshing requirements:", error);
    }
  };

  return (
    <>
      <Fieldset
        title={errorMessagesEnum.requirements.titleCard.i18n[lang]}
        activeButton={getDataButton(
          lang,
          () => setShowAddRequirementModal(true),
          () => setShowAddSystemValidationModal(true),
        )}
        disabledButton={canAddRequirements}
        heightFieldset="100%"
        hasTable={!error}
        hasError={error ? true : false}
        hasOverflow={isMobile}
      >
        {hasEntriesRequirements.length === 0 ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessagesEnum.requirements.title.i18n[lang]}
            description={errorMessagesEnum.requirements.description.i18n[lang]}
            buttonDescription={errorMessagesEnum.requirements.button.i18n[lang]}
            onRetry={() => setError(false)}
          />
        ) : (
          dataRequirements.map((item, index) => (
            <TableBoard
              key={item.id}
              id={item.id}
              titles={item.titlesRequirements}
              entries={item.entriesRequirements}
              actions={[
                {
                  id: "agregar",
                  content: (entry: IEntries) => renderAddIcon(entry, item.id),
                },
                {
                  id: "aprobar",
                  content: (entry: IEntries) => renderCheckIcon(entry, item.id),
                },
              ]}
              actionMobile={[
                {
                  id: "agregar",
                  content: (entry: IEntries) => renderAddIcon(entry, item.id),
                },
                {
                  id: "aprobar",
                  content: (entry: IEntries) => renderCheckIcon(entry, item.id),
                },
              ]}
              actionMobileIcon={getActionsMobileIcon()}
              showUserIconOnTablet={false}
              appearanceTable={{
                widthTd: !isMobile ? "75%" : "70%",
                efectzebra: true,
                title: "primary",
                isStyleMobile: true,
              }}
              isFirstTable={index === 0}
              infoItems={infoItems}
            />
          ))
        )}
      </Fieldset>
      {showSeeDetailsModal &&
        selectedTableId === "tableApprovalSystem" &&
        selectedEntryId && (
          <TraceDetailsModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            data={{
              answer: approvalSystemValues[selectedEntryId]?.labelText || "",
              observations:
                approvalSystemValues[selectedEntryId]?.observations || "",
            }}
            businessManagerCode={businessManagerCode}
          />
        )}
      {showSeeDetailsModal &&
        selectedTableId === "tableDocumentValues" &&
        selectedEntryId && (
          <TraceDetailsModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            user={user}
            data={{
              documents:
                approvalDocumentValues[selectedEntryId]?.selectedDocuments,
              answer: approvalDocumentValues[selectedEntryId]?.answer || "",
              observations:
                approvalDocumentValues[selectedEntryId]?.observations || "",
            }}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
          />
        )}
      {showSeeDetailsModal &&
        selectedTableId === "tableApprovalHuman" &&
        selectedEntryId && (
          <TraceDetailsModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            data={{
              answer: approvalHumanValues[selectedEntryId]?.answer || "",
              observations:
                approvalHumanValues[selectedEntryId]?.observations || "",
            }}
            businessManagerCode={businessManagerCode}
          />
        )}
      {showAprovalsModal &&
        selectedTableId === "tableApprovalSystem" &&
        selectedEntryId && (
          <SystemValidationApprovalModal
            initialValues={{
              observations: "",
              toggleChecked: false,
              labelText: "",
            }}
            onCloseModal={() => setShowAprovalsModal(false)}
            isMobile={isMobile}
            eventData={eventData}
            onConfirm={async (values) => {
              setApprovalSystemValues((prev) => ({
                ...prev,
                [selectedEntryId]: values,
              }));
              await refreshRequirementsData();
            }}
            questionToBeAskedInModal={(() => {
              const entry = dataRequirements
                .find((table) => table.id === "tableApprovalSystem")
                ?.entriesRequirements.find(
                  (entry) => entry.id === selectedEntryId,
                );

              let label: string | undefined;
              if (isValidElement(entry?.tag)) {
                label = entry.tag.props?.label;
              }

              if (label === questionToBeAskedInModalText.notEvaluated)
                return "";
              if (label === questionToBeAskedInModalText.notCompliant)
                return "";
              return "";
            })()}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            entryId={selectedEntryId}
            rawRequirements={rawRequirements}
            entryIdToRequirementMap={entryIdToRequirementMap}
          />
        )}
      {showAprovalsModal &&
        selectedTableId === "tableDocumentValues" &&
        selectedEntryId && (
          <DocumentValidationApprovalModal
            initialValues={{
              answer: "",
              observations: "",
            }}
            title={
              dataRequirements
                .find((table) => table.id === "tableDocumentValues")
                ?.entriesRequirements.find(
                  (entry) => entry.id === selectedEntryId,
                )
                ?.["Requisitos documentales"]?.toString() || ""
            }
            id={id}
            eventData={eventData}
            onCloseModal={toggleAprovalsModal}
            businessUnitPublicCode={businessUnitPublicCode}
            user={user}
            isMobile={isMobile}
            onConfirm={async (values) => {
              setApprovalDocumentValues((prev) => ({
                ...prev,
                [selectedEntryId]: values,
              }));
              await refreshRequirementsData();
            }}
            seenDocuments={seenDocuments}
            setSeenDocuments={setSeenDocuments}
            entryId={selectedEntryId}
            rawRequirements={rawRequirements}
            entryIdToRequirementMap={entryIdToRequirementMap}
            businessManagerCode={businessManagerCode}
            handleClose={() => {}}
          />
        )}
      {showAprovalsModal &&
        selectedTableId === "tableApprovalHuman" &&
        selectedEntryId && (
          <HumanValidationApprovalModal
            initialValues={{
              answer: "",
              observations: "",
            }}
            onCloseModal={toggleAprovalsModal}
            isMobile={isMobile}
            onConfirm={async (values) => {
              setApprovalHumanValues((prev) => ({
                ...prev,
                [selectedEntryId]: values,
              }));
              await refreshRequirementsData();
            }}
            eventData={eventData}
            businessUnitPublicCode={businessUnitPublicCode}
            businessManagerCode={businessManagerCode}
            entryId={selectedEntryId}
            rawRequirements={rawRequirements}
            entryIdToRequirementMap={entryIdToRequirementMap}
          />
        )}
      {showAddRequirementModal && (
        <AddRequirement
          title={dataAddRequirementEnum.title.i18n[lang]}
          buttonText={dataAddRequirementEnum.add.i18n[lang]}
          optionsRequirement={AddRequirementMock}
          onCloseModal={closeAdd}
          creditRequestCode={creditRequestCode}
          setSentData={setSentData}
          setRequirementName={setRequirementName}
          setDescriptionUseValue={setDescriptionUseValue}
          setTypeOfRequirementToEvaluated={setTypeOfRequirementToEvaluated}
          handleNext={() => {
            handleAddRequirement(initialValues);
          }}
        />
      )}
      {showAddSystemValidationModal && (
        <AddSystemValidation
          title={dataAddRequirementEnum.title.i18n[lang]}
          buttonText={dataAddRequirementEnum.add.i18n[lang]}
          optionsRequirement={AddRequirementMockSistemValidations}
          onCloseModal={closeAdd}
          creditRequestCode={creditRequestCode}
          setSentData={setSentData}
          setRequirementName={setRequirementName}
          setdescriptionUseValues={setDescriptionUseValues}
          setTypeOfRequirementToEvaluated={setTypeOfRequirementToEvaluated}
          handleNext={() => {
            handleAddRequirement(initialValuesSystemValidation);
          }}
          requirementName={requirementName}
          descriptionUseValues={descriptionUseValues}
          typeOfRequirementToEvaluated={typeOfRequirementToEvaluated}
          rawRequirements={rawRequirements}
          setJustificationRequirement={setJustificationRequirement}
          justificationRequirement={justificationRequirement}
        />
      )}
    </>
  );
};
