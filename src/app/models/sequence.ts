import { Result } from './result';

export interface Sequence {
  id: number;
  date: Date;
  score: number;
  accuracy: number;
  difficulty: string;
  results: Result[];
}
