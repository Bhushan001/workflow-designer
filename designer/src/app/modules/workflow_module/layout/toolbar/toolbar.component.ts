import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFile,
  faSave,
  faPlay,
  faSearchPlus,
  faSearchMinus,
  faExpand,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  // Icons
  faFile = faFile;
  faSave = faSave;
  faPlay = faPlay;
  faSearchPlus = faSearchPlus;
  faSearchMinus = faSearchMinus;
  faExpand = faExpand;

  @Input() workflowName = 'New Workflow';
  @Input() isExecuting = false;

  @Output() workflowNameChange = new EventEmitter<string>();
  @Output() newWorkflow = new EventEmitter<void>();
  @Output() saveWorkflow = new EventEmitter<void>();
  @Output() execute = new EventEmitter<void>();
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() fitView = new EventEmitter<void>();

  onWorkflowNameChange(value: string): void {
    this.workflowNameChange.emit(value);
  }
}
