import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KartonComponent } from './karton.component';

describe('KartonComponent', () => {
  let component: KartonComponent;
  let fixture: ComponentFixture<KartonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KartonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KartonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
