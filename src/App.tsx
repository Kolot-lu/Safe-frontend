import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/Main/MainLayout';
import ConnectWallet from './components/ConnectWallet';
import HomePage from './pages/Home';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';

const App: React.FC = () => {
  return (
    <MainLayout>
      <MainLayout.Header>
        <ConnectWallet />
      </MainLayout.Header>
      <MainLayout.Body>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
        </MainLayout.Body>
    </MainLayout>
  );
};

export default App;
