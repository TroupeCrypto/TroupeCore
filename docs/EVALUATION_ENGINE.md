# Enhanced Self-Healing Evaluation Engine

## Overview

The Enhanced Self-Healing Evaluation Engine is a comprehensive system designed to automatically detect and fix common build, test, and deployment failures in CI/CD pipelines. It provides intelligent error pattern matching, automated fix application, rollback capabilities, and comprehensive audit logging.

## Features

### 🔍 Error Detection
- **Comprehensive Pattern Matching**: Detects 20+ common error patterns across multiple languages and tools
- **Python Errors**: Module imports, version conflicts, virtual environment issues
- **Node.js/JavaScript**: Package management, TypeScript compilation, linting
- **Docker**: Container build, image, and port conflicts
- **Database**: Connection timeouts, migration failures
- **Build Tools**: Maven, Gradle, Make failures
- **Security**: Dependency vulnerabilities, credential leaks
- **Infrastructure**: Kubernetes, Terraform issues

### 🛠️ Automated Fixes
- **Safe Command Execution**: Input validation and sanitization
- **Exponential Backoff**: Retry logic with configurable attempts
- **Rollback Support**: Automatic rollback on failure
- **Approval Workflow**: Optional manual approval for sensitive operations

### 🔒 Security
- **Input Validation**: Prevents command injection and dangerous operations
- **Secret Masking**: Automatically masks tokens and passwords in logs
- **Permission Checks**: Validates GitHub token permissions
- **Rate Limiting**: GitHub API rate limiting with automatic throttling
- **Audit Logging**: Complete audit trail of all automated changes

### 📊 Monitoring & Metrics
- **Real-time Metrics**: Success rates, fix attempts, rollbacks
- **Audit Logs**: Timestamped records of all actions
- **Notification Support**: Slack, email notifications (extensible)
- **Export Options**: JSON metrics export for external systems

## Installation

### Prerequisites
- Python 3.9 or higher
- pip package manager
- Git

### Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/TroupeCrypto/TroupeCore.git
   cd TroupeCore
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure the engine**:
   ```bash
   # Copy and edit the configuration file
   cp config/engine_config.yaml config/my_config.yaml
   # Edit config/my_config.yaml with your settings
   ```

## Configuration

### Configuration File Structure

The engine uses YAML configuration files. Here's a complete example:

```yaml
# Logging
log_level: "INFO"

# Rate Limiting
rate_limit_calls: 60
rate_limit_window: 60

# Retry Configuration
max_retry_attempts: 3
retry_delay: 5

# Approval Workflow
auto_approve: false
require_approval_patterns:
  - "PythonVersionConflict"
  - "DockerfileNotFound"

# Notifications
notification_enabled: true
notification_channels:
  slack:
    enabled: true
    webhook_url: "${SLACK_WEBHOOK_URL}"
    channel: "#ci-alerts"

# Security
validate_commands: true
allow_dangerous_operations: false
max_command_timeout: 300
```

### Environment Variables

- `GITHUB_TOKEN`: GitHub personal access token with appropriate permissions
- `SLACK_WEBHOOK_URL`: Slack webhook for notifications (optional)
- `CONFIG_PATH`: Path to configuration file (default: `config/engine_config.yaml`)

## Usage

### Command Line Interface

The evaluation engine can be used via CLI:

```bash
# Analyze error from file
python evaluation_engine.py --error-log path/to/error.log

# Analyze error text directly
python evaluation_engine.py --error-text "ModuleNotFoundError: No module named 'requests'"

# Use custom configuration
python evaluation_engine.py --config config/my_config.yaml --error-log errors.log

# Display metrics
python evaluation_engine.py --metrics

# Read from stdin
cat error.log | python evaluation_engine.py
```

### Python API

Use the engine programmatically:

