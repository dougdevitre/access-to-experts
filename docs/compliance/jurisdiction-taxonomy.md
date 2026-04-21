# Jurisdiction Taxonomy

Jurisdiction is a first-class data primitive in A2X. This document specifies the taxonomy, encoding, and enforcement.

---

## Why This Matters

Content that is accurate in one jurisdiction may be wrong — or illegal — in another. A custody playbook authored under Missouri family law does not apply in France, New Zealand, or even Illinois without adaptation. Enterprise and government buyers require rigorous jurisdiction enforcement. International expansion requires it from day one.

A2X treats jurisdiction like currency: every playbook declares it; every session matches it; the platform enforces and surfaces it.

---

## Encoding Standards

### Countries

**ISO 3166-1 alpha-2** codes. Examples: `US`, `GB`, `CA`, `AU`, `DE`, `FR`, `NZ`, `IE`, `SG`.

### Sub-national divisions

**ISO 3166-2** codes. Examples:

- `US-MO` (Missouri)
- `US-CA` (California)
- `CA-ON` (Ontario)
- `GB-ENG` (England)
- `AU-NSW` (New South Wales)
- `DE-BY` (Bavaria)

### Counties / regions (US-specific precision)

When needed for county-level scope (housing, court rules, specific procedures), append **FIPS county code**:

- `US-MO-189` (St. Louis County, Missouri)
- `US-MO-510` (St. Louis City)
- `US-NY-061` (New York County / Manhattan)

### Cities (rarely needed)

When municipal-specific (e.g., rent control), use city code or named suffix:

- `US-CA-SF` (San Francisco, CA)
- `US-NY-NYC` (New York City)

### Other jurisdictional layers

- **Federal (US)** — `US`
- **Circuit Courts (US federal)** — `US-FED-CIRC-8` (8th Circuit)
- **District Courts (US federal)** — `US-FED-DIST-EDMO` (Eastern District of Missouri)
- **Tribal** — case-by-case; recorded as named tribal jurisdiction with sovereign identifier

---

## Hierarchy

```
Country (e.g., US)
├── State / Province / Nation (e.g., US-MO)
│   ├── County (e.g., US-MO-189)
│   │   └── Municipality (e.g., US-MO-189-CLAYTON)
│   └── Court districts (e.g., US-MO-FAMCT-21)
└── Federal districts / circuits (e.g., US-FED-DIST-EDMO)
```

Hierarchy is explicit in the database via `parent_id`. Queries can select "all under US" or "all under US-MO" with a single tree traversal.

---

## Scoping Rules

### Playbook declared scope

Every playbook declares one or more jurisdiction tags:

```json
{
  "jurisdictions": ["US-MO"],
  "jurisdictions_applicability": "primary",
  "notes": "Accurate for Missouri state law as of [version date]. Federal references where applicable."
}
```

**Applicability modes:**

- `primary` — playbook is authored for this jurisdiction and fully applies
- `substantial_overlap` — methodology substantially applies; adapt specifics
- `educational_only` — high-level concepts; do not execute without local counsel
- `multi_jurisdictional` — explicitly designed for multiple jurisdictions (rare)

### Expert licensure scope

Experts declare jurisdictions of active licensure and practice. Playbooks they author are auto-restricted to these jurisdictions.

**Enforcement:**

- Cannot publish a `primary` playbook for a jurisdiction the expert is not licensed in (for regulated practices)
- Can publish `educational_only` content across jurisdictions
- Co-authoring required for cross-jurisdictional `primary` playbooks

### User's session jurisdiction

User declares their jurisdiction at:

- Account signup (default)
- Session start (can override for specific playbook)

**Matching logic:**

1. Exact match → proceed
2. Parent/child in hierarchy (e.g., user in `US-MO-189`, playbook in `US-MO`) → proceed with note
3. Sibling under same parent (e.g., user in `US-CA`, playbook in `US-MO`) → warning, user can proceed with acknowledgment
4. Different countries → warning, significant disclaimer, can proceed only with explicit acknowledgment
5. Playbook is `educational_only` scope → lowered friction

---

## Reference Data Source

Jurisdiction reference data loaded from authoritative sources:

- **ISO 3166** — official ISO data
- **FIPS codes** — US Census Bureau
- **US court jurisdictions** — federal courts website
- **International** — per-country authoritative sources

