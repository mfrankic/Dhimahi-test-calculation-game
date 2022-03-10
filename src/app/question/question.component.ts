import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  form!: FormGroup;
  private result = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]+$'),
  ]);
  private newValue!: number;
  private output: {
    firstNumber: number;
    secondNumber: number;
    answer: number;
    correct: string;
  }[] = [];
  private min = 1;
  private max = 100;

  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  firstNumber = this.randomNumber(this.min, this.max);
  secondNumber = this.randomNumber(this.min, this.max);

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get history() {
    return this.output;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      result: this.result,
    });
    this.form.valueChanges
      .pipe(filter(() => this.form.valid))
      .subscribe((data) => (this.newValue = data.result));
  }

  saveAnswer(form: FormGroup) {
    if (this.form.valid) {
      this.output.unshift({
        firstNumber: this.firstNumber,
        secondNumber: this.secondNumber,
        answer: this.newValue,
        correct:
          this.firstNumber + this.secondNumber === this.newValue
            ? 'correct!'
            : 'wrong!',
      });
      this.firstNumber = this.randomNumber(this.min, this.max);
      this.secondNumber = this.randomNumber(this.min, this.max);
      this.form.reset();
    }
  }
}
