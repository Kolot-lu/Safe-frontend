import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useTranslation } from 'react-i18next';

interface MilestonesInputProps {
  milestonePercentages: string[];
  onMilestoneChange: (index: number, value: string) => void;
  onAddMilestone: () => void;
  onRemoveMilestone: (index: number) => void;
}

const MilestonesInput: React.FC<MilestonesInputProps> = ({
  milestonePercentages,
  onMilestoneChange,
  onAddMilestone,
  onRemoveMilestone,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <label className="block font-medium mb-2">{t('pages.create_project.fields.milestones')}</label>
      {milestonePercentages.map((percent, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            label={`${t('pages.create_project.fields.milestone_amount')} (%)`}
            placeholder={t('pages.create_project.fields.milestone_amount')}
            value={percent}
            onChange={(e) => onMilestoneChange(index, e.target.value)}
            type="number"
            required
            step="any"
          />
          {milestonePercentages.length > 1 && (
            <Button type="button" variant="ghost" size="xsmall" onClick={() => onRemoveMilestone(index)}>
              {t('pages.create_project.actions.remove')}
            </Button>
          )}
        </div>
      ))}
      <Button type="button" size="small" onClick={onAddMilestone}>
        {t('pages.create_project.actions.add_milestone')}
      </Button>
    </div>
  );
};

export default MilestonesInput;
