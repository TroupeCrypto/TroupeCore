# Scripts Directory

This directory contains utility scripts for the TroupeCore repository.

## Branch Cleanup Scripts

### `delete-merged-branches.sh`
**Purpose:** Delete all merged and closed branches from the repository.

**Usage:**
```bash
./scripts/delete-merged-branches.sh
```

**What it does:**
- Fetches latest changes from origin
- Lists all branches to be deleted (8 total)
- Asks for confirmation before deletion
- Deletes 6 merged branches
- Deletes 2 closed (not merged) branches
- Provides verification steps

**Requirements:** Must be run by a repository maintainer with push access.

### `cleanup-branches.sh`
**Purpose:** General-purpose branch cleanup script with dry-run and force modes.

**Usage:**
```bash
# Dry run - see what would be deleted
./scripts/cleanup-branches.sh --dry-run

# Interactive mode with confirmation prompts
./scripts/cleanup-branches.sh

# Force mode - delete without prompts
./scripts/cleanup-branches.sh --force
```

**Features:**
- Supports dry-run mode to preview changes
- Interactive confirmation for each branch
- Force mode for automated cleanup
- Color-coded output for better readability
- Handles already-deleted branches gracefully

### `delete-all-extra-branches.sh`
**Purpose:** Legacy script for deleting specific extra branches.

**Note:** This script is now superseded by `delete-merged-branches.sh` which includes more branches and better error handling.

## Other Scripts

### `db-seed.js`
**Purpose:** Database seeding script.

**Status:** Placeholder - currently just logs "DB seed ready".

## Notes

- All branch deletion scripts require push access to the repository
- The automated Copilot agent cannot delete remote branches due to security restrictions
- Always verify the list of branches before confirming deletion
- Use dry-run mode to preview changes before actual deletion
