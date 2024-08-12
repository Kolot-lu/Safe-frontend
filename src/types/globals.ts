/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalProvider } from "@ethersproject/providers";

export {};
declare global {
  interface Window {
    ethereum: ExternalProvider;
    tronWeb: any;
  }
}
