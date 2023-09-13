import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialConventionPage } from './special-convention.page';

describe('SpecialConventionPage', () => {
  let component: SpecialConventionPage;
  let fixture: ComponentFixture<SpecialConventionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SpecialConventionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
