import { useState, isValidElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineHowToReg, MdOutlineRemoveRedEye } from "react-icons/md";
import { Stack, Icon, useFlag } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
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
import { traceDetailsMock } from "@mocks/financialReporting/trace-details/tracedetails.mock";
import { AddRequirementMock } from "@mocks/addRequirement";
import { getAllPackagesOfRequirementsById } from "@services/packagesOfRequirements";

import { errorMessages } from "../config";
import {
  infoItems,
  maperDataRequirements,
  maperEntries,
  getAcctionMobile,
  dataButton,
  textFlagsRequirements,
  dataAddRequirement,
  getActionsMobileIcon,
} from "./config";
import { ApprovalsModalSystem } from "./AprovalsModalSystem";
import { AddRequirement } from "./AddRequirement";
import { saveRequirements } from "./AddRequirement/utils";
import { ApprovalModalDocumentaries } from "./ApprovalModalDocumentaries";
import { ApprovalsModalHuman } from "./ApprovalModalHuman";

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
    businessUnitPublicCode,
    creditRequestCode,
    hasPermitRejection,
  } = props;
  const [showSeeDetailsModal, setShowSeeDetailsModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showAprovalsModal, setShowAprovalsModal] = useState(false);
  const [showAddRequirementModal, setShowAddRequirementModal] = useState(false);
  const [approvalSystemValues, setApprovalSystemValues] = useState({
    observations: "",
    toggleChecked: false,
  });
  const [approvalDocumentValues, setApprovalDocumentValues] = useState({
    answer: "",
    observations: "",
  });
  const [approvalHumanValues, setApprovalHumanValues] = useState({
    answer: "",
    observations: "",
  });
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

  const renderAccion = getAcctionMobile(
    setShowSeeDetailsModal,
    setShowAprovalsModal
  );

  const toggleAprovalsModal = () => setShowAprovalsModal(!showAprovalsModal);

  const handleToggleSeeDetailsModal = () => {
    setShowSeeDetailsModal((prevState) => !prevState);
  };

  const closeAdd = () => {
    setShowAddRequirementModal(false);
  };
  const renderAddIcon = () => {
    return (
      <Stack justifyContent="center">
        <Icon
          icon={<MdOutlineRemoveRedEye />}
          appearance="primary"
          onClick={() => handleToggleSeeDetailsModal()}
          spacing="compact"
          variant="empty"
          size="32px"
          cursorHover
        />
      </Stack>
    );
  };

  const openApprovalsModal = (tableId: string) => {
    setSelectedTableId(tableId);
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
        onClick={() => openApprovalsModal(tableId)}
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
                { id: "agregar", content: renderAddIcon },
                {
                  id: "aprobar",
                  content: (entry: IEntries) => renderCheckIcon(entry, item.id),
                },
              ]}
              actionMobile={renderAccion}
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

      {showSeeDetailsModal && (
        <TraceDetailsModal
          isMobile={isMobile}
          handleClose={() => setShowSeeDetailsModal(false)}
          data={traceDetailsMock[0]}
        />
      )}
      {showAprovalsModal && selectedTableId === "tabla1" && (
        <ApprovalsModalSystem
          initialValues={approvalSystemValues}
          onCloseModal={() => setShowAprovalsModal(false)}
          isMobile={isMobile}
          onConfirm={setApprovalSystemValues}
        />
      )}
      {showAprovalsModal && selectedTableId === "tabla2" && (
        <ApprovalModalDocumentaries
          initialValues={approvalDocumentValues}
          title=""
          onCloseModal={toggleAprovalsModal}
          isMobile={isMobile}
          onConfirm={setApprovalDocumentValues}
        />
      )}
      {showAprovalsModal && selectedTableId === "tabla3" && (
        <ApprovalsModalHuman
          initialValues={approvalHumanValues}
          onCloseModal={toggleAprovalsModal}
          isMobile={isMobile}
          onConfirm={setApprovalHumanValues}
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
