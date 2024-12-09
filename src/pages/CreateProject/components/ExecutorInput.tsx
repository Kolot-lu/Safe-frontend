import React from 'react';
import Input from '../../../components/ui/Input';
import { useTranslation } from 'react-i18next';

const translations = 'pages.create_project.fields';

interface ExecutorInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ExecutorInput: React.FC<ExecutorInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <Input
      label={t(`${translations}.executor`)}
      placeholder="0x123..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
};

export default ExecutorInput;
