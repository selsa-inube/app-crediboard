import { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  MdOutlineChevronRight,
  MdOutlineFilterAlt,
  MdOutlineFilterAltOff,
} from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  useFlag,
  useMediaQueries,
  Button,
} from "@inubekit/inubekit";

import { SummaryCard } from "@components/cards/SummaryCard";
import {
  ICreditRequestPinned,
  ICreditRequest,
} from "@services/creditRequest/query/types";
import { mockErrorBoard } from "@mocks/error-board/errorborad.mock";
import { patchChangeTracesToReadById } from "@services/creditRequest/command/patchChangeTracesToReadById";
import { AppContext } from "@context/AppContext";
import { ErrorModal } from "@components/modals/ErrorModal";
import { getCanUnpin } from "@utils/configRules/permissions";
import { ruleConfig } from "@utils/configRules/configRules";
import { evaluateRule } from "@utils/configRules/evaluateRules";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { taskPrs } from "@services/enum/icorebanking-vi-crediboard/dmtareas/dmtareasprs";

import { StyledBoardSection, StyledCollapseIcon } from "./styles";
import { SectionBackground, SectionOrientation } from "./types";
import { configOption, messagesError } from "./config";

interface BoardSectionProps {
  sectionTitle: string;
  sectionBackground: SectionBackground;
  orientation: SectionOrientation;
  sectionInformation: ICreditRequest[];
  pinnedRequests: ICreditRequestPinned[];
  errorLoadingPins: boolean;
  searchRequestValue: string;
  sectionCounter?: number;
  sectionId?: string;
  handlePinRequest: (
    requestId: string,
    userWhoPinnnedId: string,
    isPinned: string
  ) => void;
  handleLoadMoreData: () => void;
  dragIcon?: React.ReactElement;
  onOrientationChange: (orientation: SectionOrientation) => void;
  shouldCollapseAll: boolean;
}

