import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionOverviewComponent } from './division-overview.component';

describe('DivisionOverviewComponent', () => {
  let component: DivisionOverviewComponent;
  let fixture: ComponentFixture<DivisionOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
