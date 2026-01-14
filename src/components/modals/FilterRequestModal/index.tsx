import { useState, useCallback } from "react";
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
import { IFilterFormValues } from "@pages/board/outlets/boardlayout/index.tsx";
import { useEnum } from "@hooks/useEnum";

import { StyledModal, StyledContainerClose } from "./styles.ts";
import { FormValues } from "./types.ts";
import { dataFiltersRequestEnum } from "./config.ts";

export interface SelectedFilter extends IOption {
  count: number;
}

export interface FilterRequestModalProps {
  portalId?: string;
  assignmentOptions?: IOption[];
  statusOptions?: IOption[];
  selectedFilters?: Filter[];
  filterValues?: IFilterFormValues;
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
    filterValues,
    onCloseModal,
    onSubmit,
    onClearFilters,
    onRemoveFilter,
  } = props;

  const isMobile = useMediaQuery("(max-width: 1280px)");
  const portalNode = document.getElementById(portalId);

  const [loading, setLoading] = useState(false);

  const { lang } = useEnum();

  const validationSchema = Yup.object({
    assignment: Yup.string().required(validationMessages.required),
    status: Yup.string().required(validationMessages.required),
    value: Yup.number().required(validationMessages.required).min(1, ""),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      assignment: filterValues?.assignment ?? "",
      status: filterValues?.status ?? "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: () => {
      console.log("Form submitted");
    },
  });

  const handleSubmit = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formik.values);
      }
      setLoading(false);
    }, 800);
  }, [onSubmit, formik.values]);

  const sortedAssignmentOptions = [...assignmentOptions].sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  if (!portalNode) {
    throw new Error(
      "The portal node is not defined. Ensure the specific node exists in the DOM."
    );
  }

  if (portalNode) {
    portalNode.style.position = "relative";
    portalNode.style.zIndex = "3";
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
            {dataFiltersRequestEnum.filter.i18n[lang]}
          </Text>
          <StyledContainerClose onClick={onCloseModal}>
            <Stack alignItems="center" gap="8px">
              <Text>{dataFiltersRequestEnum.close.i18n[lang]}</Text>
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
                lang={lang}
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
                placeholder="Selecciona el campo que deseas"
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
                  setTimeout(() => {
                    formik.setFieldValue(name, value);
                  }, 0);
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
                {dataFiltersRequestEnum.cancel.i18n[lang]}
              </Button>
              <Button onClick={handleSubmit} loading={loading}>
                {dataFiltersRequestEnum.filter.i18n[lang]}
              </Button>
            </Stack>
          </Stack>
        </form>
      </StyledModal>
    </Blanket>,
    portalNode
  );
}
