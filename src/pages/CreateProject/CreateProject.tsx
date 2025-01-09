import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import PageLayout from '../../components/Layout/Page/PageLayout';
import Button from '../../components/ui/Button';
import ExecutorInput from './components/ExecutorInput';
import TotalAmountInput from './components/TotalAmountInput';
import MilestonesInput from './components/MilestonesInput';
import PlatformFeeInput from './components/PlatformFeeInput';
import TokenAddressInput from './components/TokenAddressInput';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useToast } from '../../hooks/useToast';
import { createProjectValidationSchema } from './validation/schema';

const TRANSLATION_KEY = 'pages.create_project';

interface FormData {
  executor: string;
  totalAmount: number;
  platformFee: number;
  tokenAddress: string;
  milestonePercentages: string[];
}

/**
 * CreateProjectPage Component
 *
 * This component renders the "Create Project" form.
 * It uses `react-hook-form` for form state management and validation, integrated with `yup`.
 *
 * @returns {JSX.Element} The Create Project page.
 */
const CreateProjectPage: React.FC = () => {
  const { t } = useTranslation();
  const { contractService, signer } = useBlockchain();
  const { showToast } = useToast();

  // Initialize form with validation schema and default values
  const methods = useForm({
    resolver: yupResolver(createProjectValidationSchema(t)),
    defaultValues: {
      executor: '',
      totalAmount: 0,
      platformFee: 0,
      tokenAddress: '',
      milestonePercentages: [''],
    },
  });
  const { handleSubmit, formState } = methods;
  const { errors, isSubmitting } = formState;

  /**
   * Handles form submission.
   *
   * @param {FormData} data - The form data.
   */
  const onSubmit = async (data: FormData) => {
    if (!contractService)
      return showToast({ message: t(`${TRANSLATION_KEY}.errors.no_contract_service`), type: 'error' });
    
    if (!signer) return showToast({ message: t(`${TRANSLATION_KEY}.errors.no_signer`), type: 'error' });

    try {
      await contractService.createProject(
        data.executor,
        data.totalAmount.toString(),
        data.milestonePercentages,
        data.platformFee,
        data.tokenAddress,
        signer
      );
      showToast({ message: t(`${TRANSLATION_KEY}.success`), type: 'success' });
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : t(`${TRANSLATION_KEY}.errors.generic`),
        type: 'error',
      });
    }
  };

  return (
    <PageLayout.FixedWidth>
      <h1>{t('pages.create_project.title')}</h1>

      {/* FormProvider for managing form state */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form inputs */}
          <ExecutorInput error={errors.executor?.message} />
          <TotalAmountInput error={errors.totalAmount?.message} />
          <PlatformFeeInput error={errors.platformFee?.message} />
          <MilestonesInput />
          <TokenAddressInput error={errors.tokenAddress?.message} />

          {/* Submit button */}
          <Button type="submit" size="large" disabled={isSubmitting}>
            {isSubmitting ? t('pages.create_project.actions.submitting') : t('pages.create_project.actions.submit')}
          </Button>
        </form>
      </FormProvider>
    </PageLayout.FixedWidth>
  );
};

export default CreateProjectPage;
