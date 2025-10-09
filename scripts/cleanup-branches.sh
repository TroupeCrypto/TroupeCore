#!/bin/bash

# Branch Cleanup Script for TroupeCrypto/TroupeCore
# This script helps with the systematic cleanup of merged and outdated branches
#
# Usage:
#   ./scripts/cleanup-branches.sh [--dry-run] [--force]
#
# Options:
#   --dry-run    Show what would be deleted without actually deleting
#   --force      Skip confirmation prompts

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
DRY_RUN=false
FORCE=false

for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Usage: $0 [--dry-run] [--force]"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Branch Cleanup Script for TroupeCore${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}Running in DRY RUN mode - no branches will be deleted${NC}"
  echo ""
fi

# Fetch latest changes from origin
echo -e "${BLUE}Fetching latest changes from origin...${NC}"
git fetch --all --prune

# Define branches to delete
# Already merged branches
MERGED_BRANCHES=(
  "copilot/add-github-actions-workflows"
)

# Outdated branches that should NOT be merged
# These have been deleted:
# OUTDATED_BRANCHES=(
#   "copilot/generate-random-string"
#   "copilot/run-task-execution"
#   "revert-3-copilot/generate-random-string"
# )
OUTDATED_BRANCHES=()

# Branches pending merge (will be deleted after their PRs are merged)
PENDING_MERGE=(
  "copilot/auto-merge-pull-requests"
)

# Function to delete a branch
delete_branch() {
  local branch=$1
  local reason=$2
  
  # Check if branch exists on remote
  if ! git ls-remote --heads origin "$branch" | grep -q "$branch"; then
    echo -e "${YELLOW}  ⚠ Branch '$branch' does not exist on remote, skipping${NC}"
    return
  fi
  
  if [ "$DRY_RUN" = true ]; then
    echo -e "${GREEN}  [DRY RUN] Would delete: origin/$branch${NC}"
    echo -e "    Reason: $reason"
  else
    if [ "$FORCE" = false ]; then
      read -p "  Delete origin/$branch? (y/N) " -n 1 -r
      echo ""
      if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}  Skipped: origin/$branch${NC}"
        return
      fi
    fi
    
    echo -e "${GREEN}  Deleting: origin/$branch${NC}"
    git push origin --delete "$branch"
    echo -e "    Reason: $reason"
  fi
}

# Delete already merged branches
if [ ${#MERGED_BRANCHES[@]} -gt 0 ]; then
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}Already Merged Branches${NC}"
  echo -e "${GREEN}========================================${NC}"
  for branch in "${MERGED_BRANCHES[@]}"; do
    delete_branch "$branch" "Already merged to main via PR"
  done
  echo ""
fi

# Delete outdated branches
if [ ${#OUTDATED_BRANCHES[@]} -gt 0 ]; then
  echo -e "${RED}========================================${NC}"
  echo -e "${RED}Outdated Branches (Do NOT Merge)${NC}"
  echo -e "${RED}========================================${NC}"
  echo -e "${YELLOW}These branches contain outdated or conflicting changes${NC}"
  for branch in "${OUTDATED_BRANCHES[@]}"; do
    delete_branch "$branch" "Contains outdated/conflicting changes"
  done
  echo ""
fi

# Show pending merge branches (don't delete yet)
if [ ${#PENDING_MERGE[@]} -gt 0 ]; then
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}Branches Pending Merge${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo -e "${YELLOW}These branches have open PRs and should be merged first:${NC}"
  for branch in "${PENDING_MERGE[@]}"; do
    echo -e "  • origin/$branch"
  done
  echo ""
  echo -e "${YELLOW}After their PRs are merged, run this script again to delete them.${NC}"
  echo ""
fi

# Final summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Cleanup Summary${NC}"
echo -e "${GREEN}========================================${NC}"

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}This was a dry run. No branches were actually deleted.${NC}"
  echo -e "${YELLOW}Run without --dry-run to perform the actual deletion.${NC}"
else
  echo -e "${GREEN}Branch cleanup completed!${NC}"
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Review and merge pending PRs"
echo "2. Run this script again to clean up remaining branches"
echo "3. Verify repository state at: https://github.com/TroupeCrypto/TroupeCore/branches"

echo ""
echo -e "${GREEN}Done!${NC}"
