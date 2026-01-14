import { Routes } from '@angular/router';
import { ContentComponent } from '../../content/content.component';
import { GridSystemComponent } from '../../content/grid-system/grid-system.component';
import { TypographyComponent } from '../../content/typography/typography.component';
import { TextUtilitiesComponent } from '../../content/text-utilities/text-utilities.component';
import { HomeComponent } from '../../home/home.component';
import { ProjectManagerComponent } from '../../home/project-manager/project-manager.component';
import { SchemaConfigComponent } from '../../home/schema-config/schema-config.component';
import { RequestSchemaComponent } from '../../home/schema-config/request-schema/request-schema.component';
import { S1SchemaComponent } from '../../home/schema-config/s1-schema/s1-schema.component';
import { MappingConfigComponent } from '../../home/mapping-config/mapping-config.component';
import { MappingComponent } from '../../home/mapping-config/mapping/mapping.component';
import { MappingListComponent } from '../../home/mapping-config/mapping-list/mapping-list.component';
import { AuthGuard } from '../../auth/guards/auth.guard';


export const Full_ROUTES: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { roles: ['USER'] },
    children: [
      {
        path: 'project-manager', 
        component: ProjectManagerComponent
      },
      {
        path: 'schema', 
        component: SchemaConfigComponent,
        children: [
          {
            path: 'request-schema', 
            component: RequestSchemaComponent
          },
          {
            path: 's1-schema', 
            component: S1SchemaComponent
          }
        ]
      },
      {
        path: 'mapping', 
        component: MappingConfigComponent,
        children: [
          {
            path: 'create-mapping', 
            component: MappingComponent
          },
          {
            path: 'mapping-list', 
            component: MappingListComponent
          }
        ]
      }
    ]
  },
  {
    path: 'content',
    component: ContentComponent,
    children: [
      { path: 'grid-system', component: GridSystemComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'text-utilities', component: TextUtilitiesComponent }
    ]
  }
];