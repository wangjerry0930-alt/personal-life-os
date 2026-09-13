# Personal Life OS Supabase setup

1. Open the Supabase project SQL Editor.
2. Run the migration in `supabase/migrations/20260913000000_life_os_snapshots.sql`.
3. In Personal Life OS → Settings → Supabase cloud sync, enter the project URL and anon key.
4. Save settings, then use **Backup to cloud**. Use **Restore cloud** on another device.

The migration creates one complete JSON snapshot per `user_key`. The current local-first build uses `user_key = 'local'`; the RLS policies only allow that workspace key. When account authentication is added, replace these policies with user-id-based policies before exposing multiple users.
