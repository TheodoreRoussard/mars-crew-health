# Crew Health Monitor: setup and backup procedure

Print this page and keep it next to the screen. All keys are also shown at the bottom of every screen.

## 1. First setup (once per device)

1. Copy `index.html` to the device and open it in Chromium. Press `F11` for full screen.
2. In Chromium settings, under Downloads, turn on **"Ask where to save each file"**, so backups can go straight to the USB stick.
3. On the start screen choose **Add a new astronaut**, type your name, press `Enter`.
4. Choose your name and press `Enter`. This starts the session and turns the alarm sound on.
5. Press `6` and test both sounds. Set the speaker volume so they are heard across the room.
6. Check the date at the top right. If it is wrong, press `6` and choose **Set today's date**. Repeat after every power cut: the Raspberry Pi has no battery clock.

To try the tool with example data, choose **Import an astronaut from a backup file** on the start screen and pick `sample-data.json`.

## 2. Every day

Start your session, press `2` and do the check-in. Then press `1`: the Overview tells you if you are OK and what to do.

An **Act** alarm repeats every 8 seconds until someone presses `A`. The alert stays on screen, and it sounds again at your next session if the problem is still there.

## 3. Every week: backup (1 minute per astronaut)

1. Plug in **USB stick A**.
2. Press `6`, choose **Make a backup file**, press `Enter`, and save it to the stick.
3. Next week use **USB stick B**. Alternate A and B, and store them in different modules.

Keep a copy of `index.html` on both sticks: the whole tool is that one file. The Overview reminds you when your last backup is more than 7 days old.

## 4. If something breaks

| Problem | What to do |
|---|---|
| Screen is dead | Alarms still sound. Move the cable to another screen, or use the spare device. |
| Keyboard is dead | Use the mouse: everything on screen can be clicked. |
| Pi or drive is dead | On the spare device, open `index.html` from the USB stick. Choose **Import an astronaut from a backup file**, pick your newest backup, then set the date. |
| "The screen had a problem" | Press `R`. Saved measurements are kept. |
| "This device is NOT saving" | Make a backup file now (`6`), then move to the spare device. |
| "The clock looks wrong" / "Date is wrong" | Press `6`, choose **Set today's date**. Statuses stay "No data" until you do. |
| Import says "Nothing was changed" | The file is damaged. Use the other USB stick. |
| No sound | Check speaker and volume, test the sounds (`6`). Alerts are always on screen too. |

## 5. Good to know

- Each device keeps its own copy. Data moves between devices only through a backup file.
- Loading a backup replaces that astronaut's data on the device. The tool asks first, and the default answer is Cancel.
- Do not clear Chromium's browsing data and do not use an incognito window: saved measurements would be lost. Backup files are not affected.
