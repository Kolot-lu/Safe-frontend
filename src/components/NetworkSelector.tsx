import React from "react";

interface NetworkSelectorProps {
  onSelectNetwork: (network: "ethereum" | "tron") => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  onSelectNetwork,
}) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => onSelectNetwork("ethereum")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Ethereum
      </button>
      <button
        onClick={() => onSelectNetwork("tron")}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Tron
      </button>
    </div>
  );
};

export default NetworkSelector;
