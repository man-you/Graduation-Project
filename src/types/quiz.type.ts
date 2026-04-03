export type ExerciseType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE'

export interface ExerciseOption {
  id: number
  exerciseId: number
  content: string
  isCorrect: boolean
}

export interface Exercise {
  id: number
  exerciseTitle?: string
  exerciseContent: string
  type: ExerciseType
  score: number
  blankAnswer?: string
  nodeId: number
  options?: ExerciseOption[]
  createdAt: string
  updatedAt: string
}

export interface CreateExerciseDTO {
  exerciseTitle?: string
  exerciseContent: string
  type: ExerciseType
  score: number
  blankAnswer?: string
  nodeId: number
  options?: Omit<ExerciseOption, 'id' | 'exerciseId'>[]
}

export interface UpdateExerciseDTO extends CreateExerciseDTO {
  id: number
}
