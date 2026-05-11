import type { WorkoutDay } from '@/types/workout'

// ============================================================
// HangFit Hybrid Program — Revised 2026-05-02
// Eugene Tao Hybrid Style: Plyometrics → Power → Strength → Hypertrophy → Mobility → Cardio
// ============================================================

// Program version — bump to bust stale localStorage caches
export const PROGRAM_VERSION = 3

// ────────────────────────────────────────────────────────────
// WARM-UP TEMPLATES (day-specific)
// ────────────────────────────────────────────────────────────

const LOWER_A_WARMUP = [
  { name: 'Easy Cardio', detail: '2–3 min', cue: 'Fan bike, ski erg, jump rope, or march in place' },
  { name: 'Leg Swings (front/back, lateral)', detail: '2×20 each' },
  { name: 'Hip Airplane (single leg)', detail: '2×10 each' },
  { name: 'Deep Squat Hold + Rise', detail: '5×' },
  { name: 'Ankle Rocks / Calf Pumps', detail: '10 each' },
  { name: 'Walking Lunge Prep (optional)', detail: '1×5 each' },
]

const UPPER_A_WARMUP = [
  { name: 'Easy Cardio', detail: '2–3 min', cue: 'Fan bike, ski erg, or march in place' },
  { name: 'Band Pull-Aparts', detail: '2×15' },
  { name: 'PVC/Band Dislocates', detail: '10' },
  { name: 'Wall Slides or Scap Push-Ups', detail: '10' },
  { name: 'Arm Circles / Shoulder Prep', detail: '10 each direction' },
  { name: 'Brief Hip Opener (optional)', detail: '30s each side' },
]

const LOWER_B_WARMUP = [
  { name: 'Easy Cardio', detail: '3 min warm-up', cue: 'Fan bike or ski erg — easy pace' },
  { name: 'Sprint Prep / Dynamic Lower-Body', detail: '5 min', cue: 'High knees, butt kicks, leg swings' },
  { name: 'Deep Squat Hold + Rise', detail: '5×' },
  { name: 'Ankle Rocks / Calf Pumps', detail: '10 each' },
]

const UPPER_B_WARMUP = [
  { name: 'Easy Cardio', detail: '2–3 min', cue: 'Fan bike, ski erg, or march in place' },
  { name: 'Band Pull-Aparts', detail: '2×15' },
  { name: 'PVC/Band Dislocates', detail: '10' },
  { name: 'Scapular Prep', detail: '10' },
  { name: 'Thoracic Opener', detail: '5 reps each direction' },
  { name: 'Brief Hip Maintenance (optional)', detail: '30s each side' },
]

const FULLBODY_WARMUP = [
  { name: 'Easy Cardio', detail: '2–3 min', cue: 'Fan bike, ski erg, or march in place' },
  { name: 'Lower-Body Dynamic Prep', detail: '1 drill', cue: 'Leg swings or walking lunges' },
  { name: 'Upper/Scapular Prep', detail: '1 drill', cue: 'Band pull-aparts or wall slides' },
  { name: 'Deep Squat Pattern Prep', detail: '5 reps' },
  { name: 'Shoulder Prep', detail: 'Arm circles or dislocates' },
]

// ────────────────────────────────────────────────────────────
// MOBILITY TEMPLATES (day-specific)
// ────────────────────────────────────────────────────────────

const LOWER_A_MOBILITY = [
  { name: 'Cossack Squat', detail: '10 reps each side' },
  { name: '90/90 Hip Stretch', detail: '30s each side' },
  { name: 'Double Elephant', detail: '20 reps' },
  { name: 'Hip Flexor Lunge Stretch', detail: '60s per side' },
]

const UPPER_A_MOBILITY = [
  { name: 'Dead Hang', detail: '2×30s' },
  { name: 'Wall Shoulder Slides', detail: '2×10' },
  { name: 'Thoracic Extension On Bench', detail: '2×30s' },
]

const LOWER_B_MOBILITY = [
  { name: 'Kneeling Hip Flexor Stretch', detail: '30s each side' },
  { name: 'Cossack Squats', detail: '2×10 reps each side' },
  { name: 'Reverse Nordic Stretch', detail: '2×30s' },
  { name: '90/90 Hip Switch (optional)', detail: '5 reps each direction' },
]

