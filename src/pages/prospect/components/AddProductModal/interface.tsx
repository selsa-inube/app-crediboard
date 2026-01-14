import {
  Stack,
  Text,
  Grid,
  Divider,
  Assisted,
  SkeletonLine,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { CardProductSelection } from "@components/cards/CardProductSelection";
import { ErrorModal } from "@components/modals/ErrorModal";
import { TruncatedText } from "@components/modals/TruncatedTextModal";

import { ScrollableContainer, ModalContentWrapper } from "./styles";
import {
  messageNotFound,
  IAddProductModalUIProps,
  titleButtonTextAssistedEnum,
  stepsAddProductEnum,
  noAvailablePaymentMethodsEnum,
} from "./config";
import { PaymentConfiguration } from "./steps/PaymentConfiguration";
import { AmountCapture } from "./steps/AmountCapture";
import { TermSelection } from "./steps/TermSelection";
import { VerificationDebtorAddModal } from "./steps/Verification";

export const AddProductModalUI = (props: IAddProductModalUIProps) => {
  const {
    title,
    onCloseModal,
    iconBefore,
    iconAfter,
    creditLineTerms,
    isMobile,
    steps,
    currentStepsNumber,
    isCurrentFormValid,
    formData,
    handleFormChange,
    handleNextStep,
    handlePreviousStep,
    handleSubmitClick,
    setIsCurrentFormValid,
    businessUnitPublicCode,
    businessManagerCode,
    prospectData,
    errorMessage,
    setErrorModal,
    errorModal,
    loading,
    setCurrentStep,
    isSendingData,
    language,
    assistedControls
  } = props;

  return (
    <>
      <BaseModal
        title={
          <TruncatedText
            text={title}
            maxLength={25}
            size="small"
            type="headline"
          />
        }
        nextButton={
          currentStepsNumber.id === steps[steps.length - 1].id
            ? titleButtonTextAssistedEnum.submitText.i18n[language]
            : titleButtonTextAssistedEnum.goNextText.i18n[language]
        }
        backButton={titleButtonTextAssistedEnum.goBackText.i18n[language]}
        handleNext={
          currentStepsNumber.id === steps[steps.length - 1].id
            ? handleSubmitClick
            : handleNextStep
        }
        handleBack={handlePreviousStep}
        handleClose={onCloseModal}
        disabledNext={!isCurrentFormValid}
        disabledBack={currentStepsNumber.id === steps[0].id}
        iconBeforeNext={
          (currentStepsNumber.id === steps[steps.length - 1].id
            ? titleButtonTextAssistedEnum.submitText.i18n[language]
            : titleButtonTextAssistedEnum.goNextText.i18n[language]) ===
          titleButtonTextAssistedEnum.submitText.i18n[language]
            ? iconBefore
            : undefined
        }
        iconAfterNext={iconAfter}
        finalDivider={true}
        width={isMobile ? "330px" : "550px"}
        $height="calc(100vh - 64px)"
        isSendingData={isSendingData}
        internalWidth={isMobile ? "280px" : "500px"}
      >
        <ModalContentWrapper>
          <Stack
            direction="column"
            gap="16px"
            width={isMobile ? "280px" : "500px"}
          >
            <Assisted
              step={currentStepsNumber}
              totalSteps={steps.length}
              onBackClick={handlePreviousStep}
              onNextClick={handleNextStep}
              controls={assistedControls}
              onSubmitClick={handleSubmitClick}
              disableNext={!isCurrentFormValid}
              disableSubmit={!isCurrentFormValid}
              size={isMobile ? "small" : "large"}
              showCurrentStepNumber={false}
            />

            <Divider />
            <ScrollableContainer
              $smallScreen={isMobile}
              $height="calc(100vh - 440px)"
              $width={isMobile ? "280px" : "auto"}
            >
              {currentStepsNumber.id ===
                stepsAddProductEnum.creditLineSelection.id && (
                <>
                  {loading ? (
                    <SkeletonLine animated width="100%" height="160px" />
                  ) : (
                    <Grid
                      gap="16px"
                      padding={isMobile ? "0px 6px" : "0px 12px"}
                      templateColumns={`repeat(1, ${isMobile ? "auto" : "455px"})`}
                      autoRows=" repeat(auto-fill, 200px)"
                      justifyContent="center"
                      alignContent="center"
                    >
                      {Object.keys(creditLineTerms).length > 0 ? (
                        Object.entries(creditLineTerms).map(
                          ([lineName, terms], index) => (
                            <Stack key={index} direction="row" width="auto">
                              <CardProductSelection
                                isMobile={isMobile}
                                typeCheck="radio"
                                key={lineName}
                                amount={terms.LoanAmountLimit}
                                rate={terms.RiskFreeInterestRate}
                                term={terms.LoanTermLimit}
                                description={lineName}
                                disabled={false}
                                isSelected={formData.selectedProducts.includes(
                                  lineName
                                )}
                                onSelect={() => {
                                  handleFormChange({
                                    selectedProducts: [lineName],
                                    creditLine: lineName,
                                  });
                                }}
                                language={language}
                              />
                            </Stack>
                          )
                        )
                      ) : (
                        <Text type="body" size="medium">
                          {messageNotFound}
                        </Text>
                      )}
                    </Grid>
                  )}
                </>
              )}

              {currentStepsNumber.id ===
                stepsAddProductEnum.paymentConfiguration.id &&
                !loading &&
                formData.paymentConfiguration.paymentChannelData.length > 0 && (
                  <PaymentConfiguration
                    paymentConfig={formData.paymentConfiguration}
                    onChange={(config) => {
                      handleFormChange({
                        paymentConfiguration: {
                          ...formData.paymentConfiguration,
                          ...config,
                        },
                      });
                    }}
                    onFormValid={setIsCurrentFormValid}
                  />
                )}

              {currentStepsNumber.id ===
                stepsAddProductEnum.paymentConfiguration.id &&
                !loading &&
                formData.paymentConfiguration.paymentChannelData.length ===
                  0 && (
                  <Text
                    type="body"
                    size="medium"
                    children={noAvailablePaymentMethodsEnum.i18n[language]}
                    margin="10px 0 0 10px"
                  />
                )}

              {currentStepsNumber.id ===
                stepsAddProductEnum.paymentConfiguration.id &&
                loading && <SkeletonLine animated width="100%" height="60px" />}

              {currentStepsNumber.id === stepsAddProductEnum.amountCapture.id && (
                <AmountCapture
                  creditLine={formData.creditLine}
                  amount={formData.creditAmount}
                  moneyDestination={prospectData.moneyDestination}
                  businessUnitPublicCode={businessUnitPublicCode}
                  businessManagerCode={businessManagerCode}
                  onChange={(amount) => {
                    handleFormChange({ creditAmount: amount });
                  }}
                  onFormValid={setIsCurrentFormValid}
                  isMobile={isMobile}
                />
              )}

              {currentStepsNumber.id === stepsAddProductEnum.termSelection.id && (
                <TermSelection
                  quotaCapValue={formData.quotaCapValue}
                  maximumTermValue={formData.maximumTermValue}
                  quotaCapEnabled={formData.quotaCapEnabled}
                  maximumTermEnabled={formData.maximumTermEnabled}
                  isMobile={isMobile}
                  onChange={(values) => {
                    handleFormChange({
                      quotaCapValue: values.quotaCapValue,
                      maximumTermValue: values.maximumTermValue,
                      quotaCapEnabled: values.quotaCapEnabled,
                      maximumTermEnabled: values.maximumTermEnabled,
                    });
                  }}
                  onFormValid={setIsCurrentFormValid}
                />
              )}
              {currentStepsNumber.id === stepsAddProductEnum.verification.id && (
                <VerificationDebtorAddModal
                  formData={formData}
                  creditLineTerms={creditLineTerms}
                  setCurrentStep={(step) => {
                    handlePreviousStep();
                    setTimeout(() => {
                      setCurrentStep?.(step);
                    }, 0);
                  }}
                />
              )}
            </ScrollableContainer>
          </Stack>
        </ModalContentWrapper>
      </BaseModal>
      {errorModal && (
        <ErrorModal
          isMobile={isMobile}
          message={errorMessage}
          handleClose={() => setErrorModal(false)}
        />
      )}
    </>
  );
};
