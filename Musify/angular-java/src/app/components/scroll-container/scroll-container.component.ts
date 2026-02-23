import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-scroll-container',
  imports: [CommonModule],
  templateUrl: './scroll-container.component.html',
  styleUrl: './scroll-container.component.scss'
})
export class ScrollContainerComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  scrollable: boolean=false;

  constructor(private cdr: ChangeDetectorRef){}

  ngAfterViewInit() {
    const container = this.scrollContainer.nativeElement;
    
    const resizeObserver = new ResizeObserver(() => {
      this.scrollable = container.scrollWidth > container.clientWidth;
      this.cdr.detectChanges();
    });

    resizeObserver.observe(container);

    const mutationObserver = new MutationObserver(() => {
      this.scrollable = container.scrollWidth > container.clientWidth;
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true
    });

  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
