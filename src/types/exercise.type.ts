export type ExerciseType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE';

export interface ExerciseOption {
  id: number;
  content: string;
}

export interface Exercise {
  id: number;
  exerciseTitle: string;
  exerciseContent: string;
  type: ExerciseType;
  score: number;
  options: ExerciseOption[];
  blankAnswer?: string; // 仅在练习模式或提交后返回
}

// 单个题目答案结构
export interface ExerciseAnswer {
  exerciseId: number;
  selectedOptionId?: number | null;
  blankAnswer?: string | null;
}

// 提交载荷结构 (对应后端 SubmitQuizDto)
export interface SubmitQuizPayload {
  nodeId: number;
  answers: ExerciseAnswer[];
}

// 提交结果返回结构
export interface SubmitResult {
  totalScore: number;
  fullScore: number;
  details: {
    exerciseId: number;
    isCorrect: boolean;
    score: number;
    correctAnswer: any;
  }[];
}