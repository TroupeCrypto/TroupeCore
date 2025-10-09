---
name: Branch Merge Request
about: Request to merge and cleanup branches
title: 'Merge and cleanup branches'
labels: 'branch-cleanup, maintenance'
assignees: ''
---

## Branch Merge Request

This issue tracks the process of merging all necessary branches to `main` and cleaning up outdated branches.

### 📋 Pre-Merge Checklist

Please review the [BRANCH_MERGE_TRACKER.md](../BRANCH_MERGE_TRACKER.md) document for detailed information about each branch.

#### Branches with Open PRs (Pending Merge)
- [ ] Review and merge PR for `copilot/auto-merge-pull-requests`
- [ ] Delete branch after successful merge

#### Already Merged Branches (Ready for Deletion)
- [ ] Verify `copilot/add-github-actions-workflows` was merged via PR #4
- [ ] Delete `copilot/add-github-actions-workflows` branch

#### Outdated Branches (Delete Without Merging)
⚠️ These branches contain conflicting changes and should NOT be merged:
- [ ] Delete `copilot/generate-random-string` (contains outdated workflow removals)
- [ ] Delete `copilot/run-task-execution` (contains outdated workflow removals)
- [ ] Delete `revert-3-copilot/generate-random-string` (revert no longer needed)

### 🔧 Cleanup Process

#### Option 1: Using the Cleanup Script
```bash
# Dry run to see what would be deleted
./scripts/cleanup-branches.sh --dry-run

# Actually delete branches (with confirmation prompts)
./scripts/cleanup-branches.sh

# Delete all branches without prompts
./scripts/cleanup-branches.sh --force
```

#### Option 2: Manual Deletion via Git
```bash
# Delete remote branches one at a time
git push origin --delete <branch-name>
```

#### Option 3: GitHub UI
1. Navigate to: https://github.com/TroupeCrypto/TroupeCore/branches
2. Click the delete icon (🗑️) next to each branch

### ⚠️ Important Notes

1. **Do NOT merge** the following branches as they contain outdated changes:
   - `copilot/generate-random-string`
   - `copilot/run-task-execution`
   - `revert-3-copilot/generate-random-string`

2. **Verify before deletion** that no valuable changes will be lost

3. **Check for dependencies** - ensure no other branches or PRs depend on branches being deleted

### 📊 Expected Outcome

After completing all steps:
- Repository should have only the `main` branch
- All valuable code changes are preserved in main
- Outdated and conflicting branches are removed
- Clean branch structure for future development

### 📚 Additional Resources

- [Branch Merge Tracker Documentation](../BRANCH_MERGE_TRACKER.md)
- [Repository Branches](https://github.com/TroupeCrypto/TroupeCore/branches)
- [Cleanup Script](../scripts/cleanup-branches.sh)

---

**Assignee:** Please follow the checklist above and mark items as completed. Close this issue when all branches have been merged or deleted appropriately.