const UPPER_B_MOBILITY = [
  { name: 'Thoracic Extension On Bench', detail: '2×30s' },
  { name: 'Side Plank', detail: '2×30s each side' },
  { name: 'Dead Hang', detail: '2×30s' },
]

const FULLBODY_MOBILITY = [
  { name: 'Deep Squat Hold + Rise', detail: '5×' },
  { name: 'Hip Flexor Stretch', detail: '30s each side' },
  { name: 'Thoracic Extension On Bench', detail: '30s' },
]

// ────────────────────────────────────────────────────────────
// PROGRAM DAYS
// ────────────────────────────────────────────────────────────

export const WORKOUT_PROGRAM: WorkoutDay[] = [

  // ============================================================
  // DAY 1 — LOWER A
  // Plyometrics → Power → Strength → Hypertrophy → Mobility
  // + Optional Light Cooldown Cardio
  // ============================================================
  {
    dayNumber: 1, label: 'Lower A',
    description: 'Plyometrics → Power → Strength → Hypertrophy → Mobility',
    type: 'lower', warmUp: LOWER_A_WARMUP,
    exercises: [
      // Plyometrics superset
      { id: 'broad-jumps', name: 'Broad Jumps', category: 'plyometric', customSets: 3, customReps: '5', supersetGroup: 'lower-a-ss1' },
      { id: 'box-jumps', name: 'Box Jumps', category: 'plyometric', customSets: 3, customReps: '3', supersetGroup: 'lower-a-ss1' },
      // Power superset
      { id: 'trap-bar-jump-squat', name: 'Trap Bar Jump Squat', category: 'explosive', customSets: 4, customReps: '3', supersetGroup: 'lower-a-ss2' },
      { id: 'zercher-squat', name: 'Zercher Squat', category: 'compound', customSets: 4, customReps: '5', supersetGroup: 'lower-a-ss2' },
      // Hypertrophy
      { id: 'ring-sissy-squat', name: 'Ring Sissy Squat', category: 'isolation', customSets: 2, customReps: '10' },
      { id: 'weighted-box-step-up', name: 'Weighted Box Step Up', category: 'compound', customSets: 3, customReps: '8' },
      { id: 'side-plank-clamshell', name: 'Side Plank Clamshell', category: 'isolation', customSets: 2, customReps: '10' },
    ],
    mobilityBlock: LOWER_A_MOBILITY
  },

  // ============================================================
  // DAY 2 — UPPER A
  // Plyometrics → Power → Strength → Hypertrophy → Mobility
  // ============================================================
  {
    dayNumber: 2, label: 'Upper A',
    description: 'Plyometrics → Power → Strength → Hypertrophy → Mobility',
    type: 'upper', warmUp: UPPER_A_WARMUP,
    exercises: [
      // Plyometrics superset
      { id: 'medicine-ball-slams', name: 'Medicine Ball Slams', category: 'plyometric', customSets: 3, customReps: '8', supersetGroup: 'upper-a-ss1' },
      { id: 'clap-push-up', name: 'Clap Push Up', category: 'plyometric', customSets: 3, customReps: '5', supersetGroup: 'upper-a-ss1' },
      // Power
      { id: 'kneeling-land-mine-press', name: 'Kneeling Land Mine Press', category: 'explosive', customSets: 3, customReps: '3 each arm' },
      // Strength superset
      { id: 'weighted-bar-dip', name: 'Weighted Bar Dip', category: 'calisthenics', customSets: 3, customReps: '5', supersetGroup: 'upper-a-ss2' },
      { id: 'ring-row', name: 'Ring Row', category: 'compound', customSets: 3, customReps: '6', supersetGroup: 'upper-a-ss2' },
      // Hypertrophy
      { id: 'weighted-ring-push-up', name: 'Weighted Ring Push Up', category: 'calisthenics', customSets: 2, customReps: '8' },
      { id: 'trap-bar-farmers-carry', name: 'Trap Bar Farmers Carry', category: 'carry', customSets: 2, customReps: '30s', isTimeBased: true },
    ],
    mobilityBlock: UPPER_A_MOBILITY
  },

  // ============================================================
  // DAY 3 — LOWER B (HIIT Day)
  // Cardio Warmup/HIIT Sprints → Plyometrics → Power → Strength → Hypertrophy → Mobility
  // ============================================================
  {
    dayNumber: 3, label: 'Lower B',
    description: 'HIIT Sprints → Plyometrics → Power → Strength → Hypertrophy → Mobility',
    type: 'lower', warmUp: LOWER_B_WARMUP,
    exercises: [
      // HIIT Sprint Block — visible at the top of the workout
      {
        id: 'hiit-sprints',
        name: 'HIIT Sprints',
        category: 'conditioning',
        isHIIT: true,
        hiitConfig: {
          warmupSeconds: 180,   // 3 min easy warmup
          rounds: 6,
          workSeconds: 15,     // 15s sprint
          restSeconds: 45,      // 45s rest/easy
          label: '6×15s sprint / 45s rest'
        }
      },
      // Plyometrics superset
      { id: 'side-jumps', name: 'Side Jumps', category: 'plyometric', customSets: 2, customReps: '8', supersetGroup: 'lower-b-ss1' },
      { id: 'box-jump-stick', name: 'Box Jump (Stick Landing)', category: 'plyometric', customSets: 2, customReps: '3', supersetGroup: 'lower-b-ss1' },
      // Power
      { id: 'devils-press', name: 'Devils Press', category: 'conditioning', customSets: 3, customReps: '8' },
      // Strength superset
      { id: 'barbell-hip-thrust', name: 'Barbell Hip Thrust', category: 'compound', customSets: 3, customReps: '5', supersetGroup: 'lower-b-ss2' },
      { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'compound', customSets: 3, customReps: '6', supersetGroup: 'lower-b-ss2' },
      // Hypertrophy
      { id: 'ring-leg-curl', name: 'Ring Leg Curl', category: 'isolation', customSets: 2, customReps: '10' },
    ],
    mobilityBlock: LOWER_B_MOBILITY
  },

  // ============================================================
  // DAY 4 — UPPER B
  // Plyometrics → Power → Strength → Hypertrophy → EMOM Finisher → Mobility
  // ============================================================
  {
    dayNumber: 4, label: 'Upper B',
    description: 'Plyometrics → Power → Strength → Hypertrophy → EMOM Finisher → Mobility',
    type: 'upper', warmUp: UPPER_B_WARMUP,
    exercises: [
      // Plyometrics superset
      { id: 'kettlebell-swing', name: 'Kettlebell Swings', category: 'conditioning', customSets: 3, customReps: '20', supersetGroup: 'upper-b-ss1' },
      { id: 'chest-ball-slam', name: 'Chest Ball Slams', category: 'plyometric', customSets: 3, customReps: '10', supersetGroup: 'upper-b-ss1' },
      // Power
      {
        id: 'front-lever-hold',
        name: 'Tuck Front Lever Hold',
        category: 'calisthenics',
        customSets: 3,
        customReps: '15s',
        isTimeBased: true,
        duration: 15,
        cue: 'Max intent — rest 90s between holds'
      },
      // Strength
      { id: 'weighted-pull-up', name: 'Weighted Pull Up', category: 'calisthenics', customSets: 3, customReps: '5' },
      { id: 'cable-chest-fly', name: 'Cable Chest Flys', category: 'compound', customSets: 3, customReps: '8' },
      // Hypertrophy
      { id: 'cable-y-raise', name: 'Cable Y-Raise', category: 'isolation', customSets: 2, customReps: '10' },
      // EMOM Conditioning Finisher
      {
        id: 'emom-kb-bike',
        name: 'EMOM Conditioning Finisher',
        category: 'conditioning',
        isEMOM: true,
        emomConfig: {
          totalMinutes: 10,
          minuteLabel: 'Minute 1: 14 Ball Slams · Minute 2: 12-15 Push-Ups'
        }
      },
    ],
    mobilityBlock: UPPER_B_MOBILITY
  },

  // ============================================================
  // DAY 5 — FULL BODY
  // Plyometrics → Power → Strength → Hypertrophy → AMRAP Circuit → Mobility
  // ============================================================
  {
    dayNumber: 5, label: 'Full Body',
    description: 'Plyometrics → Power → Strength → Hypertrophy → AMRAP Circuit → Mobility',
    type: 'full-body', warmUp: FULLBODY_WARMUP,
    exercises: [
      // Plyometrics superset
      { id: 'broad-jumps-b', name: 'Broad Jumps', category: 'plyometric', customSets: 3, customReps: '5', supersetGroup: 'fullbody-ss1' },
      { id: 'side-to-side-ball-slams', name: 'Side to Side Ball Slams', category: 'conditioning', customSets: 3, customReps: '6', supersetGroup: 'fullbody-ss1' },
      // Power
      { id: 'power-snatch', name: 'Power Snatch', category: 'explosive', customSets: 3, customReps: '5' },
      // Strength
      { id: 'zercher-squat-b', name: 'Zercher Squat', category: 'compound', customSets: 3, customReps: '5' },
      { id: 'low-cable-row', name: 'Low Cable Row', category: 'compound', customSets: 2, customReps: '8' },
      // Hypertrophy
      { id: 'goblet-rdl', name: 'Goblet RDL', category: 'compound', customSets: 2, customReps: '10' },
      // AMRAP Conditioning Circuit
      {
        id: 'amrap-circuit',
        name: 'Full-Body Conditioning Circuit',
        category: 'conditioning',
        isAMRAP: true,
        amrapConfig: {
          totalMinutes: 12,
          circuit: [
            { name: 'Burpee to Pull Up', reps: 6 },
            { name: 'Suitcase Carry', reps: '20m each side' },
            { name: 'Kettlebell Swings', reps: 15 },
            { name: 'Ski Erg / Fan Bike', reps: '150m' },
          ]
        }
      },
    ],
    mobilityBlock: FULLBODY_MOBILITY
  },

  // ============================================================
  // OFF DAY — Zone 2 Cardio
  // ============================================================
  {
    dayNumber: 6, label: 'Off Day',
    description: 'Zone 2 Cardio — 20 to 40 min',
    type: 'rest',
    warmUp: [],
    isOffDay: true,
    exercises: [
      {
        id: 'zone2-cardio',
        name: 'Zone 2 Cardio',
        category: 'conditioning',
        customSets: 1,
        customReps: '20–40 min',
        isTimeBased: true,
        duration: 2400, // placeholder; user sets actual duration
        cue: 'RPE 5–6 · Fan Bike or Ski Erg · Steady pace'
      },
    ],
    mobilityBlock: [
      { name: 'Deep Squat Hold + Rise', detail: '5×' },
      { name: 'Hip Flexor Stretch', detail: '30s each side' },
      { name: 'Lat Hang', detail: '30s' },
    ]
  },
]

