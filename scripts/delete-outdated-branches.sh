#!/bin/bash

# Delete Outdated Branches Script for TroupeCrypto/TroupeCore
#
# This script deletes three specific branches that contain outdated changes
# which conflict with the current main branch:
#   - copilot/run-task-execution
#   - copilot/generate-random-string  
#   - revert-3-copilot/generate-random-string
#
# These branches should NOT be merged as they remove workflow files that
# were later added back via PR #4. This script deletes them permanently.
#
# Usage:
#   ./scripts/delete-outdated-branches.sh
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
echo -e "${BLUE}Delete Outdated Branches${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}This script will delete the following branches:${NC}"
echo -e "  • copilot/run-task-execution"
echo -e "  • copilot/generate-random-string"
echo -e "  • revert-3-copilot/generate-random-string"
echo ""
echo -e "${RED}WARNING: These branches will be permanently deleted from the remote repository.${NC}"
echo -e "${YELLOW}These branches contain outdated changes and should NOT be merged.${NC}"
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

echo -e "${GREEN}Deleting: copilot/run-task-execution${NC}"
git push origin --delete copilot/run-task-execution

echo -e "${GREEN}Deleting: copilot/generate-random-string${NC}"
git push origin --delete copilot/generate-random-string

echo -e "${GREEN}Deleting: revert-3-copilot/generate-random-string${NC}"
git push origin --delete revert-3-copilot/generate-random-string

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deletion Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Verify the branches are deleted at: https://github.com/TroupeCrypto/TroupeCore/branches"
echo "2. Continue with remaining branch cleanup tasks"
echo ""
echo -e "${GREEN}Done!${NC}"
