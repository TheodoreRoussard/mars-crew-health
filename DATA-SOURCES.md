# NASA data usable for the Crew Health Monitor

Source: the `https://data.nasa.gov/dataset/` catalogue (36,518 datasets), queried on 14 November 2026 with about sixty keyword searches, one or more for each risk and hazard in the challenge brief.

Method and limits:

- The “why” and “context” columns restate the description NASA publishes for each dataset. When the record gives no reason, this is marked “(inferred)”: the reason is then our interpretation.
- For the keyword “astronaut” (178 results), every result was reviewed; for the other searches, only the first 12.
- Only two datasets were opened and analysed: ISS dosimetry (year 2014) and the extravehicular activity log. The others are described from their catalogue record.
- A keyword search can miss poorly described datasets. “Nothing found” means “nothing found with these keywords”, not “does not exist”.

## 1. Verdict by risk and hazard

| Risk or hazard | What the catalogue contains | Usable for the tool? |
|---|---|---|
| Space radiation | Continuous ISS dosimetry (TEPC), Curiosity dosimetry on the surface of Mars (RAD), small-satellite dosimeters. Six other RAD records (raw and calibrated data) have no attached file; we did not check whether they cover the Earth–Mars cruise | **Yes, directly** (real figures, see §3) |
| Extravehicular activity (EVA) | Log of 375 US and Russian spacewalks, 1965–2013 | **Yes, directly** (see §3) |
| Host–microorganism interactions | Microbes from ISS surfaces, the Dragon capsule, and crew skin, mouth and stool | For the sampling protocol, not for thresholds |
| Immune system | Astronaut saliva (viral reactivation), blood gene expression before and after flight, IgM antibody repertoire during a long flight, plasma RNA | To justify the indicator, not for thresholds |
| Isolation and confinement | MARS500 simulation (520 days, 6 people): mood, biochemistry, microbiome | For the protocol; raw sequencing data |
| Fitness, muscle | Human bed-rest studies of 21 days or more, with or without exercise and protein | To justify the indicator |
| Hypoxia | Bed rest in thin air (PlanHab study, equivalent to 4,000 m) | For measurement context |
| SANS (eyes) | Mice and rats: intraocular pressure, intracranial pressure, retina | Indirect (animal) |
| Bone | Rodents in flight: bone density and microarchitecture | Indirect (animal) |
| Cardiovascular | Mouse hearts after 30 days on the ISS, cultured cells | No |
| Nutrition | Lettuce crops on the ISS (harvested mass, nutrients, microbial safety) | No: nothing on what the crew eats |
| Sensorimotor | One dataset on snails | No |
| Altered gravity | Suspended rodents, human cells in simulated microgravity | No |
| Closed environment (CO2, air, water, noise) | Nothing on cabin air; the results are measurements of Earth’s atmosphere. One human dataset: gene expression in hair follicles of ISS astronauts | No |
| Decompression sickness | Nothing | No |
| Distance from Earth (medical kit, autonomy) | Nothing | No |
| Crew alertness (outside the brief) | 18 pilots in a simulator: EEG, ECG, breathing, skin conductance | Not relevant to daily monitoring |

Astronaut clinical measurements (blood pressure, pulse, mass, vision, sleep) are not on this portal. The “NASA Life Sciences Portal (NLSP)” record points to the archive that holds them, from Mercury (1961) to the ISS: `https://nlsp.nasa.gov`.

## 2. Survey: what, why, in what context, how

