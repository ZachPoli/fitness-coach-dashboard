# Proposed private-to-public updates — NOT ENABLED

Current site is a manually curated snapshot. No private-repository workflow, new token, GitHub App, repository secret or synchronization job was installed.

## Recommended approach

1. Maintain an explicitly approved, structured export file in the private training repository, separate from free-text logs. Have a private-side exporter populate only allowlisted fields; reject unknown fields and ambiguous records rather than infer them.
2. Trigger a private-side GitHub Action when the approved export changes. Validate schema, scan for secrets/contact information, calculate metrics, and generate only the sanitized public dataset. Never upload the private checkout, source logs, Actions artifacts containing logs, or Git history.
3. Open a pull request in the public dashboard repository containing only the sanitized dataset changes. The pull request is already public: privacy review must occur on the private side BEFORE creation. Prefer a private review/approval gate on changed fields or notes.
4. After approval, merge the dashboard pull request. The existing Pages branch deployment publishes it. Unattended publication can be considered later only after the exporter is validated and the exact fields are approved.

## Exact proposed field contract to approve

| Record | Allowed fields |
| --- | --- |
| Snapshot | `schema_version`, `snapshot_date` |
| Lift exposure | `date` (nullable for undated history), `sequence`, `movement_id`, `equipment_id`, `load_lb`, `load_basis` (total/per_hand/per_side/added), `load_is_approximate`, `sets[].clean_reps`, `sets[].role` (warmup/calibration/work), `source_record_id` |
| Verified test | `date`, `movement_id`, `load_lb` or `distance_miles` and `elapsed_seconds`, `test_type`, `verification_basis` (athlete_log) |
| Run session | `date`, `sequence`, `session_type`, `distance_miles` (nullable), `elapsed_seconds` (nullable), `distance_scope` (whole_session/recorded_portion/hard_work_only), `completion_status` |
| Interval | `date`, `reps_planned`, `reps_completed`, `partial_rep_distance_miles` (nullable), `rep_distance_miles` or `rep_duration_seconds`, `speed_mph`, `recovery_seconds`, `recovery_speed_mph` |
| Program | `block_id`, `rotation_number`, `programmed_day`, `movement_id`, `prescribed_sets`, `rep_min`, `rep_max`, `target_load_lb` (nullable), `target_duration_minutes` (nullable), `target_speed_mph` (nullable), `completion_status` |
| Goals | `bench_1rm_lb`, `squat_1rm_lb`, `conventional_deadlift_1rm_lb`, `mile_seconds` |

No free-text source notes are transferred. Coach/recovery observations require a separately reviewed manual summary or explicitly approved structured flags. Bodyweight, body measurements, injury narrative, supplements, work details, contact details and locations remain excluded by default.

## Permissions to approve before implementation

- The private workflow's `GITHUB_TOKEN`: read access to its own repository only. It cannot write to a separate repository by default.
- Preferred cross-repository credential: short-lived GitHub App installation token, scoped only to the public dashboard, with Contents and Pull requests read/write and Metadata read. Store the App private key solely as a private Actions secret. No administration, secrets or private-repository access granted to the public workflow.
- Simpler alternative: expiring fine-grained personal access token restricted to the public dashboard with Contents and Pull requests write. Approve owner, expiry and exact scopes before creating/storing it.
- Trigger, private approval gate, final field list and whether future merges may be automatic all require approval. Existing static Pages publication needs no cross-repository credential.

Use concurrency and a stable update branch to avoid duplicate PRs; reject stale exports and schema changes. Pin action dependencies to reviewed commit SHAs, mask credentials and keep workflow logs free of source notes. Standard GitHub Actions usage avoids a new hosting subscription; private-repository usage remains subject to the account's included minutes.
