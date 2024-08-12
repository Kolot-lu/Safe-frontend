import React from "react";
import { useBlockchain } from "../context/BlockchainProvider";

const ConnectWallet: React.FC = () => {
  const { connectEthereum, connectTron } = useBlockchain();

  return (
    <div className="flex space-x-4">
      <button
        onClick={connectEthereum}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Connect to Ethereum
      </button>
      <button
        onClick={connectTron}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Connect to Tron
      </button>
    </div>
  );
};

export default ConnectWallet;
