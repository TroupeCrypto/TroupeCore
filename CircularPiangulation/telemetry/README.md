# Telemetry Contract (Test/Development)

Every event should include event_id, task_id, proposal_id, fixture_id, occurred_at (ISO-8601 UTC), stage, actor_type, action_class, outcome, latency_ms (when measured), retry_count, and error_category. Skills tests must include fixture_id and synthetic=true.

## Privacy / safety
Never record credentials, access tokens, private keys, session cookies, raw secrets, or unnecessary personal data. Prefer structured error codes over raw request bodies. Use synthetic samples by default. Telemetry completeness is itself a test assertion.

## Required invariants
1. Every implementation event links to a proposal and task.
2. A success event must be backed by the tool success result and read-back verification when persistence is involved.
3. Partial writes must be logged as partial, not success.
4. Retries reuse the task/correlation ID and record retry count.
5. Logs must not contain secrets or unredacted sensitive payloads.