export function getDayLabel(dayNumber: number, weekType: 'A' | 'B'): string {
  const day = WORKOUT_PROGRAM.find(d => d.dayNumber === dayNumber)
  if (!day) return `Day ${dayNumber}`
  return day.label
}

export function getDayColor(type: string): string {
  const colors: Record<string, string> = {
    lower: 'text-blue-500', upper: 'text-purple-500', metcon: 'text-orange-500',
    'full-body': 'text-emerald-500', sprint: 'text-red-500', rest: 'text-muted-foreground',
  }
  return colors[type] || 'text-muted-foreground'
}

export function getDayBgColor(type: string): string {
  const colors: Record<string, string> = {
    lower: 'bg-blue-500/15 border-blue-500/30', upper: 'bg-purple-500/15 border-purple-500/30',
    metcon: 'bg-orange-500/15 border-orange-500/30', 'full-body': 'bg-emerald-500/15 border-emerald-500/30',
    sprint: 'bg-red-500/15 border-red-500/30', rest: 'bg-muted/50 border-muted',
  }
  return colors[type] || 'bg-muted/50 border-muted'
}

export function calculateProgramPosition(startDate: Date): {
  programWeek: number; weekType: 'A' | 'B'; phase: 0 | 1 | 2; currentDay: number;
} {
  const now = new Date()
  const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = daysSinceStart % (5 * 7)
  const programWeek = Math.floor(daysSinceStart / (5 * 7)) % 13 + 1
  const currentDay = (totalDays % 5) + 1
  const weekType: 'A' | 'B' = Math.floor(totalDays / 5) % 2 === 0 ? 'A' : 'B'
  return { programWeek, weekType, phase: 0 as 0 | 1 | 2, currentDay }
}

export function getTargetReps(phase: 0 | 1 | 2 | 3, category: string): { min: number; max: number } {
  const schemes: Record<string, { min: number; max: number }> = {
    compound: { min: 5, max: 10 }, isolation: { min: 8, max: 15 },
    explosive: { min: 3, max: 5 }, calisthenics: { min: 6, max: 15 },
    conditioning: { min: 10, max: 20 }, carry: { min: 30, max: 60 },
    mobility: { min: 20, max: 45 }, plyometric: { min: 3, max: 6 },
  }
  return schemes[category] || { min: 8, max: 12 }
}