```python
from evaluation_engine import EvaluationEngine

# Initialize with config
engine = EvaluationEngine(config_path='config/engine_config.yaml')

# Analyze and heal
error_output = """
ModuleNotFoundError: No module named 'requests'
"""

result = engine.evaluate_and_heal(error_output)

if result and result.success:
    print(f"Fix applied: {result.fix_applied}")
else:
    print("No fix could be applied")

# Get metrics
metrics = engine.get_metrics()
print(f"Success rate: {metrics['success_rate']:.2%}")
```

### GitHub Actions Integration

The engine integrates seamlessly with GitHub Actions:

```yaml
# Add to your workflow
- name: Run Self-Healing
  if: failure()
  run: |
    python evaluation_engine.py --error-log ${{ steps.build.outputs.log }}
```

Or use the dedicated self-healing workflow that triggers automatically on failures.

## Supported Error Patterns

### Python Errors

| Error Type | Pattern | Fix |
|------------|---------|-----|
| ModuleNotFoundError | `No module named 'X'` | `pip install X` |
| ImportError | `cannot import name 'X'` | `pip install --upgrade X` |
| Python Version | Version requirement mismatch | `pyenv install` |
| Requirements.txt | File not found | `pip freeze > requirements.txt` |

### Node.js/JavaScript Errors

| Error Type | Pattern | Fix |
|------------|---------|-----|
| Module Not Found | `Cannot find module 'X'` | `npm install X` |
| Package.json | File missing | `npm init -y` |
| Lock Conflict | npm/yarn lock conflict | Remove lock and reinstall |
| TypeScript | Compilation errors | Install and check TypeScript |

### Docker Errors

| Error Type | Pattern | Fix |
|------------|---------|-----|
| Dockerfile Missing | Dockerfile not found | `docker init` |
| Base Image | Pull access denied | Update Dockerfile |
| Port Conflict | Port already allocated | Stop conflicting container |

### Database Errors

| Error Type | Pattern | Fix |
|------------|---------|-----|
| Connection Timeout | Connection timeout | Check connection/restart |
| Migration Failure | Migration failed | Rollback and reapply |

### Build Tool Errors

| Error Type | Pattern | Fix |
|------------|---------|-----|
| Maven | BUILD FAILURE | `mvn clean install -U` |
| Gradle | FAILURE | Clean and rebuild |
| Make | Make error | `make clean && make` |

### Linting Errors

| Error Type | Pattern | Fix |
|------------|---------|-----|
| ESLint | ESLint errors | `npx eslint . --fix` |
| Pylint | Pylint errors | `autopep8` |
| Black | Formatting needed | `black .` |

### Security Issues

| Error Type | Pattern | Fix |
|------------|---------|-----|
| Dependencies | CVE vulnerabilities | `npm audit fix` |
| Credentials | Credential leak | Manual intervention |

## Architecture

### Core Components

1. **EvaluationEngine**: Main orchestrator
2. **InputValidator**: Command sanitization and validation
3. **SecretManager**: Sensitive data handling
4. **RateLimiter**: API rate limiting
5. **FixResult**: Fix operation result
6. **AuditEntry**: Audit log entry

### Workflow

```
┌─────────────────┐
│ Error Detected  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Analyze Pattern │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      No Match
│ Match Found?    ├──────────────► Log & Exit
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│ Approval Needed?├──► Yes ──► Request Approval
└────────┬────────┘
         │ No
         ▼
┌─────────────────┐
│ Validate Fix    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply Fix       │
│ (with retry)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      Success
│ Verify Result   ├──────────────► Log & Commit
└────────┬────────┘
         │ Failure
         ▼
┌─────────────────┐
│ Rollback        │
└─────────────────┘
```

## Security Considerations

### Command Validation

The engine validates all commands before execution:

- Blocks dangerous patterns (`rm -rf /`, `eval`, etc.)
- Prevents command injection
- Sanitizes input
- Enforces timeouts

### Secret Management

- Automatically masks GitHub tokens
- Masks passwords and API keys
- Sanitizes all log output
- Validates token formats

