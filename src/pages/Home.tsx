import React from 'react';
import ProjectsList from '../components/ProjectsList';
import ConnectWallet from '../components/ConnectWallet';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ConnectWallet />
      <ProjectsList />
    </div>
  );
};

export default HomePage;
