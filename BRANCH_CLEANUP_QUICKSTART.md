# Quick Start: Branch Cleanup

This guide provides quick commands for cleaning up branches in TroupeCrypto/TroupeCore.

## 🚀 Quick Commands

### Option 1: Automated Cleanup (Recommended)

```bash
# Use the new comprehensive cleanup script
./scripts/delete-merged-branches.sh

# This will delete all 8 branches (6 merged + 2 closed) with confirmation
```

### Option 2: Manual GitHub UI

Visit: https://github.com/TroupeCrypto/TroupeCore/branches

Click the 🗑️ icon next to each of the 8 branches listed below.

### Option 3: Manual Git Commands

```bash
# Delete merged branches (6 total)
git push origin --delete copilot/add-github-actions-workflows
git push origin --delete copilot/delete-unused-copilot-branches
git push origin --delete copilot/generate-random-string
git push origin --delete copilot/run-task-execution
git push origin --delete revert-3-copilot/generate-random-string
git push origin --delete copilot/merge-and-delete-extra-branches

# Delete closed (not merged) branches (2 total)
git push origin --delete copilot/add-github-actions-workflows-2
git push origin --delete copilot/add-github-actions-workflows-3
```

## ⚠️ Important

The following **8 branches** need to be deleted:

**Merged branches (6):**
- `copilot/add-github-actions-workflows` (PR #4)
- `copilot/delete-unused-copilot-branches` (PR #8)
- `copilot/generate-random-string` (PR #3)
- `copilot/run-task-execution` (PR #2)
- `revert-3-copilot/generate-random-string` (PR #5)
- `copilot/merge-and-delete-extra-branches` (PR #13)

**Closed branches (2):**
- `copilot/add-github-actions-workflows-2` (PR #10)
- `copilot/add-github-actions-workflows-3` (PR #11)

All of these branches should be deleted from the remote repository.

## 📚 Full Documentation

For detailed information, see:
- [CLEANUP_STATUS.md](./CLEANUP_STATUS.md) - Current status and detailed instructions
- [BRANCH_MERGE_TRACKER.md](./BRANCH_MERGE_TRACKER.md) - Complete branch analysis
- [.github/ISSUE_TEMPLATE/branch-merge-request.md](./.github/ISSUE_TEMPLATE/branch-merge-request.md) - Issue template

## ✅ Verification

After cleanup, verify at:
https://github.com/TroupeCrypto/TroupeCore/branches

Expected result: 3 branches should remain:
- `main` (protected)
- `copilot/enhance-evaluation-engine` (PR #14 - active)
- `copilot/merge-and-cleanup-branches` (PR #15 - this cleanup PR)
