import { MdArrowBack } from "react-icons/md";
import { Stack, Grid, Button } from "@inubekit/inubekit";

import { BoxAttribute } from "@components/data/BoxAttirbute";
import { AccordionValidations } from "@components/data/AccordionValidations";

import { IDataVerificationStep } from "./types";

interface IVerificationAddProductUIProps {
  dataVerificationStep: IDataVerificationStep[];
  keySections: string[];
  isMobile: boolean;
  setCurrentStep: (step: number) => void;
}

export const VerificationAddProductUI = (
  props: IVerificationAddProductUIProps,
) => {
  const { dataVerificationStep, keySections, isMobile, setCurrentStep } = props;

  return (
    <Stack gap="8px" direction="column" margin="0 6px 0 0">
      {dataVerificationStep.map((dataStept, __) =>
        keySections.map((keySection) => {
          const section = dataStept.sections[keySection];
          const hasContent =
            section.attributes.length > 0 || section.customComponent;

          return hasContent ? (
            <AccordionValidations
              key={keySection}
              title={section.title}
              isMobile={isMobile}
              dashed={true}
              defaultOpen={true}
            >
              <Stack direction="column" gap="8px">
                {section.customComponent && (
                  <Stack padding="16px 0" justifyContent="center">
                    {section.customComponent}
                  </Stack>
                )}

                {section.attributes.length > 0 && (
                  <Grid
                    templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                    width="-webkit-fill-available"
                    autoRows="auto"
                    gap="10px"
                    padding="16px 0"
                  >
                    {section.attributes.map((attribute, index) => (
                      <BoxAttribute
                        key={`${attribute.attribute}-${index}`}
                        attribute={attribute.attribute}
                        value={attribute.value}
                      />
                    ))}
                  </Grid>
                )}

                <Stack justifyContent="flex-end" width="100%" padding="8px 0">
                  <Button
                    variant="none"
                    appearance="dark"
                    spacing="compact"
                    iconBefore={<MdArrowBack />}
                    onClick={() => setCurrentStep(section.stepNumber)}
                  >
                    Regresar a este paso
                  </Button>
                </Stack>
              </Stack>
            </AccordionValidations>
          ) : null;
        }),
      )}
    </Stack>
  );
};