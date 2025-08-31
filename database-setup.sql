-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(50),
  faculty VARCHAR(100),
  department VARCHAR(100),
  year_level INTEGER CHECK (year_level >= 1 AND year_level <= 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL CHECK (credits > 0),
  faculty VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  semester VARCHAR(20) NOT NULL,
  academic_year VARCHAR(9) NOT NULL,
  grade VARCHAR(2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id, semester, academic_year)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  event_type VARCHAR(20) CHECK (event_type IN ('academic', 'social', 'career', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_courses_faculty ON courses(faculty);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- Insert sample data for testing
INSERT INTO courses (code, title, description, credits, faculty, department) VALUES
('CS101', 'Introduction to Computer Science', 'Basic concepts of programming and computer science', 3, 'Engineering', 'Computer Science'),
('MATH101', 'Calculus I', 'Fundamental concepts of calculus', 4, 'Science', 'Mathematics'),
('ENG101', 'English Composition', 'Writing and communication skills', 3, 'Arts', 'English'),
('PHY101', 'Physics I', 'Mechanics and thermodynamics', 4, 'Science', 'Physics'),
('BUS101', 'Business Fundamentals', 'Introduction to business concepts', 3, 'Business', 'Management');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Courses are public for reading
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

-- Enrollments: users can only see their own enrollments
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Events are public for reading
CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
