import { useEffect, useState, useContext } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import {
  IExtraordinaryInstallments,
  IProspect,
} from "@services/creditRequest/query/ProspectByCode/types";
import { EnumType } from "@hooks/useEnum";
import { AppContext } from "@context/AppContext";
import { searchExtraInstallmentPaymentCyclesByCustomerCode } from "@services/creditLimit/extraInstallmentPaymentCyles/searchExtraInstallmentPaymentCyclesByCustomerCode";
import {
  IExtraordinaryAgreement,
  IExtraordinaryCycle,
} from "@services/creditLimit/types";
import { IExtraordinaryInstallmentsAddSeries } from "@services/creditRequest/query/ProspectByCode/types";
import { SystemStateContext } from "@context/systemStateContext";
import {
  manageShowError,
  IError,
} from "@context/systemStateContextProvider/utils";

import { removeExtraordinaryInstallment } from "../../../board/outlets/financialReporting/CommercialManagement/utils";
import {
  headersTableExtraordinaryInstallment,
  rowsVisbleMobile,
  rowsActions,
} from "./config";
import { TableExtraordinaryInstallmentUI } from "./interface";

export interface TableExtraordinaryInstallmentProps {
  [key: string]: unknown | string | number;
  prospectData?: IProspect;
  refreshKey?: number;
  businessUnitPublicCode?: string;
  extraordinary?: TableExtraordinaryInstallmentProps[];
  service?: boolean;
  lang?: EnumType;
  businessManagerCode?: string;
  setSentData?: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallmentsAddSeries | null>
  >;
  handleClose?: () => void;
  handleDelete?: (id: string) => void;
  creditRequestCode?: string;
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

  const paddingCount = pageLength - currentData.length;
  const paddingItems = Array.from({
    length: paddingCount > 0 ? paddingCount : 0,
  }).map((_, i) => ({
    __isPadding: true,
    id: `padding-${i}`,
  }));

  const paddedCurrentData = [...currentData, ...paddingItems];
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
    paddedCurrentData,
  };
};

