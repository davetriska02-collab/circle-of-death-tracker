# Data Protection Impact Assessment
## IT Slowness Tracker

| | |
|---|---|
| **Project** | IT Slowness Tracker |
| **Version** | 1.0 |
| **Date** | May 2026 |
| **Prepared by** | Dave Triska, Guildowns Group Practice |
| **DPO / IG lead review** | *(name + date when signed off)* |
| **Status** | DRAFT — awaiting DPO sign-off |

---

## 1. Background

Clinical staff at Cranleigh Surgery and Guildowns Group Practice lose measurable time to EMIS and Accurx freezes during working sessions. This tool allows staff to record the number and duration of IT incidents per session. Aggregated data is reported to the ICB to support procurement and service improvement decisions.

---

## 2. Description of Processing

| Item | Detail |
|---|---|
| **Tool** | Web app hosted on GitHub Pages; data stored as GitHub Issues in a **private** repository |
| **Data subjects** | Clinical and administrative staff at Cranleigh Surgery and Guildowns Group Practice |
| **Data collected** | Site (practice name), role category (GP / Nurse / HCA / Receptionist / Admin / Other), session type (Duty / Normal / Admin), session start and end time, number and duration of IT freeze incidents, optional free-text notes about the nature of the IT issue |
| **Data NOT collected** | Staff names, staff numbers, NHS numbers, patient identifiers, clinical content |
| **Volume** | Estimated 5–15 submissions per practice per working day |
| **Retention** | GitHub Issues are retained for **12 months** then deleted (see retention policy below) |
| **Access** | Repository is private; access limited to practice partners and managers who hold a GitHub account with explicit repository access |
| **Sub-processors** | GitHub (Microsoft Ireland Operations Ltd) — stores issues; Cloudflare, Inc. — proxies submissions via a Worker |

### Free-text notes

Staff may optionally enter a note describing the IT freeze (e.g. "EMIS froze on patient summary"). The app and Worker actively reject any entry containing an NHS number pattern or the phrase "NHS number". Staff should be instructed not to include patient names or dates of birth in notes.

---

## 3. Lawful Basis

| Basis | Justification |
|---|---|
| **UK GDPR Article 6(1)(e)** — public task | Monitoring IT performance is necessary for the delivery of NHS primary care services and falls within the practices' mandate as NHS providers |

No special category data (Article 9) is processed. Staff health or trade union data is not captured.

---

## 4. Necessity and Proportionality

**Is this the least privacy-intrusive way to achieve the purpose?**

Yes. The tool collects only the minimum data needed to quantify IT-related time loss:

- Role category (not individual names) is sufficient to identify whether certain staff groups are disproportionately affected
- Timestamps are necessary to correlate incidents with system logs and busy periods
- Free-text notes are optional and limited to IT issues, not clinical content

A paper-based log would achieve the same outcome but could not be aggregated or shared with the ICB efficiently. A commercial IT monitoring tool would require broader system access and greater cost.

---

## 5. Risk Assessment

| Risk | Likelihood | Impact | Mitigation | Residual Risk |
|---|---|---|---|---|
| Staff identified from role + timestamp in a small team | Low | Low | No names collected; role categories are broad; sessions are not linked across days without a name | Low |
| Patient data entered in free-text notes | Low | High | App rejects NHS number patterns; Worker rejects payloads containing NHS numbers; staff briefing note advises against including patient details | Low |
| Unauthorised access to GitHub repository | Low | Medium | Repository set to **private**; access granted only to named practice partners/managers; GitHub enforces 2FA for the organisation | Low |
| Sub-processor (GitHub/Cloudflare) data breach | Very Low | Medium | Both GitHub and Cloudflare hold ISO 27001 certification and publish DPAs compliant with UK GDPR. Data held is low-sensitivity staff operational data with no patient content | Very Low |
| Data retained beyond necessity | Low | Low | Retention policy established (12 months); practice manager or IG lead to review and delete annually | Very Low |

**Overall risk level: LOW**

A full Article 35 DPIA consultation with the ICO is not considered necessary given the low risk rating, absence of special category data, and the limited scope of the processing.

---

## 6. Sub-processor Agreements

| Processor | DPA reference |
|---|---|
| **GitHub (Microsoft)** | Covered by GitHub's Data Protection Agreement, incorporated into the GitHub Customer Agreement. Available at: github.com/customer-terms |
| **Cloudflare** | Covered by Cloudflare's Data Processing Addendum, available at: cloudflare.com/cloudflare-customer-dpa |

Both are acceptable sub-processors under UK GDPR. No separate contract is required beyond accepting their standard terms.

---

## 7. Retention Policy

| Item | Retention | Action |
|---|---|---|
| GitHub Issues (session records) | 12 months from session date | Delete via GitHub Issues interface or analytics script |
| Offline queue (localStorage) | Until successfully submitted or browser data cleared | No action required |

The practice manager or nominated IG lead should review the GitHub Issues list every 6 months and delete sessions older than 12 months.

---

## 8. Staff Rights

Staff whose session data is processed have the following rights under UK GDPR:

- **Access**: Request a copy of their session records (identifiable by session date/time and role)
- **Erasure**: Request deletion of their sessions
- **Rectification**: Request correction of inaccurate records
- **Objection**: Object to processing

Requests should be directed to the practice manager. Sessions can be identified and deleted via the GitHub Issues interface using the `role:` and `site:` labels.

---

## 9. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Project lead | Dave Triska | | |
| Practice manager — Cranleigh Surgery | | | |
| Practice manager — Guildowns Group Practice | | | |
| Data Protection Officer / IG lead | | | |
