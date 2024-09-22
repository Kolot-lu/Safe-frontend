import React from 'react';
import { Header } from './Header';
import { Body } from './Body';
import { Footer } from './Footer';

/**
 * @interface MainLayoutProps
 * @description Defines the structure of the props for the MainLayout component.
 * @property {React.ReactNode} children - The content to be rendered inside the layout (Header, Body, and Footer).
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * @interface MainLayoutComponent
 * @description Extends the MainLayout component with static properties for Header, Body, and Footer.
 * This allows a modular and declarative usage of the layout.
 * 
 * Example:
 * <MainLayout>
 *   <MainLayout.Header>...</MainLayout.Header>
 *   <MainLayout.Body>...</MainLayout.Body>
 *   <MainLayout.Footer>...</MainLayout.Footer>
 * </MainLayout>
 */
interface MainLayoutComponent extends React.FC<MainLayoutProps> {
  Header: typeof Header;
  Body: typeof Body;
  Footer: typeof Footer;
}

/**
 * @component MainLayout
 * @description The main layout component that provides a structure with a header, body, and footer.
 * It allows for flexible content injection into each section of the layout.
 * 
 * @param {React.ReactNode} children - The content to render inside the layout.
 * @returns {JSX.Element} The rendered layout with optional Header, Body, and Footer.
 */
const MainLayout: MainLayoutComponent = ({ children }) => {
  return (
    <div className="flex flex-col">
      {children}
    </div>
  );
};

MainLayout.Header = Header;
MainLayout.Body = Body;
MainLayout.Footer = Footer;

export default MainLayout;
