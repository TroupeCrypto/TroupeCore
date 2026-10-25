# CircularPiangulation

CircularPiangulation is an isolated, persistent workspace for implementation artifacts, purpose-matched fixes, custom upgrade proposals, model skills tests, and telemetry fixtures.

## Root contract

- Preserve the original two-part workflow in workflows/original-two-part-workflow.md.
- Every fix/implementation proposal must include a custom, purpose-matched enhancement proposal in protocols/custom-upgrade-enhancement-proposal.md.
- Use templates/task-spec.md for each isolated task.
- Keep brand, department, and job samples separated; starter fixtures under samples/ are synthetic.
- Do not mix source originals, assessments, proposed changes, implementation outputs, and verification logs.
- No secrets, live customer records, production tokens, or uncontrolled side effects in test fixtures.
- Mark work complete only after reading back persisted GitHub and Notion results and recording commit SHA and test evidence.

## Layout

- workflows/ — baseline workflows and versioned workflow contracts.
- protocols/ — proposal and execution standards.
- templates/ — reusable task and test templates.
- implementations/<task-id>/ — each isolated implementation with docs, artifacts, tests, telemetry, and verification.
- samples/brands/<brand-id>/ — synthetic brand-specific tasks.
- samples/departments/<department-id>/ — synthetic department-specific tasks.
- samples/jobs/<job-id>/ — synthetic job-specific tasks.
- telemetry/ — event schema, retention/redaction rules, and test-only logs.
- skills-tests/ — model skill rubrics and evaluation fixtures.
- logs/ — task execution and verification logs (no secrets).

## Lifecycle

intake → source-preserved → assessed → fix-proposed + enhancement-proposed → approval-gated → implemented → tested → verified → reconciled

Failure state: blocked or partial-write; document the discrepancy and reconcile before retrying.
