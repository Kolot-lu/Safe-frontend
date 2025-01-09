import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '../../../components/ui/Input';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.token_address';

/**
 * TokenAddressInput Component
 *
 * Renders an input field for the token address with integration to `react-hook-form`.
 *
 * @param {object} props - Component props.
 * @param {string} error - Error message to display below the input field.
 * @returns {JSX.Element} A styled input field for the token address.
 *
 * @example
 * <TokenAddressInput error="Token address is invalid" />
 */
const TokenAddressInput: React.FC<{ error?: string }> = ({ error, ...props }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name="tokenAddress"
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          name="tokenAddress"
          label={t(`${TRANSLATION_KEY}.token_address`)}
          placeholder={t(`${TRANSLATION_KEY}.token_address_placeholder`, 'Enter token address')}
          type="text"
          error={error}
          required
          aria-label={t(`${TRANSLATION_KEY}.token_address`)}
          {...props}
        />
      )}
    />
  );
};

export default TokenAddressInput;
