import { useState } from "react";
import { MdOutlineDescription, MdOutlineDelete } from "react-icons/md";
import { Icon, Stack, Text } from "@inubekit/inubekit";

import { EnumType } from "@hooks/useEnum";
import { DeleteModal } from "@components/modals/DeleteModal";

import { StyledFile } from "./styles";
import { fileUILabelsEnum } from "./config";

interface FileUIProps {
  name: string;
  size: string;
  onDelete?: () => void;
  withBorder?: boolean;
  lang: EnumType;
}

function FileUI(props: FileUIProps) {
  const { withBorder, name, size, onDelete, lang } = props;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <>
      <StyledFile $withBorder={withBorder}>
        <Stack gap="8px" alignItems="center">
          <Icon icon={<MdOutlineDescription />} appearance="dark" size="20px" />
          <Stack direction="column" width="170px">
            <Text type="label" size="medium" weight="bold" ellipsis>
              {name}
            </Text>
            <Text appearance="gray" size="small">
              {size}
            </Text>
          </Stack>
        </Stack>
        <Icon
          icon={<MdOutlineDelete />}
          cursorHover
          appearance="danger"
          size="20px"
          onClick={() => setShowConfirmDelete(true)}
        />
      </StyledFile>

      {showConfirmDelete && (
        <DeleteModal
          handleClose={() => setShowConfirmDelete(false)}
          handleDelete={() => {
            onDelete?.();
            setShowConfirmDelete(false);
          }}
          TextDelete={fileUILabelsEnum.deleteModal.content.i18n[lang]}
          lang={lang}
        />
      )}
    </>
  );
}

export { FileUI };
