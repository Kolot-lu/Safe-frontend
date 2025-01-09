import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '../../../components/ui/Input';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.platform_fee';

/**
 * PlatformFeeInput Component
 *
 * Renders an input field for specifying the platform fee as a percentage.
 * Integrates with `react-hook-form` for form state management.
 *
 * @param {object} props - Component props.
 * @param {string} error - Error message to display below the input field.
 * @returns {JSX.Element} A styled input field for the platform fee percentage.
 *
 * @example
 * <PlatformFeeInput error="Platform fee is required" />
 */
const PlatformFeeInput: React.FC<{ error?: string }> = ({ error }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name="platformFee"
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          name="platformFee"
          label={t(`${TRANSLATION_KEY}.platform_fee`)}
          placeholder={t(`${TRANSLATION_KEY}.platform_fee_placeholder`)}
          type="number"
          step="any"
          error={error}
          description={t(`${TRANSLATION_KEY}.platform_fee_description`)}
          required
          aria-label={t(`${TRANSLATION_KEY}.platform_fee`)}
        />
      )}
    />
  );
};

export default PlatformFeeInput;
