import { Stack } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { Fieldset } from "@components/data/Fieldset";
import { getPropertyValue } from "@utils/mappingData/mappings";
import { currencyFormat } from "@utils/formatData/currency";
import { IBorrower } from "@services/prospect/types";

import { dataIncomeDebtor } from "./config";

interface IIncomeBorrower {
  initialIncome: IBorrower;
}

const incomeFields = [
  {
    label: dataIncomeDebtor.work,
    keys: ["PeriodicSalary", "OtherNonSalaryEmoluments", "PensionAllowances"],
  },
  {
    label: dataIncomeDebtor.capital,
    keys: ["FinancialIncome", "Leases", "Dividends"],
  },
  {
    label: dataIncomeDebtor.variables,
    keys: ["ProfessionalFees", "PersonalBusinessUtilities"],
  },
];

export function IncomeBorrower(props: IIncomeBorrower) {
  const { initialIncome } = props;

  return (
    <Fieldset
      borderColor="none"
    >
      <Stack direction="column" padding="10px 16px" gap="16px">
        {incomeFields.map((field, index) => {
          const sum = field.keys.reduce((acc, key) => {
            const val = Number(
              getPropertyValue(initialIncome.borrowerProperties, key) ?? 0
            );
            return acc + (isNaN(val) ? 0 : val);
          }, 0);

          return (
            <CardGray
              key={index}
              label={field.label}
              placeHolder={currencyFormat(sum)}
              apparencePlaceHolder="gray"
            />
          );
        })}
      </Stack>
    </Fieldset>
  );
}
