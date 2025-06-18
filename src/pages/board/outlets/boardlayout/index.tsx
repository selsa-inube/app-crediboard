import { useCallback, useContext, useEffect, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { Stack, Icon, Text, useMediaQuery, useFlag } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { ICreditRequest } from "@services/types";
import { getCreditRequestPinned } from "@services/credit-request/query/isPinned";
import { getCreditRequestInProgress } from "@services/credit-request/query/getCreditRequestInProgress";
import { patchChangeAnchorToCreditRequest } from "@services/credit-request/command/anchorCreditRequest";
import { AppContext } from "@context/AppContext";
import { mockErrorBoard } from "@mocks/error-board/errorborad.mock";
import { ruleConfig } from "@utils/configRules/configRules";
import { evaluateRule } from "@utils/configRules/evaluateRules";
import { postBusinessUnitRules } from "@services/businessUnitRules";

import { dataInformationModal } from "./config/board";
import { BoardLayoutUI } from "./interface";
import { selectCheckOptions } from "./config/select";
import { IBoardData } from "./types";

function BoardLayout() {
  const { businessUnitSigla, eventData, setEventData } = useContext(AppContext);
  const [boardData, setBoardData] = useState<IBoardData>({
    boardRequests: [],
    requestsPinned: [],
  });

  const [filters, setFilters] = useState({
    searchRequestValue: "",
    showPinnedOnly: eventData.user.preferences.showPinnedOnly || false,
    selectOptions: selectCheckOptions,
    boardOrientation: eventData.user.preferences.boardOrientation || "vertical",
  });

  const [filteredRequests, setFilteredRequests] = useState<ICreditRequest[]>(
    []
  );
  const [errorLoadingPins, setErrorLoadingPins] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");

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

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  const errorData = mockErrorBoard[0];

  const [valueRule, setValueRule] = useState<Record<string, string[]>>({});
  const [recordsToFetch, setRecordsToFetch] = useState(79);

  const fetchBoardData = async (
    businessUnitPublicCode: string,
    limit: number
  ) => {
    try {
      const [boardRequestsResult, requestsPinnedResult] =
        await Promise.allSettled([
          getCreditRequestInProgress(businessUnitPublicCode, limit),
          getCreditRequestPinned(businessUnitPublicCode),
        ]);

      if (boardRequestsResult.status === "fulfilled") {
        setBoardData((prevState) => ({
          ...prevState,
          boardRequests: boardRequestsResult.value,
        }));
        setFilteredRequests(boardRequestsResult.value);
      }

      if (requestsPinnedResult.status === "fulfilled") {
        setBoardData((prevState) => ({
          ...prevState,
          requestsPinned: requestsPinnedResult.value,
        }));
      } else {
        handleFlag(errorData.Summary[0], errorData.Summary[1]);
      }
    } catch (error) {
      console.error("Error fetching board data:", error);
      setErrorLoadingPins(true);
    }
  };

  useEffect(() => {
    fetchBoardData(businessUnitPublicCode, recordsToFetch);
    fetchValidationRulesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, recordsToFetch]);

  const handleLoadMoreData = () => {
    setRecordsToFetch((prev) => prev + 50);
  };

  useEffect(() => {
    const filteredRequests = boardData.boardRequests.filter((request) => {
      const isSearchMatch =
        request.clientName
          .toLowerCase()
          .includes(filters.searchRequestValue.toLowerCase()) ||
        request.creditRequestCode
          .toString()
          .includes(filters.searchRequestValue);
      request.creditRequestCode.toString().includes(filters.searchRequestValue);

      const isPinned =
        !filters.showPinnedOnly ||
        boardData.requestsPinned
          .filter((req) => req.isPinned === "Y")
          .map((req) => req.creditRequestId)
          .includes(request.creditRequestId as string);

      return isSearchMatch && isPinned;
    });

    const activeFilterIds = filters.selectOptions
      .filter((option) => option.checked)
      .map((option) => option.id);

    const finalFilteredRequests = filteredRequests.filter((request) => {
      if (activeFilterIds.length === 0) return true;

      return activeFilterIds.some((filterId) => {
        switch (filterId) {
          case "1":
            return request.userWhoPinnnedId === staffId;
          case "2":
            return [
              "GESTION_COMERCIAL",
              "VERIFICACION_APROBACION",
              "FORMALIZACION_GARANTIAS",
              "TRAMITE_DESEMBOLSO",
            ].includes(request.stage);
          case "3":
            return request.stage === "GESTION_COMERCIAL";
          case "4":
            return request.stage === "VERIFICACION_APROBACION";
          case "5":
            return request.stage === "FORMALIZACION_GARANTIAS";
          case "6":
            return request.stage === "TRAMITE_DESEMBOLSO";
          case "7":
            return request.stage === "CUMPLIMIENTO_REQUISITOS";
          case "9":
            return request.stage === "GESTION_COMERCIAL";
          case "10":
            return request.unreadNovelties === "Y";
          default:
            return false;
        }
      });
    });
    setFilteredRequests(finalFilteredRequests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, boardData]);

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

  const { addFlag } = useFlag();

  const handleFlag = useCallback(
    (title: string, description: string) => {
      addFlag({
        title: title,
        description: description,
        appearance: "danger",
        duration: 5000,
      });
    },
    [addFlag]
  );

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
            businessUnitPublicCode
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
  }, [businessUnitPublicCode]);

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
          userAccount,
          creditRequestId,
          isPinned
        );
        await fetchBoardData(businessUnitPublicCode, recordsToFetch);
      } else {
        setIsOpenModal(true);
        return;
      }
    } catch (error) {
      handleFlag(errorData.anchor[0], errorData.anchor[1]);
    }
  };

  return (
    <>
      <BoardLayoutUI
        isMobile={isMobile}
        selectOptions={filters.selectOptions}
        boardOrientation={filters.boardOrientation}
        BoardRequests={filteredRequests}
        searchRequestValue={filters.searchRequestValue}
        showPinnedOnly={filters.showPinnedOnly}
        pinnedRequests={boardData.requestsPinned}
        errorLoadingPins={errorLoadingPins}
        handleLoadMoreData={handleLoadMoreData}
        handleSelectCheckChange={(e) =>
          handleFiltersChange({
            selectOptions: filters.selectOptions.map((option) =>
              option.id === e.target.name
                ? { ...option, checked: e.target.checked }
                : option
            ),
          })
        }
        handlePinRequest={handlePinRequest}
        handleShowPinnedOnly={(e) =>
          handleFiltersChange({ showPinnedOnly: e.target.checked })
        }
        handleSearchRequestsValue={(e) =>
          handleFiltersChange({ searchRequestValue: e.target.value })
        }
        onOrientationChange={(orientation) =>
          handleFiltersChange({ boardOrientation: orientation })
        }
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
    </>
  );
}

export { BoardLayout };
