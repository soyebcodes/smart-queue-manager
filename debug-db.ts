import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLogs() {
    console.log("--- Supabase Activity Logs Debug ---");
    
    // 1. Check current session
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Current session:", session ? `Logged in as ${session.user.email}` : "No session");

    // 2. Count logs
    const { count, error: countError } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("Error counting logs:", countError);
    } else {
        console.log("Total logs in table (according to current user RLS):", count);
    }

    // 3. Fetch recent logs
    const { data: logs, error: fetchError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (fetchError) {
        console.error("Error fetching logs:", fetchError);
    } else if (logs && logs.length > 0) {
        console.log("Recent logs:");
        logs.forEach(l => console.log(`- [${l.created_at}] ${l.message}`));
    } else {
        console.log("No logs found.");
    }

    console.log("--- End Debug ---");
}

debugLogs();
