import { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  MdOutlineChevronRight,
  MdOutlineFilterAlt,
  MdOutlineFilterAltOff,
  MdInfoOutline,
} from "react-icons/md";
import { Stack, Icon, Text, useMediaQueries, Button } from "@inubekit/inubekit";

import { SummaryCard } from "@components/cards/SummaryCard";
import { BaseModal } from "@components/modals/baseModal";
import {
  ICreditRequestPinned,
  ICreditRequest,
} from "@services/creditRequest/query/types";
import { patchChangeTracesToReadById } from "@services/creditRequest/command/patchChangeTracesToReadById";
import { AppContext } from "@context/AppContext";
import { ErrorModal } from "@components/modals/ErrorModal";
import { getCanUnpin } from "@utils/configRules/permissions";
import { getPositionsAuthorizedToRemoveAnchorsPlacedByOther } from "@services/creditRequest/query/positionsAuthorizedToRemoveAnchorsPlacedByOther";
import { taskPrs } from "@services/enum/icorebanking-vi-crediboard/dmtareas/dmtareasprs";

import {
  StyledBoardSection,
  StyledCollapseIcon,
  StyledFilterIcon,
} from "./styles";
import { SectionBackground, SectionOrientation } from "./types";
import { configOption, infoModal, messagesError } from "./config";

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
    isPinned: string,
  ) => void;
  handleLoadMoreData: () => void;
  dragIcon?: React.ReactElement;
  onOrientationChange: (orientation: SectionOrientation) => void;
  shouldCollapseAll: boolean;
  hasActiveFilters?: boolean;
  showPinnedOnly?: boolean;
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
    hasActiveFilters,
    showPinnedOnly = false,
  } = props;
  const disabledCollapse = sectionInformation.length === 0;
  const { "(max-width: 1024px)": isTablet, "(max-width: 595px)": isMobile } =
    useMediaQueries(["(max-width: 1024px)", "(max-width: 595px)"]);
  const [collapse, setCollapse] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [currentOrientation, setCurrentOrientation] =
    useState<SectionOrientation>(orientation);
  const [positionsAuthorized, setPositionsAuthorized] = useState<string[]>([]);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const flagMessage = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessManagerCode = eventData.businessManager.abbreviatedName;
  const missionName = eventData.user.staff.missionName;
  const staffId = eventData.user.staff.staffId;
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

  const getNoDataMessage = () => {
    if (sectionInformation.length === 0) {
      if (showPinnedOnly) {
        return configOption.noPinnedRequests;
      }
      if (searchRequestValue && searchRequestValue.trim().length >= 1) {
        return configOption.noKeywordResults;
      }
      if (hasActiveFilters) {
        return configOption.noFilterResults;
      }
      return configOption.textNodata;
    }
    return "";
  };
  const handleToggleOrientation = () => {
    if (disabledCollapse) {
      setIsInfoModalOpen(true);
      return;
    }
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
    pinnedRequests: ICreditRequestPinned[],
  ) =>
    pinnedRequests.some(
      (pinnedRequest) =>
        pinnedRequest.creditRequestId === creditRequestId &&
        pinnedRequest.isPinned === "Y",
    );

  const handleCardClick = async (creditRequestId: string | undefined) => {
    if (!businessUnitPublicCode || !creditRequestId) return;

    try {
      await patchChangeTracesToReadById(
        creditRequestId,
        businessUnitPublicCode,
        businessManagerCode,
      );
    } catch (error) {
      setErrorMessage(messagesError.changeTracesToReadById.description);
      setErrorModal(true);
    }
  };

  const fetchPositionsAuthorized = useCallback(async () => {
    if (!businessUnitPublicCode) return;

    try {
      const response = await getPositionsAuthorizedToRemoveAnchorsPlacedByOther(
        businessUnitPublicCode,
      );

      if (response?.positionsAuthorized) {
        setPositionsAuthorized(response.positionsAuthorized);
      }
    } catch (error) {
      setShowErrorModal(true);
      setMessageError(messagesError.changeTracesToReadById.description);
    }
  }, [businessUnitPublicCode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const hasUnread = sectionInformation.some(
        (request) => request.unreadNovelties === undefined,
      );
      if (!flagMessage.current && hasUnread) {
        flagMessage.current = true;
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [sectionInformation]);

  useEffect(() => {
    if (businessUnitPublicCode) {
      fetchPositionsAuthorized();
    }
  }, [businessUnitPublicCode, fetchPositionsAuthorized]);

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
            <StyledFilterIcon $disabled={disabledCollapse}>
              <Icon
                icon={
                  currentOrientation === "vertical" ? (
                    <MdOutlineFilterAlt />
                  ) : (
                    <MdOutlineFilterAltOff />
                  )
                }
                appearance={disabledCollapse ? "gray" : "primary"}
                size="24px"
                onClick={handleToggleOrientation}
                cursorHover={!disabledCollapse}
              />
            </StyledFilterIcon>
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
                  pinnedRequests,
                )}
                hasMessage={request.unreadNovelties === "Y"}
                onPinChange={() => {
                  if (request.creditRequestId) {
                    handlePinRequest(
                      request.creditRequestId,
                      request.userWhoPinnnedId || "",
                      isRequestPinned(request.creditRequestId, pinnedRequests)
                        ? "N"
                        : "Y",
                    );
                  }
                }}
                canUnpin={getCanUnpin(
                  staffId,
                  request.userWhoPinnnedId || "",
                  missionName || "",
                  {
                    PositionsAuthorizedToRemoveAnchorsPlacedByOther:
                      positionsAuthorized,
                  },
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
      {showErrorModal && (
        <ErrorModal
          handleClose={() => {
            setShowErrorModal(false);
          }}
          isMobile={isMobile}
          message={messageError}
        />
      )}
      {isInfoModalOpen && (
        <BaseModal
          title={infoModal.title}
          nextButton={infoModal.button}
          handleNext={() => setIsInfoModalOpen(false)}
          handleClose={() => setIsInfoModalOpen(false)}
          width={isMobile ? "290px" : "403px"}
        >
          <Stack direction="column" alignItems="center" gap="16px">
            <Icon icon={<MdInfoOutline />} size="68px" appearance="primary" />
            <Text type="body" size="medium" appearance="gray">
              {infoModal.message}
            </Text>
          </Stack>
        </BaseModal>
      )}
    </StyledBoardSection>
  );
}

export { BoardSection };
export type { BoardSectionProps };
