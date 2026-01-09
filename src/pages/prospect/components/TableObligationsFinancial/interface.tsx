import { useState } from "react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

import {
  Pagination,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Stack,
  Icon,
  Text,
  SkeletonLine,
  SkeletonIcon,
} from "@inubekit/inubekit";

import { EditFinancialObligationModal } from "@components/modals/editFinancialObligationModal";
import { NewPrice } from "@components/modals/ReportCreditsModal/components/newPrice";
import { BaseModal } from "@components/modals/baseModal";
import { currencyFormat } from "@utils/formatData/currency";
import { DeleteModal } from "@components/modals/DeleteModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { privilegeCrediboard } from "@config/privilege";
import { ErrorModal } from "@components/modals/ErrorModal";

import { usePagination } from "./utils";
import { dataReport, ROWS_PER_PAGE } from "./config";
import InfoModal from "../modals/InfoModal";

export interface ITableFinancialObligationsProps {
  type?: string;
  id?: string;
}

export interface IDataInformationItem {
  propertyName?: string;
  propertyValue?: string | string[];
  id?: number;
  borrowerIdentificationNumber?: string;
}

interface UIProps {
  dataInformation: IDataInformationItem[];
  extraDebtors: ITableFinancialObligationsProps[];
  selectedDebtor: ITableFinancialObligationsProps | null;
  loading: boolean;
  visibleHeaders: { key: string; label: string; action?: boolean }[];
  isModalOpenEdit: boolean;
  isMobile: boolean;
  showOnlyEdit?: boolean;
  handleEdit: (item: ITableFinancialObligationsProps, index: number) => void;
  setIsModalOpenEdit: (value: boolean) => void;
  handleDelete: (id: number, borrowerIdentificationNumber: string) => void;
  handleUpdate: (
    updatedDebtor: ITableFinancialObligationsProps
  ) => Promise<void>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setGotEndPage: React.Dispatch<React.SetStateAction<boolean>>;
  gotEndPage: boolean;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorModal?: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage?: string;
  errorModal?: boolean;
}

