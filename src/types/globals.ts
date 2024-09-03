/* eslint-disable @typescript-eslint/no-explicit-any */

import { Eip1193Provider } from "ethers";

export {};
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
    tronWeb?: any;
  }
}
