import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import { showConversions, showUSDConversion } from '../utils/conversions';
import { fromUnit, toUnit, Unit } from '../../../helpers/converters';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

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
const TotalAmountInput: React.FC<{ error?: string }> = ({ error }) => {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext();

  // Watch for changes in rawTotalAmount and displayUnit
  const rawTotalAmount = watch('totalAmount');
  const displayUnit = watch('displayUnit', 'ETH'); // Default to 'ETH'

  /**
   * Handles unit switching and updates the raw total amount accordingly.
   *
   * @param {Unit} newUnit - The new unit to switch to.
   */
  const handleUnitSwitch = (newUnit: Unit) => {
    if (displayUnit !== newUnit) {
      const currentAmountInEth = fromUnit(parseFloat(rawTotalAmount || '0'), displayUnit);
      const newRawTotalAmount = toUnit(currentAmountInEth, newUnit).toString();

      setValue('displayUnit', newUnit);
      setValue('totalAmount', newRawTotalAmount);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Controller
        name="totalAmount"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            name="totalAmount"
            label={`${t(`${TRANSLATION_KEY}.total_amount`)} (${displayUnit})`}
            placeholder={`0.0 ${displayUnit}`}
            description={
              parseFloat(rawTotalAmount) > 0
                ? `${t(`${TRANSLATION_KEY}.conversions`)}: ${showConversions(
                    parseFloat(rawTotalAmount)
                  )} ${showUSDConversion(parseFloat(rawTotalAmount))}`
                : undefined
            }
            type="number"
            step="any"
            error={error}
            required
            aria-label={t(`${TRANSLATION_KEY}.total_amount`, { unit: displayUnit })}
          />
        )}
      />

      <div className="flex gap-2">
        {(['ETH', 'Gwei', 'Wei'] as const).map((unit) => (
          <Button
            key={unit}
            type="button"
            variant={displayUnit === unit ? 'primary' : 'ghost'}
            size="xsmall"
            onClick={() => handleUnitSwitch(unit)}
            aria-pressed={displayUnit === unit}
          >
            {unit}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TotalAmountInput;
