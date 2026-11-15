# Crew Health Monitor

**An offline astronaut health dashboard for long-duration missions to Mars.**

Built for the **2026 NASA Space Apps Challenge**, addressing [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/).

Our goal is simple: help a crew member without medical training answer **“Am I OK, and what should I do now?”** at a glance. Crew Health Monitor brings daily measurements, symptoms, personal baselines, trends, and suggested next steps into one interface that works without an internet connection.

**Try it now:** [mars-crew-health.vercel.app](https://mars-crew-health.vercel.app) (no login, no install), then press **D** for a demo scenario.

| | |
| --- | --- |
| **Challenge** | [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/) |
| **Live app** | https://mars-crew-health.vercel.app |
| **Source code** | https://github.com/TheodoreRoussard/mars-crew-health |
| **NASA data** | ISS radiation dosimetry (2014) and the US/Russian spacewalk log (1965–2013): see [NASA data used](#nasa-data-used) |
| **Use of AI** | Disclosed in [Use of AI tools](#use-of-ai-tools) |

> **Hackathon prototype:** the thresholds and suggested actions are illustrative and have not been clinically validated. Demonstration profiles are not real astronaut medical records. This project supports a demonstration of crew health monitoring; it is not a medical device or an operational flight system.

## Why this project?

Long-duration space missions combine radiation exposure, altered gravity, isolation, a closed living environment, and distance from Earth. Crews need to notice changes in their health and understand what needs attention when immediate ground support is unavailable.

The interface puts plain-language status and the next action before raw numbers. Each action identifies who should handle it: the astronaut, the crew medical officer, or flight surgeons on Earth. Earth-directed actions include a communication-delay reminder and guidance to display while waiting.

## Try the demo

No installation, package manager, build step, server, or API key is required. The quickest way is the [live app](https://mars-crew-health.vercel.app); it is the same `index.html` as in this repository and runs entirely in your browser. To run it locally instead:

1. Download the repository using **Code → Download ZIP**, then extract it. Alternatively:

   ```sh
   git clone https://github.com/TheodoreRoussard/mars-crew-health.git
   cd mars-crew-health
   ```

2. Open `index.html` in Chromium or Chrome. Press **F11** for full screen.
3. On the crew page, press **D** (or click **Start demo**).
4. Choose one of the three built-in scenarios:

   | Scenario | What to explore |
   | --- | --- |
   | Routine check | No alerts in the recorded checks; explore 30-day trends. |
   | Progressive change | Body mass and grip strength fall relative to pre-flight references. Open an alert to see the calculation. |
   | Radiation alert | A dose spike triggers Act. Inspect the applicable rule, then press **A** to acknowledge the sound. |

The built-in scenarios use **fictional data in a temporary workspace**. They do not overwrite saved crew profiles or write changes to browser storage. Press **D** to change scenario or **X** to exit and restore your crew. Reloading also leaves demo mode. Backup export is disabled in demo mode.

For the separate four-person example crew, open **Backup (B)** from the crew page, choose **Load a backup file**, and select `sample-data.json`. Its dates shift so that the final sample day falls on today. This import persists in browser storage and asks before replacing matching profiles.

To start with an empty profile, press **Enter** on an empty crew page, or choose **Add a new astronaut** in Settings. The optional personal-baseline form opens after entering a name; complete it or choose **Cancel / skip**.

## Personal references and explained alerts

Inside any profile, press **B** to enter known resting-heart-rate, body-mass, and grip-strength references. Add the measurement date and source/context, such as a pre-flight assessment. Blank fields retain existing references; invalid entries prevent the whole form from being saved. Changed references immediately recalculate statuses and keep their provenance through backup and restore.

When no explicit reference exists, the app uses the first 3–7 available readings as a **provisional** baseline. This is not equivalent to a validated pre-flight assessment. Older backups without reference dates or sources remain supported.

Each indicator card now includes **Why this status?** It explains the recorded value, selected symptom response or applicable numeric band, and the baseline change or radiation ratio when relevant. Radiation explanations distinguish the rolling reference, fixed-limit fallback, and absolute backstop. The overview says **No alerts in your recorded checks**, rather than making a general health assurance.

## What works today

- **Guided check-ins:** enter one measurement or symptom response at a time, with immediate interpretation. Daily checks and weekly checks are scheduled separately.
- **23 indicators:** vital signs, symptoms, fitness, wellbeing, radiation, cabin CO2, and medical-kit readiness.
- **Four clear statuses:** OK, Watch, Act, and No data, represented by words, colors, and shapes.
- **Action-oriented overview:** prioritizes alerts and shows a next step and its responsible person.
- **Body & hazards view:** every measurement listed once by body system, beside tiles for six body systems and the five mission hazards. The selected measurement lights the tiles it belongs to.
- **Personal baselines and trends:** heart rate, body mass, and grip strength are evaluated relative to a baseline; indicator cards show 30-day SVG charts.
- **Visual and audible alerts:** affected crew cards show red or yellow borders. Only Act makes a sound; Watch is silent. Finite visual pulses share the sound's start time; Act repeats every eight seconds until acknowledged with **A**. Reduced-motion users get steady borders. Acknowledging stops the pulses and sound without clearing the underlying status. Sound still covers the whole crew on every screen; the global alert banner has been removed.
- **Prioritized Trends:** Act first, then Watch, OK, and No data; indicators within each group are alphabetical. Body & hazards and Trends use text statuses: green OK, amber Watch, red Act and gray No data. Their lists, headings and detail cards omit status pictograms; astronaut tabs keep their original symbols.
- **Concrete next steps:** advice starts with an immediate action and includes medical escalation where appropriate. Low temperature and fever, or mass gain and loss, get different guidance. See [action guidance and sources](ACTION-GUIDANCE.md).
- **Local profiles and backups:** measurements are saved in the browser, with JSON export/import for transfer between devices.
- **Data-quality handling:** missing or stale readings, missing baselines, and a device date behind the recorded data are surfaced instead of presenting a normal status.
- **Keyboard and mouse controls:** navigation shortcuts remain visible in the footer.

Measurements are entered manually. The prototype does not connect directly to sensors or transmit messages to Earth.

## Controls

| Key | View or action |
| --- | --- |
| **1** | Overview |
| **2** | Check-in |
| **3** | Body & hazards |
| **4** | Trends |
| **0** | Crew page |
| **Tab / Shift+Tab** | Next / previous crew tab |
| **B** | On the crew page: Backup (make or load a backup file). Inside a profile: personal baselines |
| **S** | Settings from the crew page: profiles, date, and sound test |
| **Sound button** | Click the button in the top bar to turn sound on / off |
| **D** | Start demo from the crew page; switch scenario during a demo |
| **X** | Exit demo and restore the saved crew |
| **↑ / ↓** | Choose an item |
| **Enter** | Open or confirm |
| **Esc** | Go back or cancel |
| **A** | Acknowledge pending alarms |

## Health indicators

| Area | Measurements and checks |
| --- | --- |
| Heart and breathing | Blood oxygen, resting heart rate, systolic blood pressure |
| Immunity and nutrition | Body temperature, skin/mouth/wounds, stomach/gut symptoms, body mass |
| Movement and fitness | Dizziness/balance, exercise duration, grip strength |
| Eyes and bones | Eyesight, urine calcium strip |
| Suit operations | Pressure-change symptoms, suit-work event, duration, breathing/heat, eyes/skin, hands/shoulders |
| Wellbeing | Sleep duration, mood |
| Environment and readiness | Daily radiation dose, cabin CO2, medical kit |

Eyesight, grip strength, urine calcium, and medical-kit checks are scheduled weekly; routine indicators are scheduled daily. Suit-work follow-up questions appear after a logged event; unresolved symptoms are checked again. The hazard tiles of the Body & hazards view cover **space radiation, hostile closed environment, isolation and confinement, distance from Earth, and altered gravity**.

## Multiple readings and correcting mistakes

You can answer any check-in question again during the day. **Every new answer is appended with the device timestamp**, rather than replacing the previous answer. The latest active reading drives the current status. Charts plot **every active reading**, including repeated measurements on the same day. Provisional baselines and radiation totals still use the latest active value for each day so repeated checks do not count as extra days or double-count the daily radiation dose.

Charts show readings from the last 30 days, with the time axis fitted to the available measurements. Horizontal positions combine the app's entry date with the capture time in the device's current timezone. Hover a point for its exact value and time, or press **H** to inspect the history when points overlap. Older readings without a timestamp are positioned at midday and labelled **Time not recorded**; this position is not a recorded measurement time. A dashed segment connects nearby readings when either capture time is unknown, including a new measurement after an untimed same-day import. It shows the value change without implying an exact time. Lines still break across long unmeasured gaps or when known capture times move backwards.

Numeric charts automatically scale to include all plotted values and the baseline, with padding around the extremes. The scale stays linear: widely separated values remain visible, but small changes can look flat beside a large outlier. Exact values remain available in the point labels and history. Removed readings disappear from the chart; restoring them brings their points back.

Open an indicator card and click **History / remove a reading**, or press **H** inside a profile to see all indicators. Each row shows its date, time, value, and whether it is the latest active reading for that day.

- Click **Remove** next to the erroneous reading. Confirm the exact indicator, value, and time; **Cancel** is selected by default.
- Only that reading is excluded from calculations. The previous active reading becomes effective, retaining its original date and age; if none remains, the indicator shows **No data**.
- The excluded entry stays visible with a **Restore** button. Restoring it returns it to its original position, without making an old reading appear new.
- Keyboard navigation: **Up/Down** selects a reading, **Enter** opens its Remove/Restore confirmation, **Esc** returns to the previous screen.

Timestamps come from the device clock. The displayed day follows the application's date setting; correcting that setting does not rewrite existing timestamps. Older data is retained with **Time not recorded**, because no original capture time was stored.

Backups now use **format version 2** to preserve the complete journal, including removed entries. Version 1 backups remain importable. Restore version 2 files with this version of the app or newer; older builds reject them instead of silently dropping history. Browser storage migrates by reading the existing version 1 data and saving subsequent changes under a separate version 2 key. Keep a backup before returning to an older build: it cannot see new version 2 measurements.

## Technical approach

The complete application lives in **`index.html`**:

- HTML and CSS for the interface.
- Vanilla JavaScript for check-ins, status rules, profiles, and navigation.
- Inline SVG for the body illustration, status symbols, and charts.
- Web Audio API for generated alarm sounds.
- Browser `localStorage` for persistence and JSON files for backups.

There are no external libraries, fonts, services, or network requests in the application. It is designed to run locally in Chromium, including on a Raspberry Pi 4.

Indicator definitions, ranges, schedules, status bands, and suggested actions are centralized in the `INDICATORS` array. The `evaluate()` function converts a reading into a status. Imported profiles can include personal baselines; otherwise, the app calculates them from the first available readings, requiring at least three and using up to seven.

## Data and backups

Use the same browser profile and file location for daily use. Do not rely on private browsing or clear browser storage: doing so can remove saved measurements.

From the crew page, use **B → Make a backup file** to export the whole crew in one file. Older one-astronaut backup files can still be loaded. Each device keeps its own data; there is no automatic synchronization. Importing a backup for an existing profile asks before replacing its data, with **Cancel** selected by default.

The app includes a backup reminder and a date-offset setting for devices with an incorrect clock. Local storage and exported JSON files are not encrypted by the application.

See [SETUP.md](SETUP.md) for the full setup, sound testing, backup rotation, and recovery procedure.

## NASA data used

We searched the [NASA open data catalogue](https://data.nasa.gov/) (about 60 keyword searches, one or more per risk and hazard in the challenge brief, on 14 November 2026) and analysed two datasets in depth. Both directly shaped how the app judges a reading.

### ISS radiation dosimetry (Tissue Equivalent Proportional Counter, 2014)

| Finding | Value |
| --- | --- |
| Days analysed (at least 80 % coverage) | 352 |
| Median daily dose equivalent, usual location | 0.68 mSv/day (5th–95th percentile 0.62–0.75) |
| Day-to-day variation at a fixed location | about 6 % of the mean (median change 0.02 mSv) |
| Same module, other location (May 2014) | 0.83 mSv/day, about 20 % higher |
| Share of dose from the radiation belts / galactic cosmic rays | 52 % / 48 % (7 % / 93 % of the time) |

**How it is used:**

- Because the background dose is so stable at a fixed location, a jump away from your *own* usual level is the real signal. The radiation rule therefore compares today's dose with the median of the previous 7 days, keeps a fixed storm limit as a fallback, and keeps an absolute backstop.
- The radiation card shows the NASA reference range and the mission's running total.
- The 20 % location effect is why recording where each measurement is taken is our first next step.
- The four-person sample crew (`sample-data.json`) replays the 30 real daily doses from 16 October to 14 November 2014.

These values come from low Earth orbit. On the way to Mars there are no radiation belts and no magnetic shielding, so the background level will differ, but the method (a stable personal baseline, alerting on the departure from it) still applies.

### Extravehicular activity (EVA) log, United States and Russia, 1965–2013

| Finding | Value |
| --- | --- |
| Spacewalks logged | 375 (368 with a recorded duration) |
| Duration | median 6 h; 90 % under 7 h 21 min; longest 8 h 56 min |
| Crew issues reported in the notes | suit CO2 (9 sorties), ammonia contamination (about 6), fogging or eye irritation (6), damaged gloves (4), fatigue or overheating (2), water in the helmet (1) |

**How it is used:**

- NASA records spacewalks as one line per sortie, so the app logs them as **events**: “suit work since the last check-in?”, then the duration and three symptom questions, repeated daily until the symptom clears.
- The follow-up questions (breathing and heat, eyes and skin, hands and shoulders) target the problems the log reports most often.
- The spacewalk-duration card shows the NASA reference distribution.
- The sample crew uses two real sortie durations: EVA 227 (30 August 2012, 8.3 h) and EVA 231 (9 July 2013, 6.1 h).

### Other NASA datasets reviewed

The catalogue also holds Curiosity's radiation measurements on Mars (MSL RAD), ISS microbial surveys, crew immune and gene-expression studies, the MARS500 isolation study and bed-rest studies. They justify why indicators such as immunity, isolation and fitness are tracked, but they come from lab samples analysed on the ground, so they do not give thresholds that can be read on board. Astronaut clinical measurements (blood pressure, pulse, mass, vision, sleep) are not on the open portal; NASA's [Life Sciences Portal](https://nlsp.nasa.gov) points to the archive that holds them.

The full working notes, including the survey of every reviewed dataset, are in [DATA-SOURCES.md](DATA-SOURCES.md).

## Limitations

The application does not fetch NASA datasets over the network, and its thresholds are **not NASA-validated clinical limits**. Flight surgeons must replace them; they live in one table at the top of the script. The built-in demos use invented values. The sample crew combines fictional health readings with the historical ISS radiation values and EVA durations described above; it is not an astronaut medical record.

Other current limitations:

- Data entry is manual.
- Blood pressure records the systolic value only.
- There is no authentication or encrypted storage.
- Clinical rules and suggested actions require specialist review before any real-world use.

## Next steps

- Record the sensor location and measurement context with each reading (motivated by the 20 % location effect in the ISS data).
- Accept readings directly from sensors.
- Validate the rules with flight surgeons, using NASA's life-sciences data archive.
- Track cabin oxygen alongside blood oxygen and cabin CO2.

Radiation cumulative-dose tracking, event-based spacewalk follow-ups and multiple readings per day are already implemented.

## References and third-party resources

The application contains **no third-party code, libraries, fonts, images or sounds**. All icons, the body illustration and the charts are inline SVG made for this project, and alarm sounds are generated with the Web Audio API.

Data and documents used:

| Resource | Used for |
| --- | --- |
| NASA, ISS Tissue Equivalent Proportional Counter dose data, 2014 ([data.nasa.gov](https://data.nasa.gov/)) | Radiation rule, reference line, sample crew doses ([extract](tools/nasa-iss-tepc-daily-dose-2014.json)) |
| NASA, Extravehicular Activity (EVA) log, US and Russia, 1965–2013 ([data.nasa.gov](https://data.nasa.gov/)) | Event-based spacewalk follow-up, duration reference, sample sorties |
| NASA, [Natural and Induced Environments (Human Integration Design Handbook, vol. 2)](https://www.nasa.gov/reference/6-0-natural-and-induced-environments-vol-2/) | Radiation sheltering guidance |
| NASA, [Life Sciences Portal](https://nlsp.nasa.gov) | Pointer to astronaut clinical data for future validation |
| NHS: [fever in adults](https://www.nhs.uk/symptoms/fever-in-adults/), [dehydration](https://www.nhs.uk/conditions/dehydration/), [dizziness](https://www.nhs.uk/symptoms/dizziness/), [cuts and grazes](https://www.nhs.uk/conditions/cuts-and-grazes/), [vision loss](https://www.nhs.uk/conditions/vision-loss/) | Wording of suggested first actions |
| St John Ambulance, [hypothermia](https://www.sja.org.uk/first-aid-advice/hypothermia/); NSW Health, [hypothermia](https://www.health.nsw.gov.au/environment/factsheets/Pages/hypothermia.aspx) | Low-temperature guidance |
| American Heart Association, [monitoring your blood pressure at home](https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/monitoring-your-blood-pressure-at-home) | Blood pressure re-measurement guidance |

See [ACTION-GUIDANCE.md](ACTION-GUIDANCE.md) for how each source maps to an action.

## Use of AI tools

In line with the NASA Space Apps rules on AI (“Super Intelligence”) tools:

- **Code, tests and documentation:** the team used Claude (Anthropic), through Claude Code, as a coding assistant to write, review and refactor parts of `index.html`, the test scripts in `tests/` and the Markdown documentation. Commits produced with its help carry a `Co-Authored-By: Claude` trailer in the Git history.
- **Presentation:** the slide deck was drafted with the same assistant. Its screenshots are real captures of the app.
- **Data:** no data was generated by AI. NASA values come from the datasets listed above, and the fictional demo and sample health readings are produced by deterministic code (`tools/make-sample.js`, `demoProfile()` in `index.html`).
- **Images, video and audio:** none were generated by AI.

The team reviewed, tested (`npm test`) and takes responsibility for all AI-assisted content.

## Repository guide

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Complete offline application |
| [sample-data.json](sample-data.json) | Four-person example crew with documented historical radiation and EVA inputs |
| [SETUP.md](SETUP.md) | Setup, daily use, backups, and recovery |
| [RATIONALE.md](RATIONALE.md) | Design decisions and risk coverage |
| [ACTION-GUIDANCE.md](ACTION-GUIDANCE.md) | Sources behind each suggested action |
| [DATA-SOURCES.md](DATA-SOURCES.md) | Full NASA dataset survey, analysis and gaps between NASA practice and the tool |
| [tools/](tools/) | Sample-crew generator and the NASA ISS dose extract it uses |

## Development checks

Node.js is needed only for development checks, not to run the app. No package installation is required:

```sh
npm test
```

The checks cover offline packaging, indicator rules, sample reproducibility, crew navigation, alarms, keyboard input, demo isolation, baseline validation/provenance, and status explanations. Browser rendering still needs a manual check in Chromium, particularly at the target screen size.

Developed as a participant project for NASA Space Apps Challenge 2026.



