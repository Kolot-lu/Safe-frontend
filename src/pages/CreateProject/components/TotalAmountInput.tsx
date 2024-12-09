import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Unit } from '../../../helpers/converters';
import { useTranslation } from 'react-i18next';

const translations = 'pages.create_project.fields';

interface TotalAmountInputProps {
  rawTotalAmount: string;
  displayUnit: Unit;
  descriptionText?: string;
  onAmountChange: (value: string) => void;
  onUnitSwitch: (unit: Unit) => void;
}

const TotalAmountInput: React.FC<TotalAmountInputProps> = ({
  rawTotalAmount,
  displayUnit,
  descriptionText,
  onAmountChange,
  onUnitSwitch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <Input
        label={`${t(`${translations}.total_amount`)} (${displayUnit})`}
        placeholder={`0.0 ${displayUnit}`}
        value={rawTotalAmount}
        onChange={(e) => onAmountChange(e.target.value)}
        description={descriptionText}
        type="number"
        step="any"
        required
      />
      <div className="flex gap-2">
        {(['ETH', 'Gwei', 'Wei'] as Unit[]).map((unit) => (
          <Button
            key={unit}
            type="button"
            variant={displayUnit === unit ? 'primary' : 'ghost'}
            size="xsmall"
            onClick={() => onUnitSwitch(unit)}
          >
            {unit}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TotalAmountInput;
