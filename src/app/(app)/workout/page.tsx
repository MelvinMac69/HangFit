'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { WORKOUT_PROGRAM, getDayLabel, getDayBgColor, getDayColor, calculateProgramPosition } from '@/lib/workout-program'
import { EXERCISES } from '@/lib/program-data'
import { PHASE_LABELS, PHASE_COLORS } from '@/types/workout'
import type { PhaseKey } from '@/types/workout'

// Local types for workout session (simpler than DB types)
interface LocalSet {
  id: string
  weight: number
  reps: number | string
  completed: boolean
}

interface LocalExercise {
  exerciseId: string
  exerciseName: string
  sets: LocalSet[]
  notes?: string
  supersetGroup?: string
}

// Superset group (2 or more exercises logged together)
interface SupersetGroup {
  groupId: string
  exercises: LocalExercise[]
}

// Generate unique IDs
const genId = () => Math.random().toString(36).substring(2, 15)
import { 
  ChevronRight, Check, Play, Pause, RotateCcw, Clock, Dumbbell,
  Flame, ArrowLeft, Save, X, Plus, Minus, Timer, Target, Calendar,
  TrendingUp, Info, Link2, History
} from 'lucide-react'



// Rest Timer Component
function RestTimer({ 
  seconds, 
  onComplete, 
  onSkip 
}: { 
  seconds: number
  onComplete: () => void
  onSkip: () => void 
}) {
  const [remaining, setRemaining] = useState(seconds)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning || remaining <= 0) return
    const timer = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          onComplete()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, remaining, onComplete])

  const progress = ((seconds - remaining) / seconds) * 100

  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
          <circle 
            cx="50" cy="50" r="42" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="6" 
            strokeLinecap="round"
            className="text-orange-500 transition-all duration-1000"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">
            {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={onSkip}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Inline rest timer with clock-based countdown (avoids setInterval drift)
function InlineRestTimer({ onSkip }: { onSkip: () => void }) {
  const REST_DURATION = 90 // seconds
  const endTimeRef = React.useRef<number>(Date.now() + REST_DURATION * 1000)
  const [remaining, setRemaining] = React.useState(REST_DURATION)

  React.useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const left = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000))
      setRemaining(left)
      if (left <= 0) {
        onSkip()
      }
    }
    // Run immediately, then every 100ms for smooth countdown
    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [onSkip])

  const progress = ((REST_DURATION - remaining) / REST_DURATION) * 100
  const cx = 12, cy = 12, r = 10
  const circ = 2 * Math.PI * r

  return (
    <div className="ml-10 mt-1 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500/20" />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-500 transition-all"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress / 100)}
          />
        </svg>
        <span className="text-xs text-emerald-400 tabular-nums">
          {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, '0')}
        </span>
        <div className="flex-1" />
        <button onClick={onSkip} className="text-xs text-muted-foreground hover:text-white">Skip</button>
      </div>
    </div>
  )
}

// Set Row Component
function SetRow({
  set,
  index,
  onUpdate,
  onComplete,
  targetReps,
}: {
  set: LocalSet
  index: number
  onUpdate: (weight: number, reps: number) => void
  onComplete: () => void
  targetReps: { min: number; max: number }
}) {
  const [weight, setWeight] = useState(set.weight.toString())
  const [reps, setReps] = useState(set.reps.toString())

  const handleWeightChange = (val: string) => {
    setWeight(val)
    onUpdate(parseFloat(val) || 0, parseInt(reps) || 0)
  }

  const handleRepsChange = (val: string) => {
    setReps(val)
    onUpdate(parseFloat(weight) || 0, parseInt(val) || 0)
  }

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${
      set.completed 
        ? 'bg-emerald-500/10 border-emerald-500/30' 
        : 'bg-white/5 border-white/10'
    }`}>
      <span className="text-xs font-medium text-muted-foreground w-8">Set {index + 1}</span>
      <input
        type="number"
        inputMode="decimal"
        value={weight}
        onChange={(e) => handleWeightChange(e.target.value)}
        placeholder="0"
        className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-center font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      />
      <span className="text-muted-foreground">lbs</span>
      <span className="text-muted-foreground mx-1">×</span>
      <input
        type="number"
        inputMode="numeric"
        value={reps}
        onChange={(e) => handleRepsChange(e.target.value)}
        placeholder={targetReps.min.toString()}
        className="w-16 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-center font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      />
      <span className="text-muted-foreground text-xs">
        ({targetReps.min}-{targetReps.max})
      </span>
      <div className="flex-1" />
      <button
        onClick={onComplete}
        className={`p-2 rounded-lg transition-colors ${
          set.completed
            ? 'bg-emerald-500 text-white'
            : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        <Check className="w-5 h-5" />
      </button>
    </div>
  )
}

