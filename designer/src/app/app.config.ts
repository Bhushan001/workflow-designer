import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faFile,
  faSave,
  faFolderOpen,
  faPlay,
  faSearchPlus,
  faSearchMinus,
  faExpand,
  faBolt,
  faGlobe,
  faCodeBranch,
  faCircle,
  faCode,
  faChevronLeft,
  faChevronRight,
  faTerminal,
  faTimes,
  faCog,
  faEdit,
  faTrash,
  faSpinner,
  faRocket,
  faCheckCircle,
  faShieldAlt,
  faChartLine,
  faUsers,
  faCloud,
  faArrowRight,
  faBars,
  faEnvelope,
  faLock,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        library.addIcons(
          faFile,
          faSave,
          faFolderOpen,
          faPlay,
          faSearchPlus,
          faSearchMinus,
          faExpand,
          faBolt,
          faGlobe,
          faCodeBranch,
          faCircle,
          faCode,
          faChevronLeft,
          faChevronRight,
          faTerminal,
          faTimes,
          faCog,
          faEdit,
          faTrash,
          faSpinner,
          faRocket,
          faCheckCircle,
          faShieldAlt,
          faChartLine,
          faUsers,
          faCloud,
          faArrowRight,
          faBars,
          faEnvelope,
          faLock,
          faUser
        );
        return library;
      },
    },
  ],
};