function BoardSection(props: BoardSectionProps) {
  const {
    sectionTitle,
    sectionCounter,
    sectionBackground = "light",
    orientation = "vertical",
    sectionInformation,
    pinnedRequests,
    errorLoadingPins,
    searchRequestValue,
    sectionId,
    handlePinRequest,
    handleLoadMoreData,
    onOrientationChange,
    shouldCollapseAll,
  } = props;
  const disabledCollapse = sectionInformation.length === 0;
  const { "(max-width: 1024px)": isTablet, "(max-width: 595px)": isMobile } =
    useMediaQueries(["(max-width: 1024px)", "(max-width: 595px)"]);
  const [collapse, setCollapse] = useState(false);
  const [currentOrientation, setCurrentOrientation] =
    useState<SectionOrientation>(orientation);
  const [valueRule, setValueRule] = useState<Record<string, string[]>>({});
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const flagMessage = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const missionName = eventData.user.staff.missionName;
  const staffId = eventData.user.staff.staffId;

  const { addFlag } = useFlag();

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  useEffect(() => {
    if (shouldCollapseAll && !disabledCollapse) {
      setCollapse(true);
    }
  }, [shouldCollapseAll, disabledCollapse]);

  const handleCollapse = () => {
    if (!disabledCollapse) {
      setCollapse((prev) => !prev);
    }
  };

  const handleFlag = (title: string, description: string) => {
    addFlag({
      title,
      description,
      appearance: "danger",
      duration: 5000,
    });
  };

  const getNoDataMessage = () => {
    if (sectionInformation.length === 0) {
      return searchRequestValue
        ? `${configOption.noMatches} "${searchRequestValue}"`
        : configOption.textNodata;
    }
    return "";
  };

  const handleToggleOrientation = () => {
    const newOrientation =
      currentOrientation === "vertical" ? "horizontal" : "vertical";
    if (newOrientation === "horizontal") {
      setCollapse(true);
      setTimeout(() => {
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 100);
    } else {
      setCollapse(false);
    }
    setCurrentOrientation(newOrientation);
    onOrientationChange(newOrientation);
  };

  const isRequestPinned = (
    creditRequestId: string | undefined,
    pinnedRequests: ICreditRequestPinned[]
  ) =>
    pinnedRequests.some(
      (pinnedRequest) =>
        pinnedRequest.creditRequestId === creditRequestId &&
        pinnedRequest.isPinned === "Y"
    );

  const handleCardClick = async (creditRequestId: string | undefined) => {
    if (!businessUnitPublicCode || !creditRequestId) return;

    try {
      await patchChangeTracesToReadById(
        creditRequestId,
        businessUnitPublicCode,
        businessManagerCode
      );
    } catch (error) {
      setErrorMessage(messagesError.changeTracesToReadById.description);
      setErrorModal(true);
    }
  };

  const fetchValidationRulesData = useCallback(async () => {
    const rulesValidate = ["PositionsAuthorizedToRemoveAnchorsPlacedByOther"];

    await Promise.all(
      rulesValidate.map(async (ruleName) => {
        const rule = ruleConfig[ruleName]?.({});
        if (!rule) return;

        try {
          const values = await evaluateRule(
            rule,
            postBusinessUnitRules,
            "value",
            businessUnitPublicCode,
            businessManagerCode
          );

          const extractedValues = Array.isArray(values)
            ? values
                .map((v) => (typeof v === "string" ? v : (v?.value ?? "")))
                .filter((val): val is string => val !== "")
            : [];

          setValueRule((prev) => {
            const merged = [...(prev[ruleName] || []), ...extractedValues];
            const unique = Array.from(new Set(merged));
            return { ...prev, [ruleName]: unique };
          });
        } catch {
          console.error(`Error evaluando ${ruleName} para este usuario.`);
        }
      })
    );
  }, [businessUnitPublicCode, businessManagerCode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const hasUnread = sectionInformation.some(
        (request) => request.unreadNovelties === undefined
      );
      if (!flagMessage.current && hasUnread) {
        const errorData = mockErrorBoard[0];
        handleFlag(errorData.messages[0], errorData.Summary[1]);
        flagMessage.current = true;
      }
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionInformation]);

  useEffect(() => {
    if (businessUnitPublicCode) fetchValidationRulesData();
  }, [businessUnitPublicCode, fetchValidationRulesData]);

  const getTaskLabel = (code: string): string => {
    const task = taskPrs.find((t) => t.Code === code);
    return task ? `${task.Value}` : code;
  };

  return (
    <StyledBoardSection
      ref={sectionRef}
      id={sectionId}
      $sectionBackground={sectionBackground}
      $orientation={orientation}
      $isTablet={isTablet}
    >
      <Stack
        justifyContent={
          orientation === "vertical" ? "space-between" : "flex-start"
        }
        alignItems="end"
        gap="24px"
      >
        <Stack
          alignItems="center"
          gap="8px"
          width={orientation === "vertical" ? "180px" : "auto"}
          height={orientation === "vertical" ? "56px" : "auto"}
        >
          {orientation !== "vertical" && (
            <StyledCollapseIcon
              $collapse={collapse}
              $disabledCollapse={disabledCollapse}
              onClick={handleCollapse}
            >
              <Icon
                icon={<MdOutlineChevronRight />}
                disabled={disabledCollapse}
                appearance="dark"
                size="26px"
                cursorHover
              />
            </StyledCollapseIcon>
          )}

          {!isTablet && (
            <Icon
              icon={
                currentOrientation === "vertical" ? (
                  <MdOutlineFilterAlt />
                ) : (
                  <MdOutlineFilterAltOff />
                )
              }
              appearance="primary"
              size="24px"
              onClick={handleToggleOrientation}
              cursorHover
            />
          )}

          <Text
            type={orientation === "vertical" || isMobile ? "title" : "headline"}
            size={orientation === "vertical" || isMobile ? "large" : "medium"}
          >
            {sectionTitle}
          </Text>
        </Stack>

        <Text type="title" size="medium">
          {sectionCounter}
        </Text>
      </Stack>

      {(collapse || orientation === "vertical") && (
        <Stack
          wrap="wrap"
          alignItems="center"
          direction={orientation === "vertical" ? "column" : "row"}
          justifyContent={isMobile ? "center" : "flex-start"}
          gap="20px"
        >
          {sectionInformation.length > 0 ? (
            sectionInformation.map((request, index) => (
              <SummaryCard
                key={index}
                rad={request.creditRequestCode}
                date={request.creditRequestDateOfCreation}
                name={request.clientName}
                destination={request.moneyDestinationAbreviatedName}
                value={request.loanAmount}
                toDo={
                  request.taskToBeDone ? getTaskLabel(request.taskToBeDone) : ""
                }
                path={`extended-card/${request.creditRequestCode}`}
                isPinned={isRequestPinned(
                  request.creditRequestId,
                  pinnedRequests
                )}
                hasMessage={request.unreadNovelties === "Y"}
                onPinChange={() => {
                  if (request.creditRequestId) {
                    handlePinRequest(
                      request.creditRequestId,
                      request.userWhoPinnnedId || "",
                      isRequestPinned(request.creditRequestId, pinnedRequests)
                        ? "N"
                        : "Y"
                    );
                  }
                }}
                canUnpin={getCanUnpin(
                  staffId,
                  request.userWhoPinnnedId || "",
                  missionName || "",
                  valueRule
                )}
                onCardClick={() => handleCardClick(request.creditRequestId)}
                errorLoadingPins={errorLoadingPins}
              />
            ))
          ) : (
            <Stack
              gap="24px"
              alignItems="center"
              height={orientation === "vertical" ? "533px" : "200px"}
              width="100%"
            >
              <Text type="title" size="small" appearance="gray">
                {getNoDataMessage()}
              </Text>
            </Stack>
          )}

          {orientation === "horizontal" && sectionInformation.length > 0 && (
            <Stack justifyContent="center" width="100%">
              <Button
                variant="outlined"
                appearance="dark"
                onClick={handleLoadMoreData}
              >
                {configOption.load}
              </Button>
            </Stack>
          )}
        </Stack>
      )}
      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => {
            setErrorModal(false);
          }}
        />
      )}
    </StyledBoardSection>
  );
}

export { BoardSection };
export type { BoardSectionProps };
