import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextUtilitiesComponent } from './text-utilities.component';

describe('TextUtilitiesComponent', () => {
  let component: TextUtilitiesComponent;
  let fixture: ComponentFixture<TextUtilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextUtilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
