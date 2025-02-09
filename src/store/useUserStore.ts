import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Network } from '../config/chains';
import { WalletType } from '../config/wallets';

/**
 * @interface UserState
 * @description Interface defining the shape of the user's state.
 */
interface UserState {
  connectedNetwork: Network | null; // Currently connected network
  address: string | null; // Wallet address of the connected user
  wallet: WalletType | null; // Connected wallet type
  isConnected: boolean; // Connection status flag
  setConnectedNetwork: (network: Network, address: string, wallet: WalletType) => void; // Function to set the connected network and address
  resetConnection: () => void; // Function to reset the connection state
}

/**
 * Zustand store to manage user-related state, including wallet connections, network switching, and state persistence.
 * Zustand's `persist` middleware is used to automatically save the state in `localStorage`.
 */
export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      connectedNetwork: null,
      address: null,
      wallet: null,
      isConnected: false,

      /**
       * @function setConnectedNetwork
       * @description Sets the connected network and address in the store.
       * @param {Network} network - The network to connect to.
       * @param {string} address - The wallet address of the connected user.
       */
      setConnectedNetwork: (network, address, wallet) => {
        if (!Object.values(Network).includes(network)) {
          console.error(`Invalid network: ${network}`);
          return;
        }
        set({
          connectedNetwork: network,
          address,
          wallet,
          isConnected: true,
        });
      },

      /**
       * @function resetConnection
       * @description Resets the wallet connection state and clears any persistent storage related to the connection.
       */
      resetConnection: () => {
        set({
          connectedNetwork: null,
          address: null,
          wallet: null,
          isConnected: false,
        });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
