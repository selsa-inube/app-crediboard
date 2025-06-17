import { useContext, useEffect, useRef, useState } from "react";
import { MdOutlinePushPin, MdSearch } from "react-icons/md";
import { RxDragHandleVertical, RxDragHandleHorizontal } from "react-icons/rx";

import {
  Stack,
  Icon,
  Text,
  Divider,
  Textfield,
  Toggle,
  useFlag,
} from "@inubekit/inubekit";

import { SectionOrientation } from "@components/layout/BoardSection/types";
import { BoardSection } from "@components/layout/BoardSection";
import { ICreditRequestPinned, ICreditRequest } from "@services/types";
import { Selectcheck } from "@components/inputs/SelectCheck";
import { IOptionItemCheckedProps } from "@components/inputs/SelectCheck/OptionItem";
import { ErrorAlert } from "@components/ErrorAlert";

import {
  StyledInputsContainer,
  StyledBoardContainer,
  StyledContainerToCenter,
  StyledError,
  StyledSearch,
} from "./styles";
import { boardColumns, selectConfig, seePinned } from "./config/board";
import { getCreditRequestTotalsByStage } from "@services/credit-request/query/getCreditRequestTotalsByStage";
import { ICreditRequestTotalsByStage } from "@services/credit-request/query/getCreditRequestTotalsByStage/types";
import { AppContext } from "@context/AppContext";
import { textFlagsUsers } from "@config/pages/staffModal/addFlag";
import { totalsKeyBySection } from "@components/layout/BoardSection/config";

interface BoardLayoutProps {
  isMobile: boolean;
  selectOptions: IOptionItemCheckedProps[];
  boardOrientation: SectionOrientation;
  BoardRequests: ICreditRequest[];
  searchRequestValue: string;
  showPinnedOnly: boolean;
  pinnedRequests: ICreditRequestPinned[];
  errorLoadingPins: boolean;
  handleSelectCheckChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePinRequest: (
    requestId: string,
    userWhoPinnnedId: string,
    isPinned: string
  ) => void;
  handleShowPinnedOnly: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchRequestsValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrientationChange: (orientation: SectionOrientation) => void;
  handleLoadMoreData: () => void;
}

function BoardLayoutUI(props: BoardLayoutProps) {
  const {
    isMobile,
    selectOptions,
    boardOrientation,
    BoardRequests,
    searchRequestValue,
    showPinnedOnly,
    pinnedRequests,
    errorLoadingPins,
    handleLoadMoreData,
    handleSelectCheckChange,
    handlePinRequest,
    handleShowPinnedOnly,
    handleSearchRequestsValue,
    onOrientationChange,
  } = props;

  const selectProps = selectConfig(selectOptions, handleSelectCheckChange);
  const [showErrorAlert, setShowErrorAlert] = useState(true);
  const { businessUnitSigla } = useContext(AppContext);
  const [totalsData, setTotalsData] = useState<ICreditRequestTotalsByStage[]>();
  const { addFlag } = useFlag();
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const [isExpanded, setIsExpanded] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
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
      } catch (error: unknown) {
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

  return (
    <StyledContainerToCenter>
      <Stack
        direction="column"
        width={isMobile ? "-webkit-fill-available" : "min(100%,1500px)"}
      >
        {errorLoadingPins && showErrorAlert && (
          <StyledError $isMobile={isMobile}>
            <ErrorAlert
              message="Error: No se pudo cargar el estado de los anclados."
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
              <StyledSearch
                ref={stackRef}
                $isMobile={isMobile}
                $isExpanded={isExpanded}
                onClick={() => {
                  if (!isExpanded) setIsExpanded(true);
                }}
              >
                <Stack width="100%">
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
                </Stack>
              </StyledSearch>
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
            margin={isMobile ? "16px 0px" : "auto"}
          >
            <Stack width={isMobile ? "100%" : "400px"}>
              <Selectcheck size="compact" {...selectProps} />
            </Stack>
            {!isMobile && (
              <Stack width="400px" alignItems="end">
                <Textfield
                  id="SearchCardsDesktop"
                  name="SearchCardsDesktop"
                  placeholder="Buscar..."
                  size="compact"
                  iconAfter={<MdSearch />}
                  value={searchRequestValue}
                  onChange={handleSearchRequestsValue}
                  fullwidth
                />
              </Stack>
            )}
            <Stack alignItems="center" margin="25px 0px 0px">
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
          {boardColumns.map((column) => (
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
            />
          ))}
        </StyledBoardContainer>
        {boardOrientation === "vertical" && <div ref={observerRef} />}
      </Stack>
    </StyledContainerToCenter>
  );
}

export { BoardLayoutUI };
