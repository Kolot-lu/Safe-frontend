import React from 'react';
import { useBlockchain } from '../hooks/useBlockchain';
import { useUserStore } from '../store/useUserStore';
import { useToast } from '../store/useToast';

const ConnectWallet: React.FC = () => {
  const { connectEthereum, connectTron, switchNetwork, provider, tronWeb } = useBlockchain();
  const { address, connectedNetwork } = useUserStore();
  const { showToast } = useToast();

  function openToast(): void {
    showToast({ message: 'Wallet connected!' });
  }

  return (
    <div className="flex space-x-4">
      {!provider && !tronWeb && !connectedNetwork ? (
        <>
          <button onClick={connectEthereum} className="m-2 p-2 bg-blue-400">
            Connect to Ethereum
          </button>
          <button onClick={connectTron} className="m-2 p-2 bg-red-400">
            Connect to Tron
          </button>
        </>
      ) : (
        <>
          <p>Address: {address}</p>
          {provider && (
            <button onClick={() => switchNetwork('tron')} className="m-2 p-2 bg-red-400">
              Switch to Tron
            </button>
          )}
          {tronWeb && (
            <button onClick={() => switchNetwork('ethereum')} className="m-2 p-2 bg-blue-400">
              Switch to Ethereum
            </button>
          )}
        </>
      )}
      <button onClick={() => openToast()} className="m-2 p-2 bg-gray-400">
        Test
      </button>
    </div>
  );
};

export default ConnectWallet;
