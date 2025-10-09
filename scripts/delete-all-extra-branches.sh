#!/bin/bash

# Delete All Extra Branches Script for TroupeCrypto/TroupeCore
#
# This script deletes all branches that have been merged or closed
# and are no longer needed in the repository.
#
# Usage:
#   ./scripts/delete-all-extra-branches.sh
#
# The script will prompt for confirmation before deleting.

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Delete All Extra Branches${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}This script will delete the following branches:${NC}"
echo ""
echo -e "${GREEN}Merged branches:${NC}"
echo -e "  • copilot/add-github-actions-workflows (PR #4)"
echo -e "  • copilot/delete-unused-copilot-branches (PR #8)"
echo -e "  • copilot/generate-random-string (PR #3)"
echo -e "  • copilot/run-task-execution (PR #2)"
echo -e "  • revert-3-copilot/generate-random-string (PR #5)"
echo ""
echo -e "${YELLOW}Closed branches:${NC}"
echo -e "  • copilot/add-github-actions-workflows-2 (PR #10)"
echo -e "  • copilot/add-github-actions-workflows-3 (PR #11)"
echo ""
echo -e "${RED}WARNING: These branches will be permanently deleted from the remote repository.${NC}"
echo ""

# Confirm deletion
read -p "Are you sure you want to delete these branches? (yes/no) " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo -e "${YELLOW}Deletion cancelled.${NC}"
  exit 0
fi

# Delete the branches
echo -e "${BLUE}Deleting branches...${NC}"
echo ""

# Merged branches
echo -e "${GREEN}Deleting merged branches...${NC}"
git push origin --delete copilot/add-github-actions-workflows || echo "Branch already deleted or doesn't exist"
git push origin --delete copilot/delete-unused-copilot-branches || echo "Branch already deleted or doesn't exist"
git push origin --delete copilot/generate-random-string || echo "Branch already deleted or doesn't exist"
git push origin --delete copilot/run-task-execution || echo "Branch already deleted or doesn't exist"
git push origin --delete revert-3-copilot/generate-random-string || echo "Branch already deleted or doesn't exist"
echo ""

# Closed branches
echo -e "${YELLOW}Deleting closed (not merged) branches...${NC}"
git push origin --delete copilot/add-github-actions-workflows-2 || echo "Branch already deleted or doesn't exist"
git push origin --delete copilot/add-github-actions-workflows-3 || echo "Branch already deleted or doesn't exist"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deletion Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Verify the branches are deleted at: https://github.com/TroupeCrypto/TroupeCore/branches"
echo "2. Only 'main' and 'copilot/merge-and-delete-extra-branches' should remain"
echo "3. After merging PR #13, delete the 'copilot/merge-and-delete-extra-branches' branch"
echo ""
echo -e "${GREEN}Done!${NC}"