### Permissions

Required GitHub token permissions:
- `contents: write` - To commit fixes
- `pull-requests: write` - To create PRs
- `issues: write` - To create issues
- `actions: read` - To read workflow logs

### Rate Limiting

- Default: 60 requests per 60 seconds
- Automatic throttling
- Exponential backoff on retry
- Configurable limits

## Monitoring & Debugging

### Audit Logs

All actions are logged to `logs/audit.log`:

```json
{
  "timestamp": "2024-01-01T12:00:00",
  "action": "auto_fix",
  "error_pattern": "ModuleNotFoundError",
  "fix_applied": "pip install requests",
  "success": true,
  "file_changes": ["requirements.txt"],
  "rollback_command": "pip uninstall -y requests",
  "user": "evaluation_engine"
}
```

### Metrics

Access real-time metrics:

```python
metrics = engine.get_metrics()
# {
#   "total_fixes_attempted": 100,
#   "successful_fixes": 85,
#   "failed_fixes": 15,
#   "rollbacks": 3,
#   "success_rate": 0.85
# }
```

### Log Levels

Configure logging detail:
- `DEBUG`: Detailed diagnostic information
- `INFO`: General informational messages
- `WARNING`: Warning messages
- `ERROR`: Error messages
- `CRITICAL`: Critical failures

## Extending the Engine

### Adding New Error Patterns

Edit `evaluation_engine.py` and add to `KNOWN_FIXES`:

```python
"MyCustomError": {
    "pattern": r"my custom error pattern",
    "fix": "my fix command",
    "description": "Description of the fix",
    "requires_approval": False,
    "rollback": "rollback command"
}
```

### Custom Notifications

Implement notification handlers:

```python
def send_slack_notification(message, level):
    # Your Slack integration
    pass

def send_email_notification(message, level):
    # Your email integration
    pass
```

### Integration with Monitoring Systems

Export metrics to Prometheus, Grafana, etc.:

```python
# In your monitoring script
from evaluation_engine import EvaluationEngine

engine = EvaluationEngine()
metrics = engine.get_metrics()

# Export to Prometheus
# Export to Grafana
# etc.
```

## Troubleshooting

### Common Issues

**Issue**: Fixes not being applied
- Check `auto_approve` setting in config
- Verify error pattern matches
- Check audit logs for details

**Issue**: Rate limit errors
- Increase `rate_limit_window`
- Add delays between operations
- Check GitHub token quota

**Issue**: Rollback failures
- Verify rollback command is valid
- Check file permissions
- Review audit logs

### Debug Mode

Enable verbose logging:

```yaml
log_level: "DEBUG"
advanced:
  verbose_logging: true
```

### Dry Run Mode

Test without applying fixes:

```yaml
advanced:
  dry_run: true
```

## Best Practices

1. **Start Conservative**: Begin with `auto_approve: false` and review fixes manually
2. **Monitor Metrics**: Track success rates and adjust patterns
3. **Review Audit Logs**: Regularly check automated changes
4. **Test Rollbacks**: Ensure rollback commands work
5. **Secure Tokens**: Use environment variables for sensitive data
6. **Configure Notifications**: Stay informed of automated changes
7. **Version Control**: Track configuration changes

## Contributing

Contributions are welcome! To add new error patterns:

1. Fork the repository
2. Add pattern to `KNOWN_FIXES`
3. Add tests in `tests/test_evaluation_engine.py`
4. Update documentation
5. Submit a pull request

## License

See LICENSE file in repository.

## Support

- **Issues**: https://github.com/TroupeCrypto/TroupeCore/issues
- **Documentation**: https://github.com/TroupeCrypto/TroupeCore/docs
- **Examples**: See `examples/` directory

## Changelog

### Version 1.0.0
- Initial release
- 20+ error patterns
- Comprehensive security features
- GitHub Actions integration
- Full audit logging
- Rollback support
- Notification system
