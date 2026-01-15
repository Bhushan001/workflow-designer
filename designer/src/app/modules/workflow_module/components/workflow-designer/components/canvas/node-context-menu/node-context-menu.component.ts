import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCog, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-node-context-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './node-context-menu.component.html',
  styleUrl: './node-context-menu.component.scss',
})
export class NodeContextMenuComponent {
  @Input() x = 0;
  @Input() y = 0;
  @Input() nodeId: string | null = null;
  
  @Output() configure = new EventEmitter<void>();
  @Output() rename = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  faCog = faCog;
  faEdit = faEdit;
  faTrash = faTrash;
  
  onConfigure(): void {
    this.configure.emit();
    this.close.emit();
  }
  
  onRename(): void {
    this.rename.emit();
    this.close.emit();
  }
  
  onDelete(): void {
    this.delete.emit();
    this.close.emit();
  }
}

