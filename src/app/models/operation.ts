export interface Operation {
  left: number;
  right: number;
  operator: string;
  result: number;
  userAnswer?: number;
  isCorrect?: boolean;
}
