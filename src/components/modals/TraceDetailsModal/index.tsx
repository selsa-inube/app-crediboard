import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Divider, Stack, Text } from "@inubekit/inubekit";

import { CardGray } from "@components/cards/CardGray";
import { BaseModal } from "@components/modals/baseModal";
import { Fieldset } from "@components/data/Fieldset";
import { getSearchDocumentById } from "@services/credit-request/query/SearchDocumentById";

import { DocumentViewer } from "../DocumentViewer";
import { dataTrace } from "./config";
import { StyledScroll } from "./styles";
import { DocumentItem } from "./types";

export interface ITraceDetailsModalProps {
  handleClose: () => void;
  data: { answer: string; observations: string; documents?: DocumentItem[] };
  businessUnitPublicCode?: string;
  isMobile?: boolean;
}

export function TraceDetailsModal(props: ITraceDetailsModalProps) {
  const { handleClose, data, businessUnitPublicCode, isMobile } = props;

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { user } = useAuth0();

  const handlePreview = async (id: string, name: string) => {
    try {
      const documentData = await getSearchDocumentById(
        id,
        user?.email ?? "",
        businessUnitPublicCode ?? ""
      );
      const fileUrl = URL.createObjectURL(documentData);
      setSelectedFile(fileUrl);
      setFileName(name);
      setOpen(true);
    } catch (error) {
      console.error("Error obteniendo el documento:", error);
    }
  };

  return (
    <BaseModal
      title={dataTrace.title}
      nextButton={dataTrace.understood}
      handleNext={handleClose}
      handleClose={handleClose}
      width={isMobile ? "287px" : "402px"}
    >
      <Stack direction="column" gap="16px">
        {data.documents && (
          <Fieldset heightFieldset="210px" hasOverflow>
            <StyledScroll>
              <Stack direction="column" gap="8px" height="145px">
                {data.documents.map((doc, index) => (
                  <Stack key={doc.documentId} direction="column" gap="8px">
                    <Stack justifyContent="space-between">
                      <Stack gap="4px">
                        <Text type="label" size="large">
                          {doc.abbreviatedName}
                        </Text>
                      </Stack>
                      <Text
                        type="label"
                        weight="bold"
                        size="large"
                        appearance="primary"
                        cursorHover
                        onClick={() =>
                          handlePreview(doc.documentId, doc.abbreviatedName)
                        }
                      >
                        {dataTrace.see}
                      </Text>
                    </Stack>
                    {index < (data.documents?.length ?? 0) - 1 && <Divider />}
                  </Stack>
                ))}
              </Stack>
            </StyledScroll>
          </Fieldset>
        )}
        <CardGray
          label={dataTrace.answer}
          placeHolder={data.answer}
          apparencePlaceHolder="gray"
        />
        <CardGray
          label={dataTrace.observations}
          placeHolder={data.observations}
          apparencePlaceHolder="gray"
          height="108px"
        />
        {selectedFile && open && (
          <DocumentViewer
            selectedFile={selectedFile}
            handleClose={() => setOpen(false)}
            title={fileName || ""}
          />
        )}
      </Stack>
    </BaseModal>
  );
}