export const TableExtraordinaryInstallment = (
  props: TableExtraordinaryInstallmentProps,
) => {
  const {
    refreshKey,
    prospectData,
    businessUnitPublicCode,
    extraordinary,
    lang,
    service = true,
    setSentData,
    handleClose,
    handleDelete,
    creditRequestCode,
  } = props;
  const { setShowModalError, setMessageError } = useContext(SystemStateContext);
  const { eventData } = useContext(AppContext);
  const headers = headersTableExtraordinaryInstallment;
  const isMobile = useMediaQuery("(max-width:880px)");

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [paymentCycles, setPaymentCycles] = useState<IExtraordinaryCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalView, setIsOpenModalView] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const visbleHeaders = isMobile
    ? headers.filter((header) => rowsVisbleMobile.includes(header.key))
    : headers;
  const visbleActions = isMobile
    ? rowsActions.filter((action) => rowsVisbleMobile.includes(action.key))
    : rowsActions;

  const [extraordinaryInstallments, setExtraordinaryInstallments] = useState<
    TableExtraordinaryInstallmentProps[]
  >([]);
  const [selectedDebtor, setSelectedDebtor] =
    useState<TableExtraordinaryInstallmentProps>({});
  const [installmentState, setInstallmentState] = useState<{
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  }>({
    installmentAmount: 0,
    installmentDate: "",
    paymentChannelAbbreviatedName: "",
  });

  const paginationProps = usePagination(extraordinaryInstallments);

  const itemIdentifiersForUpdate: IExtraordinaryInstallments = {
    creditRequestCode: creditRequestCode || "",
    extraordinaryInstallments: selectedDebtor?.id
      ? [
          {
            installmentDate:
              typeof selectedDebtor.datePayment === "string"
                ? selectedDebtor.datePayment
                : new Date(
                    selectedDebtor.datePayment as string | number | Date,
                  ).toISOString(),
            installmentAmount: Number(selectedDebtor.value),
            paymentChannelAbbreviatedName: String(selectedDebtor.paymentMethod),
            payrollForDeductionAgreementCode: String(
              selectedDebtor.payrollForDeductionAgreementCode || "",
            ),
          },
        ]
      : [],
  };

  useEffect(() => {
    const fetchPaymentCycles = async () => {
      if (
        !eventData?.user.identificationDocumentNumber ||
        !businessUnitPublicCode ||
        prospectData === undefined
      )
        return;

      try {
        const product = prospectData.creditProducts?.[0];

        const clientIdentificationName = prospectData?.borrowers?.map(
          (borrower) => {
            if (borrower?.borrowerType === "MainBorrower") {
              return borrower?.borrowerIdentificationNumber;
            }
          },
        );

        const response: IExtraordinaryAgreement[] | null =
          await searchExtraInstallmentPaymentCyclesByCustomerCode(
            businessUnitPublicCode,
            clientIdentificationName[0] || "",
            product?.lineOfCreditAbbreviatedName || "",
            prospectData?.moneyDestinationAbbreviatedName || "",
            eventData.token,
          );

        if (response && response.length > 0) {
          const allCycles = response.flatMap((agreement) =>
            agreement.extraordinaryCycles.map((cycle) => ({
              ...cycle,
              payrollForDeductionAgreementCode:
                agreement.payrollForDeductionAgreementCode,
            })),
          );

          setPaymentCycles(allCycles);
        }
      } catch (error) {
        manageShowError(error as IError, setMessageError, setShowModalError);
      }
    };

    if (service) {
      fetchPaymentCycles();
    }
  }, [
    setMessageError,
    setShowModalError,
    businessUnitPublicCode,
    prospectData,
    service,
    eventData.token,
    eventData?.user.identificationDocumentNumber,
  ]);

  useEffect(() => {
    if (prospectData?.creditProducts) {
      const extraordinaryInstallmentsFlat = prospectData.creditProducts.flatMap(
        (product) => {
          const installments = product.extraordinaryInstallments;

          if (!Array.isArray(installments)) return [];

          return installments.map((installment) => {
            const matchingCycle = paymentCycles.find(
              (cycle) =>
                cycle.extraordinaryCycleType ===
                installment.paymentChannelAbbreviatedName,
            );
            return {
              id: `${product.creditProductCode},${installment.installmentDate},${installment.paymentChannelAbbreviatedName}`,
              datePayment: installment.installmentDate,
              value: installment.installmentAmount,
              paymentMethod: installment.paymentChannelAbbreviatedName,
              creditProductCode: product.creditProductCode,
              cycleName: matchingCycle
                ? matchingCycle.extraordinaryCycleType
                : "",
              payrollForDeductionAgreementCode:
                matchingCycle?.payrollForDeductionAgreementCode || "",
            };
          });
        },
      );

      const installmentsByUniqueKey = extraordinaryInstallmentsFlat.reduce(
        (
          installmentsAccumulator: Record<
            string,
            TableExtraordinaryInstallmentProps
          >,
          currentInstallment,
        ) => {
          const uniqueKey = `${currentInstallment.creditProductCode}_${currentInstallment.datePayment}_${currentInstallment.paymentMethod}`;

          if (installmentsAccumulator[uniqueKey]) {
            const existingValue =
              (installmentsAccumulator[uniqueKey].value as number) || 0;
            const newValue = (currentInstallment.value as number) || 0;
            installmentsAccumulator[uniqueKey].value = existingValue + newValue;
          } else {
            installmentsAccumulator[uniqueKey] = { ...currentInstallment };
          }

          return installmentsAccumulator;
        },
        {},
      );

      const extraordinaryInstallmentsUpdate = (
        Object.values(
          installmentsByUniqueKey,
        ) as TableExtraordinaryInstallmentProps[]
      ).sort((first, second) => {
        const dateA = first.datePayment
          ? new Date(first.datePayment as string).getTime()
          : 0;
        const dateB = second.datePayment
          ? new Date(second.datePayment as string).getTime()
          : 0;
        return dateA - dateB;
      });

      setExtraordinaryInstallments(extraordinaryInstallmentsUpdate);
    }
    setLoading(false);
  }, [prospectData, refreshKey, paymentCycles]);

  useEffect(() => {
    if (extraordinary && Array.isArray(extraordinary)) {
      const sortedExtraordinary = extraordinary.sort((first, second) => {
        const dateA = first.datePayment
          ? new Date(first.datePayment as string).getTime()
          : 0;
        const dateB = second.datePayment
          ? new Date(second.datePayment as string).getTime()
          : 0;
        return dateA - dateB;
      });
      setExtraordinaryInstallments(sortedExtraordinary);
      setLoading(false);
    }
  }, [extraordinary]);

  const handleDeleteAction = async () => {
    if (handleDelete && selectedDebtor.id) {
      handleDelete(selectedDebtor.id as string);
      setIsOpenModalDelete(false);
    } else if (service) {
      try {
        setIsLoadingDelete(true);
        await removeExtraordinaryInstallment(
          businessUnitPublicCode ?? "",
          itemIdentifiersForUpdate,
          eventData.token,
        );

        setSentData?.(
          itemIdentifiersForUpdate as IExtraordinaryInstallmentsAddSeries,
        );
        setIsLoadingDelete(false);
        setIsOpenModalDelete(false);
        handleClose?.();
      } catch (error: unknown) {
        setIsLoadingDelete(false);
        manageShowError(error as IError, setMessageError, setShowModalError);
      }
    }
  };

  return (
    <>
      <TableExtraordinaryInstallmentUI
        loading={loading}
        visbleHeaders={visbleHeaders}
        visbleActions={visbleActions}
        extraordinaryInstallments={extraordinaryInstallments}
        isMobile={isMobile}
        isOpenModalDelete={isOpenModalDelete}
        businessUnitPublicCode={businessUnitPublicCode ?? ""}
        prospectData={prospectData}
        setIsOpenModalDelete={setIsOpenModalDelete}
        usePagination={paginationProps}
        setSentData={setSentData ?? (() => {})}
        handleClose={handleClose}
        setSelectedDebtor={setSelectedDebtor}
        setInstallmentState={setInstallmentState}
        handleDelete={handleDelete}
        service={service}
        itemIdentifiersForUpdate={itemIdentifiersForUpdate}
        handleDeleteAction={handleDeleteAction}
        installmentState={installmentState}
        isOpenModalView={isOpenModalView}
        setIsOpenModalView={setIsOpenModalView}
        setOpenMenuIndex={setOpenMenuIndex}
        openMenuIndex={openMenuIndex}
        isLoadingDelete={isLoadingDelete}
        lang={lang as EnumType}
      />
    </>
  );
};
