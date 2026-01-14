import { Stack, Grid } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { CardGray } from "@components/cards/CardGray";
import { formatPrimaryDate } from "@utils/formatData/date";

import { formatObservation, formatYesNo, formatBiologicalSex, capitalizeFirstLetter } from "../EditDisburment/utils";
import { disbursementGeneralEnum, disbursemenOptionAccountEnum } from "../config";
import { dataTabsDisbursement } from "../types";

export interface IDisbursement {
  isMobile: boolean;
  data: dataTabsDisbursement;
  language: "es" | "en";
}

export function DisbursementInternal(props: IDisbursement) {
  const { isMobile, data, language } = props;
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
          label={disbursementGeneralEnum.label.i18n[language]}
          placeHolder={currencyFormat(Number(data.disbursementAmount), false)}
        />
        <CardGray
          label={disbursementGeneralEnum.labelToggle.i18n[language]}
          placeHolder={formatYesNo(data.isInTheNameOfBorrower)}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelName.i18n[language]}
          placeHolder={data.payeeName}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelLastName.i18n[language]}
          placeHolder={data.payeeSurname}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelSex.i18n[language]}
          placeHolder={formatBiologicalSex(data.payeeBiologicalSex)}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelDocumentType.i18n[language]}
          placeHolder={data.payeeIdentificationType}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelDocumentNumber.i18n[language]}
          placeHolder={data.payeeIdentificationNumber}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelBirthdate.i18n[language]}
          placeHolder={formatPrimaryDate(new Date(data.payeeBirthday))}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelphone.i18n[language]}
          placeHolder={data.payeePhoneNumber}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelMail.i18n[language]}
          placeHolder={data.payeeEmail}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelCity.i18n[language]}
          placeHolder={capitalizeFirstLetter(data.payeeCityOfResidence)}
        />
        <CardGray
          label={disbursemenOptionAccountEnum.labelAccount.i18n[language]}
          placeHolder={`${data.accountNumber} - ${data.accountType} - ${data.accountBankName}`}
        />
      </Grid>
      <CardGray
        label={disbursemenOptionAccountEnum.observation.i18n[language]}
        placeHolder={formatObservation(data.observation)}
      />
    </Stack>
  );
}
