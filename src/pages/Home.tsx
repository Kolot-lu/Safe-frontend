import React from 'react';
import ProjectsList from '../components/ProjectsList';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ProjectsList />
    </div>
  );
};

export default HomePage;
