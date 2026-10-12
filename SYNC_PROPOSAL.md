# Approved fitness synchronization

Automatic approved-field synchronization is configured in the private training repository. The owner approved the fitness-field boundary and saved a fine-grained GitHub token restricted to this public dashboard.

## What happens after logging

1. Commit structured lifting/running CSV records alongside the normal narrative logs on private main.
2. The private GitHub Action validates the exporter, then reads the reviewed baseline and new rows.
3. Recognized records become typed dates, numeric loads/repetitions, running distances/times, fixed movement/equipment identifiers and generated session status. Source notes supply dates and ambiguity checks but are never serialized.
4. The action writes exactly `data.js` to public main using the saved token. No changes means no new public commit. GitHub Pages publishes changed data automatically.
5. The dashboard recalculates metrics, charts, counts and coach text from that data. The header date is the latest workout date, not the time the automation ran.

The workflow runs only on private main pushes or manual dispatch, uses read-only GITHUB_TOKEN permissions, serializes runs, pins checkout to an upstream commit SHA, and exposes the sync credential only to the publication step. No raw private artifacts, history or notes are uploaded. GitHub's content SHA prevents overwriting a concurrent public data edit.

## When a review is needed

Unknown exercise/equipment names, changed setups, ambiguous or assisted reps, conflicting dates, unsupported run formats, historical corrections and future training blocks stop publication. The last public dataset remains intact. The private Actions failure explains the class of problem without copying source rows into output. Review and rerun privately.

The CSV logs are authoritative for automatic numeric updates. Markdown-only entries do not create new metrics. Program targets and narrative coaching observations require a reviewed update of the approved snapshot; they remain explicitly dated until then. Changed private program text triggers a review-needed notice without publishing that text. New lift singles are not automatically labeled verified PR tests.

## Credential and maintenance

The token is stored as `FITNESS_DASHBOARD_SYNC_TOKEN` in private Actions secrets. Its write access is restricted to `fitness-coach-dashboard`; it has Contents and Pull requests read/write with required Metadata read. The implemented publisher uses only Contents, so Pull requests permission can be removed at renewal. Token expiry: **January 9, 2027**. Replace the secret with an equivalently restricted token before that date and run the private workflow to verify it.

Disable the private workflow to pause updates. The public site will continue serving its last successful dataset. No additional hosting service or recurring paid subscription is configured; normal GitHub usage limits apply.

References: [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub Actions security guidance](https://docs.github.com/en/actions/reference/security/secure-use).
