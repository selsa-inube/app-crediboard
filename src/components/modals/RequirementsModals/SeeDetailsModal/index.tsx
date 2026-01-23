import { createPortal } from "react-dom";
import { MdClear, MdOutlineCalendarMonth } from "react-icons/md";
import {
  Stack,
  Icon,
  Text,
  useMediaQuery,
  Blanket,
  Textfield,
  Textarea,
  Button,
} from "@inubekit/inubekit";

import { formatPrimaryDate } from "@utils/formatData/date";
import { validationMessages } from "@validations/validationMessages";
import { useEnum } from "@hooks/useEnum";

import { StyledModal, StyledTextarea, StyledContainerClose } from "./styles";
import { dataSeeDetailsEnum } from "./config";

export interface SeeDetailsModalProps {
  date: Date;
  details: string;
  portalId?: string;
  onCloseModal?: () => void;
}

export function SeeDetailsModal(props: SeeDetailsModalProps) {
  const {
    date = new Date(),
    details = "",
    portalId = "portal",
    onCloseModal,
  } = props;

  const { lang } = useEnum();
  const isMobile = useMediaQuery("(max-width: 700px)");
  const node = document.getElementById(portalId ?? "portal");
  if (!node) {
    throw new Error(validationMessages.errorNodo);
  }
  if (node) {
    node.style.position = "relative";
    node.style.zIndex = "3";
  }

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack alignItems="center" justifyContent="space-between">
          <Text type="headline" size="small">
            {dataSeeDetailsEnum.more.i18n[lang]}
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap="8px">
              <Text>{dataSeeDetailsEnum.close.i18n[lang]}</Text>
              <Icon
                icon={<MdClear />}
                size="24px"
                cursorHover
                appearance="dark"
              />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Stack direction="column" gap="24px">
          <Textfield
            id="date"
            name="date"
            label="Fecha"
            value={formatPrimaryDate(date)}
            onChange={() => {}}
            iconBefore={<MdOutlineCalendarMonth />}
          />
          <StyledTextarea>
            <Textarea
              id="observation"
              label="Observación"
              value={details}
              onChange={() => {}}
              fullwidth
            />
          </StyledTextarea>
        </Stack>
        <Stack justifyContent="flex-end" margin="16px 0">
          <Button onClick={onCloseModal}>{dataSeeDetailsEnum.close.i18n[lang]}</Button>
        </Stack>
      </StyledModal>
    </Blanket>,
    node
  );
}
