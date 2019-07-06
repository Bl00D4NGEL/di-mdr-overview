import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagToolComponent } from './tag-tool.component';

describe('TagToolComponent', () => {
  let component: TagToolComponent;
  let fixture: ComponentFixture<TagToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
