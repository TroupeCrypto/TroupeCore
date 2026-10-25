# Custom Upgrade / Enhancement Proposal Standard

Use this alongside—not instead of—the original two-part workflow. Each proposal must upgrade the purpose of the current file/concept, not merely attach a generic feature list.

## Required fields

- Proposal ID / status: stable identifier; proposal, approved, implementing, verified, blocked, or rejected.
- Current artifact: exact repository, path/page, branch/revision, and source hash where available.
- Current purpose and baseline output: what the artifact actually does today, backed by evidence.
- Problem/opportunity: observed gap and impact; distinguish confirmed defect from hypothesis.
- Fix proposal: minimum correction required to restore intended behavior.
- Custom upgrade: what the artifact would do better after the change, and why that improvement fits its own purpose.
- Before/after contract: inputs, outputs, side effects, invariants, compatibility, and error behavior.
- Model skill target: capability being tested; skill rubric; expected and prohibited behaviors.
- Telemetry plan: event names, correlation/task IDs, timestamps, stage, outcome, latency, retry count, tool/action class, test fixture ID, and error category. Never log secrets or unnecessary personal data.
- Test samples: synthetic, versioned cases isolated by brand, department, and job. Include positive, negative, boundary, regression, and adversarial cases.
- Acceptance criteria: measurable, binary where possible, with test commands or verification procedure.
- Risk/security/privacy: permissions, trust boundaries, prompt injection, data handling, rate/cost limits, rollback, and human approval gates.
- Implementation sequence: ordered tasks and dependencies; each task references this proposal ID.
- Verification evidence: changed paths, commit SHA, test output, telemetry sample, Notion URL, and remaining limitations.
- Rollback/recovery: reversal path and reconciliation procedure.

## Decision rule

Do not implement a proposed upgrade until its baseline is understood and the proposal explains how the change improves the same artifact's stated purpose. If evidence is insufficient, keep the proposal in proposal or blocked state and specify the missing evidence.
