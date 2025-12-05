import { useState, useEffect, ChangeEvent, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineInfo } from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  Select,
  Button,
  Input,
  useMediaQuery,
} from "@inubekit/inubekit";

import { Fieldset } from "@components/data/Fieldset";
import { Divider } from "@components/layout/Divider";
import { ItemNotFound } from "@components/layout/ItemNotFound";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { getSearchDecisionById } from "@services/creditRequest/query/SearchDecisionById";
import {
  ICreditRequest,
  IStaff,
  IToDo,
} from "@services/creditRequest/query/types";
import { getToDoByCreditRequestId } from "@services/creditRequest/query/getToDoByCreditRequestId";
import { capitalizeFirstLetterEachWord } from "@utils/formatData/text";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { AppContext } from "@context/AppContext";
import { useEnums } from "@hooks/useEnums";
import userNotFound from "@assets/images/ItemNotFound.png";
import { taskPrs } from "@services/enum/icorebanking-vi-crediboard/dmtareas/dmtareasprs";
import { BaseModal } from "@components/modals/baseModal";

import { StaffModal } from "./StaffModal";
import {
  errorMessagge,
  staffConfig,
  txtLabels,
  txtTaskQuery,
  titlesModal,
} from "./config";
import { IICon, IButton, ITaskDecisionOption, DecisionItem } from "./types";
import { getXAction } from "./util/utils";
import { StyledHorizontalDivider, StyledTextField } from "../styles";
import { errorMessages, errorObserver } from "../config";
import { DecisionModal } from "./DecisionModal";

interface ToDoProps {
  icon?: IICon;
  button?: IButton;
  isMobile?: boolean;
  user: string;
  id: string;
  setIdProspect: (idProspect: string) => void;
}

