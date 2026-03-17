import { ICustomerData } from "@pages/prospect/components/AddProductModal/config";
import { IProspect } from "@services/creditRequest/query/ProspectByCode/types";

const documentClientNumber = (dataProspect: IProspect): ICustomerData => {
  const mainBorrower = dataProspect.borrowers?.find(
    (borrower) => borrower.borrowerType === "MainBorrower",
  );
  return {
    clientIdinteficationNumber:
      mainBorrower?.borrowerIdentificationNumber || "",
    clientIdinteficationType: mainBorrower?.borrowerIdentificationType || "",
  };
};

export { documentClientNumber };
