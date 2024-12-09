import { LucideIcon, Home, PlusCircle, Folder } from 'lucide-react';
import HomePage from '../pages/Home';
import CreateProjectPage from '../pages/CreateProject/CreateProject';
import ProjectDetailsPage from '../pages/ProjectDetails';

/**
 * @interface MenuItem
 * @description Defines the structure of each menu item. 
 * The menu includes a title, path, an optional icon, the corresponding page component, 
 * and a visibility flag (`isVisible`) that determines whether the item is displayed in navigation.
 */
export interface MenuItem {
  title: string;        // The name of the menu item to be displayed
  path: string;         // The path used for routing
  icon?: LucideIcon;    // Optional icon component to display with the menu item
  page: React.FC;       // The React component to render when this route is active
  isVisible?: boolean;  // Flag to control whether this menu item is visible in the navigation ui
}

/**
 * @constant mainMenu
 * @description The main menu configuration array that defines the menu items. And used in the App component.
 * Items with `isVisible: false` are used for routing but not displayed in the UI (e.g., routes with parameters).
 */
export const mainMenu: MenuItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: Home,
    page: HomePage,
    isVisible: true,
  },
  {
    title: 'Create Project',
    path: '/create-project',
    icon: PlusCircle,
    page: CreateProjectPage,
    isVisible: true,
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: Folder,
    page: ProjectDetailsPage,
    isVisible: true,
  },
  {
    title: 'Projects',
    path: '/projects/:id',
    icon: Folder,
    page: ProjectDetailsPage,
    isVisible: false,
  },
];
