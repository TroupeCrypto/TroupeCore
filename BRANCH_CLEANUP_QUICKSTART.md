# Quick Start: Branch Cleanup

This guide provides quick commands for cleaning up branches in TroupeCrypto/TroupeCore.

## 🚀 Quick Commands

### Option 1: Automated Cleanup (Recommended)

```bash
# Delete all extra branches in one command
./scripts/delete-all-extra-branches.sh

# Or use the general cleanup script:
# See what would be deleted (dry run)
./scripts/cleanup-branches.sh --dry-run

# Delete branches with confirmation prompts
./scripts/cleanup-branches.sh

# Delete all branches without prompts (use with caution!)
./scripts/cleanup-branches.sh --force
```

### Option 2: Manual GitHub UI

Visit: https://github.com/TroupeCrypto/TroupeCore/branches

Click the 🗑️ icon next to each branch to delete.

### Option 3: Manual Git Commands

```bash
# Delete merged branches
git push origin --delete copilot/add-github-actions-workflows
git push origin --delete copilot/delete-unused-copilot-branches
git push origin --delete copilot/generate-random-string
git push origin --delete copilot/run-task-execution
git push origin --delete revert-3-copilot/generate-random-string

# Delete closed (not merged) branches
git push origin --delete copilot/add-github-actions-workflows-2
git push origin --delete copilot/add-github-actions-workflows-3

# After merging PR #13, delete the tracking branch
git push origin --delete copilot/merge-and-delete-extra-branches
```

## ⚠️ Important

The following branches need to be deleted:

**Merged branches (5):**
- `copilot/add-github-actions-workflows` (PR #4)
- `copilot/delete-unused-copilot-branches` (PR #8)
- `copilot/generate-random-string` (PR #3)
- `copilot/run-task-execution` (PR #2)
- `revert-3-copilot/generate-random-string` (PR #5)

**Closed branches (2):**
- `copilot/add-github-actions-workflows-2` (PR #10)
- `copilot/add-github-actions-workflows-3` (PR #11)

All of these branches should be deleted from the remote repository.

## 📚 Full Documentation

For detailed information, see:
- [BRANCH_MERGE_TRACKER.md](./BRANCH_MERGE_TRACKER.md) - Complete branch analysis
- [.github/ISSUE_TEMPLATE/branch-merge-request.md](./.github/ISSUE_TEMPLATE/branch-merge-request.md) - Issue template

## ✅ Verification

After cleanup, verify at:
https://github.com/TroupeCrypto/TroupeCore/branches

Expected result: Only `main` and `copilot/merge-and-delete-extra-branches` should remain until PR #13 is merged, then only `main` branch should remain.
