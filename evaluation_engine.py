#!/usr/bin/env python3
"""
Enhanced Self-Healing Evaluation Engine

This module provides a comprehensive self-healing mechanism for CI/CD pipelines,
detecting and automatically fixing common build and test failures.
"""

import os
import sys
import json
import yaml
import logging
import time
import re
import subprocess
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
import hashlib


# Configure logging
def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Setup comprehensive logging with different levels."""
    logger = logging.getLogger("EvaluationEngine")
    logger.setLevel(getattr(logging, log_level.upper()))
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, log_level.upper()))
    
    # File handler for audit logging
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    file_handler = logging.FileHandler(log_dir / "evaluation_engine.log")
    file_handler.setLevel(logging.DEBUG)
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)
    
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger


logger = setup_logging()


@dataclass
class FixResult:
    """Result of applying a fix."""
    success: bool
    fix_applied: str
    error_pattern: str
    timestamp: datetime = field(default_factory=datetime.now)
    rollback_available: bool = False
    rollback_command: Optional[str] = None
    details: Optional[str] = None


@dataclass
class AuditEntry:
    """Audit log entry for tracking all automated changes."""
    timestamp: datetime
    action: str
    error_pattern: str
    fix_applied: str
    success: bool
    file_changes: List[str]
    rollback_command: Optional[str] = None
    user: str = "evaluation_engine"


class RateLimiter:
    """Rate limiter for API calls with exponential backoff."""
    
    def __init__(self, max_calls: int = 60, time_window: int = 60):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls: List[float] = []
        
    def wait_if_needed(self):
        """Wait if rate limit is exceeded."""
        now = time.time()
        self.calls = [call for call in self.calls if now - call < self.time_window]
        
        if len(self.calls) >= self.max_calls:
            sleep_time = self.time_window - (now - self.calls[0])
            if sleep_time > 0:
                logger.warning(f"Rate limit reached. Waiting {sleep_time:.2f} seconds...")
                time.sleep(sleep_time)
        
        self.calls.append(now)


class InputValidator:
    """Validate and sanitize inputs, especially shell commands."""
    
    DANGEROUS_PATTERNS = [
        r'rm\s+-rf\s+/',
        r'\|\s*sh',
        r'\|\s*bash',
        r'eval\s+',
        r'exec\s+',
        r'>\s*/dev/',
        r'curl.*\|\s*sh',
        r'wget.*\|\s*sh',
    ]
    
    @staticmethod
    def sanitize_command(command: str) -> Tuple[bool, str]:
        """
        Sanitize shell command and check for dangerous patterns.
        Returns (is_safe, sanitized_command)
        """
        # Check for dangerous patterns
        for pattern in InputValidator.DANGEROUS_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                logger.error(f"Dangerous pattern detected: {pattern}")
                return False, ""
        
        # Remove potentially harmful characters
        sanitized = command.strip()
        
        # Ensure no command injection
        if ';' in sanitized or '&&' in sanitized or '||' in sanitized:
            # Allow these only for specific safe patterns
            if not re.match(r'^[\w\s\-\./]+(\s+(&&|\|\|)\s+[\w\s\-\./]+)*$', sanitized):
                logger.error("Potential command injection detected")
                return False, ""
        
        return True, sanitized


class SecretManager:
    """Secure handling of tokens and sensitive data."""
    
    @staticmethod
    def mask_sensitive_data(text: str) -> str:
        """Mask sensitive data in logs."""
        # Mask common token patterns
        patterns = [
            (r'(ghp_[a-zA-Z0-9]{36})', '***GITHUB_TOKEN***'),
            (r'(sk-[a-zA-Z0-9]{32,})', '***API_KEY***'),
            (r'(password["\s:=]+)([^"\s,}]+)', r'\1***PASSWORD***'),
            (r'(token["\s:=]+)([^"\s,}]+)', r'\1***TOKEN***'),
        ]
        
        masked = text
        for pattern, replacement in patterns:
            masked = re.sub(pattern, replacement, masked, flags=re.IGNORECASE)
        
        return masked
    
    @staticmethod
    def validate_github_token(token: str) -> bool:
        """Validate GitHub token has minimal required permissions."""
        if not token or not token.startswith(('ghp_', 'github_pat_')):
            logger.error("Invalid GitHub token format")
            return False
        return True


class EvaluationEngine:
    """
    Enhanced self-healing evaluation engine with comprehensive error detection
    and automatic fixing capabilities.
    """
    
    # Comprehensive error patterns and fixes
    KNOWN_FIXES = {
        # Python-specific errors
        "ModuleNotFoundError": {
            "pattern": r"ModuleNotFoundError: No module named '([^']+)'",
            "fix": "pip install {module}",
            "description": "Install missing Python module",
            "requires_approval": False,
            "rollback": "pip uninstall -y {module}"
        },
        "ImportError": {
            "pattern": r"ImportError: cannot import name '([^']+)'",
            "fix": "pip install --upgrade {module}",
            "description": "Upgrade Python module",
            "requires_approval": False,
            "rollback": None
        },
        "PythonVersionConflict": {
            "pattern": r"requires python_version ([<>=]+) \"([^\"]+)\"",
            "fix": "pyenv install {version} && pyenv local {version}",
            "description": "Fix Python version conflict",
            "requires_approval": True,
            "rollback": None
        },
        "RequirementsTxt": {
            "pattern": r"requirements\.txt.*not found",
            "fix": "pip freeze > requirements.txt",
            "description": "Create requirements.txt",
            "requires_approval": False,
            "rollback": "git checkout requirements.txt"
        },
        
        # Node.js/JavaScript errors
        "ModuleNotFound": {
            "pattern": r"Cannot find module '([^']+)'",
            "fix": "npm install {module}",
            "description": "Install missing npm module",
            "requires_approval": False,
            "rollback": "npm uninstall {module}"
        },
        "PackageJsonMissing": {
            "pattern": r"package\.json.*not found",
            "fix": "npm init -y",
            "description": "Initialize package.json",
            "requires_approval": True,
            "rollback": "rm package.json"
        },
        "NpmYarnConflict": {
            "pattern": r"npm.*yarn.*lock.*conflict",
            "fix": "rm package-lock.json && npm install",
            "description": "Resolve npm/yarn lock conflict",
            "requires_approval": False,
            "rollback": None
        },
        "TypeScriptError": {
            "pattern": r"TS[0-9]+:",
            "fix": "npm install --save-dev typescript && npx tsc --noEmit",
            "description": "Fix TypeScript compilation error",
            "requires_approval": False,
            "rollback": None
        },
        
        # Docker errors
        "DockerfileNotFound": {
            "pattern": r"Dockerfile.*not found",
            "fix": "docker init",
            "description": "Initialize Dockerfile",
            "requires_approval": True,
            "rollback": "rm Dockerfile .dockerignore"
        },
        "DockerBaseImageMissing": {
            "pattern": r"pull access denied.*repository does not exist",
            "fix": "# Update Dockerfile with valid base image",
            "description": "Fix Docker base image",
            "requires_approval": True,
            "rollback": None
        },
        "DockerPortConflict": {
            "pattern": r"port.*already allocated",
            "fix": "docker ps -a | grep {port} | awk '{print $1}' | xargs docker stop",
            "description": "Stop container using conflicting port",
            "requires_approval": False,
            "rollback": None
        },
        
        # Database errors
        "DatabaseConnectionTimeout": {
            "pattern": r"connection.*timeout|could not connect to database",
            "fix": "# Restart database service or check connection string",
            "description": "Fix database connection timeout",
            "requires_approval": True,
            "rollback": None
        },
        "MigrationFailure": {
            "pattern": r"migration.*failed|alembic.*error",
            "fix": "# Rollback and reapply migrations",
            "description": "Fix database migration failure",
            "requires_approval": True,
            "rollback": None
        },
        
        # Build tool errors
        "MavenBuildFailure": {
            "pattern": r"Maven.*BUILD FAILURE",
            "fix": "mvn clean install -U",
            "description": "Clean and rebuild Maven project",
            "requires_approval": False,
            "rollback": None
        },
        "GradleBuildFailure": {
            "pattern": r"Gradle.*FAILURE",
            "fix": "gradle clean build --refresh-dependencies",
            "description": "Clean and rebuild Gradle project",
            "requires_approval": False,
            "rollback": None
        },
        "MakeError": {
            "pattern": r"make:.*Error",
            "fix": "make clean && make",
            "description": "Clean and rebuild with Make",
            "requires_approval": False,
            "rollback": None
        },
        
        # Linting errors
        "ESLintError": {
            "pattern": r"eslint.*error|ESLint.*found",
            "fix": "npx eslint . --fix",
            "description": "Auto-fix ESLint errors",
            "requires_approval": False,
            "rollback": None
        },
        "PylintError": {
            "pattern": r"pylint.*error|Your code has been rated",
            "fix": "autopep8 --in-place --aggressive --aggressive -r .",
            "description": "Auto-fix Pylint errors",
            "requires_approval": False,
            "rollback": None
        },
        "BlackFormatting": {
            "pattern": r"would reformat|reformatted",
            "fix": "black .",
            "description": "Format code with Black",
            "requires_approval": False,
            "rollback": None
        },
        
        # Test failures
        "TestSetupError": {
            "pattern": r"test.*setup.*failed|fixture.*not found",
            "fix": "# Check test configuration and fixtures",
            "description": "Fix test setup error",
            "requires_approval": True,
            "rollback": None
        },
        "MockConfigError": {
            "pattern": r"mock.*error|MagicMock.*error",
            "fix": "pip install --upgrade pytest-mock",
            "description": "Fix mock configuration",
            "requires_approval": False,
            "rollback": None
        },
        
        # Security vulnerabilities
        "DependencySecurity": {
            "pattern": r"security vulnerability|CVE-[0-9]+-[0-9]+",
            "fix": "npm audit fix || pip-audit --fix",
            "description": "Fix security vulnerabilities",
            "requires_approval": False,
            "rollback": None
        },
        "CredentialLeak": {
            "pattern": r"detected.*credential|secret.*exposed",
            "fix": "# Remove credentials from code and use environment variables",
            "description": "Fix credential leak",
            "requires_approval": True,
            "rollback": None
        },
        
        # Infrastructure errors
        "KubernetesDeploymentFailure": {
            "pattern": r"kubectl.*error|deployment.*failed",
            "fix": "kubectl rollout restart deployment/{name}",
            "description": "Restart Kubernetes deployment",
            "requires_approval": True,
            "rollback": None
        },
        "TerraformError": {
            "pattern": r"terraform.*error|Error:.*terraform",
            "fix": "terraform init -upgrade && terraform plan",
            "description": "Reinitialize Terraform",
            "requires_approval": True,
            "rollback": None
        },
    }
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the evaluation engine with optional configuration."""
        self.config = self._load_config(config_path)
        self.rate_limiter = RateLimiter(
            max_calls=self.config.get("rate_limit_calls", 60),
            time_window=self.config.get("rate_limit_window", 60)
        )
        self.audit_log: List[AuditEntry] = []
        self.metrics = {
            "total_fixes_attempted": 0,
            "successful_fixes": 0,
            "failed_fixes": 0,
            "rollbacks": 0
        }
        
    def _load_config(self, config_path: Optional[str]) -> Dict[str, Any]:
        """Load configuration from YAML file or use defaults."""
        default_config = {
            "log_level": "INFO",
            "rate_limit_calls": 60,
            "rate_limit_window": 60,
            "max_retry_attempts": 3,
            "retry_delay": 5,
            "auto_approve": False,
            "notification_enabled": False,
            "rollback_on_failure": True,
            "audit_log_path": "logs/audit.log"
        }
        
        if config_path and os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    if config_path.endswith('.yaml') or config_path.endswith('.yml'):
                        user_config = yaml.safe_load(f)
                    else:
                        user_config = json.load(f)
                default_config.update(user_config)
                logger.info(f"Loaded configuration from {config_path}")
            except Exception as e:
                logger.error(f"Failed to load config: {e}")
        
        return default_config
    
    def analyze_error(self, error_output: str) -> Optional[Tuple[str, Dict, Dict]]:
        """
        Analyze error output and find matching fix pattern.
        Returns (error_type, fix_info, match_groups) or None if no match found.
        """
        for error_type, fix_info in self.KNOWN_FIXES.items():
            pattern = fix_info["pattern"]
            match = re.search(pattern, error_output, re.MULTILINE | re.IGNORECASE)
            if match:
                logger.info(f"Matched error pattern: {error_type}")
                # Extract match groups for placeholder replacement
                match_groups = match.groupdict() if match.groups() else {}
                if not match_groups and match.groups():
                    # If no named groups, create numbered groups
                    match_groups = {str(i): g for i, g in enumerate(match.groups(), 1)}
                return error_type, fix_info, match_groups
        
        logger.warning("No matching error pattern found")
        return None
    
    def apply_fix_with_retry(
        self,
        fix_command: str,
        error_type: str,
        max_retries: Optional[int] = None
    ) -> FixResult:
        """
        Apply fix with exponential backoff retry logic.
        """
        max_retries = max_retries or self.config.get("max_retry_attempts", 3)
        retry_delay = self.config.get("retry_delay", 5)
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Attempting fix (attempt {attempt + 1}/{max_retries}): {fix_command}")
                
                # Validate command
                is_safe, sanitized_cmd = InputValidator.sanitize_command(fix_command)
                if not is_safe:
                    return FixResult(
                        success=False,
                        fix_applied=fix_command,
                        error_pattern=error_type,
                        details="Command failed security validation"
                    )
                
                # Apply rate limiting
                self.rate_limiter.wait_if_needed()
                
                # Execute fix
                result = subprocess.run(
                    sanitized_cmd,
                    shell=True,
                    capture_output=True,
                    text=True,
                    timeout=300
                )
                
                if result.returncode == 0:
                    logger.info(f"Fix applied successfully: {fix_command}")
                    self.metrics["successful_fixes"] += 1
                    return FixResult(
                        success=True,
                        fix_applied=fix_command,
                        error_pattern=error_type,
                        details=result.stdout
                    )
                else:
                    logger.warning(f"Fix attempt {attempt + 1} failed: {result.stderr}")
                    if attempt < max_retries - 1:
                        sleep_time = retry_delay * (2 ** attempt)  # Exponential backoff
                        logger.info(f"Retrying in {sleep_time} seconds...")
                        time.sleep(sleep_time)
            
            except subprocess.TimeoutExpired:
                logger.error(f"Fix command timed out: {fix_command}")
            except Exception as e:
                logger.error(f"Error applying fix: {e}")
        
        self.metrics["failed_fixes"] += 1
        return FixResult(
            success=False,
            fix_applied=fix_command,
            error_pattern=error_type,
            details="All retry attempts failed"
        )
    
    def requires_approval(self, fix_info: Dict) -> bool:
        """Check if fix requires manual approval."""
        if self.config.get("auto_approve", False):
            return False
        return fix_info.get("requires_approval", False)
    
    def rollback_fix(self, fix_result: FixResult) -> bool:
        """Rollback a previously applied fix."""
        if not fix_result.rollback_command:
            logger.warning("No rollback command available")
            return False
        
        try:
            logger.info(f"Rolling back: {fix_result.rollback_command}")
            result = subprocess.run(
                fix_result.rollback_command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                logger.info("Rollback successful")
                self.metrics["rollbacks"] += 1
                return True
            else:
                logger.error(f"Rollback failed: {result.stderr}")
                return False
        except Exception as e:
            logger.error(f"Error during rollback: {e}")
            return False
    
    def create_audit_entry(
        self,
        action: str,
        error_pattern: str,
        fix_applied: str,
        success: bool,
        file_changes: List[str],
        rollback_command: Optional[str] = None
    ):
        """Create audit log entry."""
        entry = AuditEntry(
            timestamp=datetime.now(),
            action=action,
            error_pattern=error_pattern,
            fix_applied=fix_applied,
            success=success,
            file_changes=file_changes,
            rollback_command=rollback_command
        )
        self.audit_log.append(entry)
        
        # Write to audit log file
        audit_path = Path(self.config.get("audit_log_path", "logs/audit.log"))
        audit_path.parent.mkdir(exist_ok=True)
        
        with open(audit_path, 'a') as f:
            f.write(json.dumps({
                "timestamp": entry.timestamp.isoformat(),
                "action": entry.action,
                "error_pattern": entry.error_pattern,
                "fix_applied": entry.fix_applied,
                "success": entry.success,
                "file_changes": entry.file_changes,
                "rollback_command": entry.rollback_command,
                "user": entry.user
            }) + "\n")
    
    def send_notification(self, message: str, level: str = "info"):
        """Send notification (Slack/email) about fix attempts."""
        if not self.config.get("notification_enabled", False):
            return
        
        # Mask sensitive data
        safe_message = SecretManager.mask_sensitive_data(message)
        
        # TODO: Implement actual notification logic
        logger.info(f"NOTIFICATION ({level}): {safe_message}")
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get metrics and analytics."""
        return {
            **self.metrics,
            "success_rate": (
                self.metrics["successful_fixes"] / self.metrics["total_fixes_attempted"]
                if self.metrics["total_fixes_attempted"] > 0 else 0
            )
        }
    
    def evaluate_and_heal(self, error_output: str) -> Optional[FixResult]:
        """
        Main method to evaluate error and attempt healing.
        """
        logger.info("Starting evaluation and healing process")
        self.metrics["total_fixes_attempted"] += 1
        
        try:
            # Analyze error
            result = self.analyze_error(error_output)
            if not result:
                logger.warning("No fix available for this error")
                return None
            
            error_type, fix_info, match_groups = result
            
            # Check if approval is required
            if self.requires_approval(fix_info):
                logger.warning(f"Fix requires manual approval: {fix_info['description']}")
                self.send_notification(
                    f"Manual approval required for: {fix_info['description']}",
                    level="warning"
                )
                return None
            
            # Apply fix with placeholder replacement
            fix_command = fix_info["fix"]
            
            # Replace placeholders with matched values
            if match_groups:
                # Try to replace named placeholders
                for key, value in match_groups.items():
                    if value:
                        fix_command = fix_command.replace(f"{{{key}}}", value)
                        fix_command = fix_command.replace("{module}", value)  # Common alias
                        fix_command = fix_command.replace("{version}", value)
                        fix_command = fix_command.replace("{port}", value)
                        fix_command = fix_command.replace("{name}", value)
            
            fix_result = self.apply_fix_with_retry(fix_command, error_type)
            
            # Create audit entry
            self.create_audit_entry(
                action="auto_fix",
                error_pattern=error_type,
                fix_applied=fix_command,
                success=fix_result.success,
                file_changes=[],  # TODO: Track actual file changes
                rollback_command=fix_info.get("rollback")
            )
            
            # Send notification
            if fix_result.success:
                self.send_notification(
                    f"Successfully applied fix: {fix_info['description']}",
                    level="success"
                )
            else:
                self.send_notification(
                    f"Failed to apply fix: {fix_info['description']}",
                    level="error"
                )
            
            return fix_result
            
        except Exception as e:
            logger.error(f"Error during evaluation and healing: {e}", exc_info=True)
            self.metrics["failed_fixes"] += 1
            return None


def main():
    """Main entry point for CLI usage."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Enhanced Self-Healing Evaluation Engine")
    parser.add_argument(
        "--config",
        type=str,
        help="Path to configuration file (YAML/JSON)"
    )
    parser.add_argument(
        "--error-log",
        type=str,
        help="Path to error log file to analyze"
    )
    parser.add_argument(
        "--error-text",
        type=str,
        help="Error text to analyze directly"
    )
    parser.add_argument(
        "--metrics",
        action="store_true",
        help="Display metrics and exit"
    )
    
    args = parser.parse_args()
    
    # Initialize engine
    engine = EvaluationEngine(config_path=args.config)
    
    if args.metrics:
        print(json.dumps(engine.get_metrics(), indent=2))
        return
    
    # Get error input
    error_text = ""
    if args.error_log:
        with open(args.error_log, 'r') as f:
            error_text = f.read()
    elif args.error_text:
        error_text = args.error_text
    else:
        # Read from stdin
        error_text = sys.stdin.read()
    
    if not error_text:
        logger.error("No error text provided")
        sys.exit(1)
    
    # Evaluate and heal
    result = engine.evaluate_and_heal(error_text)
    
    if result:
        print(json.dumps({
            "success": result.success,
            "fix_applied": result.fix_applied,
            "error_pattern": result.error_pattern,
            "timestamp": result.timestamp.isoformat(),
            "details": result.details
        }, indent=2))
        sys.exit(0 if result.success else 1)
    else:
        logger.error("No fix could be applied")
        sys.exit(1)


if __name__ == "__main__":
    main()
