'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/lib/supabase'
import { WORKOUT_PROGRAM, getDayLabel } from '@/lib/workout-program'
import { format, formatDistanceToNow } from 'date-fns'
import { 
  Calendar, Clock, Dumbbell, ChevronRight, ChevronDown, 
  Weight, TrendingUp, Play, User, LogOut, Loader2, X
} from 'lucide-react'

interface WorkoutDetail {
  id: string
  date: string
  day_number: number
  week_type: 'A' | 'B'
  phase: number
  program_week: number
  duration: number
  notes?: string
  exercises: {
    id: string
    exercise_name: string
    exercise_id: string
    sets: {
      weight: number
      reps: number
      completed: boolean
    }[]
  }[]
}

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<WorkoutDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { client: supabase, isLoading: supabaseLoading } = useSupabase()

  useEffect(() => {
    if (supabaseLoading) return
    
    if (!supabase) {
      setError('Unable to connect to database. Please check your configuration.')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setUser(user)

        // Fetch workout logs with exercises and sets
        const { data: logs, error } = await supabase
          .from('workout_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })

        if (error) throw error

        // Fetch exercises and sets for each log
        const workoutsWithDetails: WorkoutDetail[] = []
        for (const log of logs || []) {
          const { data: exercises } = await supabase
            .from('workout_exercises')
            .select('*')
            .eq('workout_log_id', log.id)
            .order('exercise_order')

          const exercisesWithSets: WorkoutDetail['exercises'] = []
          for (const ex of exercises || []) {
            const { data: sets } = await supabase
              .from('workout_sets')
              .select('*')
              .eq('workout_exercise_id', ex.id)
              .order('set_number')

            exercisesWithSets.push({
              ...ex,
              sets: sets || [],
            })
          }

          workoutsWithDetails.push({
            ...log,
            exercises: exercisesWithSets,
          })
        }

        setWorkouts(workoutsWithDetails)
      } catch (err: any) {
        console.error('Error fetching workouts:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, supabaseLoading, router])

  const handleLogout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/login')
  }

  const totalVolume = (workout: WorkoutDetail) => {
    return workout.exercises.reduce((acc, ex) => {
      return acc + ex.sets.reduce((setAcc, set) => {
        return setAcc + (set.completed ? set.weight * set.reps : 0)
      }, 0)
    }, 0)
  }

  const totalSets = (workout: WorkoutDetail) => {
    return workout.exercises.reduce((acc, ex) => {
      return acc + ex.sets.filter(s => s.completed).length
    }, 0)
  }

  if (supabaseLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Configuration Error</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <p className="text-xs text-muted-foreground">
            Make sure your Supabase environment variables are set correctly.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0f0a]/95 backdrop-blur border-b border-white/10 p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">History</h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <User className="w-5 h-5" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1a1f1a] border border-white/10 overflow-hidden z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full p-3 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-red-500"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">
        {workouts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No Workouts Yet</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Complete your first workout to see it here
            </p>
            <button
              onClick={() => router.push('/workout')}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
            >
              Start Workout
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => {
              const isExpanded = expandedWorkout === workout.id
              const day = WORKOUT_PROGRAM.find(d => d.dayNumber === workout.day_number)
              const volume = totalVolume(workout)
              const sets = totalSets(workout)
              const duration = Math.floor(workout.duration / 60)

              return (
                <div
                  key={workout.id}
                  className="rounded-xl border bg-card text-card-foreground overflow-hidden"
                >
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">
                            {day ? getDayLabel(workout.day_number, workout.week_type) : `Day ${workout.day_number}`}
                          </p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            workout.phase === 0 ? 'bg-emerald-500/20 text-emerald-500' :
                            workout.phase === 1 ? 'bg-blue-500/20 text-blue-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            P{workout.phase + 1}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(workout.date), 'MMM d, yyyy')} • {formatDistanceToNow(new Date(workout.date), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{duration}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5" />
                          <span>{sets} sets</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Weight className="w-3.5 h-3.5" />
                          <span>{volume > 0 ? `${(volume / 1000).toFixed(1)}k` : '—'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-wrap gap-1">
                        {workout.exercises.slice(0, 4).map((ex, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-muted-foreground"
                          >
                            {ex.exercise_name}
                          </span>
                        ))}
                        {workout.exercises.length > 4 && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-muted-foreground">
                            +{workout.exercises.length - 4} more
                          </span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-4">
                      {/* Exercise Details */}
                      {workout.exercises.map((ex, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{ex.exercise_name}</h4>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {ex.sets.map((set, j) => (
                              <div
                                key={j}
                                className={`p-2 rounded-lg text-center text-xs ${
                                  set.completed
                                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                                    : 'bg-white/5'
                                }`}
                              >
                                <p className="font-medium">{set.weight} lbs</p>
                                <p className="text-muted-foreground">{set.reps} reps</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Notes */}
                      {workout.notes && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm italic">"{workout.notes}"</p>
                        </div>
                      )}

                      {/* Progressive Overload Suggestion */}
                      <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold text-sm">Next Session</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Consider increasing your squat weight by 5lbs based on consistent performance at current weight.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}