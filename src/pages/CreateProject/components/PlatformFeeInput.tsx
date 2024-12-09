import { useTranslation } from 'react-i18next';
import Input from '../../../components/ui/Input';

const translations = 'pages.create_project.fields';

interface PlatformFeeInputProps {
  platformFeePercent: string;
  descriptionText?: string;
  errorText?: string;
  setPlatformFeePercent: (value: string) => void;
}

export const PlatformFeeInput: React.FC<PlatformFeeInputProps> = ({
  platformFeePercent,
  descriptionText,
  errorText,
  setPlatformFeePercent,
}): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Input
      label={t(`${translations}.platform_fee`)}
      placeholder="Example: 5 for 5%"
      value={platformFeePercent}
      onChange={(e) => setPlatformFeePercent(e.target.value)}
      type="number"
      step="any"
      description={descriptionText}
      error={errorText}
      required
    />
  );
};
