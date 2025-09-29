import {
  IProspect,
  IBorrower,
  ICreditProduct,
  IBorrowerProperty,
  IOutlay,
  IOrdinaryInstallmentsForPrincipal,
} from "./types";

export const mapperProspectResponseToIProspect = (
  response: IProspect
): IProspect => {
  const prospect: IProspect = {
    prospectId: response.prospectId,
    prospectCode: response.prospectCode,
    state: response.state,
    requestedAmount: response.requestedAmount,
    installmentLimit: response.installmentLimit,
    termLimit: response.termLimit,
    timeOfCreation: response.timeOfCreation,
    selectedRegularPaymentSchedule: response.selectedRegularPaymentSchedule,
    selectedRateType: response.selectedRateType,
    preferredPaymentChannelAbbreviatedName:
      response.preferredPaymentChannelAbbreviatedName,
    gracePeriod: response.gracePeriod,
    clientComments: response.clientComments,
    clientManagerObservation: response.clientManagerObservation,
    gracePeriodType: "",
    moneyDestinationAbbreviatedName: response.moneyDestinationAbbreviatedName,
    bondValue: response.bondValue,

    borrowers: response.borrowers.map(
      (borrower: IBorrower): IBorrower => ({
        borrowerName: borrower.borrowerName,
        borrowerType: borrower.borrowerType,
        borrowerIdentificationType: borrower.borrowerIdentificationType,
        borrowerIdentificationNumber: borrower.borrowerIdentificationNumber,
        borrowerProperties: borrower.borrowerProperties.map(
          (property: IBorrowerProperty): IBorrowerProperty => ({
            propertyName: property.propertyName,
            propertyValue: property.propertyValue,
          })
        ),
      })
    ),

    creditProducts: response.creditProducts.map(
      (product: ICreditProduct): ICreditProduct => ({
        creditProductCode: product.creditProductCode,
        loanAmount: product.loanAmount,
        lineOfCreditAbbreviatedName: product.lineOfCreditAbbreviatedName,
        interestRate: product.interestRate,
        loanTerm: product.loanTerm,
        schedule: product.installmentFrequency || "",
        ordinaryInstallmentsForPrincipal:
          product.ordinaryInstallmentsForPrincipal.map(
            (
              installment: IOrdinaryInstallmentsForPrincipal
            ): IOrdinaryInstallmentsForPrincipal => ({
              numberOfInstallments: installment.numberOfInstallments,
              schedule: installment.installmentFrequency || "",
              installmentAmount: installment.installmentAmount,
              paymentChannelAbbreviatedName:
                installment.paymentChannelAbbreviatedName,
            })
          ),
        referenceIndexForVariableInterestRate:
          product.referenceIndexForVariableInterestRate,
      })
    ),

    outlays: response.outlays.map(
      (outlay: IOutlay): IOutlay => ({
        date: outlay.date,
        amount: outlay.amount,
      })
    ),

    consolidatedCredits: response.consolidatedCredits || undefined,
  };

  return prospect;
};
