import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatementsComponent } from './view-statements.component';

describe('ViewStatementsComponent', () => {
  let component: ViewStatementsComponent;
  let fixture: ComponentFixture<ViewStatementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStatementsComponent]
    });
    fixture = TestBed.createComponent(ViewStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
