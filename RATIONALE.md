# Crew Health Monitor: design rationale

**Goal.** A crew member who is not a doctor looks at the screen once a day and knows within five seconds: "Am I OK, and what should I do now?" Simplicity comes first, reliability second.

| Feature | Risk, hazard or pain point it answers |
|---|---|
| Overview headline ("YOU ARE OK", "KEEP WATCH", "ACT NOW") with one action, before any number. An action banner stays on every screen while an alert exists | Astronaut does not understand the information |
| Crew page: one card per astronaut with status, top alert, action and check-in state. The grid re-arranges for any crew size. Alarms sound for the whole crew on every screen | Central room, shared screen: anyone walking past sees who needs help. Screen breaks: the sound still covers everyone |
| Top bar with one tab per astronaut, like browser tabs; `0` or the Crew tab leaves a profile | One way to move between people, always visible |
| Four statuses only, each with a colour, a shape and a word | Same. Still readable for colour-blind crew or on a dim screen |
| Words before numbers ("Slight fever", then "37.9 °C") and a personal baseline | Astronauts are not doctors. Bodies adapt in space, so "normal for you" matters (cardiovascular, fitness, nutrition) |
| One action as a verb, with an owner: you, crew medical officer, or flight surgeons on Earth | Removes the "what now?" decision |
| Radiation is judged against the crew member's own usual level (median of the previous 7 days), with a fixed storm limit as a backstop, and the card shows the mission total | Hazard: space radiation. A year of ISS dosimetry shows a very stable background, so the departure is the signal; dose adds up over the mission |
| Spacewalks are logged as events: "suit work since last check-in?", then duration and three symptom questions, repeated daily until the symptom is gone | Risk: EVA injury. NASA's EVA log records one line per sortie; its most frequent crew problems are suit CO2, eye irritation and fogging, heat, gloves |
| Earth escalations state the delay (about 20 min each way) and what to do while waiting | Hazard: distance from Earth |
| Guided daily check-in: one measurement per screen, interpreted at once. A question list lets you answer everything due or any single question. Weekly checks appear only when due | Long mission, daily use, no medical training |
| Body view and Hazards view open the same card | One layout to learn. All 11 risks and 5 hazards are reachable |
| 30-day SVG trend chart with baseline line. Point shape shows status | Slow changes: bone, body mass, SANS, fitness |
| Two distinct sounds. Watch: two soft notes. Act: fast harsh pulses every 8 s until acknowledged. Always with a banner | Screen breaks, or nobody is looking |
| The first key press or click turns the sound on; a notice says so until then | Browsers allow sound only after a user action |
| "No data" for missing, impossible or old values, and for all values when the clock is behind the data | Fail safe: an old "OK" is a wrong status |
| Single `index.html`: no network, no libraries, no build | Runs from `file://` on a Raspberry Pi 4. Fewer parts to fail |
| JSON backup of the whole crew or of one astronaut, in Settings on the crew page. Loading is validated before anything is replaced. Confirmation defaults to Cancel | Pi, drive, keyboard or cable breaks. A bad file cannot erase good data |
| Backup reminder after 7 days | A backup only helps if it is recent |
| Every key shown in the footer. Every item is also clickable | Keyboard-only use. A mouse still works if the keyboard fails |
| Crash screen ("data is safe, press R"), save-failure notice, "Set today's date" | Software bugs. A Pi has no battery clock and space has no network time |

**Risk coverage.** Immune: temperature; skin, mouth and wounds. Sensorimotor: dizziness and balance. Cardiovascular: resting heart rate, blood pressure. Decompression sickness: pressure-change symptoms. Host–microorganism: stomach and gut. Hypoxia: blood oxygen. Nutrition: body mass. EVA: sortie log, duration, breathing and heat, eyes and skin, hands and shoulders. Fitness: exercise minutes, grip strength. SANS: eyesight. Bone: urine calcium strip.

**Hazard coverage.** Radiation: dosimeter dose. Closed environment: cabin CO2. Isolation and confinement: mood, sleep. Distance from Earth: medical kit check. Altered gravity: heart, balance, eyes, grip, bone.

**NASA data used.** See `DATA-SOURCES.md`. The radiation and spacewalk-duration cards show a NASA reference line (ISS dosimetry 2014, EVA log 1965-2013), and the sample crew uses the real ISS daily doses and real spacewalk durations.

**Limits.** All thresholds are illustrative design values, not validated clinical limits; flight surgeons must replace them (one table at the top of the script). Blood pressure uses the top number only. The tool supports the crew medical officer and does not replace them.
