import {
  Stack,
  Text,
  Grid,
  Divider,
  Assisted,
  SkeletonLine,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { truncateTextToMaxLength } from "@utils/formatData/text";
import { CardProductSelection } from "@components/cards/CardProductSelection";
import { ErrorModal } from "@components/modals/ErrorModal";

import { ScrollableContainer, ModalContentWrapper } from "./styles";
import {
  messageNotFound,
  IAddProductModalUIProps,
  titleButtonTextAssisted,
  stepsAddProduct,
  noAvailablePaymentMethods,
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
    isSendingData
  } = props;

  return (
    <>
      <BaseModal
        title={truncateTextToMaxLength(title, 25)}
        nextButton={
          currentStepsNumber.id === steps[steps.length - 1].id
            ? titleButtonTextAssisted.submitText
            : titleButtonTextAssisted.goNextText
        }
        backButton={titleButtonTextAssisted.goBackText}
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
            ? titleButtonTextAssisted.submitText
            : titleButtonTextAssisted.goNextText) ===
            titleButtonTextAssisted.submitText
            ? iconBefore
            : undefined
        }
        iconAfterNext={iconAfter}
        finalDivider={true}
        width={
          isMobile
            ? "auto"
            : "520px"
        }
        height="100%"
        $height="80vh"
        isSendingData={isSendingData}
      >
        <ModalContentWrapper>
        <Stack direction="column" gap="16px" height="100%">
          <Assisted
            step={currentStepsNumber}
            totalSteps={steps.length}
            onBackClick={handlePreviousStep}
            onNextClick={handleNextStep}
            controls={titleButtonTextAssisted}
            onSubmitClick={handleSubmitClick}
            disableNext={!isCurrentFormValid}
            disableSubmit={!isCurrentFormValid}
            size={isMobile ? "small" : "large"}
            showCurrentStepNumber={false}
          />

          <Divider />
          <ScrollableContainer
            $smallScreen={isMobile}
            $height="100%"
            $width="100%"
          >

            {currentStepsNumber.id === stepsAddProduct.creditLineSelection.id && (
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
                                lineName,
                              )}
                              onSelect={() => {
                                handleFormChange({
                                  selectedProducts: [lineName],
                                  creditLine: lineName,
                                });
                              }}
                            />
                          </Stack>
                        ),
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

            {currentStepsNumber.id === stepsAddProduct.paymentConfiguration.id &&
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

            {currentStepsNumber.id === stepsAddProduct.paymentConfiguration.id &&
              !loading &&
              formData.paymentConfiguration.paymentChannelData.length === 0 && (
                <Text
                  type="body"
                  size="medium"
                  children={noAvailablePaymentMethods}
                  margin="10px 0 0 10px"
                />
              )}

            {currentStepsNumber.id === stepsAddProduct.paymentConfiguration.id &&
              loading && <SkeletonLine animated width="100%" height="60px" />}

            {currentStepsNumber.id === stepsAddProduct.amountCapture.id && (
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

            {currentStepsNumber.id === stepsAddProduct.termSelection.id && (
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
            {currentStepsNumber.id === stepsAddProduct.verification.id && (
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
