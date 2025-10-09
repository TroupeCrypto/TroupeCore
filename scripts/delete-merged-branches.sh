#!/bin/bash

# Script to delete all merged and closed branches from TroupeCore repository
# This script must be run by a repository maintainer with push access

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}TroupeCore Branch Deletion Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Fetch latest changes
echo -e "${BLUE}Fetching latest changes from origin...${NC}"
git fetch --all --prune
echo ""

# Define branches to delete
MERGED_BRANCHES=(
  "copilot/add-github-actions-workflows"
  "copilot/delete-unused-copilot-branches"
  "copilot/generate-random-string"
  "copilot/run-task-execution"
  "revert-3-copilot/generate-random-string"
  "copilot/merge-and-delete-extra-branches"
)

CLOSED_BRANCHES=(
  "copilot/add-github-actions-workflows-2"
  "copilot/add-github-actions-workflows-3"
)

echo -e "${GREEN}Branches to be deleted:${NC}"
echo ""
echo -e "${GREEN}Already Merged (6 branches):${NC}"
for branch in "${MERGED_BRANCHES[@]}"; do
  echo -e "  • ${branch}"
done
echo ""
echo -e "${YELLOW}Closed without Merge (2 branches):${NC}"
for branch in "${CLOSED_BRANCHES[@]}"; do
  echo -e "  • ${branch}"
done
echo ""
echo -e "${RED}WARNING: These branches will be permanently deleted from the remote repository!${NC}"
echo ""

# Confirm deletion
read -p "Are you sure you want to delete these 8 branches? (yes/no) " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo -e "${YELLOW}Deletion cancelled.${NC}"
  exit 0
fi

# Delete merged branches
echo -e "${GREEN}Deleting merged branches...${NC}"
for branch in "${MERGED_BRANCHES[@]}"; do
  if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
    echo -e "  Deleting ${branch}..."
    git push origin --delete "$branch" || echo -e "${YELLOW}  ⚠ Failed to delete ${branch}${NC}"
  else
    echo -e "${YELLOW}  ⚠ Branch ${branch} does not exist, skipping${NC}"
  fi
done
echo ""

# Delete closed branches
echo -e "${YELLOW}Deleting closed (not merged) branches...${NC}"
for branch in "${CLOSED_BRANCHES[@]}"; do
  if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
    echo -e "  Deleting ${branch}..."
    git push origin --delete "$branch" || echo -e "${YELLOW}  ⚠ Failed to delete ${branch}${NC}"
  else
    echo -e "${YELLOW}  ⚠ Branch ${branch} does not exist, skipping${NC}"
  fi
done
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deletion Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Verify branches are deleted at: https://github.com/TroupeCrypto/TroupeCore/branches"
echo "2. Expected remaining branches:"
echo "   • main (protected)"
echo "   • copilot/enhance-evaluation-engine (PR #14 - still open)"
echo "   • copilot/merge-and-cleanup-branches (PR #15 - current cleanup PR)"
echo ""
echo -e "${GREEN}Done!${NC}"
