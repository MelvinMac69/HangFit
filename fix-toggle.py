with open('/Users/melvin/.openclaw/workspace/hangfit/src/app/(app)/workout/page.tsx', 'r') as f:
    content = f.read()

# Add a local completed state to ExerciseCard
old = """  const [showRestForSet, setShowRestForSet] = useState<number | null>(null)
  const completedSets = sets.filter(s => s.completed).length"""
new = """  const [showRestForSet, setShowRestForSet] = useState<number | null>(null)
  // Local state for completed sets — synced from props but updates immediately on click
  const [localCompleted, setLocalCompleted] = useState<Record<number, boolean>>({})
  const completedSets = sets.filter(s => s.completed).length"""
content = content.replace(old, new)

# Update the button to use local state for immediate visual feedback
old2 = """                <button
                  onClick={() => { console.log('CHECK BUTTON CLICKED, set.completed =', set.completed); handleToggle(i) }}
                  className={`p-2 rounded-lg transition-colors ${
                    set.completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>"""
new2 = """                <button
                  onClick={() => {
                    console.log('CHECK BUTTON CLICKED, set.completed =', set.completed, 'i =', i)
                    setLocalCompleted(prev => ({ ...prev, [i]: !prev[i] }))
                    handleToggle(i)
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    (localCompleted[i] !== undefined ? localCompleted[i] : set.completed)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>"""
content = content.replace(old2, new2)

with open('/Users/melvin/.openclaw/workspace/hangfit/src/app/(app)/workout/page.tsx', 'w') as f:
    f.write(content)
print("Done")
