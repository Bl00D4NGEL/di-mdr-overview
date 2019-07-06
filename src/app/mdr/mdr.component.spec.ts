import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdrComponent } from './mdr.component';

describe('MdrComponent', () => {
  let component: MdrComponent;
  let fixture: ComponentFixture<MdrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
