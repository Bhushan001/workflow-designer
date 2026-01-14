import { RouteInfo } from "./sidebar.metadata";

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Home',
    icon: 'bx bx-home', // Changed to bx-home for a simple home icon
    class: 'sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    showSubMenu: false,
    submenu: [
      {
        path: '/home/project-manager',
        title: 'Project Manager',
        icon: 'bx bx-task', // Changed to bx-task for project management
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        isSubMenuOpen: false,
        showSubMenu: false
      },
    ],
    isSubMenuOpen: false
  },
  {
    path: '',
    title: 'Schema',
    icon: 'bx bx-layer', // Changed to bx-layer for schema representation
    class: 'sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isSubMenuOpen: false,
    showSubMenu: false,
    submenu: [
      {
        path: '/home/schema/request-schema',
        title: 'Request Schema',
        icon: 'bx bx-spreadsheet', // Changed to bx-file-request for request schema
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        isSubMenuOpen: false,
        showSubMenu: false
      },
      {
        path: '/home/schema/s1-schema',
        title: 'S1 Schema',
        icon: 'bx bx-data', // Changed to bx-data for data schema representation
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        isSubMenuOpen: false,
        showSubMenu: false
      }
    ],
  },
  {
    path: '',
    title: 'Mapping',
    icon: 'bx bx-transfer-alt', // Changed to bx-transfer-alt for mapping
    class: 'sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: [
      {
        path: '/home/mapping/create-mapping',
        title: 'Create Mapping',
        icon: 'bx bx-plus-circle', // Changed to bx-plus-circle for creating new mapping
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        isSubMenuOpen: false,
        showSubMenu: false
      },
      {
        path: '/home/mapping/mapping-list',
        title: 'List Mappings',
        icon: 'bx bx-list-ul', // Changed to bx-list-ul for listing items
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        isSubMenuOpen: false,
        showSubMenu: false
      }
    ],
    isSubMenuOpen: false,
    showSubMenu: false
  }
];