function ToDo(props: ToDoProps) {
  const { icon, button, isMobile, id, setIdProspect } = props;

  const { approverid } = useParams();
  const { lang } = useEnums();

  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staff, setStaff] = useState<IStaff[]>([]);
  const [taskDecisions, setTaskDecisions] = useState<ITaskDecisionOption[]>([]);
  const [selectedDecision, setSelectedDecision] =
    useState<ITaskDecisionOption | null>(null);
  const [taskData, setTaskData] = useState<IToDo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInfo, setIsModalInfo] = useState(false);
  const [hasPermitSend, setHasPermitSend] = useState<boolean>(false);

  const [assignedStaff, setAssignedStaff] = useState({
    commercialManager: "",
    analyst: "",
  });
  const [tempStaff, setTempStaff] = useState(assignedStaff);

  const [decisionValue, setDecisionValue] = useState({
    decision: "",
  });

  const isSmall = useMediaQuery("(max-width: 880px)");
  const isMedium = useMediaQuery("(max-width: 1200px)");

  const maxCharacters = (() => {
    if (isSmall) return 30;
    if (isMedium) return 10;
    return 30;
  })();

  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  useEffect(() => {
    const fetchCreditRequest = async () => {
      try {
        const data = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          id,
          userAccount
        );

        setRequests(data[0] as ICreditRequest);
      } catch (error) {
        console.error(error);
        errorObserver.notify({
          id: "Management",
          message: (error as Error).message.toString(),
        });
      }
    };

    if (id) {
      fetchCreditRequest();
    }
  }, [businessUnitPublicCode, id, userAccount, businessManagerCode]);

  useEffect(() => {
    const fetchToDoData = async () => {
      if (!requests?.creditRequestId) return;

      try {
        const data = await getToDoByCreditRequestId(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId
        );

        setTaskData(data);
        data.prospectId && setIdProspect(data.prospectId);
      } catch (error) {
        console.error(error);
        errorObserver.notify({
          id: "Management",
          message: (error as Error).message.toString(),
        });
      }
    };

    fetchToDoData();
  }, [
    businessUnitPublicCode,
    requests?.creditRequestId,
    businessManagerCode,
    setIdProspect,
  ]);

  useEffect(() => {
    const fetchDecisions = async () => {
      if (!requests?.creditRequestId || taskDecisions.length > 0 || !taskData)
        return;

      try {
        const decision = await getSearchDecisionById(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId
        );

        const formattedDecisions = Array.isArray(decision)
          ? decision.map((decisions: DecisionItem, index: number) => ({
              id: `decision-${index}`,
              label: decisions.I18n ? decisions.I18n[lang] : decisions.value,
              value: decisions.value,
              code: decisions.decision,
              originalLabel: decisions.decision,
            }))
          : [];
        setTaskDecisions(formattedDecisions);
      } catch (error) {
        console.error(error);
        errorObserver.notify({
          id: "Management",
          message: (error as Error).message.toString(),
        });
      }
    };

    fetchDecisions();
  }, [
    requests?.creditRequestId,
    taskData,
    businessUnitPublicCode,
    businessManagerCode,
    lang,
    taskDecisions.length,
  ]);

  useEffect(() => {
    if (taskData?.usersByCreditRequestResponse) {
      const formattedStaff = taskData.usersByCreditRequestResponse.map(
        (staffMember: IStaff) => ({
          ...staffMember,
          userName: capitalizeFirstLetterEachWord(staffMember.userName),
        })
      );
      setStaff(formattedStaff);

      const firstAccountManager = formattedStaff.find(
        (staffMember) => staffMember.role === "CredicarAccountManager"
      );

      const firstAnalyst = formattedStaff.find(
        (staffMember) => staffMember.role === "CredicarAnalyst"
      );

      const newStaffState = {
        commercialManager: firstAccountManager?.userName || "",
        analyst: firstAnalyst?.userName || "",
      };

      setAssignedStaff(newStaffState);
      setTempStaff(newStaffState);
    }
  }, [taskData]);

  const handleRetry = async () => {
    if (requests?.creditRequestId) {
      try {
        const data = await getToDoByCreditRequestId(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId
        );
        setTaskData(data);
      } catch (error) {
        console.error(error);
        errorObserver.notify({
          id: "Management",
          message: (error as Error).message.toString(),
        });
      }
    }
  };

  const handleToggleStaffModal = () => setShowStaffModal((prev) => !prev);

  const handleSelectOfficial =
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.innerText;
      setTempStaff((prev) => ({ ...prev, [key]: value }));
    };

  const onChangeDecision = (_: string, newValue: string) => {
    setDecisionValue({ decision: newValue });

    const selected = taskDecisions.find(
      (decision) => decision.value === newValue
    );
    setSelectedDecision(selected || null);
  };

  const handleSubmit = () => {
    setAssignedStaff(tempStaff);
    handleToggleStaffModal();
  };

  const handleSend = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const validationId = () => {
    if (approverid === eventData.user.staff.staffId) {
      return true;
    } else {
      return false;
    }
  };

  const data = {
    makeDecision: {
      creditRequestId: requests?.creditRequestId || "",
      humanDecision:
        selectedDecision?.code || selectedDecision?.label.split(":")[0] || "",
      justification: "",
    },
    businessUnit: businessUnitPublicCode,
    user: eventData.user.identificationDocumentNumber || "",
    xAction: getXAction(
      selectedDecision?.code || selectedDecision?.label.split(":")[0] || "",
      validationId()
    ),
    humanDecisionDescription:
      selectedDecision?.originalLabel || selectedDecision?.label || "",
  };

  const taskRole = useMemo(
    () => taskPrs.find((t) => t.Code === taskData?.taskToBeDone)?.Role,
    [taskData?.taskToBeDone]
  );

  const taskLabel = useMemo(() => {
    if (!taskData?.taskToBeDone) return errorMessagge;

    const matchedTask = taskPrs.find(
      (taskItem) => taskItem.Code === taskData.taskToBeDone
    );

    return matchedTask ? `${matchedTask.Value}` : taskData.taskToBeDone;
  }, [taskData?.taskToBeDone]);

  const handleInfo = () => {
    setIsModalInfo(true);
  };

  const { disabledButton: reassignCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("reassignCreditApplication"),
  });

  useEffect(() => {
    setHasPermitSend(
      staff.some(
        (s) =>
          s.role === taskRole && s.userId === eventData?.user?.staff?.staffId
      )
    );
  }, [staff, eventData, taskData, taskRole]);

  const hasSingleDecision = taskDecisions.length === 1;

  useEffect(() => {
    if (hasSingleDecision && !decisionValue.decision && taskDecisions[0]) {
      setDecisionValue({ decision: taskDecisions[0].value });
      setSelectedDecision(taskDecisions[0]);
    }
  }, [hasSingleDecision, taskDecisions, decisionValue.decision]);

  return (
    <>
      <Fieldset
        title={errorMessages.toDo.titleCard}
        descriptionTitle={
          taskRole === "CredicarAccountManager"
            ? assignedStaff.commercialManager
            : assignedStaff.analyst
        }
        heightFieldset="241px"
        hasOverflow
        aspectRatio={isMobile ? "auto" : "1"}
      >
        {!taskData ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessages.toDo.title}
            description={errorMessages.toDo.description}
            buttonDescription={errorMessages.toDo.button}
            onRetry={handleRetry}
          />
        ) : (
          <Stack
            direction="column"
            gap={isMobile ? "4px" : "6px"}
            height={isMobile ? "auto" : "205px"}
          >
            <Stack direction={isMobile ? "column" : "row"}>
              {isMobile && (
                <Text appearance="primary" type="title" size="medium">
                  Tarea
                </Text>
              )}

              <Text
                size={isMobile ? "medium" : "large"}
                appearance={taskData?.taskToBeDone ? "dark" : "gray"}
              >
                {taskLabel}
              </Text>
            </Stack>
            <Stack
              direction={isMobile ? "column" : "row"}
              gap={isMobile ? "2px" : "16px"}
              padding="8px 0px"
              alignItems="center"
            >
              <Stack width={isMobile ? "100%" : "340px"}>
                {hasSingleDecision ? (
                  <Input
                    key="decision-input-single"
                    id="toDo"
                    name="decision"
                    label="Decisión"
                    value={taskDecisions[0]?.label || ""}
                    size="compact"
                    disabled
                    fullwidth={isMobile}
                  />
                ) : (
                  <Select
                    key="decision-select-multiple"
                    id="toDo"
                    name="decision"
                    label="Decisión"
                    value={decisionValue.decision}
                    placeholder="Selecciona una opción"
                    size="compact"
                    options={taskDecisions || []}
                    onChange={onChangeDecision}
                    fullwidth={isMobile}
                  />
                )}
              </Stack>
              <Stack padding="16px 0px 0px 0px" width="100%">
                <Stack gap="2px" alignItems="center">
                  <Button
                    onClick={handleSend}
                    cursorHover
                    loading={button?.loading || false}
                    type="submit"
                    fullwidth={isMobile}
                    spacing="compact"
                    disabled={!hasPermitSend}
                  >
                    {button?.label || txtLabels.buttonText}
                  </Button>
                  {!hasPermitSend && (
                    <Icon
                      icon={<MdOutlineInfo />}
                      appearance="primary"
                      size="16px"
                      cursorHover
                      onClick={handleInfo}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
            <Divider />
            <Stack
              padding="16px 0"
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              gap="16px"
            >
              {isModalOpen && (
                <DecisionModal
                  title={txtLabels.title}
                  buttonText={txtLabels.buttonText}
                  secondaryButtonText={txtLabels.secondaryButtonText}
                  inputLabel={txtLabels.inputLabel}
                  inputPlaceholder={txtLabels.inputPlaceholder}
                  businessManagerCode={businessManagerCode}
                  onSecondaryButtonClick={handleCloseModal}
                  onCloseModal={handleCloseModal}
                  data={data}
                />
              )}
              <Stack
                gap="16px"
                justifyContent="flex-start"
                direction={isMobile ? "column" : "row"}
                width="100%"
              >
                <Stack justifyContent="space-between" width="50%">
                  <Stack direction="column" alignItems="flex-start" gap="16px">
                    <StyledTextField>
                      <Text
                        type="body"
                        weight="bold"
                        size="small"
                        appearance="gray"
                        textAlign="start"
                      >
                        {txtTaskQuery.txtCommercialManager}
                      </Text>
                    </StyledTextField>
                    <StyledTextField>
                      <Text
                        type="title"
                        size="medium"
                        appearance="dark"
                        textAlign="start"
                      >
                        {truncateTextToMaxLength(
                          assignedStaff.commercialManager,
                          maxCharacters
                        )}
                      </Text>
                    </StyledTextField>
                  </Stack>
                  <StyledHorizontalDivider $isMobile={isMobile} />
                </Stack>
                <Stack justifyContent="space-between" width="50%">
                  <Stack direction="column" alignItems="flex-start" gap="16px">
                    <StyledTextField>
                      <Text
                        type="body"
                        weight="bold"
                        size="small"
                        appearance="gray"
                        textAlign="start"
                      >
                        {txtTaskQuery.txtAnalyst}
                      </Text>
                    </StyledTextField>
                    <StyledTextField>
                      <Text
                        type="title"
                        size="medium"
                        appearance="dark"
                        textAlign="start"
                      >
                        {truncateTextToMaxLength(
                          assignedStaff.analyst,
                          maxCharacters
                        )}
                      </Text>
                    </StyledTextField>
                  </Stack>
                  <StyledHorizontalDivider $isMobile={isMobile} />
                </Stack>
              </Stack>
              {icon && (
                <Stack alignItems="center" padding="0px 15px 0px  0px">
                  <Icon
                    icon={icon.icon}
                    appearance="primary"
                    size="24px"
                    onClick={
                      reassignCreditApplication
                        ? handleInfo
                        : handleToggleStaffModal
                    }
                    cursorHover
                    disabled={staff === null}
                  />
                </Stack>
              )}
            </Stack>
          </Stack>
        )}
      </Fieldset>
      {showStaffModal && (
        <StaffModal
          commercialManager={tempStaff.commercialManager}
          analyst={tempStaff.analyst}
          onChange={handleSelectOfficial}
          onSubmit={handleSubmit}
          onCloseModal={handleToggleStaffModal}
          taskData={taskData}
          setAssignedStaff={setAssignedStaff}
          buttonText={staffConfig.confirm}
          title={staffConfig.title}
          handleRetry={handleRetry}
        />
      )}
      {isModalInfo && (
        <>
          <BaseModal
            title={titlesModal.title}
            nextButton={titlesModal.textButtonNext}
            handleNext={() => setIsModalInfo(false)}
            handleClose={() => setIsModalInfo(false)}
            width={isMobile ? "290px" : "400px"}
          >
            <Stack gap="16px" direction="column">
              <Stack direction="column" gap="8px">
                <Text weight="bold" size="large">
                  {titlesModal.subTitle}
                </Text>
                <Text weight="normal" size="medium" appearance="gray">
                  {titlesModal.description}
                </Text>
              </Stack>
            </Stack>
          </BaseModal>
        </>
      )}
    </>
  );
}

export { ToDo };