Reference data versioned and updated at least annually, or on boundary changes.

---

## Multi-Jurisdictional Playbooks

Some playbooks apply across jurisdictions (e.g., "How to prepare for a business sale"). These are authored with:

- Multiple `jurisdictions` entries
- Content modules that branch on jurisdiction (playbook branching logic)
- Per-jurisdiction disclaimers
- Per-jurisdiction artifact templates where needed

These playbooks require:

- Co-authorship by experts covering each jurisdiction, OR
- An anchor expert with multi-jurisdictional authority (e.g., federal tax law)

---

## Localization Beyond Jurisdiction

Localization is not just translation. It includes:

- **Legal concepts** — some concepts have no direct equivalent (e.g., "discovery" in UK law differs from US)
- **Cultural expectations** — how much directness, how to address authority figures
- **Process differences** — court filings, administrative procedures, timelines
- **Institutional context** — which agencies exist, their roles
- **Currency and units** — USD vs EUR vs GBP; miles vs km

A2X localization pipeline handles:

1. Linguistic translation
2. Legal/practice adaptation (by jurisdiction-specific expert)
3. Cultural adaptation (by regional reviewer)
4. UI/UX adaptation (right-to-left languages, date formats, etc.)

---

## Regulatory Mapping Layer (Phase 3+)

For each regulated practice area × jurisdiction combination:

- What's permitted (pro se legal document preparation, for example)
- What's prohibited (advice-giving without license)
- What requires licensure (practice of law, medicine, specific trades)
- Specific disclaimer requirements

This layer informs which playbooks can be offered in which jurisdictions and what disclaimers attach.

Examples of regulatory considerations:

- **US UPL rules** — vary by state; California and New York most strict; Washington and Utah most permissive
- **UK / England legal services** — reserved activities under Legal Services Act 2007
- **GDPR (EU)** — processing EU residents' data triggers GDPR regardless of platform location
- **Singapore UPL** — strict; requires careful positioning
- **Japan** — bengoshi-only restrictions on legal services

---

## UI Surfacing

### For seekers

- Jurisdiction selector at signup
- Jurisdiction visible on every playbook card (e.g., "Missouri family law")
- Jurisdiction mismatch warnings before session start
- Filter by jurisdiction in search

### For experts

- Jurisdiction chips on expert profile
- Credential verification per jurisdiction
- Playbook jurisdiction locked to licensed jurisdictions for regulated areas
- Dashboard filter by jurisdiction

### For enterprise

- Org can restrict user sessions to allowed jurisdictions
- Org can curate library per jurisdiction
- Analytics broken down by jurisdiction

---

## Initial Launch Jurisdictions (Phase 1–3)

**Phase 1:**
- United States, starting with Missouri (anchor), expanding to top-10 states by market

**Phase 2:**
- Full US 50-state coverage for legal vertical
- Federal (for federal issues)

**Phase 3:**
- United Kingdom (England & Wales; Scotland separate)
- Canada (Ontario first, then BC, Alberta, Quebec)
- Australia (New South Wales, Victoria first)
- Ireland
- New Zealand

**Phase 4:**
- Germany (GDPR-native architecture supports)
- France
- Netherlands
- Singapore

**Phase 5:**
- LATAM (Mexico first; Brazil; Chile; Colombia)
- Japan, South Korea
- Israel
- Selected Middle East (UAE)

---

## Data Model

See [`../architecture/data-model.md`](../architecture/data-model.md) for the `JurisdictionTag` entity schema.

Key fields:

```
JurisdictionTag {
  id
  code              "US-MO" | "US-MO-189" | "GB-ENG" | ...
  name              "Missouri" | "St. Louis County" | "England" | ...
  parent_id         -> parent JurisdictionTag
  level             country | state_province | county_region | city | federal_district
  iso_3166_1        "US"
  iso_3166_2        "US-MO"
  fips_code         "189"
  active            boolean
  launched_at       timestamp (when A2X started supporting this jurisdiction)
}
```

---

## Related

- [`../architecture/data-model.md`](../architecture/data-model.md)
- [`trust-safety.md`](trust-safety.md)
- [`liability-framework.md`](liability-framework.md)
- [`../verticals/v1-family-law.md`](../verticals/v1-family-law.md) (flagship with Missouri as reference)
