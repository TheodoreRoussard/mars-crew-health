# Crew Health Monitor

**An offline astronaut health dashboard for long-duration missions to Mars.**

Built for the **2026 NASA Space Apps Challenge**, addressing [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/).

Our goal is simple: help a crew member without medical training answer **“Am I OK, and what should I do now?”** at a glance. Crew Health Monitor brings daily measurements, symptoms, personal baselines, trends, and suggested next steps into one interface that works without an internet connection.

> **Hackathon prototype:** the thresholds and suggested actions are illustrative and have not been clinically validated. The sample data is fictional. This project supports a demonstration of crew health monitoring; it is not a medical device or an operational flight system.

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
3. Choose **Import an astronaut from a backup file** and select `sample-data.json`.
4. Select **Sam Okafor** and press **Enter** to start the session and enable audio.
5. Explore the overview, open an alert, and inspect its 30-day trend.

The demo contains **30 days of fictional measurements**. On import, its dates shift automatically so that the latest entry falls on today. The latest readings intentionally trigger alerts, including a high-temperature alert. Press **A** to acknowledge the alarm; the underlying health status remains visible.

To start with an empty profile, choose **Add a new astronaut**, enter a name, select it, and open **Check-in**.

## What works today

- **Guided check-ins:** enter one measurement or symptom response at a time, with immediate interpretation. Daily checks and weekly checks are scheduled separately.
- **19 indicators:** vital signs, symptoms, fitness, wellbeing, radiation, cabin CO2, and medical-kit readiness.
- **Four clear statuses:** Nominal, Watch, Act, and No data, represented by words, colors, and shapes.
- **Action-oriented overview:** prioritizes alerts and shows a next step and its responsible person.
- **Body and Hazards views:** explore measurements by body region or by the five mission hazards.
- **Personal baselines and trends:** heart rate, body mass, and grip strength are evaluated relative to a baseline; indicator cards show 30-day SVG charts.
- **Visual and audible alerts:** distinct Watch and Act sounds; Act alarms repeat every eight seconds until acknowledged. Unresolved alerts are announced again when a new session starts.
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
| **6** | Backup, profile management, date correction, and sound tests |
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
| Suit operations | Pressure-change symptoms, spacewalk/suit injuries |
| Wellbeing | Sleep duration, mood |
| Environment and readiness | Daily radiation dose, cabin CO2, medical kit |

Eyesight, grip strength, urine calcium, and medical-kit checks are scheduled weekly; the remaining indicators are scheduled daily. The Hazards view groups indicators under **space radiation, hostile closed environment, isolation and confinement, distance from Earth, and altered gravity**.

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

Use **6 → Make a backup file** to export the active astronaut's profile. Each device keeps its own data; there is no automatic synchronization. Importing a backup for an existing profile asks before replacing its data, with **Cancel** selected by default.

The app includes a backup reminder and a date-offset setting for devices with an incorrect clock. Local storage and exported JSON files are not encrypted by the application.

See [SETUP.md](SETUP.md) for the full setup, sound testing, backup rotation, and recovery procedure.

## NASA research and current limitations

[DATA-SOURCES.md](DATA-SOURCES.md) documents the team's exploration of NASA datasets, including ISS radiation dosimetry and historical EVA records. It is currently written in French and separates reviewed datasets, interpretations, and possible improvements.

These datasets provide research context; they are **not loaded by the application**, and the prototype's thresholds are **not NASA-validated clinical limits**. The demo uses invented values rather than astronaut medical records.

Current limitations include manual data entry, one stored value per indicator per day, systolic-only blood pressure, no baseline-entry screen, and no authentication or encrypted storage. Clinical rules and suggested actions require specialist review before any real-world use.

Potential next steps identified in the research notes include pre-flight baseline entry, radiation location and cumulative-dose tracking, event-based EVA check-ins, and richer measurement context. These are future improvements, not implemented features.

## Repository guide

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Complete offline application |
| [sample-data.json](sample-data.json) | Fictional 30-day demonstration profile |
| [SETUP.md](SETUP.md) | Setup, daily use, backups, and recovery |
| [RATIONALE.md](RATIONALE.md) | Design decisions and risk coverage |
| [DATA-SOURCES.md](DATA-SOURCES.md) | NASA dataset research and proposed improvements |

Developed as a participant project for NASA Space Apps Challenge 2026.
