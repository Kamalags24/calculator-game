import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { Operation } from '../models/operation';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private currentOperation = new BehaviorSubject<Operation | null>(null);
  private timeLeft = new BehaviorSubject<number>(10);
  private score = new BehaviorSubject<number>(0);
  private difficulty = new BehaviorSubject<string>('easy');
  private currentSequence: Result[] = [];
  private sequenceSubject = new BehaviorSubject<Result[]>([]);

  constructor() {}

  getCurrentOperation(): Observable<Operation | null> {
    return this.currentOperation.asObservable();
  }

  getTimeLeft(): Observable<number> {
    return this.timeLeft.asObservable();
  }

  getScore(): Observable<number> {
    return this.score.asObservable();
  }

  getDifficulty(): Observable<string> {
    return this.difficulty.asObservable();
  }

  setDifficulty(difficulty: string): void {
    this.difficulty.next(difficulty);
  }

  generateOperation(): void {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let left: number, right: number;

    switch (this.difficulty.value) {
      case 'easy':
        left = Math.floor(Math.random() * 10) + 1;
        right = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium':
        left = Math.floor(Math.random() * 50) + 1;
        right = Math.floor(Math.random() * 50) + 1;
        break;
      case 'hard':
        left = Math.floor(Math.random() * 100) + 1;
        right = Math.floor(Math.random() * 100) + 1;
        break;
      default:
        left = Math.floor(Math.random() * 10) + 1;
        right = Math.floor(Math.random() * 10) + 1;
    }

    const result = eval(`${left} ${operator} ${right}`);

    this.currentOperation.next({ left, right, operator, result });
    this.resetTimer();
  }

  resetTimer(): void {
    this.timeLeft.next(10);
    const timer$ = timer(0, 1000).subscribe(() => {
      if (this.timeLeft.value > 0) {
        this.timeLeft.next(this.timeLeft.value - 1);
      } else {
        timer$.unsubscribe();
        this.evaluateAnswer(undefined);
      }
    });
  }

  // evaluateAnswer(userAnswer?: number): void {
  //   const operation = this.currentOperation.value;
  //   if (operation) {
  //     const isCorrect = userAnswer === operation.result;
  //     if (isCorrect) {
  //       this.score.next(this.score.value + 2);
  //     }
  //     operation.userAnswer = userAnswer;
  //     operation.isCorrect = isCorrect;
  //   }
  //   this.generateOperation();
  // }

  // resetGame(): void {
  //   this.score.next(0);
  //   this.generateOperation();
  // }

  getCurrentSequence(): Observable<Result[]> {
    return this.sequenceSubject.asObservable();
  }

  evaluateAnswer(userAnswer?: number): void {
    const operation = this.currentOperation.value;
    if (operation) {
      const isCorrect = userAnswer === operation.result;
      if (isCorrect) {
        this.score.next(this.score.value + 2);
      }
      const result: Result = {
        operation: `${operation.left} ${operation.operator} ${operation.right}`,
        userAnswer: userAnswer || 0,
        correctResult: operation.result,
        isCorrect: isCorrect,
      };
      this.currentSequence.push(result);
      this.sequenceSubject.next(this.currentSequence);
    }
    this.generateOperation();
  }

  resetGame(): void {
    this.score.next(0);
    this.currentSequence = [];
    this.sequenceSubject.next(this.currentSequence);
    this.generateOperation();
  }

  getSequenceResults(): Result[] {
    return this.currentSequence;
  }
}
