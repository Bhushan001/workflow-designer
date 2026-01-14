import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-json-viewer',
  imports: [
    CommonModule
  ],
  templateUrl: './json-viewer.component.html',
  styleUrl: './json-viewer.component.scss'
})
export class JsonViewerComponent implements OnInit {
  @Input() data: any;
  @Input() currentPath: string[] = [];
  @Output() pathClicked = new EventEmitter<string[]>();
  @Input() highlightedPath: string[] | null = null;
  @Input() mappedPaths: string[][] = []; 

  expanded: { [key: string]: boolean } = {};

  ngOnInit() {
    if (this.data && typeof this.data === 'object' && !Array.isArray(this.data)) {
      Object.keys(this.data).forEach((key) => (this.expanded[key] = false));
    }
  }

  getKeys(obj: any): string[] {
    if (typeof obj === 'object' && obj !== null) {
      return Object.keys(obj);
    }
    return [];
  }

  isObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  toggle(key: string): void {
    this.expanded[key] = !this.expanded[key];
  }

  getPath(current: string[], key: string): string[] {
    return [...current, key];
  }

  handleKeyClick(key: string, current: string[], item: any) {
    if (!this.isObject(item) && !this.isArray(item)) {
      this.pathClicked.emit([...current, key]);
    } else {
      this.toggle(key);
    }
  }

  propagatePath(path: string[]) {
    this.pathClicked.emit(path);
  }

  isHighlighted(currentPath: string[], key: string): boolean {
    if (!this.highlightedPath) {
      return false;
    }
    const fullPath = [...currentPath, key];
    return (
      this.highlightedPath.length === fullPath.length &&
      this.highlightedPath.every((val, index) => val === fullPath[index]) &&
      !this.isObject(this.data[key]) &&
      !this.isArray(this.data[key])
    );
  }

  isMapped(currentPath: string[], key: string): boolean {
    const fullPath = [...currentPath, key];
    return this.mappedPaths.some(mappedPath =>
      mappedPath.length === fullPath.length &&
      mappedPath.every((val, index) => val === fullPath[index])
    );
  }
}