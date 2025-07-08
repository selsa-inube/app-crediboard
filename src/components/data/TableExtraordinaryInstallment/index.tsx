import { useContext, useEffect, useState } from "react";
import {
  Text,
  SkeletonLine,
  useMediaQuery,
  Pagination,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useFlag,
} from "@inubekit/inubekit";

import { ActionMobile } from "@components/feedback/ActionMobile";
import { EditSeriesModal } from "@components/modals/EditSeriesModal";
import { formatPrimaryDate } from "@utils/formatData/date";
import { IProspect } from "@services/prospects/types";
import { AppContext } from "@context/AppContext";
import { DeleteModal } from "@components/modals/DeleteModal";
import { IExtraordinaryInstallments } from "@services/iProspect/removeExtraordinaryInstallments/types";

import { Detail } from "./Detail";
import {
  headersTableExtraordinaryInstallment,
  rowsVisbleMobile,
  rowsActions,
  dataTableExtraordinaryInstallment,
} from "./config";
import { removeExtraordinaryInstallment } from "./utils";

export interface TableExtraordinaryInstallmentProps {
  [key: string]: unknown;
  prospectData?: IProspect;
  handleClose?: (() => void) | undefined;
  refreshKey?: number;
  id?: string;
  setSentData?:
    | React.Dispatch<React.SetStateAction<IExtraordinaryInstallments | null>>
    | undefined;
}

const usePagination = (data: TableExtraordinaryInstallmentProps[] = []) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageLength = 5;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageLength);

  const handleStartPage = () => setCurrentPage(0);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleEndPage = () => setCurrentPage(totalPages - 1);

  const firstEntryInPage = currentPage * pageLength;
  const lastEntryInPage = Math.min(firstEntryInPage + pageLength, totalRecords);

  const currentData = data.slice(firstEntryInPage, lastEntryInPage);

  return {
    currentPage,
    totalRecords,
    totalPages,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
    currentData,
  };
};

