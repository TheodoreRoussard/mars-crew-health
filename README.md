# Crew Health Monitor

**An offline astronaut health dashboard for long-duration missions to Mars.**

Built for the **2026 NASA Space Apps Challenge**, addressing [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/).

Our goal is simple: help a crew member without medical training answer **“Am I OK, and what should I do now?”** at a glance. Crew Health Monitor brings daily measurements, symptoms, personal baselines, trends, and suggested next steps into one interface that works without an internet connection.

> **Hackathon prototype:** the thresholds and suggested actions are illustrative and have not been clinically validated. Demonstration profiles are not real astronaut medical records. This project supports a demonstration of crew health monitoring; it is not a medical device or an operational flight system.

## Why this project?

Long-duration space missions combine radiation exposure, altered gravity, isolation, a closed living environment, and distance from Earth. Crews need to notice changes in their health and understand what needs attention when immediate ground support is unavailable.

The interface puts plain-language status and the next action before raw numbers. Each action identifies who should handle it: the astronaut, the crew medical officer, or flight surgeons on Earth. Earth-directed actions include a communication-delay reminder and guidance to display while waiting.

## Try the demo

No installation, package manager, build step, server, or API key is required.

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
- **Body and Hazards views:** explore measurements by body region or by the five mission hazards.
- **Personal baselines and trends:** heart rate, body mass, and grip strength are evaluated relative to a baseline; indicator cards show 30-day SVG charts.
- **Visual and audible alerts:** distinct Watch and Act sounds; Act alarms repeat every eight seconds until acknowledged. Unresolved alerts are announced again on the next day; alarms cover the whole crew on every screen.
- **Local profiles and backups:** measurements are saved in the browser, with JSON export/import for transfer between devices.
- **Data-quality handling:** missing or stale readings, missing baselines, and a device date behind the recorded data are surfaced instead of presenting a normal status.
- **Keyboard and mouse controls:** navigation shortcuts remain visible in the footer.

Measurements are entered manually. The prototype does not connect directly to sensors or transmit messages to Earth.

## Controls

| Key | View or action |
| --- | --- |
| **1** | Overview |
| **2** | Check-in |
| **3** | Body |
| **4** | Hazards |
| **5** | Trends |
| **0** | Crew page |
| **Tab / Shift+Tab** | Next / previous crew tab |
| **B** | On the crew page: Backup (make or load a backup file). Inside a profile: personal baselines |
| **S** | Settings from the crew page: profiles, date, and sound tests |
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

Eyesight, grip strength, urine calcium, and medical-kit checks are scheduled weekly; routine indicators are scheduled daily. Suit-work follow-up questions appear after a logged event; unresolved symptoms are checked again. The Hazards view groups indicators under **space radiation, hostile closed environment, isolation and confinement, distance from Earth, and altered gravity**.

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

## NASA research and current limitations

[DATA-SOURCES.md](DATA-SOURCES.md) documents the team's exploration of NASA datasets, including ISS radiation dosimetry and historical EVA records. It is currently written in French and separates reviewed datasets, interpretations, and possible improvements.

The application does not fetch NASA datasets over the network, and its thresholds are **not NASA-validated clinical limits**. The built-in demos use invented values. The separate sample crew combines fictional health readings with historical ISS radiation values and EVA durations, as documented in its generator; these values can be loaded through the sample file, but they are not an astronaut medical record.

Current limitations include manual data entry, one stored value per indicator per day, systolic-only blood pressure, and no authentication or encrypted storage. Clinical rules and suggested actions require specialist review before any real-world use.

Potential next steps include recording sensor location and measurement context, supporting multiple readings per day, and validating rules with specialists. Radiation cumulative-dose tracking and event-based EVA follow-ups are already implemented.

## Repository guide

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Complete offline application |
| [sample-data.json](sample-data.json) | Four-person example crew with documented historical radiation and EVA inputs |
| [SETUP.md](SETUP.md) | Setup, daily use, backups, and recovery |
| [RATIONALE.md](RATIONALE.md) | Design decisions and risk coverage |
| [DATA-SOURCES.md](DATA-SOURCES.md) | NASA dataset research and proposed improvements |

## Development checks

Node.js is needed only for development checks, not to run the app. No package installation is required:

```sh
npm test
```

The checks cover offline packaging, indicator rules, sample reproducibility, crew navigation, alarms, keyboard input, demo isolation, baseline validation/provenance, and status explanations. Browser rendering still needs a manual check in Chromium, particularly at the target screen size.

Developed as a participant project for NASA Space Apps Challenge 2026.

