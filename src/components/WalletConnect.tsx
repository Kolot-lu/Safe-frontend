import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Wallet } from 'lucide-react';
import MetaMaskIconSvg from '../assets/icons/MetaMask.svg?react';
import TronLinkIcon from '../assets/icons/TronLink.png';
import { useBlockchain } from '../hooks/useBlockchain';
import { useToast } from '../hooks/useToast';
import { useUserStore } from '../store/useUserStore';
import { shortenAddress } from '../helpers/shortenAddress';
import Button from './ui/Button';
import Dropdown from './ui/Dropdown/Dropdown';

// Translation keys
const translationWallets = 'components.connect_wallet';

/**
 * @component WalletConnect
 * @description A component that manages the display and connection of cryptocurrency wallets,
 * providing options for connecting through MetaMask and TronLink.
 * Displays the connected wallet address in a shortened format.
 *
 * @returns {JSX.Element} Rendered WalletConnect component.
 */
const WalletConnect: React.FC = () => {
  const { connectEthereum, provider } = useBlockchain();
  const { address, connectedNetwork } = useUserStore();
  const { showToast } = useToast();
  const { t } = useTranslation();

  /**
   * @function openToast
   * @description Displays a toast notification for features under development.
   */
  const openToast = (): void => {
    showToast({
      message: t(`${translationWallets}.tronweb.warnings.in_development`),
      type: 'warning',
    });
  };

  return (
    <>
      {provider && address && connectedNetwork ? (
        <ConnectedWallet address={address} />
      ) : (
        <WalletConnectionOptions connectEthereum={connectEthereum} openToast={openToast} />
      )}
    </>
  );
};

export default WalletConnect;

/**
 * @component ConnectedWallet
 * @description Renders a button displaying the connected wallet address in a shortened format.
 *
 * @param {string} address - The wallet address to display.
 * @returns {JSX.Element} The rendered connected wallet button.
 */
const ConnectedWallet: React.FC<{ address: string }> = ({ address }) => {
  return (
    <Button variant="outline" size="small" aria-label={`Connected wallet: ${shortenAddress(address)}`}>
      <User aria-hidden="true" /> <span className='hidden md:block'>{shortenAddress(address)}</span>
    </Button>
  );
};

/**
 * @component WalletConnectionOptions
 * @description Renders a dropdown menu with wallet connection options for MetaMask and TronLink.
 *
 * @param {function} connectEthereum - Function to connect to MetaMask wallet.
 * @param {function} openToast - Function to display a toast message for features in development.
 * @returns {JSX.Element} The rendered dropdown with connection options.
 */
const WalletConnectionOptions: React.FC<{
  connectEthereum: () => void;
  openToast: () => void;
}> = ({ connectEthereum, openToast }) => {
  const { t } = useTranslation();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button variant="outline" size="small" aria-label={t(`${translationWallets}.accessibility.connect`)}>
          <Wallet aria-hidden="true" /> {t(`${translationWallets}.connect`)}
        </Button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Button
          variant="ghost"
          size="small"
          className="justify-start [&_svg]:w-6"
          onClick={connectEthereum}
          aria-label={t(`${translationWallets}.metamask.accessibility.label`)}
        >
          <MetaMaskIconSvg aria-hidden="true" />
          {t(`${translationWallets}.metamask.label`)}
        </Button>
        <Button
          variant="ghost"
          size="small"
          className="justify-start"
          onClick={openToast}
          aria-label={t(`${translationWallets}.tronweb.accessibility.label`)}
        >
          <img src={TronLinkIcon} alt="TronLink Icon" className="w-5 h-auto rounded" />
          {t(`${translationWallets}.tronweb.label`)}
        </Button>
      </Dropdown.Content>
    </Dropdown>
  );
};
