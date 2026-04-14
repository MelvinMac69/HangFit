import type { WorkoutDay } from '@/types/workout'

// ============================================================
// HangFit Hybrid Program
// Based on Eugene Tao's Hybrid Bodybuilding 3.0 + 4.0
// Created: 2026-04-13
// ============================================================

// Warm-up templates
const LOWER_WARMUP = [
  { name: 'Jump Rope or March in Place', detail: '2 min' },
  { name: 'Leg Swings (front/back, lateral)', detail: '2×20 each' },
  { name: 'Hip Airplane (single leg)', detail: '2×10 each' },
  { name: 'Deep Squat Hold + Rise', detail: '5x' },
  { name: 'Band Pull-Aparts', detail: '2×15' },
  { name: 'Box Jumps', detail: '3×3, light' },
]

const UPPER_WARMUP = [
  { name: 'Push-Up (banded if needed)', detail: '10' },
  { name: 'Ring Rows or TRX Rows', detail: '10' },
  { name: 'Dislocates with PVC/Band', detail: '10' },
  { name: 'Face Pulls', detail: '10' },
]

const FULLBODY_WARMUP = [
  { name: 'Jump Rope or March in Place', detail: '2 min' },
  { name: 'Leg Swings (front/back, lateral)', detail: '2×20 each' },
  { name: 'Hip Airplane (single leg)', detail: '2×10 each' },
  { name: 'Deep Squat Hold + Rise', detail: '5x' },
  { name: 'Band Pull-Aparts', detail: '2×15' },
  { name: 'Broad Jumps', detail: '3×3, light' },
]

const LOWER_MOBILITY = [
  { name: 'Cossack Squat Hold (assisted)', detail: '3×30s' },
  { name: '90/90 Hip Stretch', detail: '30s each side' },
  { name: 'Kneeling Hip Flexor', detail: '30s each side' },
]

const UPPER_MOBILITY = [
  { name: 'Lat Hang + Thoracic Extension', detail: '3×30s' },
  { name: '90/90 Hip Switch', detail: '10 reps each direction' },
]

