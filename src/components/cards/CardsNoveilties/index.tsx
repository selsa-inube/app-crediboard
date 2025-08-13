import { Divider, Icon, Stack, Text } from "@inubekit/inubekit";
import { StyledContainer, StyledEllipsisText, StyledUserImage } from "./styles";

export interface ICardNoveilties {
  userImage?: string;
  userImageAlt?: string;
  userName?: string;
  dateTime?: string;
  referenceCode?: string;
  description?: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
}

export function CardNoveilties(props: ICardNoveilties) {
  const {
    userImage,
    userImageAlt,
    userName,
    dateTime,
    referenceCode,
    description,
    actionText,
    actionIcon,
    onActionClick,
  } = props;

  return (
    <StyledContainer>
      <Stack gap="8px">
        <Stack>
          <StyledUserImage src={userImage} alt={userImageAlt} />
        </Stack>
        <Stack direction="column" gap="8px" width="100%">
          <Stack justifyContent="space-between">
            <Text type="title" size="small" weight="normal" appearance="gray">
              {userName}
            </Text>
            <Text type="title" size="small" weight="normal" appearance="dark">
              {dateTime}
            </Text>
          </Stack>
          <Stack direction="column" gap="4px">
            <Text type="title" size="small" weight="bold" appearance="dark">
              {referenceCode}
            </Text>
            <StyledEllipsisText>
              <Text type="title" size="small" weight="bold" appearance="gray">
                {description}
              </Text>
            </StyledEllipsisText>
          </Stack>
        </Stack>
      </Stack>
      <Divider dashed />
      <Stack
        alignItems="center"
        gap="8px"
        justifyContent="flex-end"
        padding="12px"
      >
        <Text
          type="title"
          size="medium"
          weight="bold"
          appearance="primary"
          onClick={onActionClick}
          cursorHover
        >
          {actionText}
        </Text>
        <Icon
          icon={actionIcon}
          appearance="primary"
          size="18px"
          cursorHover
          onClick={onActionClick}
        />
      </Stack>
    </StyledContainer>
  );
}
