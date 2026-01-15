import { Directive, ElementRef, HostListener, Output, EventEmitter, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDroppable]',
  standalone: true,
})
export class DroppableDirective {
  @Output() variableDropped = new EventEmitter<{ variable: string; cursorPosition: number }>();

  constructor(
    private el: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.renderer.addClass(this.el.nativeElement, 'drag-over');
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.removeClass(this.el.nativeElement, 'drag-over');
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.removeClass(this.el.nativeElement, 'drag-over');

    const variable = event.dataTransfer?.getData('text/plain');
    if (!variable) return;

    const element = this.el.nativeElement;
    const cursorPosition = this.getCursorPosition(element, event);
    
    this.variableDropped.emit({ variable, cursorPosition });
  }

  private getCursorPosition(element: HTMLInputElement | HTMLTextAreaElement, event: DragEvent): number {
    // For input elements, use selectionStart
    if (element instanceof HTMLInputElement) {
      return element.selectionStart ?? element.value.length;
    }
    
    // For textarea, try to calculate position from drop coordinates
    // TypeScript knows this must be HTMLTextAreaElement here
    const textarea = element as HTMLTextAreaElement;
    
    // First, try to use current selection
    if (textarea.selectionStart !== null && textarea.selectionStart !== undefined) {
      return textarea.selectionStart;
    }
    
    // Calculate position from mouse coordinates
    const rect = textarea.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Estimate line and column from coordinates
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const charWidth = 8; // Approximate character width
    const estimatedLine = Math.floor(y / lineHeight);
    const estimatedCol = Math.floor(x / charWidth);
    
    const lines = textarea.value.split('\n');
    let position = 0;
    for (let i = 0; i < Math.min(estimatedLine, lines.length); i++) {
      position += lines[i].length + 1; // +1 for newline
    }
    position += Math.min(estimatedCol, lines[estimatedLine]?.length || 0);
    
    return Math.min(position, textarea.value.length);
  }
}
