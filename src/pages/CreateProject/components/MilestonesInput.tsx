import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray, Controller, useWatch } from 'react-hook-form';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.milestone';

/**
 * MilestonesInput Component
 *
 * Renders a list of milestone percentage inputs with options to add or remove milestones.
 *
 * @returns {JSX.Element} A dynamic list of milestone percentage inputs.
 *
 * @example
 * <MilestonesInput />
 */
const MilestonesInput: React.FC = () => {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();
  const { showToast } = useToast();

  // Hook for managing the array of milestones
  const { fields, append, remove, update } = useFieldArray({ control, name: 'milestonePercentages' });

  // Watch for changes in milestone percentages
  const milestoneValues = useWatch({ control, name: 'milestonePercentages', defaultValue: [] });

  const [hasInteracted, setHasInteracted] = useState(false);

  /**
   * Ensures the total milestone percentages do not exceed 100%.
   */
  useEffect(() => {
    if (!milestoneValues) return;

    const total = milestoneValues.reduce((sum: number, value: number) => sum + (Number(value) || 0), 0);

    if (total > 100) {
      // Scale down all milestones proportionally if total exceeds 100
      const scaleFactor = 100 / total;
      milestoneValues.forEach((value: number, index: number) => {
        update(index, Math.round((value || 0) * scaleFactor * 100) / 100); // Round to 2 decimals
      });
    }
  }, [milestoneValues, update]);

  /**
   * Adds a new milestone input with default value.
   */
  const handleAddMilestone = () => {
    const remaining = 100 - milestoneValues.reduce((sum: number, value: number) => sum + (Number(value) || 0), 0);
    console.log(remaining);
    if (remaining <= 0) return showToast({ message: t(`${TRANSLATION_KEY}.cannot_add_more`), type: 'warning' }); // Do not allow adding more milestones if total is already 100%

    append(remaining); // Append remaining % to ensure total stays within 100
  };

  /**
   * Removes a milestone input from the list by index and redistributes the percentage.
   *
   * @param {number} index - The index of the milestone to remove.
   */
  const handleRemoveMilestone = (index: number) => {
    const removedValue = Number(milestoneValues[index]) || 0;
    remove(index);

    // Redistribute the removed milestone percentage to remaining ones
    const remainingTotal = milestoneValues.reduce(
      (sum: number, value: number, idx: number) => (idx !== index ? sum + (Number(value) || 0) : sum),
      0
    );

    if (remainingTotal > 0) {
      milestoneValues.forEach((value: number, idx: number) => {
        if (idx !== index) {
          const newValue = ((Number(value) || 0) / remainingTotal) * (remainingTotal + removedValue);
          update(idx, Math.round(newValue * 100) / 100);
        }
      });
    }
  };

  const totalMilestoneSum = milestoneValues.reduce((sum: number, value: number) => sum + (Number(value) || 0), 0);
  const isTotalValid = totalMilestoneSum === 100;

  return (
    <div className="flex flex-col gap-4 border border-border-light dark:border-border-dark p-4 rounded-lg">
      <label className="block font-medium">{t(`${TRANSLATION_KEY}.milestones`)}</label>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Controller
            name={`milestonePercentages.${index}`}
            control={control}
            render={({ field: milestoneField, fieldState }) => (
              <Input
                {...milestoneField}
                label={t(`${TRANSLATION_KEY}.milestone_amount`)}
                placeholder={t(`${TRANSLATION_KEY}.milestone_amount_placeholder`)}
                type="number"
                step="any"
                min="1"
                max="100"
                error={fieldState.error?.message}
                required
                aria-label={t(`${TRANSLATION_KEY}.milestone_amount_aria`, { index: index + 1 })}
                onChange={(e) => {
                  let newValue = Number(e.target.value);
                  if (newValue > 100) newValue = 100;
                  setValue(`milestonePercentages.${index}`, newValue, { shouldValidate: true });
                  setHasInteracted(true);
                }}
              />
            )}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="xsmall"
              onClick={() => handleRemoveMilestone(index)}
              aria-label={t(`${TRANSLATION_KEY}.remove_milestone`, { index: index + 1 })}
            >
              {t(`pages.create_project.actions.remove`)}
            </Button>
          )}
        </div>
      ))}

      {!isTotalValid && hasInteracted && (
        <span className="text-red-500 text-sm" role="alert">
          {t(`${TRANSLATION_KEY}.not_enough`, { total: totalMilestoneSum })}
        </span>
      )}

      <Button
        type="button"
        size="small"
        className="w-fit"
        onClick={handleAddMilestone}
        aria-label={t(`${TRANSLATION_KEY}.add_milestone`)}
      >
        {t(`${TRANSLATION_KEY}.add_milestone`)}
      </Button>
    </div>
  );
};

export default MilestonesInput;
