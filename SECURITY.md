# Security Policy

## Supported Versions

Access To Experts is in early development. Security updates are applied to the `main` branch. Once versioned releases are published, this section will specify which versions receive security updates.

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Instead, report them privately by one of the following methods:

- **Email:** security@[domain-to-be-configured]
- **GitHub Security Advisory:** Use the "Report a vulnerability" button under the Security tab of this repository

Please include:

- Type of issue (e.g., authentication bypass, injection, sensitive data exposure, PII leak)
- Full paths of source files related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Response Timeline

- **Acknowledgment:** Within 3 business days of receipt
- **Initial assessment:** Within 10 business days
- **Resolution target:** Varies by severity (Critical: 30 days, High: 60 days, Medium/Low: next release)

## Disclosure Policy

We follow a coordinated disclosure process:

1. Report received and acknowledged
2. We confirm the issue and determine severity
3. We develop a fix
4. We prepare a security advisory
5. We release the fix
6. We publish the advisory crediting the reporter (if desired)

We request that reporters:

- Give us reasonable time to investigate and mitigate before any public disclosure
- Make a good-faith effort to avoid privacy violations, destruction of data, or interruption of service
- Do not access, modify, or delete data that does not belong to you
- Do not exploit the vulnerability beyond the minimum necessary to demonstrate it

## Scope

This policy applies to:

- The Access To Experts platform and its APIs
- Official mobile and web clients
- Official infrastructure (hosted versions)
- Schemas, SDKs, and integrations published under this repository

Out of scope:

- Third-party integrations not developed by the A2X team
- Social engineering attacks on staff, experts, or users
- Physical attacks on infrastructure
- DoS attacks

## Safe Harbor

We consider security research conducted in accordance with this policy to be:

- Authorized under the Computer Fraud and Abuse Act (CFAA)
- Exempt from DMCA restrictions on circumventing technological measures for this research
- Exempt from restrictions in our Terms of Service that would interfere with conducting security research

We waive any claim against you for circumventing technological measures that protect the services in scope. We will not pursue civil or criminal action against you for research activities conducted in accordance with this policy.

## Recognition

Security researchers who responsibly disclose vulnerabilities will be recognized in our Security Hall of Fame (once established) and may be eligible for a bug bounty program (when launched).

## Compliance & Certifications

Target compliance posture (in progress or planned):

- SOC 2 Type II
- ISO 27001
- HIPAA (for clinical verticals)
- GDPR
- CCPA and state privacy laws
- FedRAMP Moderate (for government contracts)
- WCAG 2.2 AA accessibility

See [`docs/compliance/`](docs/compliance/) for detailed compliance documentation.