export const TableExtraordinaryInstallment = (
  props: TableExtraordinaryInstallmentProps
) => {
  const { refreshKey, prospectData, handleClose, setSentData } = props;

  const headers = headersTableExtraordinaryInstallment;

  const [extraordinaryInstallments, setExtraordinaryInstallments] = useState<
    TableExtraordinaryInstallmentProps[]
  >([]);
  const [selectedDebtor, setSelectedDebtor] =
    useState<TableExtraordinaryInstallmentProps>({});

  const handleEdit = (debtor: TableExtraordinaryInstallmentProps) => {
    setSelectedDebtor(debtor);
    setIsOpenModalEdit(true);
  };

  const [loading, setLoading] = useState(true);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const { businessUnitSigla } = useContext(AppContext);
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;
  const { addFlag } = useFlag();
  const isMobile = useMediaQuery("(max-width:880px)");

  const visbleHeaders = isMobile
    ? headers.filter((header) => rowsVisbleMobile.includes(header.key))
    : headers;
  const visbleActions = isMobile
    ? rowsActions.filter((action) => rowsVisbleMobile.includes(action.key))
    : rowsActions;

  const {
    totalRecords,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    firstEntryInPage,
    lastEntryInPage,
  } = usePagination(extraordinaryInstallments);

  useEffect(() => {
    if (prospectData?.creditProducts) {
      const extraordinaryInstallmentsUpdate = prospectData.creditProducts
        .flatMap((product) =>
          Array.isArray(product.extraordinaryInstallments)
            ? product.extraordinaryInstallments.map((installment) => ({
                id: `${product.creditProductCode},${installment.installmentDate}`,
                datePayment: installment.installmentDate,
                value: installment.installmentAmount,
                paymentMethod: installment.paymentChannelAbbreviatedName,
              }))
            : []
        )
        .reverse();
      setExtraordinaryInstallments(extraordinaryInstallmentsUpdate);
    }
    setLoading(false);
  }, [prospectData, refreshKey]);

  const handleUpdate = async (
    updatedDebtor: TableExtraordinaryInstallmentProps
  ) => {
    try {
      const updatedExtraordinaryInstallments = extraordinaryInstallments.map(
        (debtor) => (debtor.id === updatedDebtor.id ? updatedDebtor : debtor)
      );
      setExtraordinaryInstallments(updatedExtraordinaryInstallments);
      setIsOpenModalEdit(false);
    } catch (error) {
      console.error("Error updating debtor:", error);
    }
  };
  const initialValues: IExtraordinaryInstallments = {
    creditProductCode: prospectData?.creditProducts[0].creditProductCode || "",
    extraordinaryInstallments:
      prospectData?.creditProducts[0]?.extraordinaryInstallments
        ?.filter((ins) => {
          const expectedId = `${prospectData?.creditProducts[0].creditProductCode},${ins.installmentDate}`;
          return expectedId === selectedDebtor?.id;
        })
        ?.map((installment) => ({
          installmentDate:
            typeof installment.installmentDate === "string"
              ? installment.installmentDate
              : new Date(installment.installmentDate).toISOString(),
          installmentAmount: Number(installment.installmentAmount),
          paymentChannelAbbreviatedName: String(
            installment.paymentChannelAbbreviatedName
          ),
        })) || [],
    prospectId: prospectData?.prospectId || "",
  };
  const handleExtraordinaryInstallment = async (
    extraordinaryInstallments: IExtraordinaryInstallments
  ) => {
    try {
      await removeExtraordinaryInstallment(
        businessUnitPublicCode,
        extraordinaryInstallments
      );

      setSentData?.(extraordinaryInstallments);
      setIsOpenModalDelete(false);
      handleClose?.();
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        status?: number;
        data?: { description?: string; code?: string };
      };
      const code = err?.data?.code ? `[${err.data.code}] ` : "";
      const description =
        code + (err?.message || "") + (err?.data?.description || "");

      addFlag({
        title: "aaa",
        description,
        appearance: "danger",
        duration: 5000,
      });
    }
  };
  return (
    <Table>
      <Thead>
        <Tr>
          {!loading &&
            visbleHeaders.map((header) => (
              <Th key={header.key} align="center">
                {header.label}
              </Th>
            ))}
          {!loading &&
            visbleActions &&
            visbleActions.length > 0 &&
            visbleActions.map((action) => (
              <Th key={action.key} action>
                {action.label}
              </Th>
            ))}
          {loading &&
            visbleHeaders.map((header) => (
              <Td key={header.key} align="left" type="custom">
                <SkeletonLine />
              </Td>
            ))}
          {loading &&
            visbleActions.map((action) => (
              <Td key={action.key} type="custom">
                <SkeletonLine />
              </Td>
            ))}
        </Tr>
      </Thead>
      <Tbody>
        {loading && (
          <Tr>
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              align="center"
              type="custom"
            >
              <SkeletonLine />
            </Td>
          </Tr>
        )}
        {!loading &&
          extraordinaryInstallments &&
          extraordinaryInstallments.length > 0 &&
          extraordinaryInstallments.map((row, indx) => (
            <Tr key={indx} zebra={indx % 2 !== 0}>
              {visbleHeaders.map((header) => (
                <Td key={header.key} align="left">
                  {(() => {
                    if (header.key === "datePayment") {
                      return formatPrimaryDate(
                        new Date(row[header.key] as string)
                      );
                    }
                    if (header.mask) {
                      return header.mask(row[header.key] as string | number);
                    }
                    return row[header.key] as React.ReactNode;
                  })()}
                </Td>
              ))}
              {visbleActions &&
                visbleActions.length > 0 &&
                visbleActions.map((action) => (
                  <Td key={action.key} type="custom">
                    {isMobile ? (
                      <ActionMobile
                        handleDelete={() => setIsOpenModalDelete(true)}
                        handleEdit={() => handleEdit(row)}
                      />
                    ) : (
                      <Detail
                        handleEdit={() => handleEdit(row)}
                        handleDelete={() => {
                          setSelectedDebtor(row);
                          setIsOpenModalDelete(true);
                        }}
                      />
                    )}
                  </Td>
                ))}
            </Tr>
          ))}
        {!loading && extraordinaryInstallments.length === 0 && (
          <Tr>
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              align="center"
              type="custom"
            >
              <Text
                size="large"
                type="label"
                appearance="gray"
                textAlign="center"
              >
                {dataTableExtraordinaryInstallment.noData}
              </Text>
            </Td>
          </Tr>
        )}
      </Tbody>
      {extraordinaryInstallments.length > 0 && !loading && (
        <Tfoot>
          <Tr border="bottom">
            <Td
              colSpan={visbleHeaders.length + visbleActions.length}
              type="custom"
              align="center"
            >
              <Pagination
                firstEntryInPage={firstEntryInPage}
                lastEntryInPage={lastEntryInPage}
                totalRecords={totalRecords}
                handleStartPage={handleStartPage}
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                handleEndPage={handleEndPage}
              />
            </Td>
          </Tr>
        </Tfoot>
      )}
      {isOpenModalDelete && (
        <DeleteModal
          handleClose={() => setIsOpenModalDelete(false)}
          handleDelete={() => handleExtraordinaryInstallment(initialValues)}
          TextDelete={dataTableExtraordinaryInstallment.content}
        />
      )}
      {isOpenModalEdit && (
        <EditSeriesModal
          handleClose={() => setIsOpenModalEdit(false)}
          onSubmit={() => setIsOpenModalEdit(false)}
          onConfirm={async (updatedDebtor) => {
            await handleUpdate(updatedDebtor);
          }}
          prospectData={prospectData}
          selectedDebtor={selectedDebtor}
          setSentData={setSentData}
          businessUnitPublicCode={businessUnitPublicCode}
        />
      )}
    </Table>
  );
};