export const TableFinancialObligationsUI = ({
  dataInformation,
  loading,
  selectedDebtor,
  visibleHeaders,
  isMobile,
  isModalOpenEdit,
  showOnlyEdit,
  setIsModalOpenEdit,
  handleEdit,
  handleDelete,
  handleUpdate,
  setCurrentPage,
  currentPage,
  setGotEndPage,
  gotEndPage,
  showDeleteModal,
  setShowDeleteModal,
  setErrorModal,
  errorModal,
  errorMessage,
}: UIProps) => {
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<IDataInformationItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const {
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    startIndex,
    endIndex,
    paginatedData,
    totalPages,
  } = usePagination(dataInformation, setCurrentPage, currentPage);

  if (gotEndPage) {
    setCurrentPage(totalPages);
    setGotEndPage(false);
  }

  const getValueFromProperty = (
    value: string | number | string[] | undefined,
    index: number
  ): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parts = value.split(",").map((v) => parseFloat(v.trim()));
      return parts[index] || 0;
    }
    if (Array.isArray(value)) {
      const num = parseFloat(value[index]?.toString().trim() || "0");
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const totalBalance = dataInformation.reduce(
    (sum, item) => sum + getValueFromProperty(item.propertyValue, 1),
    0
  );
  const totalFee = dataInformation.reduce(
    (sum, item) => sum + getValueFromProperty(item.propertyValue, 2),
    0
  );

  const renderHeaders = () => {
    return visibleHeaders.map((header, index) =>
      loading ? (
        <Td key={index} type="custom" width="100%">
          <SkeletonIcon animated />
        </Td>
      ) : (
        <Th
          key={index}
          action={header.action}
          align="center"
          style={{ whiteSpace: "nowrap" }}
        >
          {header.label}
        </Th>
      )
    );
  };

  const renderLoadingRow = (key: number) => (
    <Tr key={key}>
      {visibleHeaders.map((_, index) => (
        <Td key={index} type="custom" width="100%">
          <SkeletonLine animated width="100%" />
        </Td>
      ))}
    </Tr>
  );

  const renderNoDataRow = () => (
    <Tr>
      <Td
        colSpan={visibleHeaders.length}
        align="center"
        type="custom"
        height={245}
      >
        <Text size="large" type="label" appearance="gray" textAlign="center">
          {dataReport.noData}
        </Text>
      </Td>
    </Tr>
  );

  const renderDataRows = () =>
    paginatedData.map((prop: IDataInformationItem, index: number) => {
      const rowIndex = (currentPage - 1) * ROWS_PER_PAGE + index;
      let values: string[] = [];

      if (typeof prop.propertyValue === "string") {
        values = prop.propertyValue.split(",").map((val: string) => val.trim());
      } else if (Array.isArray(prop.propertyValue)) {
        values = prop.propertyValue.map(String);
      } else {
        values = Object.entries(prop)
          .filter(([key]) => key !== "id")
          .map(([, value]) => String(value).trim());
      }

      return (
        <Tr key={rowIndex}>
          {visibleHeaders.map((header, colIndex) => {
            let cellData = values[colIndex] || "";
            const isCurrency = ["balance", "fee"].includes(header.key);

            if (isCurrency) {
              cellData = isNaN(Number(cellData))
                ? cellData
                : currencyFormat(Number(cellData), false);
            }

            const isFromInitialValues = Boolean(prop.propertyName);
            if (isFromInitialValues && colIndex === values.length - 2) {
              cellData = `${values[colIndex]}/${values[colIndex + 1]}`.trim();
            }

            return (
              <Td
                key={colIndex}
                appearance={"light"}
                type={header.action ? "custom" : "text"}
                align={isCurrency ? "right" : "center"}
              >
                {header.action ? (
                  <Stack justifyContent="space-around">
                    <Icon
                      icon={<MdOutlineEdit />}
                      appearance="dark"
                      size="16px"
                      onClick={
                        editCreditApplication
                          ? handleInfo
                          : () =>
                              handleEdit(
                                prop as ITableFinancialObligationsProps,
                                prop.id as number
                              )
                      }
                      cursorHover
                    />
                    {!showOnlyEdit && (
                      <Icon
                        icon={<MdDeleteOutline />}
                        appearance="danger"
                        size="16px"
                        onClick={
                          editCreditApplication
                            ? handleInfo
                            : () => handleDeleteModal(prop)
                        }
                        cursorHover
                      />
                    )}
                  </Stack>
                ) : (
                  cellData
                )}
              </Td>
            );
          })}
        </Tr>
      );
    });

  const renderTbodyContent = () => {
    if (loading) {
      return Array.from({ length: ROWS_PER_PAGE }).map((_, index) =>
        renderLoadingRow(index)
      );
    }

    if (dataInformation.length === 0) {
      return renderNoDataRow();
    }

    return renderDataRows();
  };

 
  const handleDeleteModal = (itemToDelete: IDataInformationItem) => {
    setDataToDelete(itemToDelete);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Stack direction="column" width="100%" gap="16px">
        <Table tableLayout="fixed">
          <Thead>
            <Tr>{renderHeaders()}</Tr>
          </Thead>
          <Tbody>{renderTbodyContent()}</Tbody>
          {!loading && dataInformation.length > 0 && (
            <Tfoot>
              <Tr border="bottom">
                <Td
                  colSpan={visibleHeaders.length}
                  type="custom"
                  align="center"
                >
                  <Pagination
                    firstEntryInPage={startIndex}
                    lastEntryInPage={endIndex}
                    totalRecords={dataInformation.length}
                    handleStartPage={handleStartPage}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                    handleEndPage={handleEndPage}
                  />
                </Td>
              </Tr>
            </Tfoot>
          )}
          {isModalOpenEdit && selectedDebtor && (
            <EditFinancialObligationModal
              title={`${dataReport.edit} ${selectedDebtor.type || ""}`}
              onCloseModal={() => setIsModalOpenEdit(false)}
              onConfirm={async (updatedDebtor) => {
                await handleUpdate(updatedDebtor);
              }}
              initialValues={selectedDebtor}
              confirmButtonText={dataReport.save}
            />
          )}
          {isDeleteModal && (
            <BaseModal
              title={dataReport.deletion}
              nextButton={dataReport.delete}
              backButton={dataReport.cancel}
              handleClose={() => setIsDeleteModal(false)}
            >
              <Stack width="400px">
                <Text>{dataReport.content}</Text>
              </Stack>
            </BaseModal>
          )}
        </Table>
        <Stack
          gap="48px"
          direction={!isMobile ? "row" : "column"}
          justifyContent="center"
        >
          {loading ? (
            <SkeletonLine />
          ) : (
            <NewPrice
              value={totalBalance}
              label={dataReport.descriptionTotalBalance}
            />
          )}
          {loading ? (
            <SkeletonLine />
          ) : (
            <NewPrice value={totalFee} label={dataReport.descriptionTotalFee} />
          )}
        </Stack>
      </Stack>
      {showDeleteModal && (
        <DeleteModal
          handleClose={() => setShowDeleteModal(false)}
          handleDelete={() => {
            if (dataToDelete) {
              handleDelete(
                dataToDelete.id as number,
                dataToDelete.borrowerIdentificationNumber as string
              );
            }

            setShowDeleteModal(false);
          }}
          TextDelete={dataReport.content}
        />
      )}
      {isModalOpen && (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrediboard.title}
          subtitle={privilegeCrediboard.subtitle}
          description={privilegeCrediboard.description}
          nextButtonText={privilegeCrediboard.nextButtonText}
          isMobile={isMobile}
        />
      )}
      {errorModal && setErrorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => {
            setErrorModal(false);
          }}
        />
      )}
    </>
  );
};
