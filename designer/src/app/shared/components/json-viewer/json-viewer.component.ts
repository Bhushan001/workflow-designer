import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTable, faCode, faSitemap, faCopy } from '@fortawesome/free-solid-svg-icons';

type TabType = 'schema' | 'table' | 'raw';

interface JsonPath {
  path: string;
  value: any;
  type: string;
}

@Component({
  selector: 'app-json-viewer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './json-viewer.component.html',
  styleUrl: './json-viewer.component.scss',
})
export class JsonViewerComponent {
  @Input() data: any = null;
  @Input() title: string = 'Data';

  faTable = faTable;
  faCode = faCode;
  faSitemap = faSitemap;
  faCopy = faCopy;

  activeTab = signal<TabType>('raw');

  // Computed properties for different views
  jsonString = computed(() => {
    try {
      return JSON.stringify(this.data, null, 2);
    } catch {
      return 'Invalid JSON';
    }
  });

  schemaPaths = computed(() => {
    if (!this.data) return [];
    return this.extractSchema(this.data, '');
  });

  tableData = computed(() => {
    if (!this.data) return null;
    return this.convertToTable(this.data);
  });

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  onPathClick(path: string, event?: MouseEvent): void {
    // Copy path to clipboard in n8n-style format
    // If path starts with [, use $json[0] format, otherwise use $json.path format
    const fullPath = path.startsWith('[') 
      ? `{{ $json${path} }}`
      : `{{ $json.${path} }}`;
    navigator.clipboard.writeText(fullPath).then(() => {
      console.log('Path copied:', fullPath);
      // Visual feedback
      if (event) {
        const element = event.target as HTMLElement;
        if (element) {
          const originalText = element.textContent;
          element.textContent = '✓ Copied!';
          element.classList.add('text-success');
          setTimeout(() => {
            if (element.textContent === '✓ Copied!') {
              element.textContent = originalText;
              element.classList.remove('text-success');
            }
          }, 1500);
        }
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  onDragStart(path: string, event: DragEvent): void {
    if (!event.dataTransfer) return;
    // If path starts with [, use $json[0] format, otherwise use $json.path format
    const variablePath = path.startsWith('[') 
      ? `{{ $json${path} }}`
      : `{{ $json.${path} }}`;
    event.dataTransfer.setData('text/plain', variablePath);
    event.dataTransfer.effectAllowed = 'copy';
    // Add visual feedback
    if (event.target) {
      (event.target as HTMLElement).classList.add('dragging');
    }
  }

  onDragEnd(event: DragEvent): void {
    if (event.target) {
      (event.target as HTMLElement).classList.remove('dragging');
    }
  }

  getVariablePath(path: string): string {
    return path.startsWith('[') 
      ? `{{ $json${path} }}`
      : `{{ $json.${path} }}`;
  }

  onCopyJson(): void {
    navigator.clipboard.writeText(this.jsonString()).then(() => {
      console.log('JSON copied to clipboard');
    });
  }

  onTableCellClick(header: string, rowKey: any, event: MouseEvent): void {
    // For table view, construct path based on header and row
    let path = header;
    if (this.tableData()?.headers[0] === 'Key') {
      // Key-value table
      path = String(rowKey);
    } else if (this.tableData()?.headers[0] === 'Index') {
      // Array table
      path = `[${rowKey}]`;
    } else {
      // Object array table - use header as path
      path = header;
    }
    this.onPathClick(path, event);
  }

  private extractSchema(obj: any, prefix: string): JsonPath[] {
    const paths: JsonPath[] = [];

    if (obj === null || obj === undefined) {
      paths.push({ path: prefix, value: null, type: 'null' });
      return paths;
    }

    const type = Array.isArray(obj) ? 'array' : typeof obj;

    if (type === 'object' && !Array.isArray(obj)) {
      // Object - extract keys
      Object.keys(obj).forEach((key) => {
        const newPath = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        const valueType = Array.isArray(value) ? 'array' : typeof value;

        if (valueType === 'object' && value !== null && !Array.isArray(value)) {
          // Nested object - recurse
          paths.push(...this.extractSchema(value, newPath));
        } else if (Array.isArray(value)) {
          // Array value - show array structure and extract schema
          paths.push({
            path: newPath,
            value: `Array[${value.length}]`,
            type: 'array',
          });
          if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            paths.push(...this.extractSchema(value[0], `${newPath}[0]`));
          }
        } else {
          // Leaf value
          paths.push({
            path: newPath,
            value: this.formatValue(value),
            type: valueType,
          });
        }
      });
    } else if (Array.isArray(obj)) {
      // Array at root level - show structure and extract schema from elements
      if (obj.length > 0) {
        paths.push({
          path: prefix || '[]',
          value: `Array[${obj.length}]`,
          type: 'array',
        });
        
        // Extract schema from first element
        const firstElement = obj[0];
        if (typeof firstElement === 'object' && firstElement !== null && !Array.isArray(firstElement)) {
          // Array of objects - extract schema with [0] notation for array access
          // Users can change [0] to [1], [2], etc. or use in loops
          Object.keys(firstElement).forEach((key) => {
            const arrayPath = prefix ? `${prefix}[0].${key}` : `[0].${key}`;
            const value = firstElement[key];
            const valueType = Array.isArray(value) ? 'array' : typeof value;
            
            if (valueType === 'object' && value !== null && !Array.isArray(value)) {
              // Nested object in array element - recurse
              paths.push(...this.extractSchema(value, arrayPath));
            } else if (Array.isArray(value)) {
              paths.push({
                path: arrayPath,
                value: `Array[${value.length}]`,
                type: 'array',
              });
            } else {
              paths.push({
                path: arrayPath,
                value: this.formatValue(value),
                type: valueType,
              });
            }
          });
        } else if (Array.isArray(firstElement)) {
          // Array of arrays
          paths.push({
            path: `${prefix || ''}[0]`,
            value: `Array[${firstElement.length}]`,
            type: 'array',
          });
        } else {
          // Array of primitives
          paths.push({
            path: `${prefix || ''}[0]`,
            value: this.formatValue(firstElement),
            type: typeof firstElement,
          });
        }
      } else {
        paths.push({ path: prefix || '[]', value: 'Empty Array', type: 'array' });
      }
    } else {
      // Primitive value
      paths.push({ path: prefix, value: this.formatValue(obj), type: type });
    }

    return paths;
  }

  private formatValue(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') {
      // Truncate long strings
      if (value.length > 100) {
        return `"${value.substring(0, 100)}..."`;
      }
      return `"${value}"`;
    }
    if (Array.isArray(value)) {
      return `Array[${value.length}]`;
    }
    if (typeof value === 'object') {
      // For objects, show a summary instead of full JSON
      const keys = Object.keys(value);
      if (keys.length === 0) return '{}';
      if (keys.length <= 3) {
        return `{${keys.join(', ')}}`;
      }
      return `{${keys.slice(0, 3).join(', ')}, ...}`;
    }
    return String(value);
  }

  private convertToTable(data: any): { headers: string[]; rows: any[][] } | null {
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      
      // If array of objects, create table
      if (typeof data[0] === 'object' && data[0] !== null) {
        const headers = Object.keys(data[0]);
        const rows = data.map((item) => headers.map((h) => item[h]));
        return { headers, rows };
      } else {
        // Array of primitives
        return {
          headers: ['Index', 'Value'],
          rows: data.map((item, idx) => [idx, item]),
        };
      }
    } else if (typeof data === 'object' && data !== null) {
      // Single object - show as key-value pairs
      const keys = Object.keys(data);
      return {
        headers: ['Key', 'Value'],
        rows: keys.map((key) => [key, this.formatTableValue(data[key])]),
      };
    }
    return null;
  }

  private formatTableValue(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      return Array.isArray(value) ? `Array[${value.length}]` : 'Object';
    }
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return String(value);
  }
}
