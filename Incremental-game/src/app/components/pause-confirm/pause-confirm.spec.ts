import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseConfirm } from './pause-confirm';

describe('PauseConfirm', () => {
  let component: PauseConfirm;
  let fixture: ComponentFixture<PauseConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PauseConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PauseConfirm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
