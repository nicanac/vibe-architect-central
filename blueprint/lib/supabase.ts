import { createClient } from '@supabase/supabase-js';

// Use environment variables for configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Realtime subscription helper
export const subscribeToTranscripts = (meetingId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`meeting:${meetingId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'transcripts',
        filter: `meeting_id=eq.${meetingId}`,
      },
      callback
    )
    .subscribe();
};
