import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorItem } from './generator-item';

describe('GeneratorItem', () => {
  let component: GeneratorItem;
  let fixture: ComponentFixture<GeneratorItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratorItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratorItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
