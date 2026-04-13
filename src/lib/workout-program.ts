import type { WorkoutDay } from '@/types/workout'

// Warm-up templates
const LOWER_WARMUP = [
  { name: 'Bodyweight Squat', detail: '2 × 10' },
  { name: 'World\'s Greatest Stretch', detail: '8 each side' },
  { name: 'Banded Hip Circles', detail: '10 each direction' },
  { name: 'Band Pull-Through', detail: '10' },
]

const UPPER_WARMUP = [
  { name: 'Push-Up (banded if needed)', detail: '10' },
  { name: 'Ring Rows or TRX Rows', detail: '10' },
  { name: 'Dislocates with PVC/Band', detail: '10' },
  { name: 'Face Pulls', detail: '10' },
]

const SPRINT_WARMUP = [
  { name: 'Easy Run / Light Cycle', detail: '2 min' },
  { name: 'A-Skips', detail: '10 each leg' },
  { name: 'High Knees', detail: '10 each leg' },
  { name: 'Bounding', detail: '6 each leg' },
]

// Mobility blocks
const LOWER_MOBILITY = [
  { name: '90/90 Hip Stretch', detail: '30s each side' },
  { name: 'Couch Stretch', detail: '30s each leg' },
  { name: 'Kneeling Hip Flexor', detail: '30s each side' },
  { name: 'Jefferson Curl', detail: '10, light' },
]

const UPPER_MOBILITY = [
  { name: 'Thoracic Spine Rotation on Bench', detail: '8 each side' },
  { name: 'Lat Hang + Thoracic Extension', detail: '30s' },
  { name: 'Doorway Pec Stretch', detail: '30s each side' },
]

