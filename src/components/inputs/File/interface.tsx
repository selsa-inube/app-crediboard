import { MdOutlineDescription, MdOutlineDelete } from "react-icons/md";
import { Icon, Stack, Text } from "@inubekit/inubekit";

import { StyledFile } from "./styles";

interface FileUIProps {
  name: string;
  size: string;
  onDelete?: () => void;
  withBorder?: boolean;
}

function FileUI(props: FileUIProps) {
  const { withBorder, name, size, onDelete } = props;
  return (
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
        onClick={onDelete}
      />
    </StyledFile>
  );
}

export { FileUI };
