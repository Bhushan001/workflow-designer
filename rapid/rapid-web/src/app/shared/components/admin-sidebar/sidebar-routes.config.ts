import { RouteInfo } from "../sidebar/sidebar.metadata";

//Sidebar menu Routes and data
export const ADMINROUTES: RouteInfo[] = [
  {
    path: '/admin/home',
    title: 'Home',
    icon: 'bx bx-home', // Simplified home icon
    class: 'sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    showSubMenu: false,
    submenu: [],
    isSubMenuOpen: false
  },
  {
    path: '',
    title: 'Manage Clients',
    icon: 'bx bx-buildings', // Changed to buildings for clients
    class: 'sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isSubMenuOpen: false,
    showSubMenu: false,
    submenu: [
      {
        path: '/admin/manage-clients/list-clients',
        title: 'List Clients',
        icon: 'bx bx-list-ol', // Changed to ordered list for listing clients
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
    title: 'Manage Users',
    icon: 'bx bx-user-circle', // Changed to user-circle for user management
    class: 'sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isSubMenuOpen: false,
    showSubMenu: false,
    submenu: [
      {
        path: '/admin/manage-users/list-users',
        title: 'List Users',
        icon: 'bx bx-user-voice', // Changed to user-voice/user-account for listing users.
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
];