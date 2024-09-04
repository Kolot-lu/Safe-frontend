/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'tronweb' {
  export default class TronWeb {
    static providers: any;
    static toBigNumber: any;
    defaultAddress: any;
    ready: TronWeb | undefined;
    on: any;
    removeListener: any;
    constructor(fullNode: string, solidityNode: string, eventServer: string, privateKey?: string);
    contract(abi: any, address?: string): any;
    setPrivateKey(privateKey: string): void;
    // Oher methods as needed...
  }
}
