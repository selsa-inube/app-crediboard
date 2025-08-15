import { Button, IOption, Select, Stack, Text } from "@inubekit/inubekit";
import { IProspect } from "@services/prospect/types";
import { IncomeBorrower } from "@pages/prospect/components/modals/DebtorDetailsModal/incomeDebtor";

import { BaseModal } from "../baseModal";
import { dataCreditProspect } from "./config";

interface IIncomeBorrowersModalProps {
  borrowersProspect: IProspect | undefined;
  borrowerOptions: IOption[];
  selectedIndex: number;
  dataProspect: IProspect[];
  selectedBorrower: IProspect["borrowers"][number] | undefined;
  isMobile: boolean;
  handleCloseModal: () => void;
  handleChange: (name: string, newValue: string) => void;
  setOpenModal: (modal: string) => void;
}

export function IncomeBorrowersModal(props: IIncomeBorrowersModalProps) {
  const {
    borrowersProspect,
    borrowerOptions,
    selectedIndex,
    dataProspect,
    selectedBorrower,
    isMobile,
    handleCloseModal,
    handleChange,
    setOpenModal,
  } = props;

  const currentBorrower =
    dataProspect[0]?.borrowers?.find(
      (borrower) =>
        borrower.borrowerName === borrowerOptions[selectedIndex]?.value
    ) || selectedBorrower;

  return (
    <BaseModal
      title={dataCreditProspect.incomeSources}
      nextButton={dataCreditProspect.close}
      handleNext={handleCloseModal}
      handleClose={handleCloseModal}
      width={isMobile ? "300px" : "auto"}
    >
      {borrowersProspect ? (
        <>
          <Stack
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "end"}
            width="100%"
            gap="16px"
          >
            <Select
              label="Deudor"
              id="borrower"
              name="borrower"
              options={borrowerOptions}
              value={borrowerOptions[selectedIndex]?.value}
              onChange={handleChange}
              fullwidth={isMobile}
              size="compact"
            />
            <Button
              onClick={() => {
                handleCloseModal();
                setOpenModal("IncomeModalEdit");
              }}
              fullwidth={isMobile}
            >
              {dataCreditProspect.edit}
            </Button>
          </Stack>
          {currentBorrower && (
            <IncomeBorrower initialIncome={currentBorrower} />
          )}
        </>
      ) : (
        <Stack width="400px">
          <Text>{dataCreditProspect.noDataIncome}</Text>
        </Stack>
      )}
    </BaseModal>
  );
}
