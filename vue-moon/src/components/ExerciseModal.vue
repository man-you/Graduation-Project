<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Exercise, CreateExerciseDTO, UpdateExerciseDTO } from '@/types/quiz/quiz.type'
import { PhX, PhTrash, PhPlusCircle, PhCheckCircle } from '@phosphor-icons/vue'

const props = defineProps<{
  show: boolean
  editingExercise?: Exercise | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: CreateExerciseDTO | UpdateExerciseDTO): void
}>()

const form = ref<CreateExerciseDTO>({
  exerciseTitle: '',
  exerciseContent: '',
  type: 'SINGLE_CHOICE',
  score: 10,
  blankAnswer: '',
  nodeId: 0,
  options: [] as { content: string; isCorrect: boolean }[],
})

// 定义 resetForm 函数，确保在 watch 使用前已初始化
const resetForm = () => {
  form.value = {
    exerciseTitle: '',
    exerciseContent: '',
    type: 'SINGLE_CHOICE',
    score: 10,
    blankAnswer: '',
    nodeId: 0,
    options: [
      { content: '', isCorrect: false },
      { content: '', isCorrect: false },
    ],
  }
}

// 监听编辑状态同步
watch(
  () => props.editingExercise,
  (exercise) => {
    if (exercise) {
      form.value = {
        exerciseTitle: exercise.exerciseTitle || '',
        exerciseContent: exercise.exerciseContent,
        type: exercise.type,
        score: exercise.score,
        blankAnswer: exercise.blankAnswer || '',
        nodeId: exercise.nodeId,
        options: exercise.options.map((opt) => ({
          content: opt.content,
          isCorrect: opt.isCorrect,
        })),
      }
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

// 其余逻辑保持不变
// ...
</script>
