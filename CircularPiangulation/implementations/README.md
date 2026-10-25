# Isolated Implementation Tasks

Create one folder per implementation/task ID, for example implementations/TU-FIX-001/. Each task folder should include:

- source-reference.md: source URL, revision/hash, preservation location, and lineage
- assessment.md: evidence, findings, uncertainties, and risks
- fix-proposal.md: smallest safe correction and acceptance tests
- upgrade-proposal.md: purpose-matched custom enhancement
- implementation/ or patch artifacts
- tests/ and synthetic fixtures
- telemetry/ event schema and sample output
- verification.md: changed paths, commit SHA, test evidence, read-back confirmation
- rollback.md: recovery and reconciliation plan

Do not place credentials or live production data in task folders. Use one task ID consistently across proposals, fixtures, telemetry, and Notion records.
