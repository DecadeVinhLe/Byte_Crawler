# Turn on real accounts (about 10 minutes)

ByteCrawler is a static site, so accounts need a hosted database. This project uses
[Supabase](https://supabase.com) (free plan is enough): it provides the user accounts,
the PostgreSQL tables and the security rules. Until you finish these steps the site keeps
its browser-only demo login, so nothing breaks.

## What gets stored

| Where | What |
|---|---|
| `auth.users` (Supabase) | email and a password hash. Passwords are never visible to you or to this site's code. |
| `profiles` | display name |
| `progress` | XP, cleared checkpoints, answered quick challenges, Wyrm defeated, boss record (best time, wins, losses, last 8 runs) |

Every row belongs to one account. Row Level Security in `schema.sql` lets a logged-in user read
and change only their own rows. The public key in `js/config.js` can do nothing without a login.

## Steps

1. **Create a project.** supabase.com > New project. Pick a region near your users and keep the
   database password somewhere safe.
2. **Create the tables.** In the project, open *SQL Editor* > *New query*, paste all of
   `supabase/schema.sql`, press *Run*. You should see "Success". Running it again is harmless.
3. **Copy the keys.** *Project Settings* > *API* (or the *Connect* button). Copy:
   - the **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - the **anon / publishable key** (the public one)

   Paste both into `js/config.js`. Never use the `service_role` or *secret* key in this file.
4. **Choose how sign-up works.** *Authentication* > *Sign In / Providers* > *Email*:
   - *Confirm email* **on** (default): new users must click a link in their inbox before they can log in.
     Set *Authentication* > *URL Configuration* > **Site URL** to your published address
     (for example `https://yourname.github.io/bytecrawler/`) so the link opens the site.
   - *Confirm email* **off**: users are logged in straight after signing up. Easiest for a class or demo.
   - Optional: *Authentication* > *Policies* > raise the minimum password length. The form asks for 6.
5. **Publish.** Commit `js/config.js` and push. The anon key is meant to be public.
6. **Check it works.** Open the site, go to Log in > Sign up, finish a checkpoint, reload the page,
   and look in *Table Editor* > `progress` for your row.

## Running it locally

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## How progress is saved

- **Without an account** (guest, or before you add keys), checkpoints, XP and quiz answers are kept in
  the browser and survive a reload. They stay on that browser and are removed if the visitor clears site data.
  The boss record is only kept for a logged-in account.
- When a guest logs in, their browser progress is added to the account and the browser copy is removed.
- Every XP, checkpoint or boss change is saved a moment later. The login card shows
  "Saving…", "Progress saved to your account." or "Offline…".
- If the connection drops, the save is kept and sent when the browser is back online.
- Two devices on the same account are merged, not overwritten: checkpoints are combined,
  XP is recalculated from them, and boss counters never go down.
- Boss runs played as a guest are added to the account at the next login.
- Logging out clears the game on that browser so the next person starts clean.

## Good to know

- **No password reset page yet.** Users can be reset from *Authentication* > *Users*. Supabase has a
  recovery endpoint when you want to add a "Forgot password" link.
- **Progress is trusted from the browser.** That is fine for a learning game. If you add a public
  leaderboard, validate boss times on the server first, because a player could edit their own record.
- **Deleting an account** (*Authentication* > *Users*) also deletes its `profiles` and `progress` rows.
- Free Supabase projects can pause after a period of inactivity. Restore one from the dashboard
  and the accounts are still there.
