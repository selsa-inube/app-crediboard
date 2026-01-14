import { isValidElement, ReactNode } from "react";
import { MdNotificationsNone, MdWarningAmber } from "react-icons/md";
import { Icon, Stack, Tag } from "@inubekit/inubekit";

import check from "@assets/images/check.svg";
import close from "@assets/images/close.svg";
import remove from "@assets/images/remove.svg";
import info from "@assets/images/info.svg";
import { IEntries } from "@components/data/TableBoard/types";
import { IApprovals } from "@pages/board/outlets/financialReporting/Approvals/types";

import { approvalsConfigEnum } from "./configApprovalTexts";

const handleData = (data: IEntries) => {
  console.log("function that receives data", data);
};

interface IActionConfig {
  id: string;
  actionName: string;
  content: (data: IEntries) => ReactNode;
}


export const getTitlesApprovals = (language: "es" | "en") => [
  {
    id: approvalsConfigEnum.ids.users.i18n[language],
    titleName: approvalsConfigEnum.titles.assignedApprovers.i18n[language],
    priority: 1,
  },
  {
    id: approvalsConfigEnum.ids.tag.i18n[language],
    titleName: approvalsConfigEnum.titles.decision.i18n[language],
    priority: 2,
  },
];

export const getActionMobileApprovals = (language: "es" | "en") => [
  {
    id: approvalsConfigEnum.ids.error.i18n[language],
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={<MdWarningAmber />}
        appearance="warning"
        spacing="narrow"
        cursorHover
        size="20px"
        onClick={() => handleData(data)}
        disabled={
          isValidElement(data?.tag) &&
          data?.tag?.props?.label !== approvalsConfigEnum.status.pending.i18n[language]
        }
      />
    ),
  },
  {
    id: approvalsConfigEnum.ids.notifications.i18n[language],
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={<MdNotificationsNone />}
        appearance="primary"
        spacing="narrow"
        cursorHover
        size="20px"
        onClick={() => handleData(data)}
        disabled={
          isValidElement(data?.tag) &&
          data?.tag?.props?.label !== approvalsConfigEnum.status.pending.i18n[language]
        }
      />
    ),
  },
];

export const handleNotificationClick = (
  data: IEntries,
  setSelectedData: (data: IEntries) => void,
  setShowModal: (showModal: boolean) => void,
  language: "es" | "en"
) => {
  const tag = data?.tag;
  if (
    isValidElement(tag) &&
    tag.props?.label === approvalsConfigEnum.status.pending.i18n[language]
  ) {
    setSelectedData(data);
    setShowModal(true);
  }
};

export const handleErrorClick = (
  data: IEntries,
  setSelectedData: (data: IEntries) => void,
  setShowModal: (showModal: boolean) => void,
  language: "es" | "en"
) => {
  const tag = data?.tag;
  if (
    isValidElement(tag) &&
    tag.props?.label === approvalsConfigEnum.status.pending.i18n[language]
  ) {
    setSelectedData(data);
    setShowModal(true);
  }
};

export const desktopActions = (
  actions: IActionConfig[],
  handleNotificationClick: (data: IEntries) => void,
  handleErrorClick: (data: IEntries) => void,
  language: "es" | "en"
) => {
  return actions.map((action) => ({
    id: action.id,
    actionName: action.actionName,
    content: (data: IEntries) => {
      const handleClick = () => {
        if (action.id === approvalsConfigEnum.ids.notifications.i18n[language]) {
          handleNotificationClick(data);
        } else if (action.id === approvalsConfigEnum.ids.error.i18n[language]) {
          handleErrorClick(data);
        }
      };

      const iconElement = action.content(data);

      if (isValidElement(iconElement)) {
        return <Icon {...iconElement.props} onClick={handleClick} />;
      }
      return iconElement;
    },
  }));
};

export const getMobileActionsConfig = (
  actionMobileApprovals: IActionConfig[],
  handleNotificationClickBound: (data: IEntries) => void,
  handleErrorClickBound: (data: IEntries) => void,
  language: "en" | "es"
) => {
  return actionMobileApprovals.map((action) => ({
    id: action.id,
    content: (data: IEntries) => {
      const handleClick = () => {
        if (action.id === approvalsConfigEnum.ids.notifications.i18n[language]) {
          handleNotificationClickBound(data);
        } else if (action.id === approvalsConfigEnum.ids.error.i18n[language]) {
          handleErrorClickBound(data);
        }
      };

      const iconElement = action.content(data);

      if (isValidElement(iconElement)) {
        return (
          <Icon
            {...iconElement.props}
            onClick={handleClick}
          />
        );
      }
      return iconElement;
    },
  }));
};

const appearanceTag = (label: string, language: "es" | "en") => {
  if (label === approvalsConfigEnum.status.approved.i18n[language]) return "success";
  if (label === approvalsConfigEnum.status.pending.i18n[language]) return "warning";
  if (label === approvalsConfigEnum.status.returned.i18n[language]) return "help";
  if (label === approvalsConfigEnum.status.commercialManagement.i18n[language]) return "help";
  if (label === approvalsConfigEnum.status.riskAnalysis.i18n[language]) return "dark";
  return "danger";
};
const getIconByTagStatus = (tagElement: React.ReactElement, language: "es" | "en") => {
  const label = tagElement.props.label;

  if (label === approvalsConfigEnum.status.approved.i18n[language]) {
    return <img src={check} alt={approvalsConfigEnum.altTexts.complies.i18n[language]} width={14} height={14} />;
  } else if (label === approvalsConfigEnum.status.pending.i18n[language]) {
    return <img src={remove} alt={approvalsConfigEnum.altTexts.notEvaluated.i18n[language]} width={14} height={14} />;
  } else if (label === approvalsConfigEnum.status.rejected.i18n[language]) {
    return <img src={close} alt={approvalsConfigEnum.altTexts.doesNotComply.i18n[language]} width={14} height={14} />;
  } else if (label === approvalsConfigEnum.status.returned.i18n[language]) {
    return <img src={info} alt={approvalsConfigEnum.altTexts.returned.i18n[language]} width={14} height={14} />;
  }
  return null;
};

export const getActionsMobileIcon = (language: "es" | "en") => [
  {
    id: approvalsConfigEnum.ids.status.i18n[language],
    actionName: "",
    content: (entry: IEntries) => {
      const tagElement = entry.tag as React.ReactElement;
      return (
        <Stack>
          <Icon
            icon={getIconByTagStatus(tagElement, language)}
            appearance={tagElement.props.appearance}
            cursorHover
            size="20px"
          />
        </Stack>
      );
    },
  },
];


export const entriesApprovals = (data: IApprovals[], language: "es" | "en") => {
  return data.map((entry) => ({
    id: entry?.approverName?.toString(),
    [approvalsConfigEnum.ids.users.i18n[language]]: entry?.approverName,
    concept: entry?.concept,
    identificationNumber: entry?.approverIdentificationNumber,
    identificationType: entry?.approverIdentificationType,
    approvalId: entry?.approvalId,
    approverId: entry?.approverId,
    tag: (
      <Tag label={entry.concept} appearance={appearanceTag(entry.concept, language)} />
    ),
    error: entry.error,
  }));
};
