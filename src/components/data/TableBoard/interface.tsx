import { useState } from "react";
import { MdOutlineInfo, MdWarningAmber } from "react-icons/md";
import { LuUserRoundCheck } from "react-icons/lu";
import {
  Icon,
  Text,
  SkeletonLine,
  Stack,
  useMediaQuery,
} from "@inubekit/inubekit";

import { InfoModal } from "@components/modals/InfoModal";

import { ITableBoardProps } from ".";
import { IAction, IEntries, ITitle, appearances } from "./types";
import {
  StyledContainer,
  StyledTable,
  StyledTbody,
  StyledThead,
  StyledTr,
  StyledTh,
  StyledTd,
  StyledThactions,
  StyledTdactions,
  StyledDivactions,
} from "./styles";

interface ITableBoardUIProps extends ITableBoardProps {
  loading: boolean;
  isTablet: boolean;
  hideTagOnTablet?: boolean;
  hideSecondColumnOnTablet?: boolean;
  hideSecondColumnOnMobile?: boolean; 
  showUserIconOnTablet?: boolean; 
}

interface IRenderActionsTitles {
  actions: IAction[];
  isTablet: boolean;
  appearance: appearances;
  isStyleMobile: boolean;
  onInfoClick: () => void;
  isFirstTable: boolean;
}

const RenderActionsTitles = (props: IRenderActionsTitles) => {
  const {
    actions,
    appearance,
    isTablet,
    isStyleMobile,
    onInfoClick,
    isFirstTable,
  } = props;

  return (
    <>
      {!isTablet
        ? actions.map((actionTitle) => (
            <StyledThactions key={actionTitle.id}>
              <Text
                appearance={appearance}
                type="title"
                size="medium"
                padding="0px 4px"
                textAlign="center"
              >
                {actionTitle.actionName}
              </Text>
            </StyledThactions>
          ))
        : isFirstTable && (
            <StyledThactions $isTablet={isTablet} colSpan={3} $isFirst>
              {isStyleMobile && (
                <Stack margin="0 10px 0 0" justifyContent="end">
                  <Icon
                    icon={<MdOutlineInfo />}
                    appearance="primary"
                    size="20px"
                    onClick={onInfoClick}
                  />
                </Stack>
              )}
            </StyledThactions>
          )}
    </>
  );
};

const actionsLoading = (numberActions: number) => {
  const cellsOfActionsLoading = [];
  for (let cellAction = 0; cellAction < numberActions; cellAction++) {
    cellsOfActionsLoading.push(
      <StyledTd key={cellAction}>
        <SkeletonLine animated />
      </StyledTd>
    );
  }
  return cellsOfActionsLoading;
};

const dataLoading = (filteredTitles: ITitle[], numberActions: number) => {
  const rowsLoading = [];
  for (let rows = 0; rows < 3; rows++) {
    rowsLoading.push(
      <StyledTr key={rows}>
        {filteredTitles.map((title) => (
          <StyledTd key={`e-${title.id}`}>
            <SkeletonLine animated />
          </StyledTd>
        ))}
        {actionsLoading(numberActions)}
      </StyledTr>
    );
  }
  return rowsLoading;
};

const ActionsIcon = (props: IActionsComponent) => {
  const { actionMobile, entry, isTablet } = props;

  return (
    <>
      {isTablet &&
        actionMobile?.map((action, index) => (
          <StyledDivactions
            key={action.id}
            $isTablet={isTablet}
            $isFirst={index === 0}
          >
            {action.content(entry)}
          </StyledDivactions>
        ))}
    </>
  );
};

interface IActionsComponent {
  actions: IAction[];
  isTablet: boolean;
  entry: IEntries;
  actionMobile?: IAction[];
}

const Actions = (props: IActionsComponent) => {
  const { actions, isTablet, entry, actionMobile } = props;

  return (
    <>
      {!isTablet &&
        actions.map((action) => (
          <StyledTdactions key={action.id}>
            {action.content(entry)}
          </StyledTdactions>
        ))}
      {isTablet &&
        actionMobile &&
        actionMobile.map((action, index) => (
          <StyledTdactions
            key={action.id}
            $isTablet={isTablet}
            $isFirst={index === 0}
          >
            {action.content(entry)}
          </StyledTdactions>
        ))}
    </>
  );
};

const isPendingStatus = (entry: IEntries): boolean => {
  const tag = entry.tag;
  if (typeof tag === "object" && tag !== null && "props" in tag) {
    return (tag as JSX.Element).props?.label === "Pendiente";
  }
  return false;
};

