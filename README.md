# 🦃 Thanksgiving Quest

A Game Boy–style sign-up game for the family Thanksgiving. Guests:

1. Get stopped at the front door by **Aunt Deb** (battle-screen cutscene) and enter their name
2. Get handed the list and **circle what they're bringing** (first-person view)
3. Walk back up to the door holding their items, and get let in (barely)
4. Choose their destiny: **First Table**, **Second Round**, or **Doggie Bag**
5. Their answers save to a Google Sheet, and items already claimed show up crossed off for the next person

## Customize

Open `index.html` and edit the `CONFIG` block at the top of the `<script>`:

- `GUARD_NAME` is who's guarding the door
- `ITEMS` is the food list. `slots` is how many people can claim an item (e.g. `slots: 2` for drinks)
- `SUBMIT_URL` is your Google Apps Script URL (below). Leave it blank and the game runs in demo mode.

## 1. Set up the results sheet (about 5 minutes)

1. Create a new Google Sheet (e.g. "Thanksgiving Sign-ups")
2. **Extensions → Apps Script**, delete what's there, and paste in `apps-script/Code.gs`
3. **Deploy → New deployment →** gear icon **→ Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, approve the permissions, and copy the **Web app URL** (ends in `/exec`)
5. Paste it into `SUBMIT_URL` in `index.html`

Each completed game adds a row to the **Signups** tab: timestamp, name, items, write-in, and game plan.
If you edit `Code.gs` later, go to **Deploy → Manage deployments → Edit → New version** so the URL keeps working.

## 2. Host it on GitHub Pages

1. Create a new GitHub repo and upload `index.html` (the `apps-script` folder and this README are optional)
2. Repo **Settings → Pages →** Source: *Deploy from a branch*, Branch: `main` / root → **Save**
3. In a minute it's live at `https://<your-username>.github.io/<repo-name>/`. Text that link to the family.

## Controls

Click or tap (or press Space/Enter) to advance the dialogue. Arrow keys work in the final menu. ♪ toggles sound.
