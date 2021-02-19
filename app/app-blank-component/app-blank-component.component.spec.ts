import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBlankComponentComponent } from './app-blank-component.component';

describe('AppBlankComponentComponent', () => {
  let component: AppBlankComponentComponent;
  let fixture: ComponentFixture<AppBlankComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppBlankComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppBlankComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
