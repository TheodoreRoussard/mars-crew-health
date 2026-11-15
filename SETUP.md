# Crew Health Monitor: setup and backup procedure

Print this page and keep it next to the screen. All keys are also shown on screen.

## 1. First setup (once per device)

1. Copy `index.html` to the device and open it in Chromium. Press `F11` for full screen.
2. In Chromium settings, under Downloads, turn on **"Ask where to save each file"**, so backups can go straight to the USB stick.
3. The first screen is the **crew page**. Press `S` for Settings.
4. Choose **Add a new astronaut**, type the name, press `Enter`. Repeat for each crew member.
5. Test both sounds in Settings. Set the speaker volume so they are heard across the room.
6. Check the date at the top right. If it is wrong, choose **Set today's date**. Repeat after every power cut: the Raspberry Pi has no battery clock.

To try the tool with an example crew, press `B`, choose **Load a backup file** and pick `sample-data.json`.

## 2. Every day

| Key | What it does |
|---|---|
| `0` | Crew page: every astronaut at a glance |
| `Tab` | Next astronaut (the names are tabs in the top bar) |
| `Enter` | Open the selected astronaut, or confirm |
| `1` to `5` | Inside a profile: Overview, Check-in, Body, Hazards, Trends |
| `Esc` | Back |
| `A` | Acknowledge an alarm |
| `B` | Backup: make or load a backup file (from the crew page) |
| `S` | Settings: astronauts, date, sound tests (from the crew page) |

Open your profile, press `2`, then either answer everything that is due or pick a single question.

The sound turns on at the first key press after the page is opened. An **Act** alarm of any astronaut repeats every 8 seconds, on every screen, until someone presses `A`. The alert stays on screen. It sounds again the next day if the problem is still there.

## 3. Every week: backup (1 minute)

1. Plug in **USB stick A**.
2. On the crew page press `B`, choose **Make a backup file: whole crew**, and save it to the stick.
3. Next week use **USB stick B**. Alternate A and B, and store them in different modules.

Keep a copy of `index.html` on both sticks: the whole tool is that one file. Each profile reminds its owner when the last backup is more than 7 days old.

## 4. If something breaks

| Problem | What to do |
|---|---|
| Screen is dead | Alarms still sound. Move the cable to another screen, or use the spare device. |
| Keyboard is dead | Use the mouse: everything on screen can be clicked. |
| Pi or drive is dead | On the spare device, open `index.html` from the USB stick. Press `B`, choose **Load a backup file**, pick the newest backup, then set the date. |
| "The screen had a problem" | Press `R`. Saved measurements are kept. |
| "This device is NOT saving" | Make a backup file now, then move to the spare device. |
| "The clock looks wrong" / "Date is wrong" | In Settings, choose **Set today's date**. Statuses stay "No data" until you do. |
| Loading says "Nothing was changed" | The file is damaged. Use the other USB stick. |
| "Sound is off" | Press any key. If it says sound is not available, check the speaker. Alerts are always on screen too. |

## 5. Good to know

- Each device keeps its own copy. Data moves between devices only through a backup file.
- Loading a backup replaces the astronauts it contains. The tool lists them and asks first; the default answer is Cancel. To restore one person only, use that person's own backup file.
- To remove an astronaut from this device (crew change, test profile), press `S` and choose **Remove an astronaut**. The tool asks twice and the default answer is Cancel. Make a backup first: removing erases that person's measurements on this device.
- Do not clear Chromium's browsing data and do not use an incognito window: saved measurements would be lost. Backup files are not affected.
