import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeChecklistExample } from './tree-checklist.component';

describe('TreeChecklistComponent', () => {
  let component: TreeChecklistExample;
  let fixture: ComponentFixture<TreeChecklistExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeChecklistExample ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeChecklistExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
