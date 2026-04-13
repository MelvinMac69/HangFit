import type { Exercise } from '@/types/workout'

// Exercise library with YouTube links for key movements
export const EXERCISES: Record<string, Exercise> = {
  // LOWER BODY
  'barbell-back-squat': {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'compound',
    cue: 'Brace hard, sit to depth. Drive through the floor. Heavy.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
  },
  'romanian-deadlift': {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'compound',
    cue: 'Hinge at hips, soft knees. Feel the hamstrings load through the full stretch.',
    youtubeUrl: 'https://www.youtube.com/watch?v=7j-2w4-P14I',
  },
  'bulgarian-split-squat': {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'compound',
    cue: 'Rear foot elevated. Pause 1s at bottom for stretch and control.',
    youtubeUrl: 'https://www.youtube.com/watch?v=txp4R3X1X6U',
  },
  'walking-lunge': {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    category: 'compound',
    cue: 'Dynamic, athletic. Control the eccentric, drive through front foot.',
    youtubeUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE',
  },
  'nordic-hamstring-curl': {
    id: 'nordic-hamstring-curl',
    name: 'Nordic Hamstring Curl',
    category: 'calisthenics',
    cue: 'Eccentric focus — slow 3-4s lowering. Band assist if needed.',
    youtubeUrl: 'https://www.youtube.com/watch?v=yygp-3zr6Xg',
  },
  'barbell-hip-thrust': {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust',
    category: 'compound',
    cue: 'Full lockout, squeeze glutes 1s at top. Pause reps.',
    youtubeUrl: 'https://www.youtube.com/watch?v=SIOCAPD3uW8',
  },
  'conventional-deadlift': {
    id: 'conventional-deadlift',
    name: 'Conventional Deadlift',
    category: 'compound',
    cue: 'Brace, push the floor away. Lockout with glutes. Controlled lower.',
    youtubeUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
  },
  'goblet-squat': {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'compound',
    cue: 'Deep squat, elbows between knees. Mobility and strength.',
    youtubeUrl: 'https://www.youtube.com/watch?v=YZ3D5cZkjkY',
  },
  'snatch-grip-rdl': {
    id: 'snatch-grip-rdl',
    name: 'Snatch-Grip Romanian Deadlift',
    category: 'compound',
    cue: 'Wide grip, massive hamstring stretch. Signature Eugene Teo posterior chain builder.',
    youtubeUrl: 'https://www.youtube.com/watch?v=_2LlnU2macU',
  },
  'tempo-front-squat': {
    id: 'tempo-front-squat',
    name: 'Tempo Front Squat',
    category: 'compound',
    cue: '3s down, 1s pause at bottom, drive up. Upright torso, elbows high.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Eqa8mnnF1hA',
  },
  'suitcase-carry': {
    id: 'suitcase-carry',
    name: 'Suitcase Carry',
    category: 'carry',
    cue: 'Single DB/KB — anti-lateral flexion. Brace hard, walk tall.',
    youtubeUrl: 'https://www.youtube.com/watch?v=gqjVNC1ZJ9E',
  },

  // UPPER BODY - PULL
  'weighted-pull-up': {
    id: 'weighted-pull-up',
    name: 'Weighted Pull-Up',
    category: 'compound',
    cue: 'Add weight via belt or DB between feet. If <5 BW reps, do bodyweight sets.',
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4Y_wSM7c',
  },
  'ring-push-up': {
    id: 'ring-push-up',
    name: 'Ring Push-Up',
    category: 'compound',
    cue: 'Turn rings out at top. Unstable pressing — massive chest and stabilizer activation.',
    youtubeUrl: 'https://www.youtube.com/watch?v=5cE4cY5eIHQ',
  },
  'ring-dip': {
    id: 'ring-dip',
    name: 'Ring Dip',
    category: 'calisthenics',
    cue: 'Turn rings out at top for lockout. Lean slightly forward for chest emphasis. Scale with band.',
    youtubeUrl: 'https://www.youtube.com/watch?v=tN3M7_5i6yA',
  },
  'chest-supported-db-row': {
    id: 'chest-supported-db-row',
    name: 'Chest-Supported Dumbbell Row',
    category: 'compound',
    cue: 'Incline bench, full stretch at bottom, squeeze lats at top.',
    youtubeUrl: 'https://www.youtube.com/watch?v=roP1nzK9g5Q',
  },
  'seated-cable-row': {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    category: 'compound',
    cue: 'Feet forward, squeeze shoulder blades. Adjust angle for difficulty.',
    youtubeUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74',
  },
  'cable-face-pull': {
    id: 'cable-face-pull',
    name: 'Cable Face Pull',
    category: 'isolation',
    cue: 'External rotation at top. Rear delt and rotator cuff health.',
    youtubeUrl: 'https://www.youtube.com/watch?v=rep-qVOkqGK8',
  },
  'ring-row': {
    id: 'ring-row',
    name: 'Ring Row',
    category: 'compound',
    cue: 'Feet forward, body angled. Squeeze shoulder blades. Adjust angle for difficulty.',
    youtubeUrl: 'https://www.youtube.com/watch?v=p9nRjJW6e2A',
  },

  // UPPER BODY - PRESS
  'barbell-bench-press': {
    id: 'barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'compound',
    cue: 'Arch, retract scapulae, drive through feet. Full ROM.',
    youtubeUrl: 'https://www.youtube.com/watch?v=r4P8C0K8mOI',
  },
  'overhead-press': {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'compound',
    cue: 'Strict standing press. Brace core, press to full lockout.',
    youtubeUrl: 'https://www.youtube.com/watch?v=2X9hh4g4tZ0',
  },
  'landmine-press': {
    id: 'landmine-press',
    name: 'Landmine Press',
    category: 'compound',
    cue: '30° incline. Full stretch at bottom, press to lockout. 2-3s eccentric.',
    youtubeUrl: 'https://www.youtube.com/watch?v=qpH7T2rP7YI',
  },
  'db-incline-press': {
    id: 'db-incline-press',
    name: 'Dumbbell Incline Press',
    category: 'compound',
    cue: '30° incline. Full stretch at bottom, press to lockout. 2-3s eccentric.',
    youtubeUrl: 'https://www.youtube.com/watch?v=DbFgADa2PL8',
  },

  // ISOLATION
  'db-hammer-curl': {
    id: 'db-hammer-curl',
    name: 'Dumbbell Hammer Curl',
    category: 'isolation',
    cue: 'Slow eccentric. No swinging — strict form.',
    youtubeUrl: 'https://www.youtube.com/watch?v=5fMTqT-Z6qI',
  },
  'db-lateral-raise': {
    id: 'db-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'isolation',
    cue: 'Slight forward lean, lead with pinky. Mind-muscle connection.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaEpQ1Io',
  },
  'overhead-tricep-extension': {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension (cable)',
    category: 'isolation',
    cue: 'Full stretch behind head. Elbows in.',
    youtubeUrl: 'https://www.youtube.com/watch?v=nRiJV0gdJ6s',
  },

  // PLYOMETRIC / EXPLOSIVE
  'box-jump': {
    id: 'box-jump',
    name: 'Box Jump (step down)',
    category: 'plyometric',
    cue: 'Max height, full hip extension. Step down — don\'t jump. Prime the nervous system.',
    youtubeUrl: 'https://www.youtube.com/watch?v=NY9U6w1nP3w',
  },
  'broad-jump': {
    id: 'broad-jump',
    name: 'Broad Jump',
    category: 'plyometric',
    cue: 'Explosive hip drive forward. Stick the landing. Reset between reps.',
    youtubeUrl: 'https://www.youtube.com/watch?v=1YpLLSLE0Jg',
  },
  'clap-push-up': {
    id: 'clap-push-up',
    name: 'Clap Push-Up',
    category: 'plyometric',
    cue: 'Explosive press, hands leave floor. Land soft. Upper body power primer.',
    youtubeUrl: 'https://www.youtube.com/watch?v=UlyU3m1xZ9A',
  },
  'depth-drop': {
    id: 'depth-drop',
    name: 'Depth Drop',
    category: 'plyometric',
    cue: 'Step off box (20-24"), absorb landing. Knees track over toes. Reactive strength.',
    youtubeUrl: 'https://www.youtube.com/watch?v=5KkT4xN8mQw',
  },
  'sprint-intervals': {
    id: 'sprint-intervals',
    name: 'Sprint Intervals',
    category: 'explosive',
    cue: '80-90% effort. Flat ground or slight incline. Full recovery.',
  },
  'explosive-push-up': {
    id: 'explosive-push-up',
    name: 'Explosive Push-Up',
    category: 'plyometric',
    cue: 'Hands leave the ground at the top. Land soft. Prime the nervous system.',
    youtubeUrl: 'https://www.youtube.com/watch?v=F3J9M5T8_Ys',
  },

  // CARRY / CONDITIONING
  'kettlebell-swing': {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing',
    category: 'explosive',
    cue: 'Hip snap, squeeze glutes at top. Russian-style power endurance.',
    youtubeUrl: 'https://www.youtube.com/watch?v=YSxHifyI6s8',
  },
  'farmer-carry': {
    id: 'farmer-carry',
    name: "Farmer's Carry",
    category: 'carry',
    cue: 'Heavy DBs. Tall posture, packed shoulders. Finisher.',
    youtubeUrl: 'https://www.youtube.com/watch?v=4zT68Q3BC3I',
  },
  'turkish-get-up': {
    id: 'turkish-get-up',
    name: 'Turkish Get-Up',
    category: 'compound',
    cue: 'Slow, deliberate. Full body coordination and stability.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Vb3w5J8K6vY',
  },
  'devils-press': {
    id: 'devils-press',
    name: "Devil's Press (DB)",
    category: 'conditioning',
    cue: 'Burpee with DBs → snatch to overhead. Full body explosive.',
    youtubeUrl: 'https://www.youtube.com/watch?v=0Z5W9S7e_cI',
  },
  'renegade-row': {
    id: 'renegade-row',
    name: 'Renegade Row',
    category: 'compound',
    cue: 'Anti-rotation core challenge. Alternate sides.',
    youtubeUrl: 'https://www.youtube.com/watch?v=wr54r8KqV2Y',
  },
  'med-ball-chest-pass': {
    id: 'med-ball-chest-pass',
    name: 'Med Ball Chest Pass',
    category: 'plyometric',
    cue: 'Explosive push from chest. Bounce off wall.',
    youtubeUrl: 'https://www.youtube.com/watch?v=0T5j4RZ5a9s',
  },
  'med-ball-overhead-slam': {
    id: 'med-ball-overhead-slam',
    name: 'Med Ball Overhead Slam',
    category: 'plyometric',
    cue: 'Full extension, slam with everything. Explosive.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Q6YKO8a1tWc',
  },

  // CORE
  'hanging-leg-raise': {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raise',
    category: 'calisthenics',
    cue: 'Straight legs to parallel. Control the negative.',
    youtubeUrl: 'https://www.youtube.com/watch?v=d6eKdX5WvYA',
  },
  'hollow-body-hold': {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'calisthenics',
    cue: 'Lower back flat, arms extended. Hold position with tension.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ll-gsL_Gs6w',
  },
  'bear-crawl': {
    id: 'bear-crawl',
    name: 'Bear Crawl',
    category: 'calisthenics',
    cue: 'Knees hovering, crawl forward. Keep hips low and core braced.',
    youtubeUrl: 'https://www.youtube.com/watch?v=N3Yk0aCjXKs',
  },
  'plank': {
    id: 'plank',
    name: 'Plank (weighted or long hold)',
    category: 'calisthenics',
    cue: 'Elbows under shoulders, squeeze everything. Core between squat sets.',
  },
  'side-plank': {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'calisthenics',
    cue: 'Stack feet or stagger. Oblique and hip stability between squat sets.',
    youtubeUrl: 'https://www.youtube.com/watch?v=K2VJzV_JYbE',
  },
  'copenhagen-plank': {
    id: 'copenhagen-plank',
    name: 'Copenhagen Plank',
    category: 'calisthenics',
    cue: 'Top leg on bench, bottom leg free. Adductor and oblique hold.',
    youtubeUrl: 'https://www.youtube.com/watch?v=pD2hN5a-Q7I',
  },
  'front-lever-hold': {
    id: 'front-lever-hold',
    name: 'Front Lever Hold (progression)',
    category: 'calisthenics',
    cue: 'Tuck → adv tuck → single-leg → full. Hollow body, depress scapulae.',
    youtubeUrl: 'https://www.youtube.com/watch?v=mu5gK5L0v8M',
  },
  'plank-to-push-up': {
    id: 'plank-to-push-up',
    name: 'Plank to Push-Up',
    category: 'calisthenics',
    cue: 'Forearms to hands, alternate lead arm. Core and tricep finisher.',
    youtubeUrl: 'https://www.youtube.com/watch?v=mZ8fH5O5Y2w',
  },

  // METCON / RECOVERY
  'easy-walk': {
    id: 'easy-walk',
    name: 'Easy Walk or Light Cycle',
    category: 'mobility',
    cue: 'Zone 1 — conversational pace. Move the body without taxing it.',
  },
  'foam-roll': {
    id: 'foam-roll',
    name: 'Foam Roll (full body)',
    category: 'mobility',
    cue: 'Quads, glutes, lats, T-spine. Slow passes on tight spots.',
  },
  'pigeon-stretch': {
    id: 'pigeon-stretch',
    name: 'Pigeon Stretch',
    category: 'mobility',
    cue: 'Deep hip flexor and glute stretch. Relax into it — don\'t fight the position.',
  },
  'lat-hang': {
    id: 'lat-hang',
    name: 'Lat Hang + Thoracic Extension',
    category: 'mobility',
    cue: 'Passive hang → bench T-spine extension. Open everything up.',
  },
}

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES[id]
}

export function getExerciseByName(name: string): Exercise | undefined {
  return Object.values(EXERCISES).find(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  )
}