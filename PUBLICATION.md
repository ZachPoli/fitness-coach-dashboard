# Publication boundary

The dashboard is public and discoverable. Publication is limited to the fitness categories requested for this dashboard:

- Dated lifting exposures: movement and separate equipment identity, pounds, clean repetitions, source row identifier.
- Running: dated session type, documented miles and time, interval prescription/completion, treadmill speed, historical undated mile attempt sequence.
- Current rotation: session date, programmed day label, rotation number, completion or fatigue-limited status, short curated performance summary.
- Goals, current program targets, progression rules and planned testing phases.
- Curated training recovery observations: incomplete Oct 9 intervals and pain-free Oct 10 conventional work.
- Selected exact Block 3 barbell work/calibration sets for external volume calculations.

No private repository history or wholesale CSV/Markdown files are included. No body measurements, bodyweight records, supplement information, contact details, precise locations, work narrative, credentials, business files or unrelated records are included. All displayed notes were curated; source notes are not exported into the dataset. Private source links were removed.

Machine/stance/setup variants remain separate. Weighted pull-up is added weight; dumbbells are per hand; trap-bar mass is approximate. Partial eighth pressing reps are conservatively counted as seven complete reps. Assisted bench rep six is excluded. Missing running totals stay null. Oct 2 distance is only the console total at cooldown start. Run session totals do not double-count embedded mile trials or strides.

The initial volume baseline covers selected barbell work/calibration sets and excludes known warm-ups. New synchronized volume covers every numeric set listed in the corresponding CSV row, potentially including ramps; the UI labels that coverage separately. Accessories and bodyweight movements are excluded. No whole-body fatigue score is inferred, and incomplete rotations are not compared against complete rotations as a regression.

Automatic updates append recognized numeric workout records and generated session labels. Arbitrary source exercise names, free-text notes, URLs and contact details are not copied. Equipment or rep ambiguity, historical edits and unsupported formats stop publication for review. Program prescriptions and dated coaching observations require a separately reviewed baseline update. A new single is never automatically declared a tested PR.
