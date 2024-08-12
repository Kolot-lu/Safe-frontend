import React, { createContext, useContext, useState } from "react";
import { BrowserProvider, ethers } from "ethers";
import TronWeb from 'tronweb';
import { Project } from "../types";

interface BlockchainContextProps {
  provider: BrowserProvider | null;
  tronWeb: TronWeb | null;
  connectEthereum: () => void;
  connectTron: () => void;
  projects: Project[];
}

const BlockchainContext = createContext<BlockchainContextProps | null>(null);

export const useBlockchain = () => {
  return useContext(BlockchainContext);
};

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const connectEthereum = async () => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      setProvider(browserProvider);
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const connectTron = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      setTronWeb(window.tronWeb);
    } else {
      alert("TronLink is not installed!");
    }
  };

  return (
    <BlockchainContext.Provider
      value={{ provider, tronWeb, connectEthereum, connectTron, projects }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
