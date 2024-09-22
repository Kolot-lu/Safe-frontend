import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n.ts';
import './styles/main.css';
import App from './App.tsx';
import { BlockchainProvider } from './context/BlockchainProvider';
import ToastContainer from './components/ui/Toast/ToastContainer.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlockchainProvider>
        <Router>
          <App />
        </Router>
        <ToastContainer />
      </BlockchainProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
