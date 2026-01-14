
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verify() {
  const { count, error } = await supabase
    .from('instructions')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting instructions:', error);
  } else {
    console.log(`✅ Total Instructions in DB: ${count}`);
  }
  
  // Check breakdown by category
  const categories = ['command', 'agent', 'skill', 'hook', 'rule', 'prompt'];
  for (const cat of categories) {
      const { count: catCount } = await supabase
        .from('instructions')
        .select('*', { count: 'exact', head: true })
        .eq('category', cat);
      console.log(`   - ${cat}: ${catCount}`);
  }
}

verify();
