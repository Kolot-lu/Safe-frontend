import React from 'react';
import { useBlockchain } from '../hooks/useBlockchain';

const ConnectWallet: React.FC = () => {
  const { connectEthereum, connectTron, provider, tronWeb, isLoadingProjects, projects } = useBlockchain();

  return (
    <div>
      {!provider && !tronWeb ? (
        <div>
          <button onClick={connectEthereum} className="m-2 p-2 bg-blue-400">Connect to Ethereum</button>
          <button onClick={connectTron} className="m-2 p-2 bg-red-400">Connect to Tron</button>
        </div>
      ) : (
        <div>
          {isLoadingProjects ? (
            <p>Loading projects...</p>
          ) : (
            <ul>
              {projects.map((project, index) => (
                <li key={index}>{project.executor}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