export const WORKOUT_PROGRAM: WorkoutDay[] = [
  // ============================================================
  // DAY 1: Lower Body A — Strength/Power + Hinge
  // ============================================================
  { dayNumber: 1, label: 'Lower A', description: 'Strength & Power: Squat / Jump / Hinge', type: 'lower', warmUp: LOWER_WARMUP, exercises: [
    { id: 'barbell-back-squat', name: 'Barbell Back Squat', category: 'compound' },
    { id: 'trap-bar-jump-squat', name: 'Trap Bar Jump Squat', category: 'explosive', supersetGroup: 'lower-a-ss1' },
    { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', category: 'compound', supersetGroup: 'lower-a-ss1' },
    { id: 'ring-leg-curl', name: 'Ring Leg Curl', category: 'isolation' },
    { id: 'reverse-nordic-curl', name: 'Reverse Nordic Curl', category: 'isolation', supersetGroup: 'lower-a-ss2' },
    { id: 'cossack-squat-hold', name: 'Cossack Squat Hold', category: 'mobility', supersetGroup: 'lower-a-ss2' },
    { id: 'side-plank-clamshell', name: 'Side Plank Clamshell', category: 'isolation' },
  ], mobilityBlock: LOWER_MOBILITY },

  // ============================================================
  // DAY 2: Upper Body A — Push + Horizontal Pull
  // ============================================================
  { dayNumber: 2, label: 'Upper A', description: 'Push & Row: Dip / Press / Pull', type: 'upper', warmUp: UPPER_WARMUP, exercises: [
    { id: 'weighted-bar-dip', name: 'Weighted Bar Dip', category: 'calisthenics', supersetGroup: 'upper-a-ss1' },
    { id: 'db-incline-press', name: 'Low Incline DB Press', category: 'compound', supersetGroup: 'upper-a-ss1' },
    { id: 'ring-row', name: 'Ring Row', category: 'compound' },
    { id: 'landmine-press', name: 'Land Mine Press', category: 'compound', supersetGroup: 'upper-a-ss2' },
    { id: 'weighted-ring-push-up', name: 'Weighted Ring Push Up', category: 'calisthenics', supersetGroup: 'upper-a-ss2' },
    { id: 'cable-face-pull', name: 'Face Pull', category: 'isolation' },
    { id: 'tall-plank-rings', name: 'Tall Plank on Rings', category: 'mobility' },
  ], mobilityBlock: UPPER_MOBILITY },

  // ============================================================
  // DAY 3: Lower Body B — Hypertrophy + Conditioning
  // ============================================================
  { dayNumber: 3, label: 'Lower B', description: 'BSS / Hip Thrust + Conditioning', type: 'lower', warmUp: LOWER_WARMUP, exercises: [
    { id: 'bulgarian-split-squat-b', name: 'Bulgarian Split Squat', category: 'compound', supersetGroup: 'lower-b-ss1' },
    { id: 'barbell-hip-thrust', name: 'Barbell Hip Thrust', category: 'compound', supersetGroup: 'lower-b-ss1' },
    { id: 'devils-press', name: 'Devils Press', category: 'conditioning', supersetGroup: 'lower-b-ss2' },
    { id: 'dead-hang', name: 'Dead Hang', category: 'mobility', supersetGroup: 'lower-b-ss2' },
    { id: 'conditioning-finisher', name: 'Conditioning: Fan Bike / Skierg / Trampoline', category: 'conditioning' },
  ], mobilityBlock: LOWER_MOBILITY },

  // ============================================================
  // DAY 4: Upper Body B — Pull + Metabolic Finisher
  // ============================================================
  { dayNumber: 4, label: 'Upper B', description: 'Pull / Row / Lever + KB Swings', type: 'upper', warmUp: UPPER_WARMUP, exercises: [
    { id: 'weighted-pull-up', name: 'Weighted Pull Up', category: 'calisthenics' },
    { id: 'low-row', name: 'Low Row (cable or DB)', category: 'compound', supersetGroup: 'upper-b-ss1' },
    { id: 'cable-y-raise', name: 'Cable Y-Raise', category: 'isolation', supersetGroup: 'upper-b-ss1' },
    { id: 'front-lever-hold', name: 'Tuck Front Lever Hold', category: 'calisthenics', supersetGroup: 'upper-b-ss2' },
    { id: 'ring-fly', name: 'Ring Fly', category: 'isolation', supersetGroup: 'upper-b-ss2' },
    { id: 'kettlebell-swing', name: 'Kettlebell Swings', category: 'conditioning' },
    { id: 'ab-roller', name: 'Ab Roller', category: 'isolation' },
  ], mobilityBlock: UPPER_MOBILITY },

  // ============================================================
  // DAY 5: Full Body Power + Conditioning ("Broccoli Day")
  // ============================================================
  { dayNumber: 5, label: 'Full Body', description: 'Snatch / Zercher / Conditioning', type: 'full-body', warmUp: FULLBODY_WARMUP, exercises: [
    { id: 'power-snatch', name: 'Power Snatch', category: 'explosive' },
    { id: 'zercher-squat', name: 'Zercher Squat', category: 'compound' },
    { id: 'weighted-ring-push-up-b', name: 'Weighted Ring Push Up', category: 'calisthenics', supersetGroup: 'fullbody-ss1' },
    { id: 'single-arm-db-row', name: 'Single Arm DB Row', category: 'compound', supersetGroup: 'fullbody-ss1' },
    { id: 'goblet-rdl', name: 'Goblet RDL', category: 'compound' },
    { id: 'side-plank', name: 'Side Plank', category: 'isolation' },
    { id: 'ball-slam', name: 'Ball Slams', category: 'conditioning' },
    { id: 'suitcase-carry', name: 'Suitcase Carry', category: 'carry' },
  ], mobilityBlock: [
    { name: 'Deep Squat Hold + Rise', detail: '5x' },
    { name: 'Lat Hang + Thoracic Extension', detail: '30s' },
  ] },
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
