# Quick Start: Branch Cleanup

This guide provides quick commands for cleaning up branches in TroupeCrypto/TroupeCore.

## 🚀 Quick Commands

### Option 1: Automated Cleanup (Recommended)

```bash
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
# Delete already merged branches
git push origin --delete copilot/add-github-actions-workflows

# Delete outdated branches (DO NOT MERGE THESE)
git push origin --delete copilot/generate-random-string
git push origin --delete copilot/run-task-execution
git push origin --delete revert-3-copilot/generate-random-string

# Delete branches with merged PRs (after their PRs are merged)
git push origin --delete copilot/auto-merge-pull-requests
git push origin --delete copilot/merge-all-branches-to-main
```

## ⚠️ Important

**DO NOT MERGE** these branches (delete them directly):
- `copilot/generate-random-string`
- `copilot/run-task-execution` 
- `revert-3-copilot/generate-random-string`

They contain outdated changes that conflict with current main.

## 📚 Full Documentation

For detailed information, see:
- [BRANCH_MERGE_TRACKER.md](./BRANCH_MERGE_TRACKER.md) - Complete branch analysis
- [.github/ISSUE_TEMPLATE/branch-merge-request.md](./.github/ISSUE_TEMPLATE/branch-merge-request.md) - Issue template

## ✅ Verification

After cleanup, verify at:
https://github.com/TroupeCrypto/TroupeCore/branches

Expected result: Only `main` branch should remain.
