import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaConfigComponent } from './schema-config.component';

describe('SchemaConfigComponent', () => {
  let component: SchemaConfigComponent;
  let fixture: ComponentFixture<SchemaConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemaConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemaConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
