import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/ui/Input';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.executor';

/**
 * ExecutorInput Component
 *
 * Renders an input field for specifying the executor's address in a project creation form.
 * Integrates with `react-hook-form` via `Controller` for form state management.
 *
 * @param {object} props - Component props.
 * @param {string} error - Error message to display below the input field.
 * @returns {JSX.Element} A styled input field for the executor's address.
 *
 * @example
 * <ExecutorInput error="Executor address is required" />
 */
const ExecutorInput: React.FC<{ error?: string }> = ({ error, ...props }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name="executor"
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          name="executor"
          required
          label={t(`${TRANSLATION_KEY}.executor`)}
          placeholder={t(`${TRANSLATION_KEY}.executor_placeholder`)}
          error={error}
          aria-label={t(`${TRANSLATION_KEY}.executor`)}
          {...props}
        />
      )}
    />
  );
};

export default ExecutorInput;
