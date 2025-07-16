import { useState } from "react";
import { createPortal } from "react-dom";
import { MdClear, MdOutlineFilterAlt } from "react-icons/md";
import {
  Icon,
  Stack,
  Text,
  useMediaQuery,
  Blanket,
  Divider,
  Button,
  Checkpicker,
  IOption,
} from "@inubekit/inubekit";
import { useFormik } from "formik";
import * as Yup from "yup";

import { validationMessages } from "@validations/validationMessages";
import { SelectedFilters } from "@components/cards/SelectedFilters/index.tsx";
import { Filter } from "@components/cards/SelectedFilters/interface.ts";

import { StyledModal, StyledContainerClose } from "./styles.ts";
import { FormValues } from "./types.ts";
import { IFilterFormValues } from "@pages/board/outlets/boardlayout/index.tsx";

export interface SelectedFilter extends IOption {
  count: number;
}

export interface FilterRequestModalProps {
  portalId?: string;
  assignmentOptions?: IOption[];
  statusOptions?: IOption[];
  selectedFilters?: Filter[];
  initialValues?: IFilterFormValues;
  onCloseModal?: () => void;
  onSubmit?: (values: IFilterFormValues) => void;
  onClearFilters?: () => void;
  onRemoveFilter?: (filterValue: string) => void;
}

export function FilterRequestModal(props: FilterRequestModalProps) {
  const {
    portalId = "portal",
    assignmentOptions = [],
    selectedFilters = [],
    initialValues,
    onCloseModal,
    onSubmit,
    onClearFilters,
    onRemoveFilter,
  } = props;

  const isMobile = useMediaQuery("(max-width: 1280px)");
  const portalNode = document.getElementById(portalId);

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    assignment: Yup.string().required(validationMessages.required),
    status: Yup.string().required(validationMessages.required),
    value: Yup.number()
      .required(validationMessages.required)
      .min(1, "El valor debe ser mayor a 0"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      assignment: initialValues?.assignment ?? "",
      status: initialValues?.status ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: () => {
      console.log("Form submitted");
    },
  });

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formik.values);
      }
      setLoading(false);
    }, 800);
  };

  const sortedAssignmentOptions = [...assignmentOptions].sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  if (!portalNode) {
    throw new Error(
      "The portal node is not defined. Ensure the specific node exists in the DOM."
    );
  }

  return createPortal(
    <Blanket>
      <StyledModal $smallScreen={isMobile}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          margin="0px 0px 10px 0px"
        >
          <Text type="headline" size="small">
            Filtrar
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap="8px">
              <Text>Cerrar</Text>
              <Icon
                icon={<MdClear />}
                size="24px"
                cursorHover
                appearance="dark"
              />
            </Stack>
          </StyledContainerClose>
        </Stack>
        <Divider />
        {isMobile && (
          <>
            <Stack alignItems="center" gap="8px">
              <Icon
                icon={<MdOutlineFilterAlt />}
                size="20px"
                appearance="gray"
              />
              <SelectedFilters
                filters={selectedFilters}
                onRemove={onRemoveFilter}
              />
            </Stack>
            <Divider dashed />
          </>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Stack direction="column" gap="20px">
            <Stack alignItems="center" gap="8px">
              <Stack margin="20px 0px 0px 0px">
                <Icon
                  icon={<MdOutlineFilterAlt />}
                  appearance="primary"
                  size="24px"
                />
              </Stack>
              <Checkpicker
                label="Filtrado por"
                placeholder="Selecciona de la lista"
                name="assignment"
                id="assignment"
                values={formik.values.assignment}
                message={
                  formik.touched.assignment
                    ? formik.errors.assignment
                    : undefined
                }
                size="compact"
                fullwidth
                onChange={(name, value) => {
                  void formik.setFieldValue(name, value);
                }}
                options={sortedAssignmentOptions}
              />
            </Stack>

            <Stack justifyContent="flex-end" gap="20px">
              <Button
                onClick={onClearFilters}
                appearance="gray"
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit} loading={loading}>
                Filtrar
              </Button>
            </Stack>
          </Stack>
        </form>
      </StyledModal>
    </Blanket>,
    portalNode
  );
}
