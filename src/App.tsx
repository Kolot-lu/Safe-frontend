import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/Main/MainLayout';
import { mainMenu } from './config/menu';
import Header from './components/Header/Header';

const App: React.FC = () => {
  return (
    <MainLayout>
      <MainLayout.Header>
        <Header.Main />
      </MainLayout.Header>
      <MainLayout.Body>
        <Routes>
          {mainMenu.map((item) => (
            <Route key={item.path} path={item.path} element={<item.page />} />
          ))}
        </Routes>
      </MainLayout.Body>
    </MainLayout>
  );
};

export default App;
