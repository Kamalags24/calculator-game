import { Injectable } from '@angular/core';
import { Sequence } from '../models/sequence';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'mental_calc_sequences';

  constructor() {}

  saveSequence(sequence: Sequence): void {
    const sequences = this.getSequences();
    sequences.push(sequence);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sequences));
  }

  getSequences(): Sequence[] {
    const sequencesJson = localStorage.getItem(this.STORAGE_KEY);
    return sequencesJson ? JSON.parse(sequencesJson) : [];
  }

  clearSequences(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
