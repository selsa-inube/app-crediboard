import { Stack, Grid } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";
import { formatPrimaryDate } from "@utils/formatData/date";

import { formatObservation, formatYesNo, formatBiologicalSex, capitalizeFirstLetter } from "../EditDisburment/utils";
import { disbursementGeneral, disbursemenOptionAccount } from "../config";
import { dataTabsDisbursement } from "../types";

export interface IDisbursement {
  isMobile: boolean;
  data: dataTabsDisbursement;
}

export function DisbursementInternal(props: IDisbursement) {
  const { isMobile, data } = props;
  return (
    <Stack
      direction="column"
      gap="16px"
      width={isMobile ? "265px" : "582px"}
      height="auto"
    >
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        gap="16px 20px"
        autoRows="auto"
        justifyContent="space-between"
      >
        <CardGray
          label={disbursementGeneral.label}
          placeHolder={currencyFormat(Number(data.disbursementAmount), false)}
        />
        <CardGray
          label={disbursementGeneral.labelToggle}
          placeHolder={formatYesNo(data.isInTheNameOfBorrower)}
        />
        <CardGray
          label={disbursemenOptionAccount.labelName}
          placeHolder={data.payeeName}
        />
        <CardGray
          label={disbursemenOptionAccount.labelLastName}
          placeHolder={data.payeeSurname}
        />
        <CardGray
          label={disbursemenOptionAccount.labelSex}
          placeHolder={formatBiologicalSex(data.payeeBiologicalSex)}
        />
        <CardGray
          label={disbursemenOptionAccount.labelDocumentType}
          placeHolder={data.payeeIdentificationType}
        />
        <CardGray
          label={disbursemenOptionAccount.labelDocumentNumber}
          placeHolder={data.payeeIdentificationNumber}
        />
        <CardGray
          label={disbursemenOptionAccount.labelBirthdate}
          placeHolder={formatPrimaryDate(new Date(data.payeeBirthday))}
        />
        <CardGray
          label={disbursemenOptionAccount.labelphone}
          placeHolder={data.payeePhoneNumber}
        />
        <CardGray
          label={disbursemenOptionAccount.labelMail}
          placeHolder={data.payeeEmail}
        />
        <CardGray
          label={disbursemenOptionAccount.labelCity}
          placeHolder={capitalizeFirstLetter(data.payeeCityOfResidence)}
        />
        <CardGray
          label={disbursemenOptionAccount.labelAccount}
          placeHolder={`${data.accountNumber} - ${data.accountType} - ${data.accountBankName}`}
        />
      </Grid>
      <CardGray
        label={disbursemenOptionAccount.observation}
        placeHolder={formatObservation(data.observation)}
      />
    </Stack>
  );
}
