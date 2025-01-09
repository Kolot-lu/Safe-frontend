import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.milestone';

/**
 * MilestonesInput Component
 *
 * Renders a list of milestone percentage inputs with options to add or remove milestones.
 * Integrates with `react-hook-form` for form state management using `useFieldArray`.
 *
 * @returns {JSX.Element} A dynamic list of milestone percentage inputs.
 *
 * @example
 * <MilestonesInput />
 */
const MilestonesInput: React.FC = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  // Hook for managing the array of milestones
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'milestonePercentages', // Must match the form field name
  });

  /**
   * Adds a new milestone input to the list.
   */
  const handleAddMilestone = () => {
    append(''); // Append an empty string as a new milestone
  };

  /**
   * Removes a milestone input from the list by index.
   *
   * @param {number} index - The index of the milestone to remove.
   */
  const handleRemoveMilestone = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="block font-medium">{t(`${TRANSLATION_KEY}.milestones`)}</label>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Controller
            name={`milestonePercentages.${index}`}
            control={control}
            render={({ field: milestoneField, fieldState }) => (
              <Input
                {...milestoneField}
                label={`${t(`${TRANSLATION_KEY}.milestone_amount`)}`}
                placeholder={t(
                  `${TRANSLATION_KEY}.milestone_amount_placeholder`,
                  t(`${TRANSLATION_KEY}.enter_percentage`)
                )}
                type="number"
                step="any"
                error={fieldState.error?.message}
                required
                aria-label={t(`${TRANSLATION_KEY}.milestone_amount_aria`, { index: index + 1 })}
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

      <Button
        type="button"
        size="small"
        onClick={handleAddMilestone}
        aria-label={t(`${TRANSLATION_KEY}.add_milestone`)}
      >
        {t(`${TRANSLATION_KEY}.add_milestone`)}
      </Button>
    </div>
  );
};

export default MilestonesInput;
