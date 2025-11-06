# API Security and Abuse Prevention

## Overview

This document outlines the security measures and API abuse prevention techniques implemented in BugBattle (Miss Information Platform).

## Rate Limiting

### Implementation

**Per-Endpoint Rate Limits:**
```javascript
// Example rate limiting configuration
const rateLimits = {
  '/api/game/submit': { requests: 10, window: 60 },      // 10 requests per minute
  '/api/wikipedia/verify': { requests: 30, window: 60 }, // 30 requests per minute
  '/api/rss/feed': { requests: 20, window: 60 },         // 20 requests per minute
  '/api/tavus/*': { requests: 5, window: 300 },          // 5 requests per 5 minutes
  '/api/xai/*': { requests: 15, window: 60 }             // 15 requests per minute
};
```

### Strategy

- **IP-based limiting**: Track requests by IP address
- **User-based limiting**: Additional limits for authenticated users
- **Sliding window**: Smooth rate limiting without burst allowance
- **Exponential backoff**: Increasing delays for repeated violations

### Response Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1699308000
Retry-After: 45
```

## Authentication Security

### NextAuth.js Integration

**Session Management:**
- Secure HTTP-only cookies
- CSRF token protection
- Session rotation on authentication
- Automatic session expiration (24 hours)

**Password Security:**
- Bcrypt hashing (cost factor: 12)
- Minimum password requirements: 8 characters, mixed case, numbers
- No password in logs or error messages
- Account lockout after 5 failed attempts (15-minute cooldown)

### JWT Security

```javascript
// JWT configuration
{
  secret: process.env.NEXTAUTH_SECRET, // Strong random secret
  maxAge: 24 * 60 * 60, // 24 hours
  updateAge: 60 * 60,    // Refresh every hour
  encryption: true       // Encrypted JWTs
}
```

## Input Validation

### Sanitization

**All user inputs are validated and sanitized:**

```javascript
// Example validation schema
const gameSubmissionSchema = {
  articleId: { type: 'string', pattern: /^[a-zA-Z0-9-]+$/, maxLength: 100 },
  score: { type: 'number', min: 0, max: 100 },
  answers: { type: 'array', maxLength: 50 },
  category: { type: 'string', enum: ['climate', 'energy', 'tech', 'politics'] }
};
```

**Protection Against:**
- SQL Injection (parameterized queries, ORM)
- XSS (React auto-escaping, CSP headers)
- Command Injection (no shell execution of user input)
- Path Traversal (whitelist validation)
- NoSQL Injection (input type checking)

### Content Security Policy

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.openai.com https://api.tavus.io;
  frame-ancestors 'none';
```

## API Endpoint Security

### Protected Routes

**Authentication Required:**
- `/api/game/submit`
- `/api/game/progress`
- `/api/game/leaderboard` (write operations)
- `/api/tavus/*` (admin endpoints)

**Public with Rate Limiting:**
- `/api/wikipedia/verify`
- `/api/rss/feed`
- `/api/game/leaderboard` (read operations)

### Request Validation

```javascript
// Middleware example
async function validateRequest(req, res, next) {
  // Check authentication
  if (requiresAuth && !req.session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check rate limit
  if (await isRateLimited(req.ip, req.path)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Validate input
  const validation = validateInput(req.body, schema);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.errors });
  }

  next();
}
```

## CORS Configuration

### Strict Origin Policy

```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
```

### Preflight Handling

- OPTIONS requests handled efficiently
- Wildcard origins blocked in production
- Credentials only for trusted origins

## Error Handling

### Secure Error Messages

**User-facing errors (sanitized):**
```json
{
  "error": "Invalid request",
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-11-06T12:00:00Z"
}
```

**Internal errors (logged, not exposed):**
```javascript
// Never expose to users:
// - Stack traces
// - Database errors
// - File paths
// - API keys
// - Internal IPs
```

### Error Logging

- Centralized error logging
- Sensitive data redacted
- Rate limit on error endpoints
- Alerting for unusual patterns

## API Abuse Detection

### Monitoring Metrics

**Real-time Detection:**
- Request rate anomalies
- Failed authentication attempts
- Invalid input patterns
- Unusual endpoint access
- Geographic anomalies

**Automated Response:**
1. **Warning**: Log suspicious activity
2. **Throttle**: Reduce rate limits for offender
3. **Temporary Block**: 15-minute IP block
4. **Permanent Block**: After repeated violations
5. **Alert**: Notify administrators

### Abuse Patterns

**Common Attack Vectors:**
- Credential stuffing
- Brute force attacks
- API scraping
- Resource exhaustion
- DDoS attempts

**Countermeasures:**
- CAPTCHA for repeated failures
- Progressive delays
- IP reputation checking
- Behavioral analysis

## Data Protection

### Sensitive Data Handling

**API Keys and Secrets:**
- Never in code or version control
- Environment variables only
- Rotation schedule (90 days)
- Separate keys per environment
- Least privilege access

**Data Encryption:**
- TLS 1.3 for transport
- Encrypted database fields (where applicable)
- Encrypted backups
- Secure key management

### Logging Security

**What We Log:**
- API endpoint access (anonymized)
- Error events
- Security events
- Performance metrics

**What We DON'T Log:**
- Passwords (plain or hashed)
- Full API keys
- Personal information
- Request bodies with sensitive data

## Third-Party API Security

### External API Calls

**Security Measures:**
- API keys in environment variables
- Request signing where supported
- Timeout and retry limits
- Response validation
- Error handling and fallbacks

**Rate Limit Management:**
```javascript
// Respect external API limits
const externalLimits = {
  wikipedia: { requests: 200, window: 60 },
  openai: { tokens: 10000, window: 60 },
  tavus: { videos: 10, window: 3600 }
};
```

### Failure Handling

- Graceful degradation
- Caching for resilience
- Circuit breaker pattern
- User notification for outages

## Compliance

### Security Standards

- **OWASP Top 10**: All vulnerabilities addressed
- **SANS Top 25**: Common weakness mitigation
- **PCI DSS**: Not applicable (no payment processing)
- **SOC 2**: Aligned practices (if applicable)

### Regular Audits

- Dependency vulnerability scans (weekly)
- Code security reviews (per release)
- Penetration testing (quarterly)
- Third-party security audits (annually)

## Incident Response

### Security Incident Procedure

1. **Detection**: Automated alerts and monitoring
2. **Analysis**: Assess scope and impact
3. **Containment**: Block malicious actors
4. **Eradication**: Remove vulnerability
5. **Recovery**: Restore normal operations
6. **Review**: Post-incident analysis

### Disclosure Timeline

- **Internal team**: Immediate notification
- **Affected users**: Within 72 hours
- **Public disclosure**: After fix deployed (90 days coordinated disclosure)

## Best Practices for Users

### Secure Usage

**For Developers:**
- Keep dependencies updated
- Never commit secrets
- Use strong NEXTAUTH_SECRET
- Rotate API keys regularly
- Monitor access logs

**For Administrators:**
- Regular security updates
- Monitor abuse alerts
- Review access logs
- Backup data regularly
- Test disaster recovery

## Security Contact

For security concerns or vulnerability reports:

- **Email**: security@yourdomain.com
- **PGP Key**: Available on GitHub
- **Response Time**: Within 24 hours
- **Disclosure Policy**: 90 days coordinated disclosure

See [VULNERABILITY_DISCLOSURE.md](VULNERABILITY_DISCLOSURE.md) for detailed reporting instructions.

## Additional Resources

- [OWASP API Security Project](https://owasp.org/www-project-api-security/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

Security is an ongoing process. This document is regularly updated to reflect current best practices and emerging threats.