// Exercise Card Component
function ExerciseCard({
  exercise,
  sets,
  onUpdateSet,
  onToggleSet,
  onCompleteSet,
  targetReps,
  youtubeUrl,
  onOpenVideo,
  cue,
  substitutions,
  supersetLabel,
  onSwitchExercise,
}: {
  exercise: LocalExercise
  sets: LocalSet[]
  onUpdateSet: (index: number, weight: number, reps: number) => void
  onToggleSet: (index: number) => void
  onCompleteSet?: (setIndex: number) => void
  targetReps: { min: number; max: number }
  youtubeUrl?: string
  onOpenVideo: () => void
  cue?: string
  substitutions?: { name: string; why: string }[]
  supersetLabel?: string
  onSwitchExercise?: (exerciseId: string, newName: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [showSubs, setShowSubs] = useState(false)
  const [showRestForSet, setShowRestForSet] = useState<number | null>(null)
  const completedSets = sets.filter(s => s.completed).length
  const totalVolume = sets.reduce((acc, s) => acc + (s.completed ? s.weight * (typeof s.reps === 'number' ? s.reps : 0) : 0), 0)

  const handleToggle = (setIndex: number) => {
    onToggleSet(setIndex)
    // Auto-show rest timer for this set after marking complete
    const set = sets[setIndex]
    if (!set.completed) {
      setShowRestForSet(setIndex)
      if (onCompleteSet) onCompleteSet(setIndex)
    }
  }

  return (
    <div className={`rounded-xl border bg-card text-card-foreground overflow-hidden ${supersetLabel ? 'border-l-4 border-l-orange-500' : ''}`}>
      {supersetLabel && (
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">
            ⟳ Superset
          </span>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 pb-3 flex items-center gap-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold truncate">{exercise.exerciseName}</h3>
            {youtubeUrl && (
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenVideo() }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
              >
                <Play className="w-3 h-3" /> Demo
              </button>
            )}
            {substitutions && substitutions.length > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowSubs(!showSubs) }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                  showSubs 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'bg-white/5 text-muted-foreground hover:text-white'
                }`}
              >
                ↔ Switch
              </button>
            )}
          </div>
          {cue && (
            <p className="text-xs text-orange-400/70 mt-1 leading-snug">{cue}</p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{completedSets}/{sets.length} sets</span>
            {totalVolume > 0 && <span>{(totalVolume / 1000).toFixed(1)}k lbs</span>}
            <span className="text-white/30">Rest 90s</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {completedSets === sets.length && sets.length > 0 && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium">
              Done
            </span>
          )}
          {expanded ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90 transition-transform" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform" />
          )}
        </div>
      </button>

      {/* Substitution Panel */}
      {showSubs && substitutions && substitutions.length > 0 && (
        <div className="px-4 pb-2">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Substitutions</p>
            {substitutions.map((sub, i) => (
              <button
                key={i}
                onClick={() => {
                  if (onSwitchExercise) {
                    onSwitchExercise(exercise.exerciseId, sub.name)
                    setShowSubs(false)
                  }
                }}
                className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
              >
                <p className="text-sm font-medium">{sub.name}</p>
                <p className="text-xs text-muted-foreground">{sub.why}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {sets.map((set, i) => (
            <div key={set.id}>
              <SetRow
                set={set}
                index={i}
                onUpdate={(w, r) => onUpdateSet(i, w, r)}
                onComplete={() => handleToggle(i)}
                targetReps={targetReps}
              />
              {/* Inline rest timer with clock-based countdown */}
              {showRestForSet === i && !set.completed && (
                <InlineRestTimer
                  key={`rest-single-${i}`}
                  onSkip={() => setShowRestForSet(null)}
                />
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const newSet: LocalSet = { id: genId(), weight: 0, reps: 0, completed: false }
              onUpdateSet(sets.length, 0, 0)
            }}
            className="w-full py-2 rounded-lg border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Set
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// SUPERSET CARD — combined logging for paired exercises
// ============================================================
function SupersetCard({
  group,
  baseIndex,
  onUpdateSet,
  onToggleSet,
  targetReps,
  onSwitchExercise,
}: {
  group: SupersetGroup
  baseIndex: number  // starting index in flat workoutExercises array
  onUpdateSet: (exerciseIndex: number, setIndex: number, weight: number, reps: number) => void
  onToggleSet: (exerciseIndex: number, setIndex: number) => void
  targetReps: { min: number; max: number }
  onSwitchExercise: (exerciseIndex: number, newName: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [showSubsFor, setShowSubsFor] = useState<{ ex: number; set: number } | null>(null)
  const [showRestForSet, setShowRestForSet] = useState<{ ex: number; set: number } | null>(null)

  const numSets = Math.max(...group.exercises.map(e => e.sets.length), 3)
  const completedSetsPerExercise = group.exercises.map(e => e.sets.filter(s => s.completed).length)
  const allDone = completedSetsPerExercise.every((c, i) => c >= group.exercises[i].sets.length)

  const groupLabel = group.exercises.map(e => e.exerciseName).join(' + ')

  return (
    <div className="rounded-xl border border-orange-500/30 bg-card overflow-hidden">
      {/* Superset Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left border-b border-white/5"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">⟳ Superset</span>
          </div>
          <p className="font-semibold text-sm mt-0.5 leading-tight">{groupLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {allDone && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium">
              Done
            </span>
          )}
          {expanded ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90 transition-transform" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* Set Rows — each row shows all exercises in the superset */}
          {Array.from({ length: numSets }).map((_, setIndex) => (
            <div key={setIndex}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground w-8">Set {setIndex + 1}</span>
                <div className="flex-1 flex gap-2">
                  {group.exercises.map((exercise, exIdx) => {
                    const exData = EXERCISES[exercise.exerciseId]
                    const set = exercise.sets[setIndex]
                    const isComplete = set?.completed
                    return (
                      <div key={exercise.exerciseId} className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1 flex-nowrap overflow-hidden">
                          <span className="text-[10px] text-orange-400 truncate">{exercise.exerciseName.split(' ').slice(0, 2).join(' ')}</span>
                          {exData?.youtubeUrl && (
                            <a
                              href={exData.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300 shrink-0"
                              onClick={e => e.stopPropagation()}
                            >
                              <Play className="w-3 h-3" />
                            </a>
                          )}
                          {exData?.substitutions && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowSubsFor(showSubsFor?.ex === exIdx && showSubsFor?.set === setIndex ? null : { ex: exIdx, set: setIndex })
                              }}
                              className="text-[10px] text-orange-400/70 hover:text-orange-400 shrink-0"
                            >
                              ↔
                            </button>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 p-1.5 rounded-lg border ${isComplete ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={set?.weight ?? ''}
                            onChange={(e) => onUpdateSet(baseIndex + exIdx, setIndex, parseFloat(e.target.value) || 0, typeof set?.reps === 'number' ? set.reps : 0)}
                            className="w-12 px-1 py-1 rounded bg-white/5 border border-white/10 text-center text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                          />
                          <span className="text-muted-foreground text-[10px]">×</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder={targetReps.min.toString()}
                            value={set?.reps ?? ''}
                            onChange={(e) => onUpdateSet(baseIndex + exIdx, setIndex, typeof set?.weight === 'number' ? set.weight : 0, parseInt(e.target.value) || 0)}
                            className="w-10 px-1 py-1 rounded bg-white/5 border border-white/10 text-center text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                          />
                          <button
                            onClick={() => {
                              if (!isComplete) {
                                onToggleSet(baseIndex + exIdx, setIndex)
                                setShowRestForSet({ ex: exIdx, set: setIndex })
                              }
                            }}
                            className={`ml-auto p-1 rounded transition-colors shrink-0 ${isComplete ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Substitution panel */}
              {showSubsFor?.ex !== undefined && showSubsFor?.set === setIndex && (
                <div className="ml-10 mb-2 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Switch Exercise</p>
                  {EXERCISES[group.exercises[showSubsFor.ex].exerciseId]?.substitutions?.map((sub, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onSwitchExercise(baseIndex + showSubsFor.ex, sub.name)
                        setShowSubsFor(null)
                      }}
                      className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <p className="text-sm font-medium">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.why}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Inline rest timer — clock-accurate countdown */}
              {showRestForSet?.set === setIndex && group.exercises[showRestForSet.ex] && (
                <InlineRestTimer
                  key={`rest-${showRestForSet.ex}-${setIndex}`}
                  onSkip={() => setShowRestForSet(null)}
                />
              )}
            </div>
          ))}

          {/* Add Set */}
          <button
            onClick={() => {
              group.exercises.forEach((_, exIdx) => {
                onUpdateSet(baseIndex + exIdx, numSets, 0, 0)
              })
            }}
            className="w-full py-2 rounded-lg border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Set
          </button>
        </div>
      )}
    </div>
  )
}

