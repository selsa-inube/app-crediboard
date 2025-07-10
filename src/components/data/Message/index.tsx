import { formatPrimaryDate } from "@utils/formatData/date";

import {
  MessageWrapper,
  MessageContent,
  Timestamp,
  IconWrapper,
} from "./styles";
export interface MessageProps {
  type: "sent" | "received" | "system";
  timestamp: number | string;
  message: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const formatDate = (timestamp: number | string) => {
  return formatPrimaryDate(new Date(timestamp), true);
};

export const Message: React.FC<MessageProps> = ({
  type,
  timestamp,
  message,
  icon,
  onIconClick,
}) => {
  return (
    <MessageWrapper type={type}>
      <MessageContent type={type}>
        {type === "sent" && (
          <IconWrapper type={type} onClick={onIconClick} role="button">
            {icon}
          </IconWrapper>
        )}
        {message}
        {type !== "sent" && (
          <IconWrapper type={type} onClick={onIconClick} role="button">
            {icon}
          </IconWrapper>
        )}
      </MessageContent>
      <Timestamp type={type}>{formatDate(timestamp)}</Timestamp>
    </MessageWrapper>
  );
};
