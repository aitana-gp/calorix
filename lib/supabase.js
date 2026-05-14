import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nlmmauflpywnhhtwobni.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sbW1hdWZscHl3bmhodHdvYm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjM0MjcsImV4cCI6MjA5NDI5OTQyN30.grFWJQejc_8leNaLOwYBXQX5W1M0p2JXidIDwvyA5WA'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)