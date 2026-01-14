import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSchemaComponent } from './request-schema.component';

describe('RequestSchemaComponent', () => {
  let component: RequestSchemaComponent;
  let fixture: ComponentFixture<RequestSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestSchemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
