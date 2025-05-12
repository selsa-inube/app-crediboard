import { useState, isValidElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdAddCircleOutline, MdOutlineCheckCircle } from "react-icons/md";
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
import { addItem } from "@mocks/utils/dataMock.service";
import { traceDetailsMock } from "@mocks/financialReporting/trace-details/tracedetails.mock";
import { AddRequirementMock } from "@mocks/addRequirement";
import { getAllPackagesOfRequirementsById } from "@services/packagesOfRequirements";
import { dataAddRequirement } from "@config/components/addRequirement";
import { textFlagsUsers } from "@config/pages/staffModal/addFlag";

import {
  infoItems,
  maperDataRequirements,
  maperEntries,
  getAcctionMobile,
  dataFlags,
  DataButton,
} from "./config";
import { AprovalsModal } from "./AprovalsModal";
import { traceObserver, errorMessages } from "../config";
import { AddRequirement } from "./AddRequirement";
import { saveRequirements } from "./AddRequirement/utils";

interface IRequirementsData {
  id: string;
  titlesRequirements: ITitle[];
  entriesRequirements: IEntries[];
  actionsMovile: IAction[];
}

export interface IRequirementsProps {
  isMobile?: boolean;
  id: string;
  user: string;
  businessUnitPublicCode: string;
  creditRequestCode: string;
}

export const Requirements = (props: IRequirementsProps) => {
  const { isMobile, id, user, businessUnitPublicCode, creditRequestCode } =
    props;
  const [showSeeDetailsModal, setShowSeeDetailsModal] = useState(false);
  const [showAprovalsModal, setShowAprovalsModal] = useState(false);
  const [showAddRequirementModal, setShowAddRequirementModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [dataRequirements, setDataRequirements] = useState<IRequirementsData[]>(
    []
  );
  const [requirementName, setRequirementName] = useState("");
  const [descriptionUseValue, setDescriptionUseValue] = useState("");
  const [modifyJustification, setModifyJustification] = useState("");
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
  const changeApprove = () => setIsApproved(!isApproved);

  const handleToggleSeeDetailsModal = () => {
    setShowSeeDetailsModal((prevState) => !prevState);
  };

  const handleSubmitAprovals = async (
    id: string,
    user: string,
    formData: { textarea: string }
  ) => {
    const justificationText = formData.textarea;

    if (justificationText && id) {
      const trace = {
        trace_value: "Document approved",
        credit_request_id: id,
        use_case: "document_upload",
        user_id: user,
        execution_date: new Date().toISOString(),
        justification: justificationText,
        decision_taken_by_user: "approved",
        trace_type: "executed_task",
        read_novelty: "",
      };

      try {
        await addItem("trace", trace);
        traceObserver.notify(trace);
        addFlag({
          title: dataFlags.documentApproved.title,
          description: dataFlags.documentApproved.description,
          appearance: "success",
          duration: 5000,
        });
      } catch (error) {
        addFlag({
          title: dataFlags.documentRejected.title,
          description: dataFlags.documentRejected.description,
          appearance: "danger",
          duration: 5000,
        });
      }
    }
  };
  const closeAdd = () => {
    setShowAddRequirementModal(false);
  };
  const renderAddIcon = () => {
    return (
      <Stack justifyContent="center">
        <Icon
          icon={<MdAddCircleOutline />}
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

  const renderCheckIcon = (entry: IEntries) => (
    <Stack justifyContent="center">
      <Icon
        icon={<MdOutlineCheckCircle />}
        appearance="primary"
        spacing="compact"
        cursorHover
        size="32px"
        onClick={() => {
          setIsApproved(false);
          toggleAprovalsModal();
        }}
        disabled={
          isValidElement(entry?.tag) && entry?.tag?.props?.label === "No Cumple"
        }
      />
    </Stack>
  );

  const actionsRequirements: IAction[] = [
    { id: "agregar", content: renderAddIcon },
    { id: "aprobar", content: renderCheckIcon },
  ];
  const openAddRequirementModal = () => setShowAddRequirementModal(true);

  const handleAddRequirement = async (creditRequests: IPatchOfRequirements) => {
    await saveRequirements(businessUnitPublicCode, creditRequests)
      .then(() => {
        addFlag({
          title: textFlagsUsers.titleSuccess,
          description: textFlagsUsers.descriptionSuccess,
          appearance: "success",
          duration: 5000,
        });
        setSentData(creditRequests);
      })
      .catch(() => {
        addFlag({
          title: textFlagsUsers.titleError,
          description: textFlagsUsers.descriptionError,
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
    modifyJustification: modifyJustification,
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
        activeButton={DataButton(openAddRequirementModal)}
        heightFieldset="100%"
        hasTable={!error}
        hasError={error ? true : false}
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
              actions={actionsRequirements}
              actionMobile={renderAccion}
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
      {showAprovalsModal && (
        <AprovalsModal
          isApproved={isApproved}
          onCloseModal={toggleAprovalsModal}
          onChangeApprove={changeApprove}
          onSubmit={(values) => handleSubmitAprovals(id!, user, values)}
        />
      )}
      {showAddRequirementModal && (
        <AddRequirement
          title={dataAddRequirement.title}
          buttonText={dataAddRequirement.add}
          accountdRequirement={AddRequirementMock}
          onCloseModal={closeAdd}
          creditRequestCode={creditRequestCode}
          setSentData={setSentData}
          setRequirementName={setRequirementName}
          setDescriptionUseValue={setDescriptionUseValue}
          setModifyJustification={setModifyJustification}
          setTypeOfRequirementToEvaluated={setTypeOfRequirementToEvaluated}
          handleNext={() => {
            handleAddRequirement(initialValues);
          }}
        />
      )}
    </>
  );
};
