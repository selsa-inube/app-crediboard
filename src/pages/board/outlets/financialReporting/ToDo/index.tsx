import { useState, useEffect, ChangeEvent, useContext, useMemo } from "react";
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
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { AppContext } from "@context/AppContext";
import { useEnum } from "@hooks/useEnum";
import userNotFound from "@assets/images/ItemNotFound.png";
import { taskPrs } from "@services/enum/icorebanking-vi-crediboard/dmtareas/dmtareasprs";
import { BaseModal } from "@components/modals/baseModal";
import { TruncatedText } from "@components/modals/TruncatedTextModal";
import { IEntries } from "@components/data/TableBoard/types";
import { getApprovalBoardRepresentablePersons } from "@services/creditRequest/query/approvalBoardRepresentablePersons";

import { StaffModal } from "./StaffModal";
import {
  errorMessaggeEnum,
  staffConfigEnum,
  txtLabelsEnum,
  txtTaskQueryEnum,
  titlesModalEnum,
  txtOthersOptionsEnum,
  txtConfirmRepresentativeEnum,
} from "./config";
import { IICon, IButton, ITaskDecisionOption, DecisionItem } from "./types";
import { getXAction } from "./util/utils";
import { StyledHorizontalDivider, StyledTextField } from "../styles";
import { errorMessagesEnum, errorObserver } from "../config";
import { DecisionModal } from "./DecisionModal";

interface ToDoProps {
  icon?: IICon;
  button?: IButton;
  isMobile?: boolean;
  user: string;
  id: string;
  setIdProspect: (idProspect: string) => void;
  approvalsEntries: IEntries[];
}

