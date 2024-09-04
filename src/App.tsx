import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import ProjectsList from './components/ProjectsList';

const App: React.FC = () => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ConnectWallet />
      <ProjectsList />
    </div>
  );
};

export default App;
