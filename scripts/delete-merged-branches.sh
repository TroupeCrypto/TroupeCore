#!/bin/bash

# Branch Cleanup Script for TroupeCrypto/TroupeCore
# This script deletes all outdated branches that have been merged into main
#
# Usage: ./scripts/delete-merged-branches.sh

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Branch Cleanup for TroupeCrypto/TroupeCore${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}This script will delete 11 outdated branches:${NC}"
echo ""
echo -e "${GREEN}Branches with work already merged:${NC}"
echo "  1. comprehensive-vault-dashboard"
echo "  2. comprehensive-vault-redesign"
echo "  3. try-merge-pr-28"
echo "  4. pre-merge-main-backup"
echo "  5. copilot/cleanup-repository-files"
echo "  6. copilot/install-dependencies"
echo "  7. copilot/install-package-dependencies"
echo "  8. copilot/push-and-commit-changes"
echo "  9. cursor/build-advanced-interactive-analytics-dashboard-4ac9"
echo "  10. cursor/build-advanced-interactive-analytics-dashboard-a84a"
echo ""
echo -e "${YELLOW}Branch with work now resolved:${NC}"
echo "  11. copilot/remove-placeholder-data-dashboard"
echo ""

read -p "Do you want to proceed with deletion? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Aborted.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}Deleting branches...${NC}"
echo ""

# Delete branches with work already merged
echo -e "${BLUE}Deleting merged branches...${NC}"
git push origin --delete comprehensive-vault-dashboard || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete comprehensive-vault-redesign || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete try-merge-pr-28 || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete pre-merge-main-backup || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete copilot/cleanup-repository-files || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete copilot/install-dependencies || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete copilot/install-package-dependencies || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete copilot/push-and-commit-changes || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete cursor/build-advanced-interactive-analytics-dashboard-4ac9 || echo "  ⚠️  Branch already deleted or doesn't exist"
git push origin --delete cursor/build-advanced-interactive-analytics-dashboard-a84a || echo "  ⚠️  Branch already deleted or doesn't exist"
echo ""

# Delete outdated/conflicting branch
echo -e "${BLUE}Deleting resolved branch...${NC}"
git push origin --delete copilot/remove-placeholder-data-dashboard || echo "  ⚠️  Branch already deleted or doesn't exist"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deletion Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Verify branches are deleted: https://github.com/TroupeCrypto/TroupeCore/branches"
echo "2. Only 'main' and 'copilot/fix-discrepancies-in-last-branch' should remain"
echo "3. Merge this PR (copilot/fix-discrepancies-in-last-branch)"
echo "4. Delete 'copilot/fix-discrepancies-in-last-branch' branch after merge"
echo ""
echo -e "${GREEN}Final result: Only 'main' branch will remain ✅${NC}"
echo ""
