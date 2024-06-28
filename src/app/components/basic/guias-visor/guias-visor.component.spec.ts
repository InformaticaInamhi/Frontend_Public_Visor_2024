import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiasVisorComponent } from './guias-visor.component';

describe('GuiasVisorComponent', () => {
  let component: GuiasVisorComponent;
  let fixture: ComponentFixture<GuiasVisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiasVisorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuiasVisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
