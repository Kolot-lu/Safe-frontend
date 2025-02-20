import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import Input from '../../../components/ui/Input';
import { Token } from '../../../config/tokens';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields';

/**
 * TotalAmountInput Component
 *
 * Renders an input field for specifying the total amount in different units (ETH, Gwei, Wei).
 * Allows switching between units and displays real-time conversion information.
 *
 * @param {string} error - Error message to display below the input field.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <TotalAmountInput error="Total amount is required" />
 */
const TotalAmountInput: React.FC<{ error?: string }> = ({ error, ...props }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const token = useWatch({ name: 'token' });

  const [selectedToken, setSelectedToken] = React.useState<Token | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      setSelectedToken(token || null);
    };

    fetchToken();
  }, [token]);

  return (
    <Controller
      name="totalAmount"
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          label={`${t(`${TRANSLATION_KEY}.total_amount`)} (${selectedToken?.name})`}
          placeholder={`0.0 ${selectedToken?.name}`}
          type="number"
          step="any"
          error={error}
          required
          aria-label={t(`${TRANSLATION_KEY}.total_amount`, { unit: selectedToken?.name })}
          {...props}
        />
      )}
    />
  );
};

export default TotalAmountInput;
