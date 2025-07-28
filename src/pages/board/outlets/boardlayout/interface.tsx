import { useContext, useEffect, useRef, useState } from "react";
import {
  MdOutlineFilterAlt,
  MdOutlineFilterAltOff,
  MdOutlineMicNone,
  MdOutlinePushPin,
  MdSearch,
  MdMic,
} from "react-icons/md";
import { RxDragHandleVertical, RxDragHandleHorizontal } from "react-icons/rx";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Stack,
  Icon,
  Text,
  Divider,
  Textfield,
  Toggle,
  Button,
  useFlag,
} from "@inubekit/inubekit";

import { SectionOrientation } from "@components/layout/BoardSection/types";
import { BoardSection } from "@components/layout/BoardSection";
import { ICreditRequestPinned, ICreditRequest } from "@services/types";
import { IOptionItemCheckedProps } from "@components/inputs/SelectCheck/OptionItem";
import { ErrorAlert } from "@components/ErrorAlert";
import { Filter } from "@components/cards/SelectedFilters/interface";
import { SelectedFilters } from "@components/cards/SelectedFilters";
import { FilterRequestModal } from "@components/modals/FilterRequestModal";
import { getCreditRequestTotalsByStage } from "@services/credit-request/query/getCreditRequestTotalsByStage";
import { ICreditRequestTotalsByStage } from "@services/credit-request/query/getCreditRequestTotalsByStage/types";
import { AppContext } from "@context/AppContext";
import { textFlagsUsers } from "@config/pages/staffModal/addFlag";
import { totalsKeyBySection } from "@components/layout/BoardSection/config";
import { BaseModal } from "@components/modals/baseModal";

import {
  speechRecognitionConfig,
  textProcessingConfig,
  voiceSearchConfig,
} from "./config/voiceSearch";
import {
  StyledInputsContainer,
  StyledBoardContainer,
  StyledContainerToCenter,
  StyledError,
  StyledSearch,
  StyledRequestsContainer,
  StyledMic,
} from "./styles";
import { selectCheckOptions } from "./config/select";
import { IFilterFormValues } from ".";
import { boardColumns, seePinned } from "./config/board";

interface BoardLayoutProps {
  isMobile: boolean;
  selectOptions: IOptionItemCheckedProps[];
  boardOrientation: SectionOrientation;
  BoardRequests: ICreditRequest[];
  searchRequestValue: string;
  showPinnedOnly: boolean;
  pinnedRequests: ICreditRequestPinned[];
  errorLoadingPins: boolean;
  activeOptions: Filter[];
  closeFilterModal: () => void;
  handleSelectCheckChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePinRequest: (
    requestId: string,
    userWhoPinnnedId: string,
    isPinned: string
  ) => void;
  handleShowPinnedOnly: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchRequestsValue: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onOrientationChange: (orientation: SectionOrientation) => void;
  handleLoadMoreData: () => void;
  openFilterModal: () => void;
  isFilterModalOpen: boolean;
  handleApplyFilters: (values: IFilterFormValues) => void;
  shouldCollapseAll: boolean;
  handleClearFilters: () => void;
  handleRemoveFilter: (filterIdToRemove: string) => void;
  isMenuOpen: boolean;
  filterValues: IFilterFormValues;
}

