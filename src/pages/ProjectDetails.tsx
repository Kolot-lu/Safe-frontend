import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Project Details - {id}</h1>
      {/* TO DO */}
    </div>
  );
};

export default ProjectDetailsPage;
