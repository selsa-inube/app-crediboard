import { useState, isValidElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineHowToReg, MdOutlineRemoveRedEye } from "react-icons/md";
import { Stack, Icon, useFlag } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { ApprovalsModalSystem } from "@components/modals/RequirementsModals/ApprovalsModalSystem";
import { AddRequirement } from "@components/modals/RequirementsModals/AddRequirement";
import { saveRequirements } from "@components/modals/RequirementsModals/AddRequirement/utils";
import { ApprovalModalDocumentaries } from "@components/modals/RequirementsModals/ApprovalModalDocumentaries";
import { ApprovalsModalHuman } from "@components/modals/RequirementsModals/ApprovalModalHuman";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { TraceDetailsModal } from "@components/modals/TraceDetailsModal";
import { IAction, IEntries, ITitle } from "@components/data/TableBoard/types";
import {
  CreditRequest,
  IPatchOfRequirements,
  IRequirement,
} from "@services/types";
import { AddRequirementMock } from "@mocks/addRequirement";
import { getAllPackagesOfRequirementsById } from "@services/packagesOfRequirements";

import { errorMessages } from "../config";
import {
  infoItems,
  maperDataRequirements,
  maperEntries,
  dataButton,
  textFlagsRequirements,
  dataAddRequirement,
  getActionsMobileIcon,
} from "./config";
import { DocumentItem } from "./types";

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
  creditRequestCode: string;
  isMobile: boolean;
  hasPermitRejection?: boolean;
}

