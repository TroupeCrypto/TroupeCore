# CircularPiangulation — Original Two-Part Workflow

**Status:** Operational baseline; enhancement rules are additive and must not silently replace this baseline.
**Scope:** Preserve the current file/concept, assess proposed implementation or fix, and design a purpose-matched enhancement before implementation.

## Part 1 — Preserve, inspect, and assess the existing workflow/artifact

1. Start from the actual source artifact, repository, Notion page, schema, workflow, or concept. Fetch it before editing.
2. Preserve original wording, sequence, structure, examples, attachments, and source lineage. Do not silently summarize, normalize, merge, rename, or “correct” the original.
3. Record source identity: repository/page URL, path, branch or revision when available, retrieval time, and inspection method.
4. Assess what exists from evidence. Separate verified facts, inferred interpretation, unknowns, risks, and recommendations.
5. Identify the specific function/output that is deficient or could be improved. Do not invent a defect or propose an unrelated redesign.
6. Persist the assessment and evidence in Notion and, where implementation artifacts are appropriate, in this repository. Verify the writes.

## Part 2 — Deliver a purpose-matched fix proposal plus custom upgrade

Every implementation or fix proposal must be accompanied by a custom Upgrade / Enhancement Proposal tied to the exact existing file, workflow, or concept.

1. **Fix proposal:** State the observed problem, evidence, root-cause hypothesis, affected path/section, smallest safe correction, dependencies, risks, and acceptance tests.
2. **Custom upgrade proposal:** Separately explain how to enhance the function or output of that same current artifact. Name target capability, baseline behavior, proposed behavior, user/model benefit, compatibility constraints, telemetry required, skill test cases, and measurable acceptance criteria.
3. Preserve source and proposal as distinct artifacts. The proposal must not overwrite the original. Implementation follows only after the applicable authorization gate.
4. Implement in an isolated task folder with tests, fixtures, documentation, telemetry schema, and verification evidence. Keep brand-, department-, and job-specific samples separate.
5. Verify actual repository state, commit SHA, changed paths, test outcomes, and Notion persistence. A successful write to one system is not proof of success in the other.
6. Record failure explicitly; retry only when safe; reconcile partial writes instead of reporting success prematurely.

## Non-negotiable preservation rules

- Original source remains available and identifiable.
- Interpretations, fixes, and enhancements are separate derivatives with source-to-derivative lineage.
- Unverified claims remain marked unverified.
- Never use real credentials, private customer data, or live financial actions in fixtures.
- Destructive or externally consequential actions require explicit authorization.
- No implementation is described as completed until the resulting state is read back and verified.

## Output bundle

Each task should contain: source snapshot/reference; assessment; fix proposal; custom upgrade proposal; implementation plan; tests and synthetic fixtures; telemetry event definitions; skills-test matrix; execution log; verification report; rollback notes; and Notion record/link.
