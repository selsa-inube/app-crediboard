import { EnumType } from "@hooks/useEnum";
import { FileUI } from "./interface";

interface FileProps {
  name: string;
  size: string;
  onDelete?: () => void;
  withBorder?: boolean;
  lang: EnumType;
}

function File(props: FileProps) {
  const { withBorder = true, name, size, onDelete, lang } = props;
  return (
    <FileUI
      withBorder={withBorder}
      name={name}
      size={size}
      onDelete={onDelete}
      lang={lang}
    />
  );
}

export { File };
