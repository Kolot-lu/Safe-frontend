import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import { ChevronsUpDown } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { Finder } from '../../../components/ui/Finder/Finder';
import config from '../../../config';

interface TokenTypes {
  name: string;
  address: string;
}

const testNetTokens: TokenTypes[] = [
  { name: 'ETH', address: config.ZERRO_ADDRESS },
  { name: 'USDT', address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06' },
  { name: 'WBTC', address: '0xe474b1939D11E17325B9A698462D89D3c47186F9' },
  { name: 'DAI', address: '0x68194a729C2450ad26072b3D33ADaCbcef39D574' },
  { name: 'USDC', address: '0x097Da51357837f9A0760B04cae4c23c3ebE28B00' },
];

/**
 * Translation key prefix for the component.
 */
const TRANSLATION_KEY = 'pages.create_project.fields.token_address';

/**
 * @component TokenAddressInput
 * @description Renders a token selection input integrated with `react-hook-form`, allowing users to either enter a token address manually or select from predefined options using `Finder`.
 */
const TokenAddressInput: React.FC<{ error?: string }> = ({ error }) => {
  const { t } = useTranslation();
  const { control, setValue, getValues } = useFormContext();

  /**
   * @function handleTokenSelect
   * @description Updates the form with the selected token address.
   * @param {TokenTypes} token - The selected token.
   */
  const handleTokenSelect = (token: TokenTypes) => {
    setValue('tokenAddress', token.address, { shouldValidate: true });
    console.log(getValues());
  };

  return (
    <div className="flex flex-col">
      <Controller
        name="tokenAddress"
        control={control}
        render={({ field }) => (
          <Finder options={testNetTokens} onSelect={handleTokenSelect}>
            <Finder.Trigger>
              <Button type="button" variant="outline" className="w-full justify-between">
                {field.value
                  ? testNetTokens.find((t) => t.address === field.value)?.name || t(`${TRANSLATION_KEY}.select_token`)
                  : t(`${TRANSLATION_KEY}.select_token`)}
                <ChevronsUpDown />
              </Button>
            </Finder.Trigger>
            <Finder.Content closeOnClisk={false} position="left" className="min-w-64">
              <Finder.Input placeholder={t(`${TRANSLATION_KEY}.search_placeholder`, 'Search tokens...')} />
              <Finder.List renderOption={(option: TokenTypes) => <span>{option.name}</span>} />
              <Finder.Empty message={t(`${TRANSLATION_KEY}.no_tokens_found`, 'No tokens found.')} />
            </Finder.Content>
          </Finder>
        )}
      />
      {error && (
        <span className="text-red-500 text-sm" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default TokenAddressInput;
