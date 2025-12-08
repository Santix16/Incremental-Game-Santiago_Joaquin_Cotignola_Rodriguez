import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostersList } from './boosters-list';

describe('BoostersList', () => {
  let component: BoostersList;
  let fixture: ComponentFixture<BoostersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoostersList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
