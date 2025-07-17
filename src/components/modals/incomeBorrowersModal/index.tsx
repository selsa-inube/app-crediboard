import { Button, Select, Stack, Text } from "@inubekit/inubekit";
import { BaseModal } from "../baseModal";
import { IncomeDebtor } from "@components/layout/CreditProspect/incomeDebtor";
import { IProspect } from "@services/prospects/types";
import { dataCreditProspect } from "./config";

interface IIncomeBorrowersModalProps {
  borrowersProspect: IProspect | undefined;
  borrowerOptions: { id: string; label: string; value: string }[];
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
          <IncomeDebtor
            initialValues={
              dataProspect[0]?.borrowers?.find(
                (b) => b.borrowerName === borrowerOptions[selectedIndex]?.value
              ) || selectedBorrower
            }
          />
        </>
      ) : (
        <Stack width="400px">
          <Text>{dataCreditProspect.noDataIncome}</Text>
        </Stack>
      )}
    </BaseModal>
  );
}
