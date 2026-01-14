import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S1SchemaComponent } from './s1-schema.component';

describe('S1SchemaComponent', () => {
  let component: S1SchemaComponent;
  let fixture: ComponentFixture<S1SchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [S1SchemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(S1SchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