export const TableBoardUI = (props: ITableBoardUIProps) => {
  const {
    id,
    entries,
    actions,
    titles,
    borderTable,
    loading,
    appearanceTable,
    isTablet,
    actionMobileIcon,
    actionMobile,
    isFirstTable,
    infoItems,
    hideTagOnTablet = true,
    hideSecondColumnOnTablet = false,
    hideSecondColumnOnMobile = true, 
    showUserIconOnTablet = true,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 560px)");

  const getFilteredTitles = () => {
    return titles.filter(
      (title) => !(isTablet && hideTagOnTablet && title.id === "tag")
    );
  };


  const getFilteredTitlesForHeader = () => {
    const filtered = getFilteredTitles();
    if (isTablet && hideSecondColumnOnTablet) {
      return filtered.filter((_, index) => index !== 1);
    }
    return filtered;
  };

  const filteredTitles = getFilteredTitles();
  const filteredTitlesForHeader = getFilteredTitlesForHeader();

  return (
    <StyledContainer
      id={id}
      $borderTable={borderTable!}
      $isTablet={isTablet}
      $actionsMobile={Boolean(actionMobile)}
    >
      <StyledTable
        $zebraEffect={appearanceTable!.efectzebra!}
        $background={appearanceTable!.background!}
        $isTablet={isTablet}
      >
        <StyledThead>
          <tr>
            {filteredTitlesForHeader.map((title) => (
              <StyledTh key={title.id + id}>
                <Text
                  appearance={appearanceTable!.title}
                  type="title"
                  size="medium"
                  padding="0px 4px"
                >
                  {title.titleName}
                </Text>
              </StyledTh>
            ))}

            {actions && actionMobile && (
              <RenderActionsTitles
                actions={actions}
                appearance={appearanceTable!.title!}
                isTablet={isTablet}
                isStyleMobile={appearanceTable!.isStyleMobile!}
                onInfoClick={() => setIsModalOpen(true)}
                isFirstTable={isFirstTable ?? false}
              />
            )}
          </tr>
        </StyledThead>
        <StyledTbody>
          {loading ? (
            dataLoading(filteredTitles, actions?.length || 0)
          ) : (
            <>
              {entries.map((entry, index) => (
                <StyledTr
                  key={`${entry.id}-${index}`}
                  $borderTable={appearanceTable!.borderTable}
                >
                  {filteredTitles.map((title, titleIndex) => (
                    <StyledTd
                      key={title.id}
                      $widthTd={appearanceTable?.widthTd}
                    >
                      <Stack gap="6px">
                        {actionMobileIcon && titleIndex === 0 && (
                          <ActionsIcon
                            actionMobile={actionMobileIcon}
                            entry={entry}
                            isTablet={isTablet}
                            actions={[]}
                          />
                        )}
                        <Stack justifyContent="space-between" width="100%">
                          {/* AQUÍ SE USA LA NUEVA PROP hideSecondColumnOnMobile */}
                          {!(
                            isMobile &&
                            hideSecondColumnOnMobile &&
                            titleIndex === 1
                          ) && (
                            <Stack
                              direction="row"
                              gap={isMobile ? "0px" : "8px"}
                              alignItems="center"
                              justifyContent={
                                isMobile ? "space-between" : "flex-start"
                              }
                              width="100%"
                            >
                              {typeof entry[title.id] !== "string" ? (
                                entry[title.id]
                              ) : (
                                <Text
                                  size="medium"
                                  padding={isTablet ? "0px" : "0px 4px"}
                                >
                                  {entry[title.id]}
                                </Text>
                              )}

                              {titleIndex === 0 &&
                                isTablet &&
                                isPendingStatus(entry) && (
                                  <Icon
                                    appearance="warning"
                                    size="20px"
                                    icon={<MdWarningAmber />}
                                  />
                                )}
                            </Stack>
                          )}
                          <Stack padding="0px 14px">
                            {titleIndex === 1 &&
                              isTablet &&
                              showUserIconOnTablet && (
                                <Icon
                                  appearance="gray"
                                  size="20px"
                                  icon={<LuUserRoundCheck />}
                                />
                              )}
                          </Stack>
                        </Stack>
                      </Stack>
                    </StyledTd>
                  ))}
                  {actions && (
                    <Actions
                      actions={actions}
                      isTablet={isTablet}
                      entry={entry}
                      actionMobile={actionMobile}
                    />
                  )}
                </StyledTr>
              ))}
            </>
          )}
        </StyledTbody>
      </StyledTable>
      {isModalOpen && (
        <InfoModal
          onClose={() => setIsModalOpen(false)}
          items={infoItems || []}
        />
      )}
    </StyledContainer>
  );
};
