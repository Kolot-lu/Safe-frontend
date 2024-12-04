import React from 'react';
import { useTranslation } from 'react-i18next';
import ProjectsList from '../components/ProjectsList';
import PageLayout from '../components/Layout/Page/PageLayout';
// import ConnectWallet from '../components/ConnectWallet';

const translations = 'pages.home';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout.FixedWidth>
      <h1>{t(`${translations}.title`)}</h1>
      {/* <ConnectWallet /> */}
      <ProjectsList />
    </PageLayout.FixedWidth>
  );
};

export default HomePage;
