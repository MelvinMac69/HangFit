'use client'

import { useState } from 'react'
import { WORKOUT_PROGRAM } from '@/lib/workout-program'
import { EXERCISES, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/program-data'
import {
  Dumbbell, Zap, Clock, Repeat, Target, Heart,
  ChevronRight, Plane, Link2, Info, Wind, ArrowRight
} from 'lucide-react'

const principles = [
  {
    icon: Target,
    title: 'Strength First, Always',
    text: 'Primary lifts get fresh first — back squats, trap bar jumps, weighted pull-ups. Power and explosive work before anything else.',
  },
  {
    icon: Repeat,
    title: '5-Day Hybrid Structure',
    text: 'Lower A → Upper A → Lower B → Upper B → Full Body. Each muscle group gets 2-3 days recovery. Squat and hinge on separate days.',
  },
  {
    icon: Zap,
    title: 'Supersets for Density',
    text: 'Opposing muscle groups paired together — press with pull, squat with curl. Reduce rest time, increase work done, build real conditioning.',
  },
  {
    icon: Heart,
    title: 'Finishers for Metabolic Stress',
    text: 'KB swings, Devil\'s Press, ball slams — these go at the end when you\'re already gassed. They\'re supposed to hurt.',
  },
  {
    icon: Wind,
    title: 'Mobility as a Warm-Up',
    text: 'Every session starts with a structured warm-up and ends with a mobility block. Not optional — part of the work.',
  },
  {
    icon: Clock,
    title: '45-60 Minute Sessions',
    text: 'In and out. No hour-and-a-half marathons. If you\'re still going at 60 minutes, you\'re moving too slow.',
  },
]

const weeklySplit = [
  { day: 'Day 1', label: 'Lower A', focus: 'Squat + Jump + Hinge', type: 'lower', desc: 'Trap bar jumps, Bulgarian split squats, ring leg curls, reverse nordics. Power and posterior chain.' },
  { day: 'Day 2', label: 'Upper A', focus: 'Push + Horizontal Pull', type: 'upper', desc: 'Weighted bar dips, low incline DB press, ring rows, land mine press. Push and pull with pressing.' },
  { day: 'Day 3', label: 'Lower B', focus: 'BSS + Hip Thrust + Conditioning', type: 'lower', desc: 'Bulgarian split squats paired with hip thrusts. Devil\'s Press supersetted with dead hangs. Fan bike or skierg finisher.' },
  { day: 'Day 4', label: 'Upper B', focus: 'Pull + Lever + KB Finisher', type: 'upper', desc: 'Weighted pull-ups, low rows, cable Y-raises, tuck front lever holds, ring flies. KB swings to finish.' },
  { day: 'Day 5', label: 'Full Body', focus: 'Snatch + Zercher + Conditioning', type: 'full-body', desc: 'Power snatch, zercher squats, ring push-ups with single-arm rows, goblet RDL, ball slams + suitcase carry.' },
]

const trainingNotes = [
  { label: 'Recovery', text: 'Same muscle group needs 2-3 days off before hitting again. That\'s built into the structure.' },
  { label: 'Progressive Overload', text: 'Add weight or reps week over week. If you\'re doing the same thing in week 4 that you did in week 1, you\'re not progressing.' },
  { label: 'Warm-Up', text: 'Box jumps and broad jumps are for warming up only — keep them light, keep them fast.' },
  { label: 'Form Over Weight', text: 'Turkish get-ups are out (shoulder). Land mine press is in. If an exercise hurts, swap it. No heroics.' },
  { label: 'Symmetry', text: 'Single-arm rows, suitcase carries, Bulgarian split squats — unilateral work catches the imbalances barbell work misses.' },
]

export default function SettingsPage() {
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0f0a] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0f0a]/95 backdrop-blur border-b border-white/10 p-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <img src="/logo.png" alt="HangFit" className="w-8 h-8 object-contain shrink-0" />
          <h1 className="text-lg font-bold">HangFit Hybrid Program</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Tagline Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 p-5 text-center">
          <p className="text-xl font-bold tracking-tight text-white">FLY HARD. TRAIN HARD.</p>
          <p className="text-sm text-white/50 mt-1">5 days a week · 45-60 min sessions · No excuses</p>
        </div>

        {/* Program Description */}
        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-orange-500" />
            The Program
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Built from Eugene Tao&apos;s Hybrid Bodybuilding 3.0 + 4.0. Five days of structured training with a clear hierarchy: <span className="text-white font-medium">Strength &gt; Hypertrophy &gt; Mobility &gt; Conditioning</span>. Every day has a warm-up, a mobility block, and a reason to show up.
          </p>
        </div>

        {/* 5-Day Overview */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-orange-500" />
            5-Day Split
          </h3>
          <div className="space-y-2">
            {weeklySplit.map((day) => (
              <div key={day.day} className={`p-4 rounded-xl border bg-card`}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      day.type === 'lower' ? 'bg-blue-500/20 text-blue-400' :
                      day.type === 'upper' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {day.day.replace('Day ', '')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{day.label}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        day.type === 'lower' ? 'bg-blue-500/10 text-blue-400' :
                        day.type === 'upper' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {day.type}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-orange-400 mt-0.5">{day.focus}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{day.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Principles */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" />
            How It Works
          </h3>
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

        {/* Program Notes */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-500" />
            Program Notes
          </h3>
          <div className="space-y-1">
            {trainingNotes.map((note) => (
              <div key={note.label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 whitespace-nowrap mt-0.5">{note.label}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{note.text}</p>
                </div>
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
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${CATEGORY_COLORS[ex.category]}`}>
                      {CATEGORY_LABELS[ex.category]}
                    </span>
                  </div>
                  {ex.youtubeUrl && (
                    <a
                      href={ex.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 shrink-0"
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
        <div className="text-center py-6 space-y-1">
          <p className="text-sm font-bold text-white">HangFit Hybrid</p>
          <p className="text-xs text-muted-foreground">5 days · 45-60 min · FLY HARD. TRAIN HARD.</p>
        </div>
      </div>
    </div>
  )
}