import { useContext, useEffect, useRef, useState } from "react";
import {
  MdOutlineFilterAlt,
  MdOutlineFilterAltOff,
  MdOutlinePushPin,
  MdSearch,
} from "react-icons/md";
import { RxDragHandleVertical, RxDragHandleHorizontal } from "react-icons/rx";

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

import { IOptionItemCheckedProps } from "@components/inputs/SelectCheck/OptionItem";
import { Filter } from "@components/cards/SelectedFilters/interface";
import { SelectedFilters } from "@components/cards/SelectedFilters";
import { FilterRequestModal } from "@components/modals/FilterRequestModal";

import { AppContext } from "@context/AppContext";
import { textFlagsUsers } from "@config/pages/staffModal/addFlag";
import { totalsKeyBySection } from "@components/layout/BoardSection/config";
import { BaseModal } from "@components/modals/baseModal";
import { getCreditRequestTotalsByStage } from "@services/creditRequest/query/getCreditRequestTotalsByStage";
import { ICreditRequestTotalsByStage } from "@services/creditRequest/query/getCreditRequestTotalsByStage/types";
import {
  ICreditRequest,
  ICreditRequestPinned,
} from "@services/creditRequest/query/types";

import {
  StyledInputsContainer,
  StyledBoardContainer,
  StyledContainerToCenter,
  StyledSearch,
  StyledRequestsContainer,
  StyledRequestsContainerVoiceSearch,
} from "./styles";
import { selectCheckOptions } from "./config/select";
import { IFilterFormValues } from ".";
import {
  boardColumns,
  boardLayoutData,
  dataInformationSearchModal,
} from "./config/board";

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

  const [hasBeenFocused, setHasBeenFocused] = useState(false);

  const [isTextSearchModalOpen, setIsTextSearchModalOpen] = useState(false);
  const [totalsData, setTotalsData] = useState<ICreditRequestTotalsByStage[]>();
  const [lastFilterCount, setLastFilterCount] = useState(0);
  const [hasShownModalForCurrentFilters, setHasShownModalForCurrentFilters] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addFlag } = useFlag();
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const businessManagerCode = eventData.businessManager.abbreviatedName;
  const stackRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeOptions.length === 0) {
      setHasBeenFocused(false);
    }
  }, [activeOptions.length]);

  useEffect(() => {
    if (activeOptions.length > lastFilterCount) {
      setLastFilterCount(activeOptions.length);
      setHasShownModalForCurrentFilters(false);
    }
    if (activeOptions.length === 0) {
      setLastFilterCount(0);
      setHasShownModalForCurrentFilters(false);
    }
  }, [activeOptions.length, lastFilterCount]);

  const getWordsFromText = (text: string): string[] => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
  };

  const handleTextfieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isTextSearchModalOpen) {
      handleSearchRequestsValue(event);
    }
  };

  const handleTextfieldFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isTextSearchModalOpen) {
      return;
    }
    if (activeOptions.length === 0) {
      return;
    }
    if (!hasBeenFocused) {
      setIsTextSearchModalOpen(true);
      setHasBeenFocused(true);
      setHasShownModalForCurrentFilters(true);
    } else {
      const currentValue = event.target.value.trim();
      if (currentValue) {
        const words = getWordsFromText(currentValue);

        if (words.length > 1) {
          setIsTextSearchModalOpen(true);
          setHasShownModalForCurrentFilters(true);
        }
      } else if (!hasShownModalForCurrentFilters) {
        setIsTextSearchModalOpen(true);
        setHasShownModalForCurrentFilters(true);
      }
    }
  };

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
          businessUnitPublicCode,
          businessManagerCode
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

  const handleTextSearchModalBack = () => {
    handleClearFilters();
    setIsTextSearchModalOpen(false);
    setHasBeenFocused(false);
    const input = document.getElementById(
      "SearchCardsDesktop"
    ) as HTMLInputElement | null;
    input?.focus();
  };

  useState(false);
  const [hasAnsweredModal, setHasAnsweredModal] = useState(false);

  const handleTextSearchModalNext = () => {
    setIsTextSearchModalOpen(false);
    setHasAnsweredModal(true);

    const input = document.getElementById(
      "SearchCardsDesktop"
    ) as HTMLInputElement | null;
    input?.focus();
  };

  const handleTextSearchModalClose = () => {
    setIsTextSearchModalOpen(false);
    setHasBeenFocused(false);
  };
  const handleTextfieldBlur = () => {
    if (hasAnsweredModal) {
      setHasBeenFocused(false);
      setHasShownModalForCurrentFilters(false);
    }
  };
  return (
    <StyledContainerToCenter>
      <Stack
        direction="column"
        width={isMobile ? "-webkit-fill-available" : "min(100%,1500px)"}
      >
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
                    if (!isExpanded && !isTextSearchModalOpen)
                      setIsExpanded(true);
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
                      onChange={handleTextfieldChange}
                      disabled={isTextSearchModalOpen}
                      fullwidth
                      onFocus={handleTextfieldFocus}
                      focused={false}
                    />
                    {!isExpanded && (
                      <>
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
                      </>
                    )}
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
              <StyledRequestsContainerVoiceSearch $isMobile={isMobile}>
                <Textfield
                  id="SearchCardsDesktop"
                  name="SearchCardsDesktop"
                  placeholder="Palabra clave"
                  size="compact"
                  iconAfter={<MdSearch />}
                  value={searchRequestValue}
                  onChange={handleTextfieldChange}
                  disabled={isTextSearchModalOpen}
                  fullwidth
                  onFocus={handleTextfieldFocus}
                  onBlur={handleTextfieldBlur}
                />
              </StyledRequestsContainerVoiceSearch>
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
                  {boardLayoutData.remove}
                </Button>
                <Button
                  appearance="primary"
                  iconBefore={<MdOutlineFilterAlt />}
                  type="button"
                  spacing="compact"
                  variant="outlined"
                  onClick={openFilterModal}
                >
                  {boardLayoutData.filter}
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
        {isTextSearchModalOpen && (
          <BaseModal
            title={dataInformationSearchModal.titleModal}
            width="400px"
            nextButton={dataInformationSearchModal.succesModal}
            backButton={dataInformationSearchModal.buttonModal}
            handleBack={handleTextSearchModalBack}
            handleNext={handleTextSearchModalNext}
            handleClose={handleTextSearchModalClose}
          >
            <Text>{dataInformationSearchModal.descriptionModal}</Text>
          </BaseModal>
        )}
        {boardOrientation === "vertical" && <div ref={observerRef} />}
      </Stack>
    </StyledContainerToCenter>
  );
}

export { BoardLayoutUI };
