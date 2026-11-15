# Crew Health Monitor: setup and backup procedure

Print this page and keep it next to the screen. All keys are also shown on screen.

## 1. First setup (once per device)

1. Copy `index.html` to the device and open it in Chromium. Press `F11` for full screen.
2. In Chromium settings, under Downloads, turn on **"Ask where to save each file"**, so backups can go straight to the USB stick.
3. The first screen is the **crew page**. Press `S` for Settings.
4. Choose **Add a new astronaut**, type the name, press `Enter`. The optional personal-baseline form opens: enter known references with their date and source, or choose Cancel / skip. Repeat for each crew member.
5. Test both sounds in Settings. Set the speaker volume so they are heard across the room.
6. Check the date at the top right. If it is wrong, choose **Set today's date**. Repeat after every power cut: the Raspberry Pi has no battery clock.

To try the tool with an example crew, press `B`, choose **Load a backup file** and pick `sample-data.json`.

## 2. Every day

| Key | What it does |
|---|---|
| `0` | Crew page: every astronaut at a glance |
| `Tab` | Next astronaut (the names are tabs in the top bar) |
| `Enter` | Open the selected astronaut, or confirm |
| `1` to `4` | Inside a profile: Overview, Check-in, Body & hazards, Trends |
| `Esc` | Back |
| `A` | Acknowledge an alarm |
| `B` | Backup: make or load a backup file (from the crew page) |
| `S` | Settings: astronauts, date, sound tests (from the crew page) |

Open your profile, press `2`, then either answer everything that is due or pick a single question.

The sound turns on at the first key press after the page is opened. An **Act** alarm of any astronaut repeats every 8 seconds, on every screen, until someone presses `A`. On the crew page, each affected astronaut's card shows a red or yellow border and pulses with its alert sound. Reduced-motion settings keep the border steady. `A` stops sound and pulses; the medical status and advice remain. There is no global alert banner: press `0` to locate the affected crew member. An unresolved alert sounds again the next day.

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
- Loading a backup replaces the astronauts it contains. The tool lists them and asks first; the default answer is Cancel. A backup file always holds the whole crew. Older one-astronaut backup files can still be loaded.
- To remove an astronaut from this device (crew change, test profile), press `S` and choose **Remove an astronaut**. The tool asks twice and the default answer is Cancel. Make a backup first: removing erases that person's measurements on this device.
- Do not clear Chromium's browsing data and do not use an incognito window: saved measurements would be lost. Backup files are not affected.


## 6. Demo and personal baselines

- On the crew page, press **D** to choose Routine check, Progressive change, or Radiation alert. No file import is needed. The fictional demo workspace is temporary: changes are not written to browser storage and backup export is disabled.
- In a demo, press **D** to switch scenarios or **X** to restore your saved crew. Reloading also returns to saved data.
- Inside a profile, press **B** to enter heart-rate, body-mass, and grip-strength references. Enter the measurement date and source/context. Blank fields retain existing references; Cancel / skip leaves all references unchanged.
- Changed references update statuses immediately. Their date and source survive JSON backup/export and import. Existing backups without this metadata remain supported.
- Without an explicit baseline, the first 3–7 readings provide a provisional reference. This is not a validated pre-flight baseline.
- Open an indicator card to read **Why this status?**: the value, applicable band, and personal or rolling reference when used. All rules and actions remain illustrative.


## 7. Repeat a measurement or remove a mistaken entry

1. Open the astronaut, press `2`, and choose any question to record it again. Earlier answers stay in history; the new answer receives the device timestamp.
2. Open the indicator card and click **History / remove a reading**, or press `H` in the profile for all readings.
3. Find the exact date, time, indicator, and value. Choose **Remove**, then confirm. Cancel is the default.
4. The reading is excluded from calculations. The previous active reading is used with its original age, or **No data** if none remains. Other measurements are unchanged.
5. Use **Restore** on an excluded row to undo removal. It keeps its original position in the history.

Daily trends and radiation totals use one final active reading per day; they do not add repeated daily-dose readings together. Old measurements display **Time not recorded**. Check the device clock before recording new data. A date correction does not rewrite timestamps already captured.

Backups use format version 2 and preserve all readings and removal markers. Version 1 backups can still be loaded. Use the updated application to restore a version 2 backup. The updated app saves to a separate browser-storage key; an older app build will not see new version 2 data.