function ToDo(props: ToDoProps) {
  const { icon, button, isMobile, id, setIdProspect, approvalsEntries } = props;
  const { lang } = useEnum();
  const [requests, setRequests] = useState<ICreditRequest | null>(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staff, setStaff] = useState<IStaff[]>([]);
  const [taskDecisions, setTaskDecisions] = useState<ITaskDecisionOption[]>([]);
  const [selectedDecision, setSelectedDecision] =
    useState<ITaskDecisionOption | null>(null);
  const [taskData, setTaskData] = useState<IToDo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInfo, setIsModalInfo] = useState(false);
  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const [hasPermitSend, setHasPermitSend] = useState<boolean>(false);
  const [representablePersons, setRepresentablePersons] = useState<string[]>(
    [],
  );
  const [selectedRepresentative, setSelectedRepresentative] = useState("");

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

  const userAccount =
    typeof eventData === "string"
      ? JSON.parse(eventData).user.identificationDocumentNumber
      : eventData.user.identificationDocumentNumber;

  useEffect(() => {
    const fetchRepresentable = async () => {
      if (
        requests?.stage === "VERIFICACION_APROBACION" &&
        requests.creditRequestId
      ) {
        try {
          const response = await getApprovalBoardRepresentablePersons(
            businessUnitPublicCode,
            businessManagerCode,
            userAccount,
            requests.creditRequestId,
            eventData.token || "",
          );

          const persons = response?.approvalBoardRepresentablePersons || [];
          setRepresentablePersons(persons);

          if (persons.length === 1) {
            setSelectedRepresentative(persons[0]);
          }
        } catch (error) {
          console.error("Error fetching representable persons:", error);
        }
      }
    };

    fetchRepresentable();
  }, [
    requests?.stage,
    requests?.creditRequestId,
    businessUnitPublicCode,
    businessManagerCode,
    userAccount,
    eventData.token,
  ]);

  useEffect(() => {
    const fetchCreditRequest = async () => {
      try {
        const data = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          id,
          userAccount,
          eventData.token || "",
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
  }, [
    businessUnitPublicCode,
    id,
    userAccount,
    businessManagerCode,
    eventData.token,
  ]);

  useEffect(() => {
    const fetchToDoData = async () => {
      if (!requests?.creditRequestId) return;

      try {
        const data = await getToDoByCreditRequestId(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId,
          eventData.token || "",
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
    eventData.token,
  ]);

  useEffect(() => {
    const fetchDecisions = async () => {
      if (!requests?.creditRequestId || taskDecisions.length > 0 || !taskData)
        return;

      try {
        const decision = await getSearchDecisionById(
          businessUnitPublicCode,
          businessManagerCode,
          requests.creditRequestId,
          eventData.token || "",
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
    eventData.token,
  ]);

  useEffect(() => {
    if (taskData?.usersByCreditRequestResponse) {
      const formattedStaff = taskData.usersByCreditRequestResponse.map(
        (staffMember: IStaff) => ({
          ...staffMember,
          userName: capitalizeFirstLetterEachWord(staffMember.userName),
        }),
      );
      setStaff(formattedStaff);

      const firstAccountManager = formattedStaff.find(
        (staffMember) => staffMember.role === "CredicarAccountManager",
      );

      const firstAnalyst = formattedStaff.find(
        (staffMember) => staffMember.role === "CredicarAnalyst",
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
          requests.creditRequestId,
          eventData.token || "",
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
      (decision) => decision.value === newValue,
    );
    setSelectedDecision(selected || null);
  };

  const handleSubmit = () => {
    setAssignedStaff(tempStaff);
    handleToggleStaffModal();
  };

  const isRepresentativeButNotApprover = () => {
    const isApprover = validationIsApprover();
    const isRepresentative = representablePersons.includes(
      eventData?.user?.userAccount || "",
    );

    return isRepresentative && !isApprover;
  };

  const handleSend = () => {
    if (isRepresentativeButNotApprover()) {
      setIsModalConfirm(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmRepresentative = () => {
    setIsModalConfirm(false);
    setIsModalOpen(true);
  };

  const validationIsApprover = () => {
    if (requests?.stage !== "VERIFICACION_APROBACION") {
      return false;
    }
    const currentUserId = eventData?.user?.identificationDocumentNumber;
    const isUserInApprovals = approvalsEntries.some(
      (approval) => approval.identificationNumber === currentUserId,
    );
    return isUserInApprovals;
  };

  const data = {
    makeDecision: {
      concept: selectedDecision?.code || "",
      creditRequestId: requests?.creditRequestId || "",
      humanDecision: selectedDecision?.code || "",
      justification: "",
    },
    businessUnit: businessUnitPublicCode,
    user: eventData.user.identificationDocumentNumber || "",
    xAction: isRepresentativeButNotApprover()
      ? "RegisterIndividualConceptOfApproval"
      : getXAction(selectedDecision?.code || "", validationIsApprover()),
    humanDecisionDescription: selectedDecision?.label || "",
  };

  const taskRole = useMemo(
    () => taskPrs.find((t) => t.Code === taskData?.taskToBeDone)?.Role,
    [taskData?.taskToBeDone],
  );

  const taskLabel = useMemo(() => {
    if (!taskData?.taskToBeDone) return errorMessaggeEnum.default.i18n[lang];

    const matchedTask = taskPrs.find(
      (taskItem) => taskItem.Code === taskData.taskToBeDone,
    );

    return matchedTask ? `${matchedTask.Value}` : taskData.taskToBeDone;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskData?.taskToBeDone]);

  const handleInfo = () => {
    setIsModalInfo(true);
  };

  const { disabledButton: reassignCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("reassignCreditApplication"),
  });

  useEffect(() => {
    const hasStaffPermission = staff.some(
      (s) =>
        s.role === taskRole && s.userId === eventData?.user?.staff?.staffId,
    );

    const isVerificationWithAccount =
      requests?.stage === "VERIFICACION_APROBACION" &&
      Boolean(eventData?.user?.userAccount);

    setHasPermitSend(hasStaffPermission || isVerificationWithAccount);
  }, [staff, eventData, taskData, taskRole, requests]);

  const hasSingleDecision = taskDecisions.length === 1;

  useEffect(() => {
    if (hasSingleDecision && !decisionValue.decision && taskDecisions[0]) {
      setDecisionValue({ decision: taskDecisions[0].value });
      setSelectedDecision(taskDecisions[0]);
    }
  }, [hasSingleDecision, taskDecisions, decisionValue.decision]);

  const getToDoDescriptionTitle = (): string => {
    if (requests?.stage === "VERIFICACION_APROBACION") {
      const currentUserId = eventData?.user?.identificationDocumentNumber;

      const isUserApprover = approvalsEntries.some(
        (approval) => approval.identificationNumber === currentUserId,
      );

      if (isUserApprover) {
        return eventData?.user?.userAccount || "";
      }
      return assignedStaff.analyst || assignedStaff.commercialManager || "";
    }

    if (taskRole === "CredicarAccountManager") {
      return assignedStaff.commercialManager;
    } else {
      return assignedStaff.analyst;
    }
  };

  return (
    <>
      <Fieldset
        title={errorMessagesEnum.toDo.titleCard.i18n[lang]}
        descriptionTitle={getToDoDescriptionTitle()}
        heightFieldset="241px"
        hasOverflow
        aspectRatio={isMobile ? "auto" : "1"}
      >
        {!taskData ? (
          <ItemNotFound
            image={userNotFound}
            title={errorMessagesEnum.toDo.title.i18n[lang]}
            description={errorMessagesEnum.toDo.description.i18n[lang]}
            buttonDescription={errorMessagesEnum.toDo.button.i18n[lang]}
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
                  {txtConfirmRepresentativeEnum.taskLabel.i18n[lang]}
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
                    label={txtOthersOptionsEnum.txtDecision.i18n[lang]}
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
                    label={txtOthersOptionsEnum.txtDecision.i18n[lang]}
                    value={decisionValue.decision}
                    placeholder={
                      txtConfirmRepresentativeEnum.representativePlaceholder
                        .i18n[lang]
                    }
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
                    {button?.label || txtLabelsEnum.buttonText.i18n[lang]}
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
                  title={txtLabelsEnum.title.i18n[lang]}
                  buttonText={txtLabelsEnum.buttonText.i18n[lang]}
                  secondaryButtonText={
                    txtLabelsEnum.secondaryButtonText.i18n[lang]
                  }
                  inputLabel={txtLabelsEnum.inputLabel.i18n[lang]}
                  inputPlaceholder={txtLabelsEnum.inputPlaceholder.i18n[lang]}
                  businessManagerCode={businessManagerCode}
                  onSecondaryButtonClick={handleCloseModal}
                  onCloseModal={handleCloseModal}
                  data={data}
                  eventData={eventData}
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
                        {txtTaskQueryEnum.txtCommercialManager.i18n[lang]}
                      </Text>
                    </StyledTextField>
                    <StyledTextField>
                      <TruncatedText
                        text={assignedStaff.commercialManager}
                        maxLength={maxCharacters}
                        type="title"
                        size="medium"
                        appearance="dark"
                      />
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
                        {txtTaskQueryEnum.txtAnalyst.i18n[lang]}
                      </Text>
                    </StyledTextField>
                    <StyledTextField>
                      <TruncatedText
                        text={assignedStaff.analyst}
                        maxLength={maxCharacters}
                        type="title"
                        size="medium"
                        appearance="dark"
                      />
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
          buttonText={staffConfigEnum.confirm.i18n[lang]}
          title={staffConfigEnum.title.i18n[lang]}
          handleRetry={handleRetry}
        />
      )}
      {isModalInfo && (
        <>
          <BaseModal
            title={titlesModalEnum.title.i18n[lang]}
            nextButton={titlesModalEnum.textButtonNext.i18n[lang]}
            handleNext={() => setIsModalInfo(false)}
            handleClose={() => setIsModalInfo(false)}
            width={isMobile ? "290px" : "400px"}
          >
            <Stack gap="16px" direction="column">
              <Stack direction="column" gap="8px">
                <Text weight="bold" size="large">
                  {titlesModalEnum.subTitle.i18n[lang]}
                </Text>
                <Text weight="normal" size="medium" appearance="gray">
                  {titlesModalEnum.description.i18n[lang]}
                </Text>
              </Stack>
            </Stack>
          </BaseModal>
        </>
      )}
      {isModalConfirm && (
        <BaseModal
          title={txtConfirmRepresentativeEnum.confirmTitle.i18n[lang]}
          nextButton={staffConfigEnum.confirm.i18n[lang]}
          backButton={staffConfigEnum.cancel.i18n[lang]}
          handleNext={handleConfirmRepresentative}
          handleClose={() => setIsModalConfirm(false)}
        >
          <Stack direction="column" gap="16px">
            <Text>
              {`${txtConfirmRepresentativeEnum.confirmationMessage.i18n[lang]} ${selectedDecision?.label || "procesando"} ${txtConfirmRepresentativeEnum.decisionLabel.i18n[lang]} ${
                representablePersons.length === 1
                  ? representablePersons[0]
                  : selectedRepresentative || "..."
              }, ${txtConfirmRepresentativeEnum.decisionPlaceholder.i18n[lang]}`}
            </Text>
            {representablePersons.length > 1 && (
              <Select
                name="Representative"
                id="Representative"
                label={
                  txtConfirmRepresentativeEnum.representativeLabel.i18n[lang]
                }
                placeholder={
                  txtConfirmRepresentativeEnum.representativePlaceholder.i18n[
                    lang
                  ]
                }
                size="compact"
                fullwidth
                options={representablePersons.map((person) => ({
                  id: person,
                  label: person,
                  value: person,
                }))}
                value={selectedRepresentative}
                onChange={(_id, value) => setSelectedRepresentative(value)}
              />
            )}
          </Stack>
        </BaseModal>
      )}
    </>
  );
}

export { ToDo };