| Dataset | What is measured | Why | Context | How it is used |
|---|---|---|---|---|
| ISS TEPC, Dose Analyzer | Absorbed dose rate (µGy/min) and dose-equivalent rate (µSv/min), station position, dominant source (cosmic, belts, solar), instrument location in the station | “To manage the dose received by the crew”, because dose rates in orbit are a few hundred times those on the ground | Instrument located in the Service Module and occasionally moved (one month at another location in 2014), one measurement per minute, continuously | By the Johnson Space Center radiation analysis group, to track the risk in real time |
| MSL RAD Level 2 | Dose rate, particle energy spectrum, neutrons and gamma rays, with a quality flag per measurement | To characterise radiation on the surface of Mars (inferred) | Instrument on the Curiosity rover | “Quality-filtered” and “all data” versions published side by side |
| EVA US and Russia | Number, country, crew, vehicle, date, duration, purpose and incidents in free text | To keep a chronology of spacewalks (inferred; the record only gives a definition) | One line per sortie, from Gemini to the ISS | Historical register; health problems appear only if they disrupted the sortie |
| ISS Microbial Observatory | Bacteria and fungi from 8 locations, by surface wipes, 2 sessions 3 months apart | Hypothesis: the microbial population changes over time with crew activity and depends on location | The station seen as a closed built environment | Sequenced on the ground after samples return |
| SpaceX Inspiration4 | Swabs from 10 body sites, stool, 9 capsule surfaces | To track the crew and cabin microbiome (inferred) | 4 people, 3 days; samples before (L-92, L-44, L-3), during (days 2 and 3) and after flight | Sequenced on the ground; the sampling plan lets each person be compared with themselves |
| Astronaut saliva | Salivary microbiome | To look for a flight-related change and a signature associated with viral reactivation | Astronauts on missions | Sequenced on the ground |
| Blood genes, astronauts | 234 stress-response genes | Astronauts become more susceptible to infection | 6 astronauts, 10 days before flight and 2–3 h after landing | Before/after comparison for each person |
| MARS500 | DNA methylation, mood, biochemistry, gut microbiome | To understand adaptation to long isolation | 6 crew members, 520 days of ground simulation, extended follow-up after leaving | Longitudinal follow-up of each person |
| Bed rest (PlanHab and others) | Muscle biopsies, plasma proteins | To understand muscle loss and test countermeasures (exercise, protein) | Volunteers in bed rest for 21 days or more, sometimes in thin air (14.1 % oxygen). In PlanHab, each subject goes through every condition; in the study of women, three separate groups are compared | Comparison between conditions, within the same subject or between groups depending on the study |
| Rodent eyes | Intraocular pressure (tonometer), intracranial pressure (telemetry), MRI, retinal tissue | To explain vision changes observed in astronauts | Mice 35 days on the ISS; rats suspended on the ground | Mechanism research, not monitoring |
| Pilots in a simulator | 20-channel EEG, ECG, breathing, skin conductance, at 256 Hz | To train models to detect three attention states | 18 pilots, ground exercises then a full simulated flight | Machine learning (Kaggle competition) |

## 3. What the two analysed datasets show

### ISS dosimetry, year 2014 (352 days with at least 80 % coverage)

| Quantity | Value |
|---|---|
| Median dose equivalent, whole year | 0.69 mSv/day |
| Usual location (323 days): median, and 5th to 95th percentile | 0.68 mSv/day; 0.62 to 0.75 |
| Second location (29 days, 1 to 29 May): median, and 5th to 95th percentile | 0.83 mSv/day; 0.76 to 0.96 |
| Median day-to-day change | 0.02 mSv |
| Median absorbed dose | 0.32 mGy/day |
| Equivalent / absorbed ratio | 2.2 |
| Share from the radiation belts | 7 % of the time, 52 % of the dose |
| Share from cosmic radiation | 93 % of the time, 48 % of the dose |

Three takeaways:

1. **At a fixed location, the daily dose is very stable**: the standard deviation is about 6 % of the mean. A day that clearly departs from the usual level is therefore a real signal.
2. **The location in the spacecraft changes the dose by about 20 %.** The five highest days of the year all fall in May, when the instrument was elsewhere in the same module, at an unchanged station altitude. Without the location recorded with each measurement, that month would have been mistaken for a rise in radiation.
3. **This year says nothing about solar storms**: the instrument almost never classified the Sun as the dominant source in 2014.

