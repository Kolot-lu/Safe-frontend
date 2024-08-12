import React, { useEffect } from 'react';
import { useBlockchain } from '../context/BlockchainProvider';
import { Project } from '../types';

const ProjectsList: React.FC = () => {
  const { projects } = useBlockchain();

  useEffect(() => {
    // ...
  }, []);

  return (
    <div>
      {projects.map((project: Project, index: number) => (
        <div key={index} className="p-4 border mb-2">
          <h2 className="text-lg font-bold">Project {index + 1}</h2>
          <p>Client: {project.client}</p>
          <p>Executor: {project.executor}</p>
          
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
