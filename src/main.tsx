import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/main.css';
import { BlockchainProvider } from './context/BlockchainProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlockchainProvider>
        <App />
      </BlockchainProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