These figures apply to low Earth orbit. On the way to Mars there are no radiation belts and no protection from Earth’s magnetic field: the background level will be different, but the method (a stable usual level at a constant location, alerting on the departure from it) still holds.

### Extravehicular activity log (375 spacewalks, 1965–2013)

- Median duration: 6 h; 90 % of sorties last less than 7 h 21 min; maximum 8 h 56 min.
- The median duration rose from under one hour in the 1960s to 6 h 30 min since 2000.
- Incidents affecting the person, identified by reading the notes:

| Type of incident | Sorties affected |
|---|---|
| CO2 in the suit (rising level, depleted cartridge, failed sensor) | 9 |
| Ammonia contamination or suit decontamination | about 6 |
| Fogging, eye irritation, impaired vision | 6 |
| Damaged or cut gloves | 4 |
| Fatigue or overheating | 2 |
| Water in the helmet | 1 |

Takeaway: the recorded incidents concern breathing air, vision and heat more than hands and shoulders. The log mentions neither decompression sickness nor muscle injury: it records what disrupted the sortie, not the medical state on return.

## 4. Gaps between these practices and the tool

When this analysis was written, points 2 and 3 were applied in `index.html` and the others were not. Notes marked **Update** give the current state.

NASA data used as-is in the tool:

- **Cards**: the “Radiation dose” card and the “Spacewalk duration” card display a “NASA reference” line taken from the two analyses in §3.
- **Example crew** (`sample-data.json`): the radiation doses are the 30 real daily values from the ISS dosimeter from 16 October to 14 November 2014; the spacewalk durations are those of sorties no. 227 (30 August 2012, 8.3 h) and no. 231 (9 July 2013, 6.1 h). All other values in the example are invented.

1. **Personal reference taken before flight.** Crew studies (Inspiration4, blood genes, MARS500) take measurements before flight or before isolation to serve as a point of comparison. The tool already accepted pre-flight references, but only through the JSON file; without them, it falls back on the first 3 to 7 in-flight measurements, so on a body that is already adapting. A screen for entering references when creating a profile was missing. **Update:** a personal-baseline form now opens when a profile is created and with **B** inside a profile, with the reference date and source.
2. **Radiation: departure from the usual level, location and cumulative dose (applied, except location).** The tool used to compare the day’s dose with fixed thresholds. The data show a very stable background at a constant location; an alert on the departure from the usual level over the last 7 days is more accurate, provided measurements taken at the same place are compared. NASA says it measures to “manage the dose”: the cumulative total since departure was missing. **Update:** the radiation card now shows the mission total.
3. **EVA: an event, not a daily question (applied).** NASA records one line per sortie with its duration. The tool used to ask a daily question about hands and shoulders. It is more consistent to ask “spacewalk today?”, then the duration and the symptoms the log highlights: headache (CO2), vision, overheating, hands.
4. **Measurement versus sampling.** Microbes and immunity are tracked through samples analysed on the ground, on fixed dates. Nothing can be interpreted on board. The tool can keep its symptom questions, but must not suggest that it measures the microbiome; a simple “sample taken” reminder would be the consistent counterpart.
5. **Context of each measurement.** Instrument datasets record where and how the measurement was taken (dosimeter location, quality flag). The tool stored only one number per day. May 2014 shows the cost of that gap: a 20 % difference due to location alone. The same logic applies to cabin CO2, read “in this room” without recording which room. **Update:** each reading now keeps its own timestamp and several readings per day are kept; the measurement location is still not recorded.
6. **Cabin oxygen.** The PlanHab study describes hypoxia through the air breathed (oxygen fraction and partial pressure). The tool tracks blood oxygen and cabin CO2, not cabin oxygen.
7. **Indicators without support in this catalogue.** Decompression sickness, balance, medical kit, sleep, blood pressure, pulse and cabin CO2: their thresholds remain illustrative values, to be supported with the NLSP archive or the literature.
