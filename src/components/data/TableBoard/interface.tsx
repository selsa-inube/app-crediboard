import {
  MdOutlineInfo,
  MdOutlineHowToReg,
  MdWarningAmber,
} from "react-icons/md";
import { Icon, Text, SkeletonLine, Stack } from "@inubekit/inubekit";

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
  StyledCellText,
} from "./styles";

interface ITableBoardUIProps extends ITableBoardProps {
  loading: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isModalOpen: boolean;
  onInfoClick: () => void;
  onCloseModal: () => void;
  filteredTitles: ITitle[];
  filteredTitlesForHeader: ITitle[];
  isPendingStatus: (entry: IEntries) => boolean;
  hideTagOnTablet?: boolean;
  hideSecondColumnOnTablet?: boolean;
  hideSecondColumnOnMobile?: boolean;
  showUserIconOnTablet?: boolean;
  enableStickyActions?: boolean;
  showPendingWarningIcon?: boolean;
}

interface IRenderActionsTitles {
  actions: IAction[];
  isTablet: boolean;
  appearance: appearances;
  isStyleMobile: boolean;
  onInfoClick: () => void;
  isFirstTable: boolean;
  enableStickyActions?: boolean;
}

const RenderActionsTitles = (props: IRenderActionsTitles) => {
  const {
    actions,
    appearance,
    isTablet,
    isStyleMobile,
    onInfoClick,
    isFirstTable,
    enableStickyActions = true,
  } = props;

  return (
    <>
      {!isTablet
        ? actions.map((actionTitle) => (
            <StyledThactions
              key={actionTitle.id}
              $enableSticky={enableStickyActions}
            >
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
            <StyledThactions
              $isTablet={isTablet}
              $enableSticky={enableStickyActions}
              colSpan={3}
              $isFirst
            >
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

export const TableBoardUI = (props: ITableBoardUIProps) => {
  const {
    id,
    entries,
    actions,
    borderTable,
    loading,
    appearanceTable,
    isTablet,
    isMobile,
    actionMobileIcon,
    actionMobile,
    isFirstTable,
    infoItems,
    hideSecondColumnOnMobile = true,
    showUserIconOnTablet = true,
    enableStickyActions = true,
    showPendingWarningIcon = false,
    isModalOpen,
    onInfoClick,
    onCloseModal,
    filteredTitles,
    filteredTitlesForHeader,
    isPendingStatus,
  } = props;

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
                onInfoClick={onInfoClick}
                isFirstTable={isFirstTable ?? false}
                enableStickyActions={enableStickyActions}
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
                        <Stack justifyContent="flex-end" width="100%">
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
                              height="auto"
                            >
                              <StyledCellText>
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
                              </StyledCellText>

                              {titleIndex === 0 &&
                                showPendingWarningIcon &&
                                isPendingStatus(entry) && (
                                  <Icon
                                    appearance="warning"
                                    size="20px"
                                    icon={<MdWarningAmber />}
                                  />
                                )}
                            </Stack>
                          )}
                          <Stack padding="0px 4px">
                            {titleIndex === 1 && showUserIconOnTablet && (
                              <Icon
                                appearance="gray"
                                size="32px"
                                spacing="compact"
                                variant="empty"
                                icon={<MdOutlineHowToReg />}
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
        <InfoModal onClose={onCloseModal} items={infoItems || []} />
      )}
    </StyledContainer>
  );
};
