import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { useBlockchain } from '../hooks/useBlockchain';

const ProjectsList: React.FC = () => {
  const { contractService } = useBlockchain();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (contractService) {
        try {
          setLoading(true);
          const fetchedProjects = await contractService.getProjects(0, 10);
          console.log('Fetched projects:', fetchedProjects);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setError('Failed to load projects');
        } finally {
          console.log('Finished fetching projects');
          setLoading(false);
        }
      }
    };
    fetchProjects();
  }, [contractService]);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Projects List</h2>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>
            {project.executor} - {project.totalAmount.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
