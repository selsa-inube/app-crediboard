import { useCallback, useEffect, useState, useContext } from "react";
import { Stack, useFlag, Tag } from "@inubekit/inubekit";

import ItemNotFound from "@assets/images/ItemNotFound.png";
import { Fieldset } from "@components/data/Fieldset";
import { TableBoard } from "@components/data/TableBoard";
import { IEntries } from "@components/data/TableBoard/types";
import { PromissoryNotesModal } from "@components/modals/PromissoryNotesModal";
import { UnfoundData } from "@components/layout/UnfoundData";
import { getCreditRequestByCode } from "@services/creditRequest/query/getCreditRequestByCode";
import { getPayrollDiscountAuthorizationsById } from "@services/creditRequest/query/payroll_discount_authorizations";
import { getPromissoryNotesById } from "@services/creditRequest/query/promissory_notes";
import {
  ICreditRequest,
} from "@services/creditRequest/query/types";
import { AppContext } from "@context/AppContext";
import { useEnum } from "@hooks/useEnum";
import { IPayrollDiscountAuthorization } from "@services/creditRequest/query/types";
import { IPromissoryNotes } from "@services/creditRequest/query/types";

import {
  appearanceTag,
  getTableBoardActionMobile,
  getTableBoardActions,
  infoItems,
  getActionsMobileIcon,
  getTitlesFinancialReporting,
  titlesFinancialReportingEnum,
} from "./config";
import { errorObserver, errorMessagesEnum } from "../config";

interface IPromissoryNotesProps {
  id: string;
  isMobile: boolean;
}

type DocumentEntry = IPayrollDiscountAuthorization | IPromissoryNotes;

export const PromissoryNotes = (props: IPromissoryNotesProps) => {
  const { id, isMobile } = props;
  const { addFlag } = useFlag();
  const { lang } = useEnum();

  const [creditRequets, setCreditRequests] = useState<ICreditRequest | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataPromissoryNotes, setDataPromissoryNotes] = useState<IEntries[]>(
    []
  );
  const [showRetry, setShowRetry] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.abbreviatedName;

  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  useEffect(() => {
    const fetchCreditRequest = async () => {
      try {
        const data = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          id,
          userAccount
        );
        setCreditRequests(data[0] as ICreditRequest);
      } catch (error) {
        errorObserver.notify({
          id: "Management",
          message: (error as Error).message,
        });
      }
    };
    if (id) fetchCreditRequest();
  }, [businessUnitPublicCode, id, businessManagerCode, userAccount]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setShowRetry(false);

    if (!creditRequets?.creditRequestId) return;

    try {
      const [payrollDiscountResult, promissoryNotesResult] =
        await Promise.allSettled([
          getPayrollDiscountAuthorizationsById(
            businessUnitPublicCode,
            businessManagerCode,
            creditRequets.creditRequestId
          ),
          getPromissoryNotesById(
            businessUnitPublicCode,
            businessManagerCode,
            creditRequets.creditRequestId
          ),
        ]);

 const processResult = (
        result: PromiseSettledResult<IPayrollDiscountAuthorization[] | IPromissoryNotes[]>,
        sourceType: "payroll" | "promissory_note"
      ) => {
        if (result.status === "fulfilled") {

          const entries = result.value as DocumentEntry[];

          return entries.map((entry) => {
            let currentId = "";
            
            if ("payrollDiscountAuthorizationId" in entry) {
              currentId = entry.payrollDiscountAuthorizationId;
            } else if ("promissoryNoteId" in entry) {
              currentId = (entry as IPromissoryNotes).promissory_note_id;
            }

            return {
              id: currentId,
              [titlesFinancialReportingEnum.obligationCode.id]: entry.obligationCode,
              [titlesFinancialReportingEnum.documentCode.id]: entry.documentCode,
              [titlesFinancialReportingEnum.type.id]:
                // eslint-disable-next-line no-nested-ternary
                sourceType === "payroll"
                  ? lang === "es"
                    ? "Libranza"
                    : "Payroll"
                  : lang === "es"
                  ? "Pagaré"
                  : "Promissory Note",
              tag: (
                <Tag
                  label={entry.documentState}
                  appearance={appearanceTag(entry.documentState)}
                />
              ),
            };
          });
        } 
        
        errorObserver.notify({
          id: sourceType === "payroll" ? "PayrollDiscount" : "PromissoryNotes",
          message: typeof result.reason === 'string' ? result.reason : (result.reason as Error).message,
        });
        return [];
      };

      const combinedData = [
        ...processResult(payrollDiscountResult, "payroll"),
        ...processResult(promissoryNotesResult, "promissory_note"),
      ];

      if (combinedData.length === 0) {
        throw new Error("NoData");
      }

      setDataPromissoryNotes(combinedData);
    } catch (error) {
   if ((error as Error).message === "NoData") {
      setErrorMessage(errorMessagesEnum.promissoryNotes.description.i18n[lang]);
    } else {
      setErrorMessage((error as Error).message);
    }
    setShowRetry(true);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, businessManagerCode, creditRequets]);

  useEffect(() => {
    if (creditRequets?.creditRequestId) fetchData();
  }, [fetchData, creditRequets]);

  const handleRetry = () => {
    setLoading(true);
    setShowRetry(false);
    fetchData();
  };

  return (
    <Fieldset
      title={errorMessagesEnum.promissoryNotes.titleCard.i18n[lang]}
      heightFieldset="100%"
      hasTable
      hasError={!creditRequets ? true : false}
      hasOverflow={isMobile}
    >
      {!creditRequets || showRetry ? (
        <UnfoundData
          image={ItemNotFound}
          title={errorMessagesEnum.promissoryNotes.title.i18n[lang]}
          description={
            errorMessagesEnum.promissoryNotes.description.i18n[lang] || errorMessage
          }
          buttonDescription={errorMessagesEnum.promissoryNotes.button.i18n[lang]}
          onRetry={handleRetry}
        />
      ) : (
        <Stack direction="column" height={!isMobile ? "100%" : "auto"}>
          <TableBoard
            id="promissoryNotes"
            titles={getTitlesFinancialReporting(lang)}
            entries={dataPromissoryNotes}
            actions={getTableBoardActions(() => setShowModal(true), lang)}
            actionMobile={getTableBoardActionMobile(() => setShowModal(true))}
            actionMobileIcon={getActionsMobileIcon(lang)}
            loading={loading}
            appearanceTable={{
              widthTd: isMobile ? "23%" : undefined,
              efectzebra: true,
              title: "primary",
              isStyleMobile: true,
            }}
            isFirstTable
            infoItems={infoItems}
            hideSecondColumnOnTablet={false}
            hideSecondColumnOnMobile={false}
            showUserIconOnTablet={false}
          />

          {showModal && (
            <PromissoryNotesModal
              title="Confirma los datos del usuario"
              buttonText="Enviar"
              formValues={{
                field1: "usuario@inube.com",
                field2: "3122638128",
                field3: "3122638128",
              }}
              handleClose={() => setShowModal(false)}
              onSubmit={() => {
                addFlag({
                  title: "Datos enviados",
                  description:
                    "Los datos del usuario han sido enviados exitosamente.",
                  appearance: "success",
                  duration: 5000,
                });
                setShowModal(false);
              }}
            />
          )}
        </Stack>
      )}
    </Fieldset>
  );
};
