import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ProjectComponent } from './project/project.component';
import { PageComponent } from './page/page.component';
import { UserService } from '../../services/user.service';
import { WorkspaceService } from '../services/workspace.service';
import { Workspace } from '../model/workspace.model';
import { ProjectService } from '../services/project.service';
import { Project } from '../model/project.model';
import { PageService } from '../services/page.service';
import { Page } from '../model/page.model';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { PageableResponse } from '../model/pageable.model';

@Component({
  selector: 'app-project-manager',
  imports: [
    CommonModule,
    WorkspaceComponent,
    ProjectComponent,
    PageComponent
  ],
  templateUrl: './project-manager.component.html',
  styleUrl: './project-manager.component.scss'
})
export class ProjectManagerComponent implements OnInit {
  selectedWorkspace: any = null;
  selectedProject: any = null;
  selectedPage: any = null;

  constructor(
    private _workspaceService: WorkspaceService,
    private _projectService: ProjectService,
    private _pageService: PageService
  ) { }

  ngOnInit(): void {
    
  }

  onWorkspaceSelect(workspace: Workspace) {
    this.selectedWorkspace = workspace;
    this.selectedProject = null; // Reset project on workspace change
    this.selectedPage = null;
  }

  onWorkspaceCreate(ev: any) {
    // this.getAllWorkspaces();
  }

  onWorkspaceUpdate(ev: any) {
   // this.getAllWorkspaces();
  }

  onWorkspaceDelete(ev: any) {
    this.selectedProject = null;
    this.selectedPage = null;
  }

  onProjectSelect(project: any) {
    this.selectedProject = project; 
    this.selectedPage = null;   
  }

  onProjectCreate(ev: any) {
    this.selectedProject = null;
    this.selectedPage = null;
  }

  onProjectUpdate(ev: any) {
    //this.getAllProjectsByWorkspaceId(this.selectedWorkspace.id);
  }

  onProjectDelete(ev: any) {
    this.selectedProject = null;
    this.selectedPage = null;
  }

  onPageSelect(page: any) {
    this.selectedPage = page;
  }

  onPageCreate(ev: any) {
    // this.getAllPagesByProjectId(this.selectedProject.id);
  }

  onPageUpdate(ev: any) {
   //  this.getAllPagesByProjectId(this.selectedProject.id);
  }

  onPageDelete(ev: any) {
   // this.getAllPagesByProjectId(this.selectedProject.id);
  }
}