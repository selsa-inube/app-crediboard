import { Stack, Icon, Text, Divider } from "@inubekit/inubekit";
import {
  MdOutlineAttachMoney,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlinePerson,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

import { EnumType } from "@hooks/useEnum";

import { StyledContainer } from "./styles";
import { newBorrowedDataEnum } from "./config";

export interface ICardBorrowerProps {
  title: string;
  name: string;
  lastName: string;
  email: string;
  income: string;
  obligations: string;
  lang: EnumType;
  handleView?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  showIcons?: boolean;
  isMobile?: boolean;
}

export function CardBorrower(props: ICardBorrowerProps) {
  const {
    title,
    name,
    lastName,
    email,
    income,
    obligations,
    handleView = () => {},
    handleEdit = () => {},
    handleDelete = () => {},
    showIcons = true,
    isMobile = false,
    lang,
  } = props;

  return (
    <StyledContainer $showIcons={showIcons} $isMobile={isMobile}>
      <Stack direction="column" padding="10px 16px" gap="12px">
        <Stack gap="12px">
          <Icon icon={<MdOutlinePerson />} appearance="gray" size="24px" />
          <Text type="title" size="medium" weight="bold" appearance="gray">
            {title}
          </Text>
        </Stack>
        <Divider dashed />
        <Stack direction="column" gap="8px">
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDataEnum.names.i18n[lang]}
            </Text>
            <Text type="body" size="large">
              {name}
            </Text>
          </Stack>
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDataEnum.lastNames.i18n[lang]}
            </Text>
            <Text type="body" size="large">
              {lastName}
            </Text>
          </Stack>
          <Stack direction="column" gap="4px">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDataEnum.email.i18n[lang]}
            </Text>
            <Text type="body" size="large">
              {email}
            </Text>
          </Stack>
          <Stack direction="column" gap="4px" justifyContent="center">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDataEnum.income.i18n[lang]}
            </Text>
            <Stack alignItems="center">
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance={"success"}
                size="18px"
              />
              <Text type="body" size="large">
                {income}
              </Text>
            </Stack>
          </Stack>
          <Stack direction="column" gap="4px" justifyContent="center">
            <Text type="label" weight="bold" size="medium" appearance="gray">
              {newBorrowedDataEnum.obligations.i18n[lang]}
            </Text>
            <Stack alignItems="center">
              <Icon
                icon={<MdOutlineAttachMoney />}
                appearance={"success"}
                size="18px"
              />
              <Text type="body" size="large">
                {obligations}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        {showIcons && (
          <Stack direction="column" gap="12px">
            <Divider dashed />
            <Stack gap="10px" justifyContent="flex-end">
              <Icon
                icon={<MdOutlineRemoveRedEye />}
                appearance={"primary"}
                size="20px"
                onClick={handleView}
                cursorHover
              />
              <Icon
                icon={<MdOutlineEdit />}
                appearance={"primary"}
                size="20px"
                onClick={handleEdit}
                cursorHover
              />
              <Icon
                icon={<MdOutlineDelete />}
                appearance={"primary"}
                size="20px"
                onClick={handleDelete}
                cursorHover
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </StyledContainer>
  );
}
