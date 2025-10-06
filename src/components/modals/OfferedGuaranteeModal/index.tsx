import { useEffect, useState } from "react";
import { Stack, Tabs, useFlag } from "@inubekit/inubekit";

import userNotFound from "@assets/images/ItemNotFound.png";
import { BaseModal } from "@components/modals/baseModal";
import { CardBorrower } from "@components/cards/CardBorrower";
import { Fieldset } from "@components/data/Fieldset";
import { getGuaranteesById } from "@services/creditRequest/query/guarantees";
import { IGuarantees } from "@services/creditRequest/query/types";
import { IProspect } from "@services/prospect/types";
import { getTotalFinancialObligations } from "@utils/formatData/currency";
import { currencyFormat } from "@utils/formatData/currency";
import { getPropertyValue } from "@utils/mappingData/mappings";

import { Mortgage } from "./Mortgage";
import { Pledge } from "./Pledge";
import { Bail } from "./bail";
import { dataGuarantee, dataTabs } from "./config";
import { ScrollableContainer } from "./styles";
import { ItemNotFound } from "@components/layout/ItemNotFound";

export interface IOfferedGuaranteeModalProps {
  handleClose: () => void;
  isMobile: boolean;
  prospectData: IProspect;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  requestId: string;
}

export function OfferedGuaranteeModal(props: IOfferedGuaranteeModalProps) {
  const {
    handleClose,
    isMobile,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
    requestId,
  } = props;

  const [currentTab, setCurrentTab] = useState(dataTabs[0].id);
  const [dataProperty, setDataProperty] = useState<IGuarantees[]>();

  const onChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  const dataResponse = prospectData;

  const { addFlag } = useFlag();

  const handleFlag = (error: unknown) => {
    addFlag({
      title: "Error al obtener los datos de la garantia",
      description: `${error}`,
      appearance: "danger",
      duration: 5000,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getGuaranteesById(
          businessUnitPublicCode,
          businessManagerCode,
          requestId
        );
        setDataProperty(result);
      } catch (error) {
        handleFlag(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, requestId]);

  const [pledgeData, mortgageData] = [
    dataProperty?.find((i) => i.guaranteeType === "pledge")?.pledges ?? [],
    dataProperty?.find((i) => i.guaranteeType === "mortgage")?.mortgages ?? [],
  ];

  return (
    <BaseModal
      title={dataGuarantee.title}
      nextButton={dataGuarantee.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "300px" : "602px"}
      height="529px"
      finalDivider={true}
    >
      <Stack>
        <Tabs
          scroll={isMobile}
          selectedTab={currentTab}
          tabs={dataTabs}
          onChange={onChange}
        />
      </Stack>
      <Stack width="100%">
        {currentTab === "borrower" && (
          <ScrollableContainer>
            {dataResponse?.borrowers && dataResponse.borrowers.length > 0 ? (
              dataResponse.borrowers.map((borrower, index) => (
                <Stack
                  key={index}
                  justifyContent="center"
                  margin="8px 0px"
                  width="100%"
                >
                  <CardBorrower
                    key={index}
                    title={`${dataGuarantee.borrower} ${index + 1}`}
                    name={getPropertyValue(borrower.borrowerProperties, "name")}
                    lastName={getPropertyValue(
                      borrower.borrowerProperties,
                      "surname"
                    )}
                    email={getPropertyValue(
                      borrower.borrowerProperties,
                      "email"
                    )}
                    income={currencyFormat(
                      Number(
                        getPropertyValue(
                          borrower.borrowerProperties,
                          "PeriodicSalary"
                        ) || 0
                      ) +
                        Number(
                          getPropertyValue(
                            borrower.borrowerProperties,
                            "OtherNonSalaryEmoluments"
                          ) || 0
                        ) +
                        Number(
                          getPropertyValue(
                            borrower.borrowerProperties,
                            "PensionAllowances"
                          ) || 0
                        ),
                      false
                    )}
                    obligations={currencyFormat(
                      getTotalFinancialObligations(borrower.borrowerProperties),
                      false
                    )}
                    showIcons={false}
                  />
                </Stack>
              ))
            ) : (
              <Fieldset>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  height="290px"
                >
                  <ItemNotFound
                    image={userNotFound}
                    title={dataGuarantee.noBorrowersTitle}
                    description={dataGuarantee.noBorrowersDescription}
                    buttonDescription={dataGuarantee.retry}
                  />
                </Stack>
              </Fieldset>
            )}
          </ScrollableContainer>
        )}
        {currentTab === "mortgage" && (
          <Mortgage isMobile={isMobile} initialValues={mortgageData} />
        )}
        {currentTab === "pledge" && (
          <Pledge isMobile={isMobile} initialValues={pledgeData} />
        )}
        {currentTab === "bail" && <Bail data={dataResponse?.bondValue ?? 0} />}
      </Stack>
    </BaseModal>
  );
}
