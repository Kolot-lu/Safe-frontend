import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import { ChevronsUpDown } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Finder } from '../../../components/ui/Finder/Finder';
import { Token } from '../../../config/tokens';
import { useBlockchain } from '../../../hooks/useBlockchain';

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.token_address';

/**
 * @component TokenAddressInput
 * @description Renders a token selection input integrated with `react-hook-form`, allowing users to either enter a token address manually or select from predefined options.
 */
const TokenAddressInput: React.FC<{ error?: string }> = ({ error }) => {
  const { getTokens } = useBlockchain();
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [tokenList, setTokenList] = React.useState<Token[]>([]);

  useEffect(() => {
    getTokens().then((tokens) => {
      setTokenList(tokens);
    });
  }, [getTokens]);

  if (!tokenList) return null;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="token" className="font-medium text-sm text-gray-700 dark:text-gray-300">
        {t(`${TRANSLATION_KEY}.select_token`)}
      </label>
      <Controller
        name="token"
        control={control}
        render={({ field }) => {
          const selectedTokenName = field.value.address ? field.value.name : t(`${TRANSLATION_KEY}.select_token`);
          return (
            <Finder
              options={tokenList}
              onSelect={(option: Token) => {
                field.onChange(option);
              }}
            >
              <Finder.Trigger>
                <Button type="button" variant="outline" className="w-full justify-between">
                  {selectedTokenName}
                  <ChevronsUpDown />
                </Button>
              </Finder.Trigger>
              <Finder.Content closeOnClisk={false} position="left" className="min-w-64">
                <Finder.Input placeholder={t(`${TRANSLATION_KEY}.search_placeholder`, 'Search tokens...')} />
                <Finder.List renderOption={(option: Token) => <span>{option.name}</span>} />
                <Finder.Empty message={t(`${TRANSLATION_KEY}.no_tokens_found`, 'No tokens found.')} />
              </Finder.Content>
            </Finder>
          );
        }}
      />
      {error ? (
        <span className="text-red-500 text-sm" role="alert">
          {error}
        </span>
      ) : (
        <span className="text-gray-500 text-sm">{t(`${TRANSLATION_KEY}.description`)}</span>
      )}
    </div>
  );
};

export default TokenAddressInput;
