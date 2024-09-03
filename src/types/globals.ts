/* Global types for extending the Window object */

import { Eip1193Provider } from 'ethers';
import TronWeb from 'tronweb';

export {};

declare global {
  interface Window {
    ethereum?: Eip1193Provider; // MetaMask or similar Ethereum provider
    tronWeb?: TronWeb; // TronLink provider
  }
}
