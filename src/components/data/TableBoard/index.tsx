import { useState } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { IAction, IEntries, ITitle, IAppearances } from "./types";
import { TableBoardUI } from "./interface";

export interface IInfoItems {
  isFirstTable?: boolean;
  infoItems?: { icon: JSX.Element; text: string }[];
}

export interface ITableBoardProps extends IInfoItems {
  id: string;
  entries: IEntries[];
  titles: ITitle[];
  actions?: IAction[];
  actionMobile?: IAction[];
  actionMobileIcon?: IAction[];
  borderTable?: boolean;
  loading?: boolean;
  portalId?: string;
  appearanceTable?: IAppearances;
  hideTagOnTablet?: boolean;
  hideSecondColumnOnTablet?: boolean;
  hideSecondColumnOnMobile?: boolean;
  showUserIconOnTablet?: boolean;
  enableStickyActions?: boolean;
  showPendingWarningIcon?: boolean;
}

export const TableBoard = (props: ITableBoardProps) => {
  const {
    id,
    entries,
    titles,
    actions,
    actionMobile,
    actionMobileIcon,
    loading = false,
    borderTable = false,
    portalId,
    appearanceTable = {
      title: "primary",
      efectzebra: true,
      borderTable: false,
      background: false,
      isStyleMobile: true,
    },
    isFirstTable,
    infoItems,
    hideTagOnTablet = true,
    hideSecondColumnOnTablet = false,
    hideSecondColumnOnMobile = true,
    showUserIconOnTablet = true,
    enableStickyActions = true,
    showPendingWarningIcon = false,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isTablet = useMediaQuery("(max-width: 880px)");
  const isMobile = useMediaQuery("(max-width: 560px)");

  const getFilteredTitles = () => {
    return titles.filter(
      (title) => !(isTablet && hideTagOnTablet && title.id === "tag")
    );
  };

  const getFilteredTitlesForHeader = () => {
    const filtered = getFilteredTitles();
    if (hideSecondColumnOnTablet) {
      return filtered.filter((_, index) => index !== 1);
    }
    return filtered;
  };

  const isPendingStatus = (entry: IEntries): boolean => {
    const tag = entry.tag;
    if (typeof tag === "object" && tag !== null && "props" in tag) {
      return (tag as JSX.Element).props?.label === "Pendiente";
    }
    return false;
  };

  const handleInfoClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <TableBoardUI
      id={id}
      actions={actions}
      entries={entries}
      actionMobile={actionMobile}
      actionMobileIcon={actionMobileIcon}
      borderTable={borderTable}
      loading={loading}
      portalId={portalId}
      titles={titles}
      appearanceTable={appearanceTable}
      isTablet={isTablet}
      isMobile={isMobile}
      isFirstTable={isFirstTable}
      infoItems={infoItems}
      hideTagOnTablet={hideTagOnTablet}
      hideSecondColumnOnTablet={hideSecondColumnOnTablet}
      hideSecondColumnOnMobile={hideSecondColumnOnMobile}
      showUserIconOnTablet={showUserIconOnTablet}
      enableStickyActions={enableStickyActions}
      showPendingWarningIcon={showPendingWarningIcon}
      isModalOpen={isModalOpen}
      onInfoClick={handleInfoClick}
      onCloseModal={handleCloseModal}
      filteredTitles={getFilteredTitles()}
      filteredTitlesForHeader={getFilteredTitlesForHeader()}
      isPendingStatus={isPendingStatus}
    />
  );
};
