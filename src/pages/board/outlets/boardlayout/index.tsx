import { useCallback, useContext, useEffect, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Stack, Icon, Text, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";

import { ICreditRequest } from "@services/creditRequest/query/types";
import { getCreditRequestPinned } from "@services/creditRequest/query/isPinned";
import { getCreditRequestInProgress } from "@services/creditRequest/query/getCreditRequestInProgress";
import { patchChangeAnchorToCreditRequest } from "@services/creditRequest/command/anchorCreditRequest";
import { AppContext } from "@context/AppContext";
import { Filter } from "@components/cards/SelectedFilters/interface";
import { ruleConfig } from "@utils/configRules/configRules";
import { evaluateRule } from "@utils/configRules/evaluateRules";
import { postBusinessUnitRules } from "@services/businessUnitRules/EvaluteRuleByBusinessUnit";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ErrorPage } from "@components/layout/ErrorPage";

import { dataInformationModal, getBoardColumns } from "./config/board";
import { BoardLayoutUI } from "./interface";
import { selectCheckOptions } from "./config/select";
import { IBoardData } from "./types";
import { errorMessages } from "./config";

export interface IFilterFormValues {
  assignment: string;
  status?: string;
}

function BoardLayout() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { businessUnitSigla, eventData, setEventData } = useContext(AppContext);
  const [boardData, setBoardData] = useState<IBoardData>({
    boardRequests: [],
    requestsPinned: [],
  });
  const [activeOptions, setActiveOptions] = useState<Filter[]>([]);
  const [filters, setFilters] = useState({
    searchRequestValue: "",
    showPinnedOnly: eventData.user.preferences.showPinnedOnly || false,
    selectOptions: selectCheckOptions,
    boardOrientation: eventData.user.preferences.boardOrientation || "vertical",
  });

  const [errorLoadingPins, setErrorLoadingPins] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const [hasServerError, setHasServerError] = useState(false);

  const isMobile = useMediaQuery("(max-width: 1439px)");

  const missionName = eventData.user.staff.missionName;
  const staffId = eventData.user.staff.staffId;

  useEffect(() => {
    const orientation = isMobile ? "horizontal" : "vertical";
    setFilters((prevFilters) => ({
      ...prevFilters,
      boardOrientation: orientation,
    }));
  }, [isMobile]);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;
  const [valueRule, setValueRule] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState<IFilterFormValues>({
    assignment: "",
    status: "",
  });

  const boardColumns = getBoardColumns(activeOptions, filters.boardOrientation);

  const fetchBoardData = async (
    businessUnitPublicCode: string,
    businessManagerCode: string,
    page: number,
    searchParam?: { filter?: string; text?: string },
    append: boolean = false
  ) => {
    try {
      const [boardRequestsResult, requestsPinnedResult] =
        await Promise.allSettled([
          getCreditRequestInProgress(
            businessUnitPublicCode,
            businessManagerCode,
            page,
            userAccount,
            searchParam
          ),
          page === 1
            ? getCreditRequestPinned(
                businessUnitPublicCode,
                businessManagerCode
              )
            : Promise.resolve([]),
        ]);
      if (
        boardRequestsResult.status === "rejected" &&
        (page === 1 ? requestsPinnedResult.status === "rejected" : true)
      ) {
        console.error("Error crítico: servicios principales fallaron");
        setHasServerError(true);
        return;
      }

      if (boardRequestsResult.status === "fulfilled") {
        setBoardData((prevState) => ({
          ...prevState,
          boardRequests: append
            ? [...prevState.boardRequests, ...boardRequestsResult.value]
            : boardRequestsResult.value,
        }));
      } else if (boardRequestsResult.status === "rejected") {
        console.error(
          "Error al obtener solicitudes:",
          boardRequestsResult.reason
        );
        setHasServerError(true);
        return;
      }

      if (requestsPinnedResult.status === "fulfilled" && page === 1) {
        setBoardData((prevState) => ({
          ...prevState,
          requestsPinned: requestsPinnedResult.value,
        }));
      } else if (requestsPinnedResult.status === "rejected" && page === 1) {
        console.error(
          "Error al obtener anclados:",
          requestsPinnedResult.reason
        );
        setErrorLoadingPins(true);
      }
    } catch (error) {
      console.error("Error fetching board data:", error);
      setHasServerError(true);
    }
  };

  useEffect(() => {
    if (activeOptions.length > 0 || filters.searchRequestValue.length >= 1)
      return;

    fetchBoardData(businessUnitPublicCode, businessManagerCode, 1);
    setCurrentPage(1);

    fetchValidationRulesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode]);

  const handleLoadMoreData = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    let searchParam;

    if (activeOptions.length > 0) {
      searchParam = {
        filter: activeOptions.map((filter) => filter.value).join("&"),
      };
    } else if (filters.searchRequestValue.trim().length >= 3) {
      searchParam = { text: filters.searchRequestValue.trim() };
    } else {
      searchParam = undefined;
    }

    fetchBoardData(
      businessUnitPublicCode,
      businessManagerCode,
      nextPage,
      searchParam,
      true
    );
  };

  const [shouldCollapseAll, setShouldCollapseAll] = useState(false);

  const handleApplyFilters = async (values: IFilterFormValues) => {
    setFilterValues(values);
    setFilters((prev) => ({
      ...prev,
      searchRequestValue: "",
      showPinnedOnly: false,
      selectOptions: selectCheckOptions,
    }));
    const assignmentIds = values.assignment.split(",");
    const activeFilteredValues: Filter[] = selectCheckOptions
      .filter((option) => assignmentIds.includes(option.id))
      .map((option, index) => ({
        id: option.id,
        label: option.label,
        value: option.value + "=Y",
        type: "assignment",
        count: index + 1,
      }));

    const queryFilterString = activeFilteredValues
      .map((filter) => `${filter.value}`)
      .join("&");

    setActiveOptions(activeFilteredValues);
    setCurrentPage(1);

    const hasCompletedFilter = activeFilteredValues.some(
      (filter) => filter.value === "completedLessThan30DaysAgo=Y"
    );

    if (hasCompletedFilter) {
      setFilters((prev) => ({
        ...prev,
        boardOrientation: "horizontal",
      }));

      const updatedEventData = { ...eventData };
      updatedEventData.user.preferences = {
        ...updatedEventData.user.preferences,
        boardOrientation: "horizontal",
      };
      setEventData(updatedEventData);
    }

    await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1, {
      filter: `${queryFilterString}`,
    });

    setIsFilterModalOpen(false);
    setShouldCollapseAll(true);
    setTimeout(() => setShouldCollapseAll(false), 100);

    if (hasCompletedFilter) {
      setTimeout(() => {
        const tramitadaSection = document.getElementById("TRAMITADA");
        if (tramitadaSection) {
          tramitadaSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 100);
    }
  };

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));

    if (newFilters.boardOrientation !== undefined) {
      const updatedEventData = { ...eventData };
      updatedEventData.user.preferences = {
        ...updatedEventData.user.preferences,
        boardOrientation: newFilters.boardOrientation,
      };

      setEventData(updatedEventData);

      if (newFilters.boardOrientation === "vertical") {
        const hasCompletedFilter = activeOptions.some(
          (filter) => filter.value === "completedLessThan30DaysAgo=Y"
        );

        if (hasCompletedFilter) {
          const updatedActiveOptions = activeOptions.filter(
            (option) => option.value !== "completedLessThan30DaysAgo=Y"
          );

          setActiveOptions(updatedActiveOptions);
          setCurrentPage(1);
          setFilterValues((prev) => {
            const newValues = { ...prev };
            if (newValues.assignment) {
              const assignmentIds = newValues.assignment
                .split(",")
                .filter((id) => id.trim() !== "");
              const updatedAssignmentIds = assignmentIds.filter((id) => {
                const option = selectCheckOptions.find((opt) => opt.id === id);
                return option?.value !== "completedLessThan30DaysAgo";
              });
              newValues.assignment = updatedAssignmentIds.join(",");
            }
            return newValues;
          });
          if (updatedActiveOptions.length === 0) {
            fetchBoardData(businessUnitPublicCode, businessManagerCode, 1);
          } else {
            const updatedFilterString = updatedActiveOptions
              .map((filter) => filter.value)
              .join("&")
              .trim();
            fetchBoardData(businessUnitPublicCode, businessManagerCode, 1, {
              filter: updatedFilterString,
            });
          }
        }
      }
    }

    if (newFilters.showPinnedOnly !== undefined) {
      const updatedEventData = { ...eventData };

      updatedEventData.user.preferences = {
        ...updatedEventData.user.preferences,
        showPinnedOnly: newFilters.showPinnedOnly,
      };

      setEventData(updatedEventData);
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
            const current = prev[ruleName] || [];
            const merged = [...current, ...extractedValues];
            const unique = Array.from(new Set(merged));
            return { ...prev, [ruleName]: unique };
          });
        } catch (error: unknown) {
          console.error(`Error evaluando ${ruleName} para este usuario.`);
        }
      })
    );
  }, [businessUnitPublicCode, businessManagerCode]);

  const handlePinRequest = async (
    creditRequestId: string | undefined,
    userWhoPinnnedId: string,
    isPinned: string
  ) => {
    try {
      const isOwner = userWhoPinnnedId === staffId;
      const isUnpin = isPinned === "N";
      const isAuthorizedByRule =
        valueRule["PositionsAuthorizedToRemoveAnchorsPlacedByOther"]?.includes(
          missionName
        );

      if (isOwner || (isUnpin && isAuthorizedByRule) || isPinned === "Y") {
        setBoardData((prevState) => ({
          ...prevState,
          requestsPinned: prevState.requestsPinned.map((card) =>
            card.creditRequestId === creditRequestId
              ? { ...card, isPinned }
              : card
          ),
        }));

        await patchChangeAnchorToCreditRequest(
          businessUnitPublicCode,
          businessManagerCode,
          eventData.user.identificationDocumentNumber || "",
          creditRequestId,
          isPinned
        );
        await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1);
        setCurrentPage(1);
      } else {
        setIsOpenModal(true);
        return;
      }
    } catch (error) {
      setErrorModal(true);
    }
  };

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
    setIsMenuOpen(false);
  }, []);

  const handleClearFilters = async (keepSearchValue = false) => {
    const hasCompletedFilter = activeOptions.some(
      (filter) => filter.value === "completedLessThan30DaysAgo=Y"
    );

    setFilterValues({ assignment: "", status: "" });
    setActiveOptions([]);
    setCurrentPage(1);

    setFilters((prev) => ({
      ...prev,
      searchRequestValue: keepSearchValue ? prev.searchRequestValue : "",
      showPinnedOnly: false,
      selectOptions: selectCheckOptions,
      boardOrientation: hasCompletedFilter ? "vertical" : prev.boardOrientation,
    }));

    if (hasCompletedFilter) {
      const updatedEventData = { ...eventData };
      updatedEventData.user.preferences = {
        ...updatedEventData.user.preferences,
        boardOrientation: "vertical",
      };
      setEventData(updatedEventData);
    }

    if (keepSearchValue && filters.searchRequestValue.trim().length >= 3) {
      await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1, {
        text: filters.searchRequestValue.trim(),
      });
    } else {
      await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1);
    }
  };

  const handleRemoveFilter = async (filterIdToRemove: string) => {
    const updatedActiveOptions = activeOptions.filter(
      (option) => option.id !== filterIdToRemove
    );

    setActiveOptions(updatedActiveOptions);
    setCurrentPage(1);

    const removedFilter = activeOptions.find(
      (option) => option.id === filterIdToRemove
    );
    const isRemovingCompletedFilter =
      removedFilter?.value === "completedLessThan30DaysAgo=Y";
    if (isRemovingCompletedFilter) {
      setFilters((prev) => ({
        ...prev,
        boardOrientation: "vertical",
      }));

      const updatedEventData = { ...eventData };
      updatedEventData.user.preferences = {
        ...updatedEventData.user.preferences,
        boardOrientation: "vertical",
      };
      setEventData(updatedEventData);
    }

    setFilterValues((prev) => {
      const newValues = { ...prev };
      if (newValues.assignment) {
        const assignmentIds = newValues.assignment
          .split(",")
          .filter((id) => id.trim() !== "");
        const updatedAssignmentIds = assignmentIds.filter(
          (id) => id !== filterIdToRemove
        );
        newValues.assignment = updatedAssignmentIds.join(",");
      }
      if (newValues.status) {
        const statusIds = newValues.status
          .split(",")
          .filter((id) => id.trim() !== "");
        const updatedStatusIds = statusIds.filter(
          (id) => id !== filterIdToRemove
        );
        newValues.status = updatedStatusIds.join(",");
      }

      return newValues;
    });

    if (updatedActiveOptions.length === 0) {
      setFilters((prev) => ({
        ...prev,
        selectOptions: selectCheckOptions,
      }));

      await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1);
      return;
    }

    const updatedFilterString = updatedActiveOptions
      .map((filter) => filter.value)
      .join("&")
      .trim();
    await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1, {
      filter: updatedFilterString,
    });
  };

  const handleSearchRequestsValue = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    handleFiltersChange({ searchRequestValue: value });
    const trimmedValue = value.trim();
    setCurrentPage(1);
    if (trimmedValue.length >= 1) {
      if (activeOptions.length > 0) {
        const currentFilters = activeOptions
          .map((filter) => filter.value)
          .join("&");
        const searchResults = await getCreditRequestInProgress(
          businessUnitPublicCode,
          businessManagerCode,
          1,
          userAccount,
          { text: trimmedValue }
        );
        const filteredResults = await getCreditRequestInProgress(
          businessUnitPublicCode,
          businessManagerCode,
          1,
          userAccount,
          { filter: currentFilters }
        );
        const intersection = searchResults.filter((searchItem) =>
          filteredResults.some(
            (filterItem) =>
              filterItem.creditRequestId === searchItem.creditRequestId
          )
        );

        setBoardData((prev) => ({
          ...prev,
          boardRequests: intersection,
        }));
      } else {
        fetchBoardData(businessUnitPublicCode, businessManagerCode, 1, {
          text: trimmedValue,
        });
      }
    } else {
      if (activeOptions.length > 0) {
        const currentFilters = activeOptions
          .map((filter) => filter.value)
          .join("&");

        await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1, {
          filter: currentFilters,
        });
      } else {
        await fetchBoardData(businessUnitPublicCode, businessManagerCode, 1);
      }
    }
  };

  const closeFilterModal = useCallback(() => setIsFilterModalOpen(false), []);

  function getFilteredRequests({
    boardRequests,
    requestsPinned,
    showPinnedOnly,
  }: {
    boardRequests: ICreditRequest[];
    requestsPinned: { creditRequestId: string; isPinned: string }[];
    showPinnedOnly: boolean;
  }) {
    if (!showPinnedOnly) return boardRequests;

    const pinnedIds = requestsPinned
      .filter((r) => r.isPinned === "Y")
      .map((r) => r.creditRequestId);

    return boardRequests.filter((request) =>
      pinnedIds.includes(request.creditRequestId as string)
    );
  }

  const handleRetryFromError = () => {
    setHasServerError(false);
    setCurrentPage(1);
    fetchBoardData(businessUnitPublicCode, businessManagerCode, 1);
  };

  if (hasServerError) {
    return (
      <ErrorPage
        errorCode={500}
        nameButton="Reintentar"
        onClick={handleRetryFromError}
      />
    );
  }

  return (
    <>
      <BoardLayoutUI
        isMobile={isMobile}
        openFilterModal={openFilterModal}
        boardOrientation={filters.boardOrientation}
        BoardRequests={getFilteredRequests({
          boardRequests: boardData.boardRequests,
          requestsPinned: boardData.requestsPinned,
          showPinnedOnly: filters.showPinnedOnly,
        })}
        searchRequestValue={filters.searchRequestValue}
        showPinnedOnly={filters.showPinnedOnly}
        pinnedRequests={boardData.requestsPinned}
        errorLoadingPins={errorLoadingPins}
        handleLoadMoreData={handleLoadMoreData}
        activeOptions={activeOptions}
        handlePinRequest={handlePinRequest}
        handleShowPinnedOnly={(e) =>
          handleFiltersChange({ showPinnedOnly: e.target.checked })
        }
        handleSearchRequestsValue={handleSearchRequestsValue}
        onOrientationChange={(orientation) =>
          handleFiltersChange({ boardOrientation: orientation })
        }
        isFilterModalOpen={isFilterModalOpen}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
        handleRemoveFilter={handleRemoveFilter}
        isMenuOpen={isMenuOpen}
        selectOptions={[]}
        handleSelectCheckChange={() => {}}
        closeFilterModal={closeFilterModal}
        filterValues={filterValues}
        shouldCollapseAll={shouldCollapseAll}
        boardColumns={boardColumns}
      />
      {isOpenModal && (
        <BaseModal
          title={dataInformationModal.tilte}
          nextButton={dataInformationModal.button}
          handleNext={() => setIsOpenModal(false)}
          handleClose={() => setIsOpenModal(false)}
          width={isMobile ? "290px" : "403px"}
        >
          <Stack direction="column" alignItems="center" gap="16px">
            <Icon icon={<MdInfoOutline />} size="68px" appearance="primary" />
            <Text type="body" size="medium" appearance="gray">
              {dataInformationModal.description}
            </Text>
          </Stack>
        </BaseModal>
      )}
      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessages.changeAnchorToCreditRequest.description}
          handleClose={() => {
            setErrorModal(false);
          }}
        />
      )}
    </>
  );
}

export { BoardLayout };
