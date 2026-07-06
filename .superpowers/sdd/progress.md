# Domestic Weekly Candles — Progress Ledger

Plan: docs/superpowers/plans/2026-07-06-domestic-weekly-candles.md
Branch: feat/domestic-weekly-candles

- Task 1: candleSupport matrix + classifier — complete (commit 250630d, verified 5/5)
- Task 2: weekly capability declarations + consistency test — complete (commit 90234c2, verified 290/290)
- Task 3: unified core + facade delegation — complete (commit ba12509, verified 292/292)
- Task 4: weekly service path — complete (commit e53e263 + barrel re-export, verified 296/296)
- Task 5: gates verified (test 296/296, manifest+docs exit 0), doc finalized — complete

## Final review
- Opus whole-branch review: no Critical/Important. 3 Minor + 1 note.
- Minor #1 (weekly response-parsing test gap) fixed: added fakePayload cases + content assertions for all 4 brokers.
- Minor #2 (raw broker in error details), #3 (export order): assessed cosmetic, intentionally left.
- Note (TechnicalIndicatorService no weekly branch): pre-existing, out of scope by design.
- All gates green: npm test 296/296, validate:manifest exit 0, validate:docs exit 0.
