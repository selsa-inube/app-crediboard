import { useState, useEffect } from "react";
import { useMediaQuery } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { updateProspect } from "@services/prospect/updateProspect";
import { removeProspect } from "@services/prospect/removeProspect";
import { IBorrower, IProspect } from "@services/prospect/types";

import { headers } from "./config";
import { TableFinancialObligationsUI } from "./interface";
import { IProperty } from "./types";

export interface ITableFinancialObligationsProps {
  businessUnitPublicCode?: string;
  type?: string;
  id?: string;
  propertyValue?: string;
  balance?: string;
  fee?: string;
  initialValues?: IProspect[];
  refreshKey?: number;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
}

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps
) => {
  const { refreshKey, initialValues, showActions, businessUnitPublicCode } = props;
  const [loading, setLoading] = useState(true);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);

  const handleEdit = (debtor: ITableFinancialObligationsProps) => {
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
    });
    setIsModalOpenEdit(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  const isMobile = useMediaQuery("(max-width:880px)");

  const visibleHeaders = isMobile
    ? headers.filter(
        (header) =>
          ["type", "balance", "actions"].includes(header.key) &&
          (showActions || header.key !== "actions")
      )
    : headers.filter((header) => showActions || header.key !== "actions");

  useEffect(() => {
    const data = Array.isArray(initialValues) ? initialValues : [initialValues];

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
  }, [refreshKey, initialValues]);

  const handleDelete = async (id: string) => {
    try {
      const updatedDebtors = extraDebtors.filter((debtor) => debtor.id !== id);
      setExtraDebtors(updatedDebtors);

      if (businessUnitPublicCode) {
        await removeProspect(businessUnitPublicCode, id);
      }

      console.log(`Debtor with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete debtor:", error);
    }
  };

  const handleUpdate = async (
    updatedDebtor: ITableFinancialObligationsProps
  ) => {
    try {
      const updatedDebtors = extraDebtors.map((debtor) =>
        debtor.id === updatedDebtor.id ? updatedDebtor : debtor
      );
      setExtraDebtors(updatedDebtors);

      if (businessUnitPublicCode) {
        const updatedDebtors = extraDebtors.filter((debtor) => debtor.id !== updatedDebtor.id);
        await updateProspect(businessUnitPublicCode, updatedDebtors);
      }
      
      setIsModalOpenEdit(false);
    } catch (error) {
      console.error("Error updating debtor:", error);
    }
  };

  const dataInformation =
    (initialValues?.[0]?.borrowers?.[0]?.borrowerProperties?.filter(
      (prop: IProperty) => prop.propertyName === "FinancialObligation"
    ) ??
      extraDebtors) ||
    [];

  return (
    <TableFinancialObligationsUI
      dataInformation={dataInformation}
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
