import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { updateProspect } from "@services/prospect/updateProspect";
import {
  IBorrower,
  IProspect,
  IBorrowerProperty,
} from "@services/prospect/types";
import {
  optionsSelect,
  IFinancialObligation,
} from "@components/modals/ReportCreditsModal/index.tsx";
import { getSearchProspectByCode } from "@services/creditRequest/query/ProspectByCode";
import { useEnum } from "@hooks/useEnum";

import { headers, ROWS_PER_PAGE, errorMessages } from "./config";
import { TableFinancialObligationsUI } from "./interface";
import { IProperty } from "./types";
import { ICrediboardData } from "@context/AppContext/types";

export interface ITableFinancialObligationsProps {
  eventData?: ICrediboardData;
  prospectId?: string;
  businessUnitPublicCode?: string;
  businessManagerCode?: string;
  type?: string;
  creditRequestCode?: string;
  propertyValue?: string;
  balance?: string;
  fee?: string;
  dataProspect?: IProspect[];
  refreshKey?: number;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
  selectedBorrower?: optionsSelect;
  borrowerIdentificationNumber?: string;
  indexOnTable?: number;
  newObligation?: IFinancialObligation;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  currentPage?: number;
  onObligationProcessed?: () => void;
}

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps,
) => {
  const {
    refreshKey,
    showActions,
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestCode,
    selectedBorrower,
    newObligation,
    onObligationProcessed,
    eventData,
  } = props;
  const { lang } = useEnum();

  const [dataProspect, setDataProspect] = useState<IProspect[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);
  const [
    borrowersListFinancialObligation,
    setBorrowersListFinancialObligation,
  ] = useState<IBorrowerProperty[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [gotEndPage, setGotEndPage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessingObligation, setIsProcessingObligation] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEdit = useCallback(
    (debtor: ITableFinancialObligationsProps, index: number) => {
      let balance = "";
      let fee = "";

      if (typeof debtor.propertyValue === "string") {
        const values = debtor.propertyValue.split(",");
        balance = currencyFormat(Number(values[1]?.trim() || 0), false);
        fee = currencyFormat(Number(values[2]?.trim() || 0), false);
      }

      setSelectedDebtor({
        ...debtor,
        balance,
        fee,
        indexOnTable: index,
      });
      setIsModalOpenEdit(true);
    },
    [],
  );

  const filterListBorrowersFinancialObligation = useCallback(() => {
    if (!dataProspect) return;

    const listsBorrowers: IBorrowerProperty[] = [];
    let countIndex = 0;

    dataProspect[0].borrowers.map((borrower) => {
      if (borrower.borrowerIdentificationNumber !== selectedBorrower?.value)
        return;

      borrower.borrowerProperties.map((property) => {
        if (property.propertyName === "FinancialObligation") {
          listsBorrowers.push({
            id: countIndex,
            propertyName: borrower.borrowerName,
            propertyValue: property.propertyValue,
            borrowerIdentificationNumber: borrower.borrowerIdentificationNumber,
          } as IBorrowerProperty);

          countIndex++;

          return borrower;
        }
      });
    });

    return listsBorrowers;
  }, [dataProspect, selectedBorrower?.value]);

  const addFinancialObligation = useCallback(
    (newObligation: IFinancialObligation) => {
      if (!dataProspect || !selectedBorrower?.value) {
        console.error(
          "No se puede añadir la obligación: faltan datos del prospecto o el deudor no está seleccionado.",
        );
        return null;
      }

      const [paidFees, totalFees] = newObligation.feePaid.split("/");
      const newPropertyValue = [
        newObligation.type,
        newObligation.balance,
        newObligation.fee,
        newObligation.entity,
        newObligation.payment,
        newObligation.idUser,
        paidFees,
        totalFees,
      ].join(",");

      const newProperty: IBorrowerProperty = {
        propertyName: "FinancialObligation",
        propertyValue: newPropertyValue,
      };

      const newContentTable = structuredClone(dataProspect);

      const borrowerIndex = newContentTable[0].borrowers.findIndex(
        (borrower) =>
          borrower.borrowerIdentificationNumber === selectedBorrower.value,
      );

      if (borrowerIndex === -1) {
        console.error("Deudor seleccionado no encontrado.");
        return null;
      }

      const borrowerToUpdate = newContentTable[0].borrowers[borrowerIndex];

      let lastObligationIndex = -1;
      for (
        let i = borrowerToUpdate.borrowerProperties.length - 1;
        i >= 0;
        i--
      ) {
        if (
          borrowerToUpdate.borrowerProperties[i].propertyName ===
          "FinancialObligation"
        ) {
          lastObligationIndex = i;
          break;
        }
      }

      if (lastObligationIndex !== -1) {
        borrowerToUpdate.borrowerProperties.splice(
          lastObligationIndex + 1,
          0,
          newProperty,
        );
      } else {
        borrowerToUpdate.borrowerProperties.push(newProperty);
      }

      return newContentTable;
    },
    [dataProspect, selectedBorrower?.value],
  );

  const findFinancialObligation = useCallback(
    (indexPropertyOnTable: number, borrowerIdentificationNumber: string) => {
      let indexBorrower = 0;
      let indexPropertyFinancialObligation = -1;
      let indexProperty = 0;

      if (!dataProspect) return { indexBorrower, indexProperty };

      dataProspect[0].borrowers.map((borrower, index) => {
        if (
          borrower.borrowerIdentificationNumber === borrowerIdentificationNumber
        ) {
          indexBorrower = index;

          borrower.borrowerProperties.map((property, indexPropertyMap) => {
            if (property.propertyName === "FinancialObligation") {
              indexPropertyFinancialObligation++;
            }

            if (
              property.propertyName === "FinancialObligation" &&
              indexPropertyFinancialObligation === indexPropertyOnTable
            ) {
              indexProperty = indexPropertyMap;
            }
          });
        }
      });

      return {
        indexBorrower,
        indexProperty,
      };
    },
    [dataProspect],
  );

  const saveNewObligation = useCallback(async () => {
    try {
      if (!newObligation || isProcessingObligation) return;

      setIsProcessingObligation(true);

      const newContentTable = addFinancialObligation(newObligation);

      if (!newContentTable) return;

      await updateProspect(
        businessUnitPublicCode || "",
        businessManagerCode || "",
        newContentTable[0],
        eventData?.token || "",
      );

      if (borrowersListFinancialObligation.length % ROWS_PER_PAGE === 0) {
        setGotEndPage(true);
      }

      setDataProspect(newContentTable);

      if (onObligationProcessed) {
        onObligationProcessed();
      }
    } catch (error) {
      setIsProcessingObligation(false);
      setErrorMessage(errorMessages.save.description);
      setErrorModal(true);
    } finally {
      setIsProcessingObligation(false);
    }
  }, [
    newObligation,
    isProcessingObligation,
    addFinancialObligation,
    businessManagerCode,
    businessUnitPublicCode,
    borrowersListFinancialObligation.length,
    setGotEndPage,
    setDataProspect,
    onObligationProcessed,
    eventData?.token
  ]);

  useEffect(() => {
    if (newObligation && !isProcessingObligation) {
      saveNewObligation();
    }
  }, [newObligation, saveNewObligation, isProcessingObligation]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);

    getSearchProspectByCode(
      businessUnitPublicCode || "",
      businessManagerCode || "",
      creditRequestCode || "",
      eventData?.token || "",
    ).then((res) => {
      setDataProspect([res]);
    });

    return () => clearTimeout(timeout);
  }, [businessUnitPublicCode, creditRequestCode, businessManagerCode, eventData?.token]);

  useEffect(() => {
    const financialObligationBorrowers =
      filterListBorrowersFinancialObligation();

    if (financialObligationBorrowers) {
      setBorrowersListFinancialObligation(financialObligationBorrowers);
    }
  }, [selectedBorrower, dataProspect, filterListBorrowersFinancialObligation]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedBorrower]);

  const isMobile = useMediaQuery("(max-width:880px)");

  const visibleHeaders = isMobile
    ? headers.filter(
        (header) =>
          ["type", "balance", "actions"].includes(header.key) &&
          (showActions || header.key !== "actions"),
      )
    : headers.filter((header) => showActions || header.key !== "actions");

  useEffect(() => {
    const data = Array.isArray(dataProspect) ? dataProspect : [dataProspect];

    if (data && data.length > 0) {
      const borrowerList = Array.isArray(data[0]?.borrowers)
        ? (data[0]?.borrowers as IBorrower[])
        : [];

      const financialObligationsFromProps =
        borrowerList?.[0]?.borrowerProperties?.filter(
          (prop: IProperty) => prop.propertyName === "FinancialObligation",
        ) || [];

      setExtraDebtors([...financialObligationsFromProps]);
    } else {
      setExtraDebtors([]);
    }
  }, [refreshKey, dataProspect]);

  const editFinancialObligation = useCallback(
    (
      indexPropertyOnTable: number,
      borrowerIdentificationNumber: string,
      newFee: string,
      newBalance: string,
    ) => {
      if (!dataProspect) return null;

      const newContentTable = structuredClone(dataProspect);

      const { indexBorrower, indexProperty } = findFinancialObligation(
        indexPropertyOnTable,
        borrowerIdentificationNumber,
      );

      const borrowerToUpdate = newContentTable[0].borrowers[indexBorrower];

      const originalPropertyValue =
        borrowerToUpdate.borrowerProperties[indexProperty].propertyValue;
      const originalValues =
        typeof originalPropertyValue === "string"
          ? originalPropertyValue.split(",")
          : ["", "", ""];
      const cleanNewBalance = newBalance.replace(/[$,.]/g, "");
      const cleanNewFee = newFee.replace(/[$,.]/g, "");

      originalValues[1] = cleanNewBalance;
      originalValues[2] = cleanNewFee;

      borrowerToUpdate.borrowerProperties[indexProperty].propertyValue =
        originalValues.join(",");
      return newContentTable;
    },
    [dataProspect, findFinancialObligation],
  );

  const moveBeforePage = useCallback(() => {
    const totalPages =
      Math.ceil(borrowersListFinancialObligation.length / ROWS_PER_PAGE) || 1;
    const isTheLastRegisterOnPage =
      totalPages - 1 === currentPage &&
      (borrowersListFinancialObligation.length % ROWS_PER_PAGE) - 1 === 0;

    if (totalPages - 1 === currentPage && isTheLastRegisterOnPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [borrowersListFinancialObligation.length, currentPage]);

  const deleteFinancialObligation = useCallback(
    (indexPropertyOnTable: number, borrowerIdentificationNumber: string) => {
      const { indexBorrower, indexProperty } = findFinancialObligation(
        indexPropertyOnTable,
        borrowerIdentificationNumber,
      );

      const newContentTable = structuredClone(dataProspect);

      if (!setDataProspect || !newContentTable) return;

      newContentTable[0].borrowers[indexBorrower].borrowerProperties.splice(
        indexProperty,
        1,
      );

      return newContentTable;
    },
    [dataProspect, findFinancialObligation],
  );

  const handleDelete = useCallback(
    async (id: number, borrowerIdentificationNumber: string) => {
      setShowDeleteModal(true);
      const newContentTable = deleteFinancialObligation(
        id,
        borrowerIdentificationNumber,
      );

      if (!newContentTable) return;

      await updateProspect(
        businessUnitPublicCode || "",
        businessManagerCode || "",
        newContentTable[0],
        eventData?.token || "",
      );

      if (setDataProspect === undefined) return;

      setDataProspect(newContentTable);

      moveBeforePage();
    },
    [
      businessUnitPublicCode,
      businessManagerCode,
      deleteFinancialObligation,
      moveBeforePage,
      eventData?.token,
    ],
  );

  const handleUpdate = useCallback(
    async (updatedBorrower: ITableFinancialObligationsProps) => {
      try {
        if (
          !updatedBorrower.borrowerIdentificationNumber ||
          updatedBorrower.fee === undefined ||
          updatedBorrower.balance === undefined
        )
          return;

        const newContentTable = editFinancialObligation(
          updatedBorrower.indexOnTable as number,
          updatedBorrower.borrowerIdentificationNumber,
          updatedBorrower.fee.toString(),
          updatedBorrower.balance.toString(),
        );

        if (!newContentTable) return;

        await updateProspect(
          businessUnitPublicCode || "",
          businessManagerCode || "",
          newContentTable[0],
          eventData?.token || "",
        );

        setDataProspect(newContentTable);

        setIsModalOpenEdit(false);
      } catch (error) {
        setErrorMessage(errorMessages.update.description);
        setErrorModal(true);
      }
    },
    [editFinancialObligation, businessUnitPublicCode, businessManagerCode,  eventData?.token],
  );

  return (
    <TableFinancialObligationsUI
      dataInformation={borrowersListFinancialObligation}
      extraDebtors={extraDebtors}
      loading={loading}
      visibleHeaders={visibleHeaders}
      isMobile={isMobile}
      selectedDebtor={selectedDebtor}
      isModalOpenEdit={isModalOpenEdit}
      setIsModalOpenEdit={setIsModalOpenEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      gotEndPage={gotEndPage}
      setGotEndPage={setGotEndPage}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      setErrorModal={setErrorModal}
      errorMessage={errorMessage}
      errorModal={errorModal}
      lang={lang}
    />
  );
};
