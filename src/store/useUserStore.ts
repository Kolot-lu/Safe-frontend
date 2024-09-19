import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @interface UserState
 * @description Interface defining the shape of the user's state.
 */
interface UserState {
  connectedNetwork: 'ethereum' | 'tron' | null; // Currently connected network
  address: string | null; // Wallet address of the connected user
  isConnected: boolean; // Connection status flag
  setConnectedNetwork: (network: 'ethereum' | 'tron', address: string) => void; // Function to set the connected network and address
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
      isConnected: false,
      /**
       * @function setConnectedNetwork
       * @description Sets the connected network and address in the store.
       * @param {string} network - The network to connect to ('ethereum' or 'tron').
       * @param {string} address - The wallet address of the connected user.
       */
      setConnectedNetwork: (network, address) => {
        console.log('setConnectedNetwork', network, address);
        set({
          connectedNetwork: network,
          address,
          isConnected: true,
        });
      },
      /**
       * @function resetConnection
       * @description Resets the wallet connection state and clears any persistent storage related to the connection.
       */
      resetConnection: () => {
        console.log('resetConnection');
        set({
          connectedNetwork: null,
          address: null,
          isConnected: false,
        });
      },
    }),
    {
      name: 'user-store',
      getStorage: () => localStorage,
    }
  )
);
