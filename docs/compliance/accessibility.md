# Accessibility

A2X commits to WCAG 2.2 AA compliance across all user-facing surfaces. Accessibility is a first-class product requirement, not a retrofit.

---

## Standards

- **WCAG 2.2 Level AA** — baseline for all user-facing web surfaces
- **ARIA 1.2** — semantic markup where appropriate
- **Section 508** — required for US government contracts (Phase 3)
- **EN 301 549** — required for EU accessibility markets
- **ADA Title III** — US anti-discrimination compliance

---

## Design Commitments

### Visual

- Minimum contrast 4.5:1 for normal text, 3:1 for large text
- No information conveyed by color alone
- Zoom to 200% without loss of functionality
- Dark mode parity
- Respect `prefers-reduced-motion`

### Keyboard

- Every interactive element operable via keyboard
- Visible focus indicators (not just OS default)
- Logical tab order
- Skip links on pages with repetitive navigation
- Escape key dismisses modals and menus

### Screen reader

- Semantic HTML (proper heading hierarchy, lists, landmarks)
- ARIA labels for icon-only buttons
- Live regions for dynamic updates (e.g., AI response streaming)
- Form labels and error associations
- Decorative images hidden from AT
- Alt text meaningful for informational images

### Content

- Plain language preferred
- Jargon defined on first use
- Reading level target: grade 9 for consumer content, grade 12 for expert content
- Complete sentences avoided for UI labels (scan-friendly)

### Forms

- Labels above fields
- Required fields marked textually, not just with `*`
- Error messages specific and actionable
- Inline validation with accessible announcements
- Session timeouts warned and extendable

---

## Accessibility Features

### Session accessibility

- Session can be paused mid-step without losing state
- Auto-save every input
- Extended timeout for users who indicate need
- Print-friendly artifact rendering

### Assistive technology tested

- NVDA + Firefox
- JAWS + Chrome
- VoiceOver + Safari (macOS and iOS)
- TalkBack + Chrome (Android)

### Font & reading

- User-adjustable font size
- Dyslexia-friendly font option
- Line spacing and letter spacing adjustable
- High-contrast theme

---

## Authoring Accessibility

Expert authoring tools must also be accessible. Experts with disabilities must be able to author playbooks.

- Visual builder fully keyboard-operable
- Markdown authoring as universal fallback
- Preview respects accessibility settings
- Alt text required for images included in playbooks

---

## Testing & Validation

### Automated

- axe-core in CI for every PR
- Lighthouse accessibility score monitored (target 95+)
- Pa11y for route-level scans
- Color contrast automated checks

### Manual

- Keyboard-only walkthroughs of core flows monthly
- Screen reader walkthroughs of core flows monthly
- User testing with disabled users quarterly (Phase 2+)
- External accessibility audit annually (Phase 2+)

### Regression prevention

- Accessibility acceptance criteria on every story
- No-regression checks on merged PRs
- Design review includes accessibility
- Code review checklist includes accessibility

---

## Accessibility Statement

Published at `/accessibility` (Phase 1):

- Standards we follow
- Known gaps
- How to report issues
- Commitment to remediate
- Contact for accessibility support

---

## Known Current Gaps

- **AI-generated content** may not always meet plain-language standards. Mitigation: author guidance in prompts; output review; specific accessibility-friendly playbook versions over time.
- **Complex data visualizations** (Phase 3+ for data products) require thoughtful alternative representations.
- **Realtime collaboration** (Phase 3+) needs special attention for screen reader usability.

---

## Role and Responsibility

- **Every engineer, designer, and content author** is responsible for accessibility of their work
- **Accessibility lead** (part-time role Phase 1; full-time Phase 3) owns standards and audits
- **QA** validates accessibility on release candidates
- **User research** includes users with disabilities in studies

---

## Related

- [`trust-safety.md`](trust-safety.md)
- [`../product-spec.md`](../product-spec.md)
