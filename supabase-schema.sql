-- HangFit Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- WORKOUT_LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 7),
  week_type CHAR(1) NOT NULL CHECK (week_type IN ('A', 'B')),
  phase INTEGER NOT NULL CHECK (phase >= 0 AND phase <= 3),
  program_week INTEGER NOT NULL CHECK (program_week >= 1 AND program_week <= 13),
  duration INTEGER NOT NULL DEFAULT 0, -- in seconds
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for workout_logs
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout logs" ON workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs" ON workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" ON workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs" ON workout_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- WORKOUT_EXERCISES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  exercise_order INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for workout_exercises
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout exercises" ON workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE workout_logs.id = workout_exercises.workout_log_id 
      AND workout_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workout exercises" ON workout_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE workout_logs.id = workout_log_id 
      AND workout_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workout exercises" ON workout_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE workout_logs.id = workout_exercises.workout_log_id 
      AND workout_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workout exercises" ON workout_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_logs 
      WHERE workout_logs.id = workout_exercises.workout_log_id 
      AND workout_logs.user_id = auth.uid()
    )
  );

-- ============================================
-- WORKOUT_SETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workout_sets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_exercise_id UUID REFERENCES workout_exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INTEGER NOT NULL,
  weight DECIMAL(6, 2) NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for workout_sets
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout sets" ON workout_sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workout_logs wl ON wl.id = we.workout_log_id
      WHERE we.id = workout_sets.workout_exercise_id
      AND wl.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own workout sets" ON workout_sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workout_logs wl ON wl.id = we.workout_log_id
      WHERE we.id = workout_exercise_id
      AND wl.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own workout sets" ON workout_sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workout_logs wl ON wl.id = we.workout_log_id
      WHERE we.id = workout_sets.workout_exercise_id
      AND wl.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own workout sets" ON workout_sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workout_logs wl ON wl.id = we.workout_log_id
      WHERE we.id = workout_sets.workout_exercise_id
      AND wl.user_id = auth.uid()
    )
  );

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs(date);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_log_id ON workout_exercises(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_exercise_id ON workout_sets(workout_exercise_id);

-- ============================================
-- FUNCTION: Handle new user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_logs_updated_at
  BEFORE UPDATE ON workout_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