// Main Workout Page
export default function WorkoutPage() {
  const [user, setUser] = useState<any>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [weekType, setWeekType] = useState<'A' | 'B'>('A')
  const [phase, setPhase] = useState<PhaseKey>(0)
  const [programWeek, setProgramWeek] = useState(1)
  const [workoutActive, setWorkoutActive] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)
  const [workoutExercises, setWorkoutExercises] = useState<LocalExercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [restSeconds, setRestSeconds] = useState(90)
  const [warmUpComplete, setWarmUpComplete] = useState<boolean[]>([])
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [showDayPreview, setShowDayPreview] = useState<number | null>(null)
  const [weekWorkouts, setWeekWorkouts] = useState(0)
  const [weekVolume, setWeekVolume] = useState(0)
  const [prevWeekVolume, setPrevWeekVolume] = useState(0)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const router = useRouter()

  // Lazy init supabase client
  useEffect(() => {
    setSupabase(createClientComponentClient())
  }, [])

  // Initialize user and program position
  useEffect(() => {
    if (!supabase) return
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Calculate program position (using Jan 1, 2026 as start for demo)
      const startDate = new Date('2026-01-01')
      const pos = calculateProgramPosition(startDate)
      setCurrentDay(pos.currentDay)
      setWeekType(pos.weekType)
      setPhase(pos.phase)
      setProgramWeek(pos.programWeek)

      // Fetch this week's stats
      try {
        const now = new Date()
        const dayOfWeek = now.getDay()
        const monday = new Date(now)
        monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
        const weekStart = monday.toISOString().split('T')[0]
        const weekEnd = new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        // Last week's same day range
        const lastWeekMonday = new Date(monday.getTime() - 7 * 24 * 60 * 60 * 1000)
        const lastWeekStart = lastWeekMonday.toISOString().split('T')[0]
        const lastWeekEnd = new Date(lastWeekMonday.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        // Count workouts this week
        const { count: workoutCount } = await supabase
          .from('workout_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('date', weekStart)
          .lt('date', weekEnd)
        setWeekWorkouts(workoutCount || 0)

        // Volume this week (sum of weight * reps for completed sets)
        const { data: weekLogs } = await supabase
          .from('workout_logs')
          .select('id')
          .eq('user_id', user.id)
          .gte('date', weekStart)
          .lt('date', weekEnd)
        const weekLogIds = (weekLogs || []).map((l: any) => l.id)

        let volThis = 0
        if (weekLogIds.length > 0) {
          const { data: weekSets } = await supabase
            .from('workout_sets')
            .select('weight, reps')
            .in('workout_exercise_id', await supabase
              .from('workout_exercises')
              .select('id')
              .in('workout_log_id', weekLogIds)
              .then(({ data }) => (data || []).map((e: any) => e.id))
            )
            .eq('completed', true)
          volThis = (weekSets || []).reduce((acc: number, s: any) => acc + (s.weight || 0) * (typeof s.reps === 'number' ? s.reps : parseInt(s.reps || '0')), 0)
        }
        setWeekVolume(volThis)

        // Volume last week same day range
        const { data: lastWeekLogs } = await supabase
          .from('workout_logs')
          .select('id')
          .eq('user_id', user.id)
          .gte('date', lastWeekStart)
          .lt('date', lastWeekEnd)
        const lastWeekLogIds = (lastWeekLogs || []).map((l: any) => l.id)

        let volLast = 0
        if (lastWeekLogIds.length > 0) {
          const { data: lastWeekSets } = await supabase
            .from('workout_sets')
            .select('weight, reps')
            .in('workout_exercise_id', await supabase
              .from('workout_exercises')
              .select('id')
              .in('workout_log_id', lastWeekLogIds)
              .then(({ data }) => (data || []).map((e: any) => e.id))
            )
            .eq('completed', true)
          volLast = (lastWeekSets || []).reduce((acc: number, s: any) => acc + (s.weight || 0) * (typeof s.reps === 'number' ? s.reps : parseInt(s.reps || '0')), 0)
        }
        setPrevWeekVolume(volLast)
      } catch (e) {
        console.error('Error fetching stats:', e)
      }
    }
    init()
  }, [supabase, router])

  // Initialize workout when day is selected
  const initializeWorkout = useCallback((dayNumber: number) => {
    const day = WORKOUT_PROGRAM.find(d => d.dayNumber === dayNumber)
    if (!day) return

    const exercises = day.exercises.map((ex, i) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      sets: [
        { id: genId(), weight: 0, reps: 0, completed: false },
        { id: genId(), weight: 0, reps: 0, completed: false },
        { id: genId(), weight: 0, reps: 0, completed: false },
      ],
      supersetGroup: (ex as any).supersetGroup,
    }))

    setWorkoutExercises(exercises)
    setWarmUpComplete(new Array(day.warmUp.length).fill(false))
    setWorkoutActive(true)
    setWorkoutStartTime(new Date())
    setCurrentExerciseIndex(0)
    setShowDayPicker(false)
  }, [])

  const handleSelectDay = (dayNumber: number) => {
    initializeWorkout(dayNumber)
  }

  const handleStartWorkout = () => {
    initializeWorkout(currentDay)
  }

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, weight: number, reps: number) => {
    setWorkoutExercises(prev => {
      if (!prev[exerciseIndex]) return prev
      const updated = [...prev]
      const sets = [...updated[exerciseIndex].sets]
      if (!sets[setIndex]) {
        sets[setIndex] = { id: genId(), weight, reps, completed: false }
      } else {
        sets[setIndex] = { ...sets[setIndex], weight, reps }
      }
      updated[exerciseIndex] = { ...updated[exerciseIndex], sets }
      return updated
    })
  }

  const handleToggleSet = (exerciseIndex: number, setIndex: number) => {
    setWorkoutExercises(prev => {
      if (!prev[exerciseIndex] || !prev[exerciseIndex].sets[setIndex]) return prev
      const updated = [...prev]
      const sets = [...updated[exerciseIndex].sets]
      sets[setIndex] = { ...sets[setIndex], completed: !sets[setIndex].completed }
      updated[exerciseIndex] = { ...updated[exerciseIndex], sets }
      return updated
    })
  }

  const handleSwitchExercise = (exerciseIndex: number, newName: string) => {
    setWorkoutExercises(prev => {
      const updated = [...prev]
      updated[exerciseIndex] = {
        ...updated[exerciseIndex],
        exerciseName: newName,
      }
      return updated
    })
  }

  const handleRestComplete = () => {
    setShowRestTimer(false)
    setCurrentExerciseIndex(prev => Math.min(prev + 1, workoutExercises.length - 1))
  }

  const handleFinishWorkout = async () => {
    if (!user || !workoutStartTime || !supabase) return

    setSaving(true)
    const duration = Math.floor((new Date().getTime() - workoutStartTime.getTime()) / 1000)

    try {
      // Create workout log
      const { data: log, error: logError } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          day_number: currentDay,
          week_type: weekType,
          phase,
          program_week: programWeek,
          duration,
          notes: workoutNotes,
        })
        .select()
        .single()

      if (logError) throw logError

      // Create workout exercises and sets
      for (let i = 0; i < workoutExercises.length; i++) {
        const ex = workoutExercises[i]
        const { data: exerciseData, error: exError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_log_id: log.id,
            exercise_id: ex.exerciseId,
            exercise_name: ex.exerciseName,
            exercise_order: i,
            notes: ex.notes,
          })
          .select()
          .single()

        if (exError) throw exError

        // Insert sets
        const setsToInsert = ex.sets.map((s, j) => ({
          workout_exercise_id: exerciseData.id,
          set_number: j + 1,
          weight: s.weight,
          reps: typeof s.reps === 'number' ? s.reps : parseInt(s.reps as string) || 0,
          completed: s.completed,
        }))

        await supabase.from('workout_sets').insert(setsToInsert)
      }

      // Success - redirect to history
      router.push('/history')
    } catch (err) {
      console.error('Error saving workout:', err)
      alert('Failed to save workout. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const day = WORKOUT_PROGRAM.find(d => d.dayNumber === currentDay)
  const dayInfo = day ? WORKOUT_PROGRAM.find(d => d.dayNumber === currentDay) : null
  const phaseColor = PHASE_COLORS[phase]

  // Day Picker Modal
  if (showDayPicker) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Select Workout</h1>
          <button onClick={() => setShowDayPicker(false)} className="p-2 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {WORKOUT_PROGRAM.map((d) => {
            const isRest = d.type === 'rest' && d.dayNumber === 7
            return (
              <button
                key={d.dayNumber}
                onClick={() => handleSelectDay(d.dayNumber)}
                className={`w-full p-4 rounded-xl border text-left ${getDayBgColor(d.type)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Day {d.dayNumber}: {d.label}</p>
                    {isRest && <p className="text-xs text-muted-foreground mt-1">Recovery day - no workout needed</p>}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Workout Active View
  if (workoutActive && day) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#0a0f0a]/95 backdrop-blur border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setWorkoutActive(false)}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="font-semibold">{day.label}</p>
              <p className="text-xs text-muted-foreground">Week {programWeek} • Phase {phase + 1}</p>
            </div>
            <button
              onClick={handleFinishWorkout}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Finish'}
            </button>
          </div>
        </div>

        {/* Rest Timer Overlay */}
        {showRestTimer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm">
              <p className="text-center text-muted-foreground mb-4">Rest Period</p>
              <RestTimer
                seconds={restSeconds}
                onComplete={handleRestComplete}
                onSkip={handleRestComplete}
              />
              <div className="mt-4 flex justify-center gap-2">
                {[60, 90, 120, 180].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRestSeconds(s)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      restSeconds === s 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {s >= 60 ? `${s / 60}m` : `${s}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warm Up Section */}
        {warmUpComplete.length > 0 && warmUpComplete.some(v => !v) && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-sm">Warm-Up</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {warmUpComplete.filter(Boolean).length}/{warmUpComplete.length}
              </span>
            </div>
            <div className="space-y-2">
              {day.warmUp.map((move, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <button
                    onClick={() => {
                      const updated = [...warmUpComplete]
                      updated[i] = !updated[i]
                      setWarmUpComplete(updated)
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      warmUpComplete[i] ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
                    }`}
                  >
                    {warmUpComplete[i] && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{move.name}</p>
                    <p className="text-xs text-muted-foreground">{move.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercises */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {(() => {
            const elements: React.ReactNode[] = []
            let i = 0
            while (i < workoutExercises.length) {
              const exercise = workoutExercises[i]
              const progExercise = day.exercises[i] as any
              const supersetGroup = progExercise?.supersetGroup

              // Check if this is the start of a superset group
              const isSupersetStart = supersetGroup && (
                i === 0 || (day.exercises[i - 1] as any)?.supersetGroup !== supersetGroup
              )

              if (isSupersetStart) {
                // Collect all exercises in this superset group
                const groupExercises: LocalExercise[] = []
                const groupStartIndex = i
                while (
                  i < workoutExercises.length &&
                  (day.exercises[i] as any)?.supersetGroup === supersetGroup
                ) {
                  groupExercises.push(workoutExercises[i])
                  i++
                }
                elements.push(
                  <SupersetCard
                    key={`superset-${supersetGroup}-${groupStartIndex}`}
                    group={{ groupId: supersetGroup, exercises: groupExercises }}
                    baseIndex={groupStartIndex}
                    onUpdateSet={(exIdx, setIdx, w, r) => handleUpdateSet(exIdx, setIdx, w, r)}
                    onToggleSet={(exIdx, setIdx) => handleToggleSet(exIdx, setIdx)}
                    targetReps={{ min: 8, max: 12 }}
                    onSwitchExercise={(exIdx, newName) => handleSwitchExercise(exIdx, newName)}
                  />
                )
              } else {
                // Single exercise (not in a superset)
                const exData = EXERCISES[exercise.exerciseId]
                elements.push(
                  <ExerciseCard
                    key={exercise.exerciseId}
                    exercise={exercise}
                    sets={exercise.sets}
                    onUpdateSet={(setIndex, weight, reps) => handleUpdateSet(i, setIndex, weight, reps)}
                    onToggleSet={(setIndex) => handleToggleSet(i, setIndex)}
                    targetReps={{ min: 8, max: 12 }}
                    youtubeUrl={exData?.youtubeUrl}
                    onOpenVideo={() => {
                      if (exData?.youtubeUrl) {
                        setYoutubeUrl(exData.youtubeUrl)
                        setShowVideo(true)
                      }
                    }}
                    cue={exData?.cue}
                    substitutions={exData?.substitutions}
                    onSwitchExercise={(newName) => handleSwitchExercise(i, newName)}
                  />
                )
                i++
              }
            }
            return elements
          })()}

          {/* Mobility Block */}
          {day.mobilityBlock && day.mobilityBlock.length > 0 && (
            <div className="rounded-xl border bg-card text-card-foreground overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-cyan-500" />
                  <h3 className="font-semibold">Mobility</h3>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {day.mobilityBlock.map((move, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <div>
                      <p className="text-sm">{move.name}</p>
                      <p className="text-xs text-muted-foreground">{move.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Session Notes</label>
            <textarea
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="How did it feel? Energy levels, sleep quality..."
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              rows={3}
            />
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && youtubeUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-lg">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowVideo(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={youtubeUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Dashboard View
  const previewDay = showDayPreview !== null ? WORKOUT_PROGRAM.find(d => d.dayNumber === showDayPreview) : null
  const volumeDiff = prevWeekVolume > 0 ? Math.round(((weekVolume - prevWeekVolume) / prevWeekVolume) * 100) : null

  return (
    <div className="min-h-screen bg-[#0a0f0a] p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-3">
            <Dumbbell className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">HangFit</h1>
          <p className="text-muted-foreground text-xs mt-0.5">where the hangar meets iron</p>
        </div>

        {/* Week A/B Toggle + Phase */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 rounded-xl bg-white/5">
            {(['A', 'B'] as const).map(w => (
              <button
                key={w}
                onClick={() => setWeekType(w)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  weekType === w ? 'bg-orange-500 text-white' : 'text-muted-foreground hover:text-white'
                }`}
              >
                Week {w}
              </button>
            ))}
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            phase === 0 ? 'bg-emerald-500/20 text-emerald-500' :
            phase === 1 ? 'bg-blue-500/20 text-blue-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {PHASE_LABELS[phase]} • Week {programWeek}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs text-muted-foreground">This Week</span>
            </div>
            <p className="text-2xl font-bold">{weekWorkouts} <span className="text-sm font-normal text-muted-foreground">workouts</span></p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs text-muted-foreground">Volume</span>
            </div>
            <p className="text-2xl font-bold">
              {weekVolume > 0 ? `${(weekVolume / 1000).toFixed(1)}k` : '—'}
              <span className="text-sm font-normal text-muted-foreground"> lbs</span>
            </p>
            {volumeDiff !== null && (
              <p className={`text-xs mt-0.5 ${volumeDiff >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                {volumeDiff >= 0 ? '↑' : '↓'} {Math.abs(volumeDiff)}% vs last week
              </p>
            )}
          </div>
        </div>

        {/* Current Day Card */}
        <div className={`p-5 rounded-2xl border ${getDayBgColor(day?.type || 'rest')}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Today</p>
              <h2 className={`text-xl font-bold mt-0.5 ${getDayColor(day?.type || 'rest')}`}>
                {day ? getDayLabel(currentDay, weekType) : 'Rest Day'}
              </h2>
              {day?.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{day.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{currentDay}</p>
              <p className="text-xs text-muted-foreground">of 7</p>
            </div>
          </div>

          {day && day.type !== 'rest' ? (
            <button
              onClick={handleStartWorkout}
              className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold text-base hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Workout
            </button>
          ) : (
            <div className="w-full py-3.5 rounded-xl bg-white/5 text-center text-muted-foreground text-sm">
              Recovery Day — Rest Up! 💪
            </div>
          )}
        </div>

        {/* 7-Day Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">This Week</h3>
          <div className="grid grid-cols-7 gap-1">
            {WORKOUT_PROGRAM.map((d) => {
              const isToday = d.dayNumber === currentDay
              const isRest = d.type === 'rest'
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => {
                    setCurrentDay(d.dayNumber)
                    setShowDayPreview(d.dayNumber)
                  }}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors ${
                    isToday
                      ? 'bg-orange-500 text-white'
                      : isRest
                      ? 'bg-white/5 text-muted-foreground'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <span className="font-bold">{d.dayNumber}</span>
                  <span className="text-[8px] opacity-70 truncate w-full text-center px-0.5">
                    {d.dayNumber === 7 ? 'Off' : d.type.charAt(0).toUpperCase()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/history')}
            className="p-4 rounded-xl border bg-card text-card-foreground hover:bg-white/5 transition-colors text-left"
          >
            <History className="w-5 h-5 text-orange-500 mb-2" />
            <p className="font-semibold text-sm">History</p>
            <p className="text-xs text-muted-foreground">View past workouts</p>
          </button>
          <button
            onClick={() => router.push('/settings')}
            className="p-4 rounded-xl border bg-card text-card-foreground hover:bg-white/5 transition-colors text-left"
          >
            <Info className="w-5 h-5 text-orange-500 mb-2" />
            <p className="font-semibold text-sm">Program</p>
            <p className="text-xs text-muted-foreground">Learn the system</p>
          </button>
        </div>
      </div>

      {/* Day Preview Modal */}
      {previewDay && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4" onClick={() => setShowDayPreview(null)}>
          <div className="w-full max-w-md bg-[#0f1a0f] rounded-2xl border border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Preview</p>
                <h3 className="font-bold text-lg">{previewDay.label}</h3>
                {previewDay.description && <p className="text-xs text-muted-foreground">{previewDay.description}</p>}
              </div>
              <button onClick={() => setShowDayPreview(null)} className="p-2 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
              {previewDay.exercises.map((ex, i) => {
                const exData = EXERCISES[ex.id]
                return (
                  <div key={ex.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{ex.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{ex.category}</span>
                    </div>
                    {exData?.cue && <p className="text-xs text-orange-400/70 mt-1">{exData.cue}</p>}
                  </div>
                )
              })}
              {previewDay.mobilityBlock && previewDay.mobilityBlock.length > 0 && (
                <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-xs font-semibold text-cyan-500 mb-2">Mobility</p>
                  {previewDay.mobilityBlock.map((m, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{m.name} — {m.detail}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  setCurrentDay(previewDay.dayNumber)
                  setShowDayPreview(null)
                  if (previewDay.type !== 'rest') {
                    initializeWorkout(previewDay.dayNumber)
                  }
                }}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
              >
                {previewDay.type === 'rest' ? 'Rest Day' : 'Start This Workout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

