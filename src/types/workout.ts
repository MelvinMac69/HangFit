export type ExerciseCategory =
  | 'compound'
  | 'isolation'
  | 'explosive'
  | 'calisthenics'
  | 'conditioning'
  | 'carry'
  | 'mobility'
  | 'plyometric'

export type PhaseKey = 0 | 1 | 2 | 3
// 0 = Deload, 1 = Volume/Accumulation, 2 = Strength, 3 = Peak

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  cue?: string
  supersetGroup?: string
  customSets?: number
  customReps?: number | string
  youtubeUrl?: string
  substitutions?: { name: string; why: string }[]
  /** Time-based hold exercise — show a tap-to-start timer instead of rep count */
  isTimeBased?: boolean
}

export interface WorkoutSet {
  id: string
  setNumber?: number
  reps: number | string
  weight: number
  completed: boolean
}

export interface WorkoutExercise {
  id: string
  exerciseName: string
  exerciseId: string
  category: ExerciseCategory
  sets: WorkoutSet[]
  cue: string
  supersetGroup?: string
  notes?: string
}

export interface WarmUpMove {
  name: string
  detail: string
  cue?: string
}

export interface MobilityMove {
  name: string
  detail: string
  cue?: string
}

export interface WorkoutDay {
  dayNumber: number
  label: string
  type: 'lower' | 'upper' | 'metcon' | 'full-body' | 'sprint' | 'rest'
  description?: string
  focus?: string[]
  warmUp: { name: string; detail: string; cue?: string }[]
  exercises: Exercise[]
  mobilityBlock?: { name: string; detail: string; cue?: string }[]
}

export interface WorkoutLog {
  id: string
  userId: string
  date: string
  dayNumber: number
  weekType: 'A' | 'B'
  phase: number
  programWeek: number
  duration: number
  notes?: string
  exercises: WorkoutExercise[]
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  createdAt: string
}

export interface ProgressiveOverloadSuggestion {
  exerciseName: string
  previousWeight: number
  previousReps: number | string
  suggestion: 'increase_weight' | 'increase_reps' | 'maintain' | 'plateau'
  reason: string
  recommendedWeight: number
  recommendedReps: number | string
}

export const PHASE_LABELS: Record<PhaseKey, string> = {
  0: 'Deload',
  1: 'Volume / Accumulation',
  2: 'Strength / Intensification',
  3: 'Peak / Power',
}

export const PHASE_SHORT: Record<PhaseKey, string> = {
  0: 'Deload',
  1: 'Volume',
  2: 'Strength',
  3: 'Peak',
}

export const PHASE_COLORS: Record<PhaseKey, string> = {
  0: 'cyan',
  1: 'emerald',
  2: 'blue',
  3: 'red',
}

// Phase-aware set/rep schemes (from original app)
export const PHASE_REPS: Record<PhaseKey, Record<string, { sets: number; reps: number | string }>> = {
  1: {
    compound: { sets: 3, reps: 6 },
    isolation: { sets: 2, reps: 12 },
    explosive: { sets: 3, reps: 5 },
    calisthenics: { sets: 3, reps: 15 },
    conditioning: { sets: 2, reps: 8 },
    carry: { sets: 2, reps: '40m' },
    mobility: { sets: 2, reps: '60s' },
    plyometric: { sets: 2, reps: 3 },
  },
  2: {
    compound: { sets: 3, reps: 5 },
    isolation: { sets: 2, reps: 10 },
    explosive: { sets: 3, reps: 4 },
    calisthenics: { sets: 3, reps: 12 },
    conditioning: { sets: 2, reps: 6 },
    carry: { sets: 2, reps: '40m' },
    mobility: { sets: 2, reps: '60s' },
    plyometric: { sets: 2, reps: 3 },
  },
  3: {
    compound: { sets: 3, reps: 4 },
    isolation: { sets: 2, reps: 8 },
    explosive: { sets: 3, reps: 3 },
    calisthenics: { sets: 2, reps: 10 },
    conditioning: { sets: 2, reps: 5 },
    carry: { sets: 2, reps: '50m' },
    mobility: { sets: 2, reps: '60s' },
    plyometric: { sets: 2, reps: 2 },
  },
  0: {
    compound: { sets: 2, reps: 6 },
    isolation: { sets: 1, reps: 10 },
    explosive: { sets: 2, reps: 3 },
    calisthenics: { sets: 2, reps: 10 },
    conditioning: { sets: 1, reps: 5 },
    carry: { sets: 1, reps: '30m' },
    mobility: { sets: 2, reps: '60s' },
    plyometric: { sets: 1, reps: 3 },
  },
}

export type DayType = 'lower' | 'upper' | 'metcon' | 'sprint' | 'rest'

export const DAY_TYPE_COLORS: Record<DayType | 'full-body', string> = {
  lower: 'bg-blue-500/10 text-blue-500',
  upper: 'bg-primary/10 text-primary',
  metcon: 'bg-orange-500/10 text-orange-500',
  'full-body': 'bg-purple-500/10 text-purple-500',
  sprint: 'bg-red-500/10 text-red-500',
  rest: 'bg-cyan-500/10 text-cyan-500',
}

export function getRPECue(category: ExerciseCategory, phase: PhaseKey): string {
  if (phase === 0) return 'Light — RPE 5-6, focus on movement quality'
  switch (category) {
    case 'compound':
      return phase === 1
        ? '2-3 RIR — feel the stretch, own the range'
        : phase === 2
          ? '1-2 RIR — heavier, controlled tempo'
          : '0-1 RIR — near max intent, long rest between sets'
    case 'isolation':
      return phase === 1
        ? '2 RIR — chase the pump, full ROM'
        : phase === 2
          ? '1-2 RIR — squeeze and control'
          : '1 RIR — heavy isolation, strict form'
    case 'plyometric':
      return 'Max power — full recovery, quality over fatigue'
    case 'explosive':
      return 'Max intent — speed is the goal, stop if form breaks'
    case 'calisthenics':
      return phase === 1
        ? '2 RIR — controlled, full range'
        : phase === 2
          ? '1-2 RIR — add load if bodyweight is easy'
          : '1 RIR — loaded or advanced variation'
    case 'conditioning':
      return 'Hard effort — sustain pace across all sets'
    case 'carry':
      return 'Heavy — grip should be challenged by the last 10m'
    default:
      return ''
  }
}

export function getRestSeconds(category: ExerciseCategory): number {
  switch (category) {
    case 'compound': return 150
    case 'explosive': return 120
    case 'plyometric': return 90
    case 'isolation': return 60
    case 'calisthenics': return 60
    case 'conditioning': return 45
    case 'carry': return 90
    case 'mobility': return 30
    default: return 90
  }
}