# Strength × Speed

Public fitness coach dashboard: https://zachpoli.github.io/fitness-coach-dashboard/

Coach link: https://zachpoli.github.io/fitness-coach-dashboard/#coach

## Included

Snapshot through October 10, 2026. Responsive overview, interactive lift explorer, Epley history, running and interval history, documented barbell volume, current four-session rotation, six-rotation peak pathway, printable coach summary and session audit.

Current Epley estimates use the best clean set within the latest exposure: bench 245 lb (210×5), squat 297.5 lb (255×5), conventional deadlift 379.5 lb (345×3). The best historical bench estimate is 246 lb (205×6), which is shown separately. No tested barbell 1RMs were found in the reviewed records. Mile PR: 6:29. These are logged results, not independently witnessed certification.

Dates and programmed session names are independent: October 10 was Saturday, logged as the Sunday session. Rotation 1 is complete; Rotation 2 has three lifting visits logged, with Tuesday pending and Friday intervals incomplete. Charts space observations equally; undated early mile attempts retain their sequence without invented dates.

## Run locally

Serve this directory using `python -m http.server 8765`, then open http://localhost:8765/. No build, dependencies, analytics or third-party chart services are required.

## Automatic updates

An approved-field exporter in the private training repository updates only `data.js` when recognized workout records are committed to main. Current metrics, charts, session counts, dates and the printable coach briefing derive from that dataset. GitHub Pages publishes the resulting public commit. Source notes and raw private files are never transferred.

Program prescriptions remain dated to their latest private review. Ambiguous records, equipment changes and historical corrections stop the export for review, preserving the last published data. Markdown-only workouts must also be entered into the structured CSV logs. See [PUBLICATION.md](PUBLICATION.md) and [sync operations](SYNC_PROPOSAL.md).