export const Requirements = (props: IRequirementsProps) => {
  const {
    isMobile,
    id,
    user,
    businessUnitPublicCode,
    creditRequestCode,
    hasPermitRejection,
  } = props;
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
    []
  );
  const [requirementName, setRequirementName] = useState("");
  const [descriptionUseValue, setDescriptionUseValue] = useState("");
  const [typeOfRequirementToEvaluated, setTypeOfRequirementToEvaluated] =
    useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [rawRequirements, setRawRequirements] = useState<IRequirement[]>([]);
  const [sentData, setSentData] = useState<IPatchOfRequirements | null>(null);
  const navigate = useNavigate();
  const { addFlag } = useFlag();

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        if (!creditRequestCode) {
          return;
        }

        const data = await getAllPackagesOfRequirementsById(
          businessUnitPublicCode,
          creditRequestCode
        );
        setRawRequirements(data);
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("No hay requisitos disponibles.");
        }

        const mapped: CreditRequest = {
          credit_request_id: data[0].uniqueReferenceNumber,
          SYSTEM_VALIDATION: {},
          DOCUMENT: {},
          HUMAN_VALIDATION: {},
        };

        data.forEach((item) => {
          item.listsOfRequirementsByPackage.forEach((req) => {
            const type = req.typeOfRequirementToEvaluated;
            const key = req.descriptionUse;
            const value = req.requirementStatus;

            if (
              type &&
              key &&
              value &&
              Object.prototype.hasOwnProperty.call(mapped, type)
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (mapped as any)[type][key] = value;
            }
          });
        });

        const processedEntries = maperEntries(mapped);
        const processedRequirements = maperDataRequirements(processedEntries);
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
  };

  const renderAddIcon = (entry: IEntries, tableId: string) => {
    let isDisabled = false;

    if (tableId === "tabla1") {
      isDisabled =
        !approvalSystemValues[entry.id] ||
        (approvalSystemValues[entry.id].observations === "" &&
          approvalSystemValues[entry.id].labelText === "");
    } else if (tableId === "tabla2") {
      isDisabled =
        !approvalDocumentValues[entry.id] ||
        (approvalDocumentValues[entry.id].observations === "" &&
          approvalDocumentValues[entry.id].answer === "");
    } else if (tableId === "tabla3") {
      isDisabled =
        !approvalHumanValues[entry.id] ||
        (approvalHumanValues[entry.id].observations === "" &&
          approvalHumanValues[entry.id].answer === "");
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
          isValidElement(entry?.tag) && entry?.tag?.props?.label === "No Cumple"
        }
      />
    </Stack>
  );

  const openAddRequirementModal = () => setShowAddRequirementModal(true);

  const handleAddRequirement = async (creditRequests: IPatchOfRequirements) => {
    await saveRequirements(businessUnitPublicCode, creditRequests)
      .then(() => {
        addFlag({
          title: textFlagsRequirements.titleSuccess,
          description: textFlagsRequirements.descriptionSuccess,
          appearance: "success",
          duration: 5000,
        });
        setSentData(creditRequests);
      })
      .catch(() => {
        addFlag({
          title: textFlagsRequirements.titleError,
          description: textFlagsRequirements.descriptionError,
          appearance: "danger",
          duration: 5000,
        });
      })
      .finally(() => {
        if (closeAdd) closeAdd();
        handleToggleModal();
      });

    setTimeout(() => {
      navigate(`/extended-card/${id}`);
    }, 6000);
  };

  const initialValues: IPatchOfRequirements = {
    packageId: rawRequirements[0]?.packageId,
    uniqueReferenceNumber: creditRequestCode,
    packageDate: rawRequirements[0]?.packageDate,
    packageDescription:
      "Requisitos para la solicitud de crédito SC-12225464610",
    modifyJustification: "modifyJustification",
    listsOfRequirementsByPackage: [
      {
        packageId: rawRequirements[0]?.packageId,
        requirementCatalogName: requirementName,
        requirementDate: rawRequirements[0]?.packageDate,
        requirementStatus: "UNVALIDATED",
        descriptionEvaluationRequirement: "Requisitos no evaluados",
        descriptionUse: descriptionUseValue,
        typeOfRequirementToEvaluated: typeOfRequirementToEvaluated,
        transactionOperation: "Insert",
      },
    ],
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Fieldset
        title={errorMessages.Requirements.titleCard}
        activeButton={dataButton(openAddRequirementModal)}
        disabledButton={hasPermitRejection}
        heightFieldset="100%"
        hasTable={!error}
        hasError={error ? true : false}
        hasOverflow={isMobile}
      >
        {error ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.Requirements.title}
            description={errorMessages.Requirements.description}
            buttonDescription={errorMessages.Requirements.button}
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
        selectedTableId === "tabla1" &&
        selectedEntryId && (
          <TraceDetailsModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            data={{
              answer: approvalSystemValues[selectedEntryId]?.labelText || "",
              observations:
                approvalSystemValues[selectedEntryId]?.observations || "",
            }}
          />
        )}
      {showSeeDetailsModal &&
        selectedTableId === "tabla2" &&
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
          />
        )}
      {showSeeDetailsModal &&
        selectedTableId === "tabla3" &&
        selectedEntryId && (
          <TraceDetailsModal
            isMobile={isMobile}
            handleClose={() => setShowSeeDetailsModal(false)}
            data={{
              answer: approvalHumanValues[selectedEntryId]?.answer || "",
              observations:
                approvalHumanValues[selectedEntryId]?.observations || "",
            }}
          />
        )}
      {showAprovalsModal && selectedTableId === "tabla1" && selectedEntryId && (
        <ApprovalsModalSystem
          initialValues={
            approvalSystemValues[selectedEntryId] || {
              observations: "",
              toggleChecked: false,
              labelText: "",
            }
          }
          onCloseModal={() => setShowAprovalsModal(false)}
          isMobile={isMobile}
          onConfirm={(values) =>
            setApprovalSystemValues((prev) => ({
              ...prev,
              [selectedEntryId]: values,
            }))
          }
        />
      )}
      {showAprovalsModal && selectedTableId === "tabla2" && selectedEntryId && (
        <ApprovalModalDocumentaries
          initialValues={
            approvalDocumentValues[selectedEntryId] || {
              answer: "",
              observations: "",
            }
          }
          title={
            dataRequirements
              .find((table) => table.id === "tabla2")
              ?.entriesRequirements.find(
                (entry) => entry.id === selectedEntryId
              )
              ?.["Requisitos documentales"]?.toString() || ""
          }
          id={id}
          onCloseModal={toggleAprovalsModal}
          businessUnitPublicCode={businessUnitPublicCode}
          user={user}
          isMobile={isMobile}
          onConfirm={(values) =>
            setApprovalDocumentValues((prev) => ({
              ...prev,
              [selectedEntryId]: values,
            }))
          }
        />
      )}
      {showAprovalsModal && selectedTableId === "tabla3" && selectedEntryId && (
        <ApprovalsModalHuman
          initialValues={
            approvalHumanValues[selectedEntryId] || {
              answer: "",
              observations: "",
            }
          }
          onCloseModal={toggleAprovalsModal}
          isMobile={isMobile}
          onConfirm={(values) =>
            setApprovalHumanValues((prev) => ({
              ...prev,
              [selectedEntryId]: values,
            }))
          }
        />
      )}
      {showAddRequirementModal && (
        <AddRequirement
          title={dataAddRequirement.title}
          buttonText={dataAddRequirement.add}
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
    </>
  );
};