function BoardLayoutUI(props: BoardLayoutProps) {
  const {
    isMobile,
    openFilterModal,
    isFilterModalOpen,
    handleApplyFilters,
    boardOrientation,
    BoardRequests,
    searchRequestValue,
    showPinnedOnly,
    pinnedRequests,
    errorLoadingPins,
    activeOptions,
    filterValues,
    closeFilterModal,
    handleLoadMoreData,
    handlePinRequest,
    handleShowPinnedOnly,
    handleClearFilters,
    handleRemoveFilter,
    handleSearchRequestsValue,
    onOrientationChange,
    shouldCollapseAll,
  } = props;

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [showErrorAlert, setShowErrorAlert] = useState(true);
  const displayText = listening
    ? transcript || voiceSearchConfig.states.listening
    : voiceSearchConfig.states.instruction;

  const [isShowModal, setIsShowModal] = useState(false);
  const [isVoiceProcessed, setIsVoiceProcessed] = useState(false);
  const { businessUnitSigla } = useContext(AppContext);

  const [totalsData, setTotalsData] = useState<ICreditRequestTotalsByStage[]>();
  const { addFlag } = useFlag();
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const [isExpanded, setIsExpanded] = useState(false);

  const stackRef = useRef<HTMLDivElement>(null);
  const startListening = () => {
    resetTranscript();
    setIsVoiceProcessed(false);
    SpeechRecognition.startListening({
      continuous: false,
      language: speechRecognitionConfig.language,
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleMicClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const processTranscript = (text: string) => {
    const processedText = text.replace(
      textProcessingConfig.numberSpaceRegex,
      "$1$2"
    );
    return processedText.trim();
  };

  const applyVoiceSearch = (transcriptText: string) => {
    if (transcriptText && transcriptText.trim() !== "" && !isVoiceProcessed) {
      const processedText = processTranscript(transcriptText);
      const syntheticEvent = {
        target: {
          value: processedText,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleSearchRequestsValue(syntheticEvent);
      setIsVoiceProcessed(true);
      setIsShowModal(false);
      resetTranscript();
    }
  };

  const handleCloseModal = () => {
    stopListening();
    resetTranscript();
    setIsShowModal(false);
    setIsVoiceProcessed(false);
  };

  useEffect(() => {
    if (isShowModal && browserSupportsSpeechRecognition) {
      startListening();

      const recognition = SpeechRecognition.getRecognition();
      if (recognition) {
        recognition.onend = () => {
          if (transcript && transcript.trim() !== "" && !isVoiceProcessed) {
            applyVoiceSearch(transcript);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "no-speech") {
            setTimeout(() => {
              if (isShowModal && !isVoiceProcessed) {
                startListening();
              }
            }, 1000);
          }
        };
      }

      return () => {
        if (recognition) {
          recognition.onend = null;
          recognition.onerror = null;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowModal, browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (
      transcript &&
      transcript.trim() !== "" &&
      isShowModal &&
      !isVoiceProcessed
    ) {
      const timeoutId = setTimeout(() => {
        applyVoiceSearch(transcript);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isShowModal, isVoiceProcessed]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        stackRef.current &&
        !stackRef.current.contains(event.target as Node) &&
        !searchRequestValue
      ) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, searchRequestValue]);

  useEffect(() => {
    setIsExpanded(Boolean(searchRequestValue));
  }, [searchRequestValue]);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleLoadMoreData();
          }
        },
        { threshold: 1.0 }
      );

      const currentRef = observerRef.current;

      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, 3000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedTotalData = (result: ICreditRequestTotalsByStage) => {
    return result
      ? Object.entries(result).map(([key, value]) => ({
          id: key,
          name: totalsKeyBySection[key as keyof typeof totalsKeyBySection],
          counter: value,
        }))
      : [];
  };

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const result = await getCreditRequestTotalsByStage(
          businessUnitPublicCode
        );
        if (result) setTotalsData(normalizedTotalData(result));
      } catch (error) {
        addFlag({
          title: textFlagsUsers.titleError,
          description: JSON.stringify(error),
          appearance: "danger",
          duration: 5000,
        });

        console.error("Error fetching totals:", error);
      }
    };

    fetchTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode]);

  const counterTotalsData = (value: string) => {
    if (totalsData) {
      return totalsData.find((item) => item.name === value)?.counter;
    }
  };

  useEffect(() => {
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [listening]);

  return (
    <StyledContainerToCenter>
      <Stack
        direction="column"
        width={isMobile ? "-webkit-fill-available" : "min(100%,1500px)"}
      >
        {errorLoadingPins && showErrorAlert && (
          <StyledError $isMobile={isMobile}>
            <ErrorAlert
              message={voiceSearchConfig.errors.loadingPins}
              onClose={() => setShowErrorAlert(false)}
            />
          </StyledError>
        )}
        <StyledInputsContainer $isMobile={isMobile}>
          <Stack
            justifyContent="space-between"
            width={isMobile ? "100%" : "auto"}
            margin={isMobile ? "8px 0px" : "auto"}
          >
            {isMobile && (
              <>
                <StyledSearch
                  ref={stackRef}
                  $isMobile={isMobile}
                  $isExpanded={isExpanded}
                  onClick={() => {
                    if (!isExpanded) setIsExpanded(true);
                  }}
                >
                  <Stack width="100%" alignItems="center" gap="8px">
                    <Textfield
                      id="SearchCardsMobile"
                      name="SearchCardsMobile"
                      placeholder=""
                      size="compact"
                      iconAfter={<MdSearch />}
                      value={searchRequestValue}
                      onChange={handleSearchRequestsValue}
                      fullwidth
                    />
                    <Icon
                      icon={<MdOutlineFilterAlt />}
                      appearance="primary"
                      variant="outlined"
                      size="36px"
                      shape="rectangle"
                      cursorHover
                      spacing="wide"
                      onClick={openFilterModal}
                    />
                  </Stack>
                </StyledSearch>
              </>
            )}

            {isMobile && (
              <Stack alignItems="center">
                <Icon
                  icon={<MdOutlinePushPin />}
                  appearance="dark"
                  size="24px"
                />
                <Toggle
                  id="SeePinned"
                  name="SeePinned"
                  size="large"
                  checked={showPinnedOnly}
                  onChange={handleShowPinnedOnly}
                  disabled={errorLoadingPins}
                />
              </Stack>
            )}
          </Stack>
          {isMobile && <Divider />}
          <Stack
            width="100%"
            justifyContent={isMobile ? "end" : "space-between"}
            alignItems="center"
            margin={isMobile ? "16px 0px" : "auto"}
            gap="10px"
          >
            {isFilterModalOpen && (
              <FilterRequestModal
                assignmentOptions={selectCheckOptions}
                onSubmit={handleApplyFilters}
                selectedFilters={activeOptions}
                onCloseModal={closeFilterModal}
                onRemoveFilter={handleRemoveFilter}
                filterValues={filterValues}
              />
            )}
            {!isMobile && (
              <Stack width="280px" alignItems="center" gap="8px">
                <Textfield
                  id="SearchCardsDesktop"
                  name="SearchCardsDesktop"
                  placeholder="Palabra clave"
                  size="compact"
                  iconAfter={<MdSearch />}
                  value={searchRequestValue}
                  onChange={handleSearchRequestsValue}
                  fullwidth
                />
                <Icon
                  icon={<MdOutlineMicNone />}
                  size="26px"
                  appearance="primary"
                  cursorHover
                  onClick={() => {
                    setIsShowModal(true);
                  }}
                />
              </Stack>
            )}
            {!isMobile && (
              <StyledRequestsContainer $isMobile={isMobile}>
                <SelectedFilters
                  filters={activeOptions}
                  onRemove={handleRemoveFilter}
                />
                <Button
                  appearance="primary"
                  iconBefore={<MdOutlineFilterAltOff />}
                  type="button"
                  spacing="compact"
                  variant="outlined"
                  disabled={!activeOptions.length}
                  onClick={handleClearFilters}
                >
                  {voiceSearchConfig.buttons.remove}
                </Button>
                <Button
                  appearance="primary"
                  iconBefore={<MdOutlineFilterAlt />}
                  type="button"
                  spacing="compact"
                  variant="outlined"
                  onClick={openFilterModal}
                >
                  {voiceSearchConfig.buttons.filter}
                </Button>
              </StyledRequestsContainer>
            )}
            <Stack alignItems="center">
              <Stack gap="16px">
                {!isMobile && (
                  <Stack gap="8px">
                    <Icon
                      icon={<MdOutlinePushPin />}
                      appearance="dark"
                      size="24px"
                    />
                    <Text type="label">{seePinned.viewPinned}</Text>
                    <Toggle
                      id="SeePinned"
                      name="SeePinned"
                      size="large"
                      checked={showPinnedOnly}
                      onChange={handleShowPinnedOnly}
                      disabled={errorLoadingPins}
                    />
                  </Stack>
                )}
                {!isMobile && (
                  <Stack gap="8px">
                    <Icon
                      icon={<RxDragHandleVertical />}
                      appearance={
                        boardOrientation === "vertical" ? "dark" : "gray"
                      }
                      size="24px"
                      cursorHover
                      onClick={() => onOrientationChange("vertical")}
                    />
                    <Icon
                      icon={<RxDragHandleHorizontal />}
                      appearance={
                        boardOrientation === "horizontal" ? "dark" : "gray"
                      }
                      size="24px"
                      cursorHover
                      onClick={() => onOrientationChange("horizontal")}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </StyledInputsContainer>

        <StyledBoardContainer
          $orientation={boardOrientation}
          $isMobile={isMobile}
        >
          {boardColumns.map((column) => {
            const hasFilterForColumn = activeOptions.some(
              (filter) => filter.value === column.id
            );

            const dragIcon = hasFilterForColumn ? (
              <MdOutlineFilterAlt />
            ) : undefined;

            return (
              <BoardSection
                key={column.id}
                sectionTitle={column.value}
                sectionCounter={counterTotalsData(column.value) || 0}
                sectionBackground={column.sectionBackground}
                orientation={boardOrientation}
                sectionInformation={BoardRequests.filter(
                  (request) => request.stage === column.id
                )}
                pinnedRequests={pinnedRequests}
                errorLoadingPins={errorLoadingPins}
                searchRequestValue={searchRequestValue}
                handlePinRequest={handlePinRequest}
                handleLoadMoreData={handleLoadMoreData}
                dragIcon={dragIcon}
                onOrientationChange={onOrientationChange}
                shouldCollapseAll={shouldCollapseAll}
              />
            );
          })}
        </StyledBoardContainer>

        {isShowModal &&
          (browserSupportsSpeechRecognition ? (
            <BaseModal
              title={voiceSearchConfig.modal.title}
              width={voiceSearchConfig.modal.width}
              handleClose={handleCloseModal}
            >
              <Stack direction="column" gap="24px">
                <Text type="title" size="large">
                  {displayText}
                </Text>
                {!listening && transcript && (
                  <Stack justifyContent="center">
                    <Text type="body" size="large">
                      {transcript}
                    </Text>
                  </Stack>
                )}
                <Stack justifyContent="center">
                  <StyledMic>
                    <Icon
                      icon={listening ? <MdMic /> : <MdOutlineMicNone />}
                      size="58px"
                      appearance="primary"
                      shape="circle"
                      variant="filled"
                      spacing="compact"
                      cursorHover
                      onClick={handleMicClick}
                    />
                  </StyledMic>
                </Stack>
              </Stack>
            </BaseModal>
          ) : (
            <BaseModal
              title={voiceSearchConfig.errors.notSupported.title}
              width={voiceSearchConfig.modal.width}
              handleClose={handleCloseModal}
            >
              <Text>{voiceSearchConfig.errors.notSupported.message}</Text>
            </BaseModal>
          ))}
        {boardOrientation === "vertical" && <div ref={observerRef} />}
      </Stack>
    </StyledContainerToCenter>
  );
}

export { BoardLayoutUI };
