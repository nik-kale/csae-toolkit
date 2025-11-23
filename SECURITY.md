# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| < 1.2.0 | :x:                |

## Reporting a Vulnerability

The CSAE Toolkit team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the [Security tab](https://github.com/nik-kale/csae-toolkit/security) of this repository
   - Click "Report a vulnerability"
   - Fill out the form with details about the vulnerability

2. **Email**
   - Send details to the project maintainers
   - Include the word "SECURITY" in the subject line
   - Provide detailed information about the vulnerability

### What to Include in Your Report

To help us better understand the nature and scope of the issue, please include as much of the following information as possible:

- Type of vulnerability (e.g., XSS, code injection, privilege escalation)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it
- Your assessment of the severity

### What to Expect

After you submit a report, you can expect:

1. **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
2. **Assessment**: We'll send a more detailed response within 7 days indicating next steps
3. **Updates**: We'll keep you informed about our progress
4. **Fix**: We'll work on a fix and coordinate the release timing with you
5. **Credit**: We'll credit you in the security advisory (if you wish)

### Security Update Process

1. The security report is received and assigned a primary handler
2. The problem is confirmed and affected versions are determined
3. Code is audited to find similar problems
4. Fixes are prepared for all supported versions
5. A security advisory is published with credit to the reporter

### Disclosure Policy

- Security issues are disclosed publicly once a fix is available
- We coordinate the disclosure timing with the reporter
- We publish a security advisory on GitHub
- We update the CHANGELOG with security fixes

### Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue.

## Security Best Practices for Users

When using CSAE Toolkit:

1. **Keep Updated**: Always use the latest version of the extension
2. **Review Permissions**: Be aware of the permissions requested by the extension
3. **Report Issues**: If you notice suspicious behavior, report it immediately
4. **Source Code**: The source code is open for security auditing
5. **Chrome Web Store**: Only install from official sources

## Known Security Considerations

### Permissions

CSAE Toolkit requests the following permissions:

- `activeTab`: To interact with the current tab
- `scripting`: To inject content scripts
- `storage`: To save extension data
- `cookies`: For CSAE integration
- `clipboardWrite`: To copy CSS selectors and colors
- `sidePanel`: For the side panel interface
- `host_permissions`: To interact with web pages

These permissions are necessary for the extension's functionality. We do not collect, transmit, or store any personal data.

### Content Security Policy

The extension implements a strict Content Security Policy to prevent XSS attacks:
```
script-src 'self'; object-src 'self'
```

## Third-Party Dependencies

We regularly audit our dependencies for known vulnerabilities using:
- npm audit
- Dependabot alerts (when available)

## Contact

For security-related questions or concerns, please use the reporting methods listed above.

---

**Thank you for helping keep CSAE Toolkit and our users safe!**
