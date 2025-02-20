import { Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Checkbox from '../../../components/ui/Checkbox';
import { useEffect, useState } from 'react';
import { Token } from '../../../config/tokens';
import { ethers } from 'ethers';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.use_infinite_allowance';


/**
 * InfiniteAllowanceCheckbox Component
 *
 * Renders a checkbox for allowing infinite token allowance in a project creation form.
 * Integrates with `react-hook-form` via `Controller` for form state management.
 *
 * @param {object} props - Component props.
 * @param {string} error - Error message to display below the checkbox.
 * @returns {JSX.Element} A styled checkbox for allowing infinite token allowance.
 */
const InfiniteAllowanceCheckbox: React.FC<{ error?: string }> = ({ error, ...props }) => {
  const { t } = useTranslation();
  const token = useWatch({ name: 'token' });
  
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      setSelectedToken(token || null);
    };

    fetchToken();
  }, [token]);

  if (!selectedToken ||  selectedToken.address === ethers.ZeroAddress) return null;

  return (
    <Controller
      name="useInfiniteAllowance"
      render={({ field }) => (
        <Checkbox
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
          onBlur={field.onBlur}
          label={t(`${TRANSLATION_KEY}.title`)}
          description={t(`${TRANSLATION_KEY}.description`)}
          error={error}
          {...props}
        />
      )}
    />
  );
};

export default InfiniteAllowanceCheckbox;
