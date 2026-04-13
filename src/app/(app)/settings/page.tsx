'use client'

import { useState } from 'react'
import { WORKOUT_PROGRAM } from '@/lib/workout-program'
import { EXERCISES, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/program-data'
import { PHASE_LABELS, PHASE_COLORS } from '@/types/workout'
import type { ExerciseCategory } from '@/types/workout'
import { 
  BookOpen, Brain, Repeat, Shield, Zap, Dumbbell,
  Timer, Activity, ChevronRight, Plane, Link2, Info
} from 'lucide-react'

const principles = [
  {
    icon: Repeat,
    title: 'A/B Week System',
    text: 'Alternating exercise variations every week. Week A focuses on strength-biased movements, Week B emphasizes tempo and control work. Both hit the same muscle groups with different stimuli.',
  },
  {
    icon: Brain,
    title: '13-Week Mesocycle',
    text: 'Phase 1 (Volume): 4 weeks building work capacity. Phase 2 (Strength): 4 weeks of heavier loads. Phase 3 (Peak): 4 weeks of max intensity. Week 13: Deload at 50% volume.',
  },
  {
    icon: Zap,
    title: 'Explosive Power First',
    text: 'Plyometrics and sprints go early in the session when your nervous system is fresh. Box jumps, broad jumps, clap push-ups, and sprint intervals build real-world athleticism.',
  },
  {
    icon: Shield,
    title: 'Compound-Heavy, Phase-Aware',
    text: 'Back squats, deadlifts, presses — big movements with intensity that scales with your mesocycle phase. Sets and reps auto-adjust based on where you are in the 13-week cycle.',
  },
  {
    icon: Activity,
    title: 'Time-Efficient Sessions',
    text: '30-60 minutes per workout. No junk volume. Supersets, density circuits, and intelligent rest periods keep sessions tight and productive.',
  },
  {
    icon: Dumbbell,
    title: 'Mind-Muscle + Intent',
    text: 'Control the eccentric, pause at stretch, squeeze at contraction. Coaching cues on every exercise guide you toward better movement quality.',
  },
]

const phases = [
  { name: 'Volume / Accumulation', weeks: 'Weeks 1–4', color: 'bg-emerald-500', textColor: 'text-emerald-500', desc: 'Higher reps (8-12 compound, 10-15 isolation), building work capacity and movement quality.' },
  { name: 'Strength / Intensification', weeks: 'Weeks 5–8', color: 'bg-blue-500', textColor: 'text-blue-500', desc: 'Moderate reps (5-8 compound, 8-12 isolation), heavier loads. Strength-focused progression.' },
  { name: 'Peak / Power', weeks: 'Weeks 9–12', color: 'bg-red-500', textColor: 'text-red-500', desc: 'Low reps (3-5 compound, 6-10 isolation), max intensity. Performance peaking.' },
  { name: 'Deload', weeks: 'Week 13', color: 'bg-amber-500', textColor: 'text-amber-500', desc: '50% volume, moderate reps. Recovery and adaptation. Trust the process.' },
]

const weeklySplit = [
  { day: 'Day 1', nameA: 'Lower A', nameB: 'Lower B', type: 'Quads, Glutes, Hams', color: 'text-blue-500' },
  { day: 'Day 2', nameA: 'Upper A', nameB: 'Upper B', type: 'Back, Chest, Shoulders', color: 'text-purple-500' },
  { day: 'Day 3', nameA: 'Sprint & Athletic A', nameB: 'Sprint & Athletic B', type: 'Speed, Posterior Chain', color: 'text-red-500' },
  { day: 'Day 4', nameA: 'Upper A2 — Horizontal', nameB: 'Upper B2 — Vertical', type: 'Chest, Back, Shoulders', color: 'text-purple-500' },
  { day: 'Day 5', nameA: 'MetCon A — Density', nameB: 'MetCon B — Circuits', type: 'Full Body, Conditioning', color: 'text-orange-500' },
  { day: 'Day 6', nameA: 'Active Recovery', nameB: 'Active Recovery', type: 'Mobility, Foam Rolling', color: 'text-cyan-500' },
  { day: 'Day 7', nameA: 'Full Rest', nameB: 'Full Rest', type: 'Sleep, Nutrition', color: 'text-muted-foreground' },
]

const signatureMoves = [
  { name: 'Barbell Back Squat', why: 'King of lower body. Brace hard, sit to depth, drive through the floor. Phase-scaled from 4×12 to 5×5.' },
  { name: 'Snatch-Grip RDL', why: 'Wide grip maximizes hamstring stretch and upper back engagement. Signature posterior chain builder.' },
  { name: 'Front Lever Progression', why: 'Calisthenics skill that builds lat strength, core control, and straight-arm pulling power.' },
  { name: "Devil's Press", why: 'Burpee with dumbbells to overhead. Full-body explosive conditioning in one movement.' },
  { name: 'Nordic Hamstring Curl', why: 'Eccentric-focused hamstring strength. One of the best injury prevention exercises for athletes.' },
  { name: 'Turkish Get-Up', why: 'Total-body coordination, stability, and mobility in a single movement pattern.' },
]

export default function SettingsPage() {
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0f0a] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0f0a]/95 backdrop-blur border-b border-white/10 p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Program</h1>
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-orange-500">HangFit</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* App Info */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-3">
            <Dumbbell className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">HangFit</h2>
          <p className="text-sm text-muted-foreground">where the hangar meets iron</p>
        </div>

        {/* Program Overview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold">Program Overview</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed px-1">
            A hybrid blend of strength training and athletic conditioning. 13-week mesocycle with A/B week variations, structured mobility blocks, and phase-aware rep schemes. Every session combines strength, athleticism, and mobility into efficient 30-60 minute workouts.
          </p>
        </div>

        {/* Mesocycle Phases */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold">Mesocycle Phases</h3>
          </div>
          <div className="space-y-2">
            {phases.map((phase) => (
              <div key={phase.name} className="p-3 rounded-xl border bg-card">
                <div className="flex items-start gap-3">
                  <span className={`h-3 w-3 rounded-full ${phase.color} mt-1.5`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${phase.textColor}`}>{phase.name}</p>
                      <span className="text-xs text-muted-foreground">{phase.weeks}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{phase.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Split */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold">Weekly Split (A/B Weeks)</h3>
          </div>
          <div className="space-y-1">
            {weeklySplit.map((day) => (
              <div key={day.day} className="p-3 rounded-xl border bg-card">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-10">{day.day}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/20 text-indigo-500">A</span>
                      <p className={`text-sm font-medium ${day.color}`}>{day.nameA}</p>
                    </div>
                    {day.nameA !== day.nameB && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-pink-500/20 text-pink-500">B</span>
                        <p className={`text-sm font-medium ${day.color} opacity-70`}>{day.nameB}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">{day.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Principles */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold">Training Principles</h3>
          </div>
          <div className="grid gap-2">
            {principles.map((p) => (
              <div key={p.title} className="p-3.5 rounded-xl border bg-card">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                    <p.icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{p.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signature Moves */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold">Signature Moves</h3>
          </div>
          <div className="grid gap-2">
            {signatureMoves.map((move) => (
              <div key={move.name} className="p-3 rounded-xl border bg-card">
                <p className="font-semibold text-sm">{move.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{move.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Library */}
        <button
          onClick={() => setShowExerciseLibrary(!showExerciseLibrary)}
          className="w-full p-4 rounded-xl border bg-card text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">Exercise Library</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${showExerciseLibrary ? 'rotate-90' : ''}`} />
        </button>

        {showExerciseLibrary && (
          <div className="space-y-2 pb-4">
            {Object.values(EXERCISES).map((ex) => (
              <div key={ex.id} className="p-3 rounded-xl border bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{ex.name}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${CATEGORY_COLORS[ex.category as ExerciseCategory]}`}>
                      {CATEGORY_LABELS[ex.category as ExerciseCategory]}
                    </span>
                  </div>
                  {ex.youtubeUrl && (
                    <a
                      href={ex.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link2 className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {ex.substitutions && ex.substitutions.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-muted-foreground mb-1">Substitutions:</p>
                    <div className="flex flex-wrap gap-1">
                      {ex.substitutions.map((sub, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6 text-xs text-muted-foreground">
          <p>HangFit v1.0</p>
          <p className="mt-1">where the hangar meets iron</p>
        </div>
      </div>
    </div>
  )
}