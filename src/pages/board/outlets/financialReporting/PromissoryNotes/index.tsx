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
import { ICreditRequest } from "@services/creditRequest/query/types";
import { AppContext } from "@context/AppContext";
import { useEnum } from "@hooks/useEnum";
import { IPayrollDiscountAuthorization } from "@services/creditRequest/query/types";
import { IPromissoryNotes } from "@services/creditRequest/query/types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { searchAllCustomerCatalog } from "@services/costumer/SearchCustomerCatalogByCode";

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
import { ICustomer } from "@services/costumer/types";

interface IPromissoryNotesProps {
  id: string;
  isMobile: boolean;
  publicCode: string;
}

type DocumentEntry = IPayrollDiscountAuthorization | IPromissoryNotes;

export const PromissoryNotes = (props: IPromissoryNotesProps) => {
  const { id, isMobile, publicCode } = props;
  const { addFlag } = useFlag();
  const { lang, enums } = useEnum();

  const [creditRequets, setCreditRequests] = useState<ICreditRequest | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataPromissoryNotes, setDataPromissoryNotes] = useState<IEntries[]>(
    [],
  );
  const [showRetry, setShowRetry] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [messageError, setMessageError] = useState("");
  const businessUnitPublicCode: string =
    JSON.parse(businessUnitSigla).businessUnitPublicCode;

  const businessManagerCode = eventData.businessManager.publicCode;
  const [documentPreview, setDocumentPreview] = useState<ICustomer | null>();
  const { userAccount } =
    typeof eventData === "string" ? JSON.parse(eventData).user : eventData.user;

  useEffect(() => {
    const fetchCreditRequest = async () => {
      try {
        const data = await getCreditRequestByCode(
          businessUnitPublicCode,
          businessManagerCode,
          id,
          eventData.user.identificationDocumentNumber || "",
          eventData.token || "",
        );
        setCreditRequests(data[0] as ICreditRequest);
      } catch (error) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        setShowErrorModal(true);
        setMessageError(description);
      }
    };
    if (id) fetchCreditRequest();
  }, [
    businessUnitPublicCode,
    id,
    businessManagerCode,
    userAccount,
    eventData.token,
    eventData.user.identificationDocumentNumber,
  ]);

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
            creditRequets.creditRequestId,
            eventData.token || "",
          ),
          getPromissoryNotesById(
            businessUnitPublicCode,
            businessManagerCode,
            creditRequets.creditRequestId,
            eventData.token || "",
          ),
        ]);

      const processResult = (
        result: PromiseSettledResult<
          IPayrollDiscountAuthorization[] | IPromissoryNotes[]
        >,
        sourceType: "Payroll_discount_authorization" | "Promissory_note",
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
              [titlesFinancialReportingEnum.obligationCode.id]:
                entry.obligationCode,
              [titlesFinancialReportingEnum.documentCode.id]:
                entry.documentCode,
              [titlesFinancialReportingEnum.type.id]:
                enums?.LegalDocumentsAndWarranties?.find(
                  (e) => e.code === sourceType,
                )?.i18n[lang] ?? "",
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
          id:
            sourceType === "Payroll_discount_authorization"
              ? "PayrollDiscount"
              : "PromissoryNotes",
          message:
            typeof result.reason === "string"
              ? result.reason
              : (result.reason as Error).message,
        });
        return [];
      };

      const combinedData = [
        ...processResult(
          payrollDiscountResult,
          "Payroll_discount_authorization",
        ),
        ...processResult(promissoryNotesResult, "Promissory_note"),
      ];

      if (combinedData.length === 0) {
        throw new Error("NoData");
      }

      setDataPromissoryNotes(combinedData);
    } catch (error) {
      if ((error as Error).message === "NoData") {
        setErrorMessage(
          errorMessagesEnum.promissoryNotes.description.i18n[lang],
        );
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
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const documentData = await searchAllCustomerCatalog(
          publicCode,
          businessUnitPublicCode,
          businessManagerCode,
          eventData.token || "",
        );
        setDocumentPreview(documentData);
        console.log(documentData);
      } catch (error) {
        const err = error as {
          message?: string;
          status?: number;
          data?: { description?: string; code?: string };
        };
        const code = err?.data?.code ? `[${err.data.code}] ` : "";
        const description =
          code + (err?.message || "") + (err?.data?.description || "");

        setShowErrorModal(true);
        setMessageError(description);
      }
    };

    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUnitPublicCode, businessManagerCode, eventData.token]);

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
            errorMessagesEnum.promissoryNotes.description.i18n[lang] ||
            errorMessage
          }
          buttonDescription={
            errorMessagesEnum.promissoryNotes.button.i18n[lang]
          }
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
                field1:
                  documentPreview?.generalAttributeClientNaturalPersons?.[0]
                    ?.emailContact ?? "",
                field2:
                  documentPreview?.generalAttributeClientNaturalPersons?.[0]
                    ?.cellPhoneContact ?? "",
                field3:
                  documentPreview?.generalAttributeClientNaturalPersons?.[0]
                    ?.cellPhoneContact ?? "",
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
          {showErrorModal && (
            <ErrorModal
              handleClose={() => {
                setShowErrorModal(false);
              }}
              isMobile={isMobile}
              message={messageError}
            />
          )}
        </Stack>
      )}
    </Fieldset>
  );
};
