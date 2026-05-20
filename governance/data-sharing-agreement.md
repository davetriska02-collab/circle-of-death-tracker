# Data Sharing Agreement
## IT Slowness Tracker — Joint Controller Arrangement

| | |
|---|---|
| **Version** | 1.0 |
| **Date** | May 2026 |
| **Prepared by** | Dave Triska, Guildowns Group Practice |
| **Status** | DRAFT — awaiting signature by both parties |

---

## 1. Parties

This agreement is between:

**Controller A**
Cranleigh Surgery
*(address)*
*(ICO registration number)*

**Controller B**
Guildowns Group Practice
*(address)*
*(ICO registration number)*

Together referred to as "the practices" or "the parties".

---

## 2. Purpose of this Agreement

The practices have jointly developed and deployed the **IT Slowness Tracker**, a web application that allows clinical and administrative staff to record time lost to IT system failures (primarily EMIS and Accurx) during working sessions.

This agreement sets out the respective responsibilities of each practice as **joint data controllers** under **UK GDPR Article 26**, and governs how staff session data is collected, stored, accessed, and shared.

---

## 3. Scope of Processing

| Item | Detail |
|---|---|
| **Data subjects** | Clinical and administrative staff employed or engaged at either practice |
| **Personal data processed** | Site, role category, session type, session start/end time, incident timestamps and durations, optional free-text notes about IT issues |
| **Special category data** | None |
| **Purpose** | To quantify IT-related time loss and report aggregated findings to the ICB for procurement and service-improvement decisions |
| **Legal basis** | UK GDPR Article 6(1)(e) — public task |

---

## 4. Joint Controller Responsibilities

### 4.1 Data collected at each site

Each practice is responsible for data submitted by its own staff. The site field in every submission identifies which practice the session belongs to.

### 4.2 Shared infrastructure

Both practices jointly use:

- A **private GitHub repository** (`davetriska02-collab/circle-of-death-tracker`) to store session records as GitHub Issues
- A **Cloudflare Worker** to proxy submissions and hold the GitHub access token securely

Repository access is managed by the nominated lead at Guildowns Group Practice (currently Dave Triska). Access is granted only to partners and practice managers at both sites.

### 4.3 Responsibilities matrix

| Responsibility | Lead party | Supporting party |
|---|---|---|
| Maintaining the GitHub repository and Worker | Guildowns Group Practice | Cranleigh Surgery (informed of changes) |
| Granting / revoking GitHub repository access | Guildowns Group Practice | Each practice nominates its own authorised users |
| Responding to staff data subject requests — Cranleigh staff | Cranleigh Surgery | May request data from Guildowns if needed |
| Responding to staff data subject requests — Guildowns staff | Guildowns Group Practice | May involve Cranleigh if needed |
| Annual retention review and deletion of records > 12 months | Both practices (each to review their own site's records) | |
| Notifying the ICO of a personal data breach | The practice whose data is affected (or jointly if both are affected) | Both parties to notify each other within 24 hours of discovery |
| Maintaining this agreement | Guildowns Group Practice | Annual review |

### 4.4 Staff transparency

Each practice is responsible for ensuring its own staff are informed about this processing. The staff privacy notice (`governance/privacy-notice.md`) in this repository may be used or adapted for this purpose.

---

## 5. Sub-processors

The practices have collectively engaged the following sub-processors:

| Sub-processor | Role | DPA reference |
|---|---|---|
| **GitHub (Microsoft Ireland Operations Ltd)** | Stores session records as GitHub Issues in a private repository | GitHub Data Protection Agreement (github.com/customer-terms) |
| **Cloudflare, Inc.** | Proxies session submissions via a Cloudflare Worker | Cloudflare Data Processing Addendum (cloudflare.com/cloudflare-customer-dpa) |

Both sub-processors are covered by appropriate UK GDPR-compliant agreements. No further contractual steps are required beyond accepting their standard terms.

---

## 6. Security

The following technical and organisational measures are in place:

- The GitHub repository is set to **private**; access is limited to named partners and managers
- Repository access requires a GitHub account; the organisation enforces two-factor authentication
- The GitHub access token (PAT) is held in Cloudflare Worker secrets and is never exposed in the browser or in any publicly accessible file
- The Cloudflare Worker validates the request origin, rejects payloads that contain NHS number patterns, and enforces a maximum payload size
- Staff are instructed not to enter patient identifiers in free-text note fields

---

## 7. Data Retention and Deletion

Session records are retained for **12 months** from the session date. Each practice is responsible for reviewing and deleting records relating to its own site. Records are identified by the `site:` label on the GitHub Issues. The practice manager or nominated IG lead should carry out this review every 6 months.

---

## 8. Breach Notification

If either practice becomes aware of a personal data breach involving data processed under this agreement:

1. The discovering practice must notify the other practice **within 24 hours** of discovery
2. Both practices must assess whether the breach meets the threshold for ICO notification (risk to individuals) — if so, the affected practice(s) must notify the ICO **within 72 hours** of becoming aware
3. If staff are at high risk, affected individuals must be notified without undue delay

---

## 9. Duration and Review

This agreement takes effect when signed by both parties and remains in force for as long as the IT Slowness Tracker is in operation. It should be reviewed **annually** or when there is a material change to the processing (e.g. new sites added, storage provider changed, purpose extended).

Either party may terminate this agreement by giving **one month's written notice**, provided that arrangements for the retention or deletion of data are agreed before termination.

---

## 10. Governing Law

This agreement is governed by the law of England and Wales.

---

## 11. Signatures

| Party | Name | Role | Signature | Date |
|---|---|---|---|---|
| Cranleigh Surgery | | Practice Manager / Partner | | |
| Guildowns Group Practice | Dave Triska | GP Partner | | |
