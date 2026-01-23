import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerItem } from './worker-item';

describe('WorkerItem', () => {
  let component: WorkerItem;
  let fixture: ComponentFixture<WorkerItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
