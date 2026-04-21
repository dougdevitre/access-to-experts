# Glossary

Shared vocabulary for Access To Experts. When in doubt, use these terms consistently across docs, code, and UI copy.

---

**A2X** — Access To Experts. The platform.

**Anchor Expert** — An expert at the highest credential tier. Typically globally recognized, co-branded, with revenue guarantees.

**Anchor Institution** — A professional body, university, or enterprise that anchors supply or distribution via a strategic partnership.

**Artifact** — A structured output produced by a session (document, plan, checklist, decision record). Belongs to the session and the user who executed it.

**Branching Logic** — Conditional paths within a playbook that route the user to different steps based on inputs or prior answers.

**CAC** — Customer Acquisition Cost.

**Certified Practitioner** — Middle-tier expert. Credential verified, content QA-reviewed, standard 70/30 revenue share.

**CLE / CE / CME** — Continuing Legal Education / Continuing Education / Continuing Medical Education. Credentialing partnerships issue these credits for completed playbooks.

**Consumer** — An individual user paying for their own access (as opposed to enterprise-paid).

**Content QA** — Content Quality Assurance. The pipeline that validates playbooks before publication (automated lint + peer review + legal review).

**Credit** — The metering unit. ~$0.15 retail value. Consumed per step, per AI turn, per artifact.

**Credit Ledger** — Immutable log of credit transactions (earned, purchased, consumed, refunded).

**Emerging Expert** — Entry-tier expert. Performance-based promotion path to Certified.

**Enterprise** — An organizational customer (corporation, government, association) paying for a license covering multiple users.

**Ethics Board** — Independent governance body overseeing content policy, expert conduct, and user safety.

**Expert** — A credentialed practitioner who authors and publishes playbooks on the platform.

**Expert Council** — Elected representatives of the active expert community. Consulted on policy changes affecting experts.

**Fork** — Duplicate a completed session as a new session, allowing the user to re-execute with different inputs.

**Jurisdiction** — Geographic/legal scope (country, state, province, county). First-class data primitive in A2X.

**LTV** — Lifetime Value of a customer.

**MCP** — Model Context Protocol. Standard for connecting LLMs to external tools. A2X exposes an MCP surface for Claude and other MCP-compatible clients.

**NRR** — Net Revenue Retention.

**Outcome** — The real-world result of a session (e.g., motion filed, hire completed, deal closed). Captured via self-reporting and, where possible, verifiable signals.

**Peer Review** — Review of a playbook by another credentialed expert before publication.

**Playbook** — A structured, executable expert methodology. The core content unit of A2X.

**PlaybookVersion** — An immutable version of a playbook. Sessions are pinned to a specific version.

**Practice Area** — Taxonomy category within a vertical (e.g., Family Law → Custody Modification).

**Ranking Algorithm** — The algorithm that sorts playbook search results based on completion rate, rating, recency, jurisdiction match, and anti-gaming signals.

**Seeker** — A user who executes playbooks (as opposed to authoring them).

**Session** — A user's execution of a specific playbook version. Persistent, resumable, forkable, shareable.

**Step** — The atomic unit of a playbook. Has a prompt, inputs, branching conditions, and optional artifact generation.

**StepExecution** — The record of one step being executed in one session, including user input and AI output.

**UPL** — Unauthorized Practice of Law. A significant regulatory risk for legal playbooks; mitigated via disclaimers, educational framing, and bar partnerships.

**Vertical** — Top-level domain (Legal, Clinical, Business, Civic, Education, Specialty). Each has its own taxonomy and compliance posture.

**White-Label** — Deploying A2X under a partner's brand and domain.
