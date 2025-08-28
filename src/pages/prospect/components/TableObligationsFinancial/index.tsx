import { useState, useEffect } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { updateProspect } from "@services/prospect/updateProspect";
import { IBorrower, IProspect, IBorrowerProperty } from "@services/prospect/types";
import { optionsSelect, IFinancialObligation } from "@/components/modals/ReportCreditsModal/index.tsx";
import { getSearchProspectByCode } from "@services/prospect/ProspectByCode";

import { headers } from "./config";
import { TableFinancialObligationsUI } from "./interface";
import { IProperty } from "./types";

export interface ITableFinancialObligationsProps {
  prospectId?: string;
  businessUnitPublicCode?: string;
  type?: string;
  id?: string;
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
}

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps
) => {
  const { refreshKey, showActions, businessUnitPublicCode = "fondecom", prospectId = "67f7e8f52c014414fca8b52d", selectedBorrower, newObligation } = props;

  const [dataProspect, setDataProspect] = useState<IProspect[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);
  const [borrowersListFinancialObligation, setBorrowersListFinancialObligation] = useState<IBorrowerProperty[]>([]);

  const handleEdit = (debtor: ITableFinancialObligationsProps, index: number) => {
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
      indexOnTable: index
    });
    setIsModalOpenEdit(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);

    getSearchProspectByCode(businessUnitPublicCode, prospectId).then((res) => {
      setDataProspect([res]);
    });

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const financialObligationBorrowers = filterListBorrowersFinancialObligation();

    if (financialObligationBorrowers) {
      setBorrowersListFinancialObligation(financialObligationBorrowers);
    }
  }, [selectedBorrower, dataProspect]);

  useEffect(() => {
    if (newObligation) {
      saveNewObligation();
    }
  }, [newObligation]);

  const isMobile = useMediaQuery("(max-width:880px)");

  const visibleHeaders = isMobile
    ? headers.filter(
      (header) =>
        ["type", "balance", "actions"].includes(header.key) &&
        (showActions || header.key !== "actions")
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
          (prop: IProperty) => prop.propertyName === "FinancialObligation"
        ) || [];

      setExtraDebtors([...financialObligationsFromProps]);
    } else {
      setExtraDebtors([]);
    }
  }, [refreshKey, dataProspect]);

  const handleDelete = async (id: number, borrowerIdentificationNumber: string) => {
    try {
      const newContentTable = deleteFinancialObligation(id, borrowerIdentificationNumber);

      if (!newContentTable) return;

      await updateProspect(businessUnitPublicCode, newContentTable[0]);

      if (setDataProspect === undefined) throw new Error("setDataProspect is not defined");

      setDataProspect(newContentTable);
    } catch (error) {
      console.error("Failed to delete debtor:", error);
    }
  };

  const deleteFinancialObligation = (indexPropertyOnTable: number, borrowerIdentificationNumber: string) => {
    const {
      indexBorrower,
      indexProperty
    } = findFinancialObligation(indexPropertyOnTable, borrowerIdentificationNumber);

    const newContentTable = structuredClone(dataProspect);

    if (!setDataProspect || !newContentTable) return;

    newContentTable[0].borrowers[indexBorrower].borrowerProperties.splice(indexProperty, 1);

    setDataProspect(newContentTable);

    return newContentTable;

  }
  const handleUpdate = async (
    updatedBorrower: ITableFinancialObligationsProps
  ) => {
    try {
      if (!updatedBorrower.borrowerIdentificationNumber || updatedBorrower.fee === undefined || updatedBorrower.balance === undefined) return;

      const newContentTable = editFinancialObligation(
        updatedBorrower.indexOnTable as number,
        updatedBorrower.borrowerIdentificationNumber,
        updatedBorrower.fee.toString(),
        updatedBorrower.balance.toString()
      );

      if (!newContentTable) return;

      await updateProspect(businessUnitPublicCode, newContentTable[0]);

      setDataProspect(newContentTable);

      setIsModalOpenEdit(false);
    } catch (error) {
      console.error("Error al actualizar la obligación financiera: ", error);
    }
  };

  const editFinancialObligation = (
    indexPropertyOnTable: number,
    borrowerIdentificationNumber: string,
    newFee: string,
    newBalance: string
  ) => {
    if (!dataProspect) return null;

    const newContentTable = structuredClone(dataProspect);

    const {
      indexBorrower,
      indexProperty
    } = findFinancialObligation(indexPropertyOnTable, borrowerIdentificationNumber);

    const borrowerToUpdate = newContentTable[0].borrowers[indexBorrower];

    const originalPropertyValue = borrowerToUpdate.borrowerProperties[indexProperty].propertyValue;
    const originalValues = typeof originalPropertyValue === "string" ? originalPropertyValue.split(",") : ["", "", ""];
    const cleanNewBalance = newBalance.replace(/[$,.]/g, '');
    const cleanNewFee = newFee.replace(/[$,.]/g, '');

    originalValues[1] = cleanNewBalance;
    originalValues[2] = cleanNewFee;

    borrowerToUpdate.borrowerProperties[indexProperty].propertyValue = originalValues.join(",");
    return newContentTable;
  };

  const filterListBorrowersFinancialObligation = () => {
    if (!dataProspect) return;

    let listsBorrowers: IBorrowerProperty[] = [];

    dataProspect[0].borrowers.map((borrower) => {
      if (borrower.borrowerIdentificationNumber !== selectedBorrower?.value) return;

      borrower.borrowerProperties.map((property) => {
        if (property.propertyName === "FinancialObligation") {
          listsBorrowers.push({
            propertyName: borrower.borrowerName,
            propertyValue: property.propertyValue,
            borrowerIdentificationNumber: borrower.borrowerIdentificationNumber
          } as IBorrowerProperty);

          return borrower;
        }
      });
    });

    return listsBorrowers;
  }
  const addFinancialObligation = (newObligation: IFinancialObligation) => {
    if (!dataProspect || !selectedBorrower?.value) {
      console.error("No se puede añadir la obligación: faltan datos del prospecto o el deudor no está seleccionado.");
      return null;
    }

    const [paidFees, totalFees] = newObligation.feePaid.split('/');
    const newPropertyValue = [
      newObligation.type,
      newObligation.balance,
      newObligation.fee,
      newObligation.entity,
      newObligation.payment,
      newObligation.idUser, // TOCA EL DEL USUARIIOOO
      paidFees,
      totalFees,
    ].join(',');

    const newProperty: IBorrowerProperty = {
      propertyName: 'FinancialObligation',
      propertyValue: newPropertyValue,
    };

    const newContentTable = structuredClone(dataProspect);

    const borrowerIndex = newContentTable[0].borrowers.findIndex(
      (borrower) => borrower.borrowerIdentificationNumber === selectedBorrower.value
    );

    if (borrowerIndex === -1) {
      console.error("Deudor seleccionado no encontrado.");
      return null;
    }

    const borrowerToUpdate = newContentTable[0].borrowers[borrowerIndex];

    let lastObligationIndex = -1;
    for (let i = borrowerToUpdate.borrowerProperties.length - 1; i >= 0; i--) {
      if (borrowerToUpdate.borrowerProperties[i].propertyName === 'FinancialObligation') {
        lastObligationIndex = i;
        break;
      }
    }

    if (lastObligationIndex !== -1) {
      borrowerToUpdate.borrowerProperties.splice(lastObligationIndex + 1, 0, newProperty);
    } else {
      borrowerToUpdate.borrowerProperties.push(newProperty);
    }

    return newContentTable;
  };

  const saveNewObligation = async () => {
    try {
      if (!newObligation) return;

      const newContentTable = addFinancialObligation(newObligation);

      if (!newContentTable) return;

      await updateProspect(businessUnitPublicCode, newContentTable[0]);

      setDataProspect(newContentTable);
    } catch (error) {
      console.error("Error al guardar la nueva obligación financiera: ", error);
    }
  };

  const findFinancialObligation = (indexPropertyOnTable: number, borrowerIdentificationNumber: string) => {
    let indexBorrower = 0;
    let indexPropertyFinancialObligation = -1;
    let indexProperty = 0;

    if (!dataProspect) return { indexBorrower, indexProperty };

    dataProspect[0].borrowers.map((borrower, index) => {
      if (borrower.borrowerIdentificationNumber === borrowerIdentificationNumber) {
        indexBorrower = index;

        borrower.borrowerProperties.map((property, indexPropertyMap) => {
          if (property.propertyName === "FinancialObligation") {
            indexPropertyFinancialObligation++;
          }

          if (property.propertyName === "FinancialObligation" && indexPropertyFinancialObligation === indexPropertyOnTable) {
            indexProperty = indexPropertyMap;
          }
        })
      }
    });

    return {
      indexBorrower,
      indexProperty
    };
  }

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
    />
  );
};
