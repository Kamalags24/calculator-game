import { Component, OnDestroy, OnInit } from '@angular/core';
import { Operation } from '../../models/operation';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { StorageService } from '../../services/storage.service';
import { Sequence } from '../../models/sequence';
import { Result } from '../../models/result';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit, OnDestroy {
  currentOperation: Operation | null = null;
  currentSequence: Result[] = [];
  timeLeft: number = 10;
  score: number = 0;
  userAnswer: string = '';
  difficulty: string = 'easy';
  private subscriptions: Subscription[] = [];

  constructor(
    private gameService: GameService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.gameService
        .getCurrentOperation()
        .subscribe((operation) => (this.currentOperation = operation)),
      this.gameService
        .getTimeLeft()
        .subscribe((time) => (this.timeLeft = time)),
      this.gameService.getScore().subscribe((score) => (this.score = score)),
      this.gameService
        .getDifficulty()
        .subscribe((difficulty) => (this.difficulty = difficulty))
    );
    this.gameService.generateOperation();
    this.subscriptions.push(
      this.gameService.getCurrentSequence().subscribe(sequence => this.currentSequence = sequence)
    );
    this.gameService.generateOperation();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  submitAnswer(): void {
    const userAnswer = parseFloat(this.userAnswer);
    this.gameService.evaluateAnswer(userAnswer);
    this.userAnswer = '';
  }

  changeDifficulty(difficulty: string): void {
    this.gameService.setDifficulty(difficulty);
    this.gameService.resetGame();
  }

  // endGame(): void {
  //   const sequence: Sequence = {
  //     id: Date.now(),
  //     date: new Date(),
  //     score: this.score,
  //     accuracy: 0, // À calculer
  //     difficulty: this.difficulty,
  //     results: [], // À remplir avec les résultats de la séquence
  //   };
  //   this.storageService.saveSequence(sequence);
  //   this.gameService.resetGame();
  // }

  endGame(): void {
    const results = this.gameService.getSequenceResults();
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / results.length) * 100;

    const sequence: Sequence = {
      id: Date.now(),
      date: new Date(),
      score: this.score,
      accuracy: accuracy,
      difficulty: this.difficulty,
      results: results
    };
    this.storageService.saveSequence(sequence);
    this.gameService.resetGame();
  }
}
