import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { QuestionComponent } from './question.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule, NgMaterialModule],
      declarations: [QuestionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have question in format: 'num + num ='`, () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.question')?.textContent).toMatch(
      /^[0-9]+\s\+\s[0-9]+\s\=$/
    );
  });

  it('Form Group should have 1 input', () => {
    const formElement =
      fixture.debugElement.nativeElement.querySelector('#quizForm');
    expect(formElement.querySelectorAll('input').length).toEqual(1);
  });

  it('Form Group input should be empty', () => {
    const formInput = fixture.debugElement.nativeElement
      .querySelector('#quizForm')
      .querySelectorAll('input')[0];
    const resultControl = component.form.get('result');
    expect(formInput.value).toEqual(resultControl?.value);
    expect(resultControl?.errors).not.toBeNull();
    expect(resultControl?.errors?.['required']).toBeTruthy();
  });

  it('Form input value check', async () => {
    const formInput = fixture.debugElement.nativeElement
      .querySelector('#quizForm')
      .querySelectorAll('input')[0];
    formInput.value = 23;
    formInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const resultControl = component.form.get('result');
      expect(+formInput.value).toEqual(resultControl?.value);
      expect(resultControl?.errors).toBeNull();
    });
  });

  it('Form should be valid', async () => {
    const formInput = fixture.debugElement.nativeElement
      .querySelector('#quizForm')
      .querySelectorAll('input')[0];
    formInput.value = 23;
    formInput.dispatchEvent(new Event('input'));
    const formValid = component.form.valid;
    fixture.whenStable().then(() => {
      expect(formValid).toBeTruthy();
    });
  });

  it('should NOT have history initially', () => {
    expect(component.history.length)
      .withContext('should NOT have history initially')
      .toBe(0);
  });

  it('Form is submitted, history is correct and question changed', () => {
    const form = fixture.debugElement.query(By.css('#quizForm'));
    const formInput = fixture.debugElement.nativeElement
      .querySelector('#quizForm')
      .querySelectorAll('input')[0];

    const firstNumber = component.firstNumber;
    const secondNumber = component.secondNumber;

    const inputValue = 23;
    formInput.value = inputValue;
    formInput.dispatchEvent(new Event('input'));

    const formValid = component.form.valid;

    expect(formValid).toBeTruthy();

    form.triggerEventHandler('submit', null);
    fixture.detectChanges();

    const lastAnswer = component.history[0];

    expect(component.history.length).not.toBe(0);
    expect(inputValue).toEqual(lastAnswer.answer);
    expect(lastAnswer.correct).toBe(
      firstNumber + secondNumber === inputValue ? 'correct!' : 'wrong!'
    );

    const outputCells = fixture.debugElement.nativeElement
      .querySelector('.history')
      .querySelectorAll('.cell');

    expect(outputCells.length).not.toBe(0);
    expect(+outputCells[0].textContent).toEqual(firstNumber);
    expect(outputCells[1].textContent).toEqual('+');
    expect(+outputCells[2].textContent).toEqual(secondNumber);
    expect(outputCells[3].textContent).toEqual('=');

    const question =
      fixture.debugElement.nativeElement.querySelector('.question').textContent;

    expect(question).not.toEqual(`${firstNumber} + ${secondNumber} =`);
    expect(formInput.value).toEqual('');
  });
});