export const WORKOUT_PROGRAM: WorkoutDay[] = [
  // DAY 1: Lower A — Strength & Power
  {
    dayNumber: 1,
    label: 'Lower A',
    description: 'Strength & Power: Lower Body',
    type: 'lower',
    warmUp: LOWER_WARMUP,
    exercises: [
      { id: 'barbell-back-squat', name: 'Barbell Back Squat', category: 'compound' },
      { id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'compound' },
      { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'compound' },
      { id: 'barbell-hip-thrust', name: 'Barbell Hip Thrust', category: 'compound', supersetGroup: 'lower-a-1' },
      { id: 'nordic-hamstring-curl', name: 'Nordic Hamstring Curl', category: 'isolation', supersetGroup: 'lower-a-1' },
      { id: 'single-leg-calf-raise', name: 'Single-Leg Calf Raise', category: 'isolation' },
    ],
    mobilityBlock: LOWER_MOBILITY,
  },
  // DAY 2: Upper A — Pull & Press
  {
    dayNumber: 2,
    label: 'Upper A',
    description: 'Pull & Press: Upper Body',
    type: 'upper',
    warmUp: UPPER_WARMUP,
    exercises: [
      { id: 'weighted-pull-up', name: 'Weighted Pull-Up', category: 'calisthenics' },
      { id: 'chest-supported-db-row', name: 'Chest-Supported Dumbbell Row', category: 'compound' },
      { id: 'ring-dip', name: 'Dip (weighted if possible)', category: 'calisthenics', supersetGroup: 'upper-a-1' },
      { id: 'db-hammer-curl', name: 'Dumbbell Hammer Curl', category: 'isolation', supersetGroup: 'upper-a-1' },
      { id: 'overhead-press', name: 'Overhead Press', category: 'compound' },
      { id: 'cable-face-pull', name: 'Cable Face Pull', category: 'isolation' },
    ],
    mobilityBlock: UPPER_MOBILITY,
  },
  // DAY 3: Sprint & Athletic A
  {
    dayNumber: 3,
    label: 'Sprint & Athletic A',
    description: 'Explosive Power & Speed',
    type: 'sprint',
    warmUp: SPRINT_WARMUP,
    exercises: [
      { id: 'box-jump', name: 'Box Jump (step down)', category: 'plyometric' },
      { id: 'broad-jump', name: 'Broad Jump', category: 'plyometric' },
      { id: 'clap-push-up', name: 'Clap Push-Up', category: 'plyometric' },
      { id: 'depth-drop', name: 'Depth Drop', category: 'plyometric' },
      { id: 'sprint-intervals', name: 'Sprint Intervals', category: 'conditioning' },
      { id: 'turkish-get-up', name: 'Turkish Get-Up', category: 'conditioning' },
    ],
    mobilityBlock: [
      { name: 'Foam Roll (full body)', detail: '5 min' },
      { name: 'Pigeon Stretch', detail: '30s each side' },
    ],
  },
  // DAY 4: Upper A2 — Horizontal
  {
    dayNumber: 4,
    label: 'Upper A2 — Horizontal',
    description: 'Horizontal Push & Pull',
    type: 'upper',
    warmUp: UPPER_WARMUP,
    exercises: [
      { id: 'ring-push-up', name: 'Ring Push-Up', category: 'calisthenics', supersetGroup: 'upper-b2-1' },
      { id: 'seated-cable-row', name: 'Seated Cable Row', category: 'compound', supersetGroup: 'upper-b2-1' },
      { id: 'barbell-bench-press', name: 'Barbell Bench Press', category: 'compound' },
      { id: 'db-incline-press', name: 'Dumbbell Incline Press', category: 'compound' },
      { id: 'db-lateral-raise', name: 'Dumbbell Lateral Raise', category: 'isolation' },
      { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension (cable)', category: 'isolation' },
    ],
    mobilityBlock: UPPER_MOBILITY,
  },
  // DAY 5: MetCon A — Density
  {
    dayNumber: 5,
    label: 'MetCon A — Density',
    description: 'Density & Conditioning',
    type: 'metcon',
    warmUp: [
      { name: 'Easy Run / Light Cycle', detail: '2 min' },
      { name: 'Burpee', detail: '5' },
      { name: 'Jump Squat', detail: '5' },
      { name: 'Push-Up', detail: '5' },
    ],
    exercises: [
      { id: 'goblet-squat', name: 'Goblet Squat', category: 'compound', supersetGroup: 'lower-b-1' },
      { id: 'snatch-grip-rdl', name: 'Snatch-Grip Romanian Deadlift', category: 'compound', supersetGroup: 'lower-b-1' },
    ],
    mobilityBlock: [
      { name: 'Foam Roll (full body)', detail: '5 min' },
      { name: 'Pigeon Stretch', detail: '30s each side' },
    ],
  },
  // DAY 6: Active Recovery
  {
    dayNumber: 6,
    label: 'Active Recovery',
    description: 'Recovery & Mobility',
    type: 'rest',
    warmUp: [
      { name: 'Easy Walk or Light Cycle', detail: '5-10 min' },
    ],
    exercises: [
      { id: 'hollow-body-hold', name: 'Hollow Body Hold', category: 'mobility' },
      { id: 'bear-crawl', name: 'Bear Crawl', category: 'conditioning' },
      { id: 'side-plank', name: 'Side Plank', category: 'mobility' },
      { id: 'copenhagen-plank', name: 'Copenhagen Plank', category: 'mobility' },
    ],
    mobilityBlock: [
      { name: 'Foam Roll (full body)', detail: '10 min' },
      { name: 'Pigeon Stretch', detail: '1 min each side' },
      { name: 'Lat Hang + Thoracic Extension', detail: '1 min' },
    ],
  },
  // DAY 7: Full Rest
  {
    dayNumber: 7,
    label: 'Full Rest',
    description: 'Complete Rest Day',
    type: 'rest',
    warmUp: [],
    exercises: [],
    mobilityBlock: [],
  },
]

export function getDayLabel(dayNumber: number, weekType: 'A' | 'B'): string {
  const day = WORKOUT_PROGRAM.find(d => d.dayNumber === dayNumber)
  if (!day) return `Day ${dayNumber}`
  
  if (dayNumber === 7) return 'Full Rest'
  
  const weekSuffix = weekType === 'A' ? '' : ` (${weekType})`
  return `${day.label}${weekSuffix}`
}

export function getDayColor(type: string): string {
  const colors: Record<string, string> = {
    lower: 'text-blue-500',
    upper: 'text-purple-500',
    metcon: 'text-orange-500',
    'full-body': 'text-emerald-500',
    sprint: 'text-red-500',
    rest: 'text-muted-foreground',
  }
  return colors[type] || 'text-muted-foreground'
}

export function getDayBgColor(type: string): string {
  const colors: Record<string, string> = {
    lower: 'bg-blue-500/15 border-blue-500/30',
    upper: 'bg-purple-500/15 border-purple-500/30',
    metcon: 'bg-orange-500/15 border-orange-500/30',
    'full-body': 'bg-emerald-500/15 border-emerald-500/30',
    sprint: 'bg-red-500/15 border-red-500/30',
    rest: 'bg-muted/50 border-muted',
  }
  return colors[type] || 'bg-muted/50 border-muted'
}

// Calculate current week and phase based on program start date
export function calculateProgramPosition(startDate: Date): {
  programWeek: number
  weekType: 'A' | 'B'
  phase: 0 | 1 | 2
  currentDay: number
} {
  const now = new Date()
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = daysSinceStart % (13 * 7)
  const programWeek = Math.floor(daysSinceStart / (13 * 7)) % 13 + 1
  const currentDay = (totalDays % 7) + 1
  const weekType: 'A' | 'B' = Math.floor(totalDays / 7) % 2 === 0 ? 'A' : 'B'
  
  // Phase calculation
  let phase: 0 | 1 | 2
  if (programWeek <= 4) phase = 0 // Accumulation
  else if (programWeek <= 8) phase = 1 // Strength
  else if (programWeek <= 12) phase = 2 // Peak
  else phase = 0 // Deload (week 13)
  
  return { programWeek, weekType, phase, currentDay }
}

// Phase-aware rep scheme
export function getTargetReps(phase: 0 | 1 | 2 | 3, category: string): { min: number; max: number } {
  const schemes: Record<number, Record<string, { min: number; max: number }>> = {
    0: { // Accumulation
      compound: { min: 8, max: 12 },
      isolation: { min: 10, max: 15 },
      explosive: { min: 4, max: 6 },
      calisthenics: { min: 8, max: 12 },
      conditioning: { min: 8, max: 12 },
      carry: { min: 20, max: 40 }, // seconds/distance
      mobility: { min: 8, max: 12 },
      plyometric: { min: 4, max: 6 },
    },
    1: { // Strength
      compound: { min: 5, max: 8 },
      isolation: { min: 8, max: 12 },
      explosive: { min: 3, max: 5 },
      calisthenics: { min: 6, max: 10 },
      conditioning: { min: 6, max: 10 },
      carry: { min: 30, max: 60 },
      mobility: { min: 8, max: 12 },
      plyometric: { min: 3, max: 5 },
    },
    2: { // Peak
      compound: { min: 3, max: 5 },
      isolation: { min: 6, max: 10 },
      explosive: { min: 2, max: 4 },
      calisthenics: { min: 4, max: 8 },
      conditioning: { min: 4, max: 8 },
      carry: { min: 40, max: 80 },
      mobility: { min: 6, max: 10 },
      plyometric: { min: 2, max: 4 },
    },
  }
  
  return schemes[phase]?.[category] || { min: 8, max: 12 }
}
