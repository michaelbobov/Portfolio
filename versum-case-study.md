<!-- Admissions-ready, scan-friendly, captions-first. ~1000 words. -->

# Versum Health — Connecting uninsured patients with dental students (Web platform, Product + HCI)

Caption: A platform that pairs low‑income patients with supervised student clinicians for accessible, affordable dental care.

## Introduction & Goal

Versum Health helps uninsured or low‑income patients book free/affordable dental visits with dental students who must complete supervised clinical hours. Patients get care; students gain experience; supervisors oversee quality.

Caption: Two‑sided value — access for patients, hours for students, oversight for supervisors.

Goals
- Reduce time‑to‑care for patients who avoid treatment due to cost.
- Increase student clinical‑hour throughput and case diversity.
- Provide supervisors with visibility and documentation (planned admin tools).

Caption: Outcomes are framed around access, throughput, and accountability.

---

## Phase 1 — Discovery (HCI process)

What I needed to learn
- Insurance gap scope and cost barriers for basic procedures.
- How students currently source cases; where bottlenecks occur.
- Supervisory constraints (verification, consent, documentation, risk).

Caption: Early research mapped barriers on both sides of the market.

Methods (lean, practical)
- Desk research: statistics on dental insurance coverage and missed care.
- Stakeholder conversations: 4 dental students, 2 recent grads, 1 clinic coordinator; 5 low‑income patients from community channels.
- Journey mapping: “Find care” (patient) and “Find qualifying case” (student).

Caption: Conversations validated an obvious but critical insight — discovery is the bottleneck.

Personas (1–2 lines each)
- Patient (Alicia, 34): Uninsured, postpones routine care; needs transparent availability and costs; prefers mobile scheduling and reminders.
- Student (Noah, D3): Needs qualifying procedures and documentation; must manage schedule and clinical log; wants reliable attendance.
- Supervisor (Dr. K): Requires proof of consent, scope control, and sign‑offs; wants simple oversight, not new administrative burden.

Caption: Three actors drive the core IA: find, schedule, verify.

How might we (HMW)
- HMW make it easy for patients to discover and book supervised student appointments near them?  
  Caption: Reduce search friction and no‑shows.
- HMW help students source qualifying cases and log hours without duplicate data entry?  
  Caption: One action should satisfy both clinical and scheduling needs.
- HMW give supervisors sufficient oversight with minimal extra steps?  
  Caption: Safety and documentation first; clicks second.

---

## Phase 2 — Concept & IA (from low‑fi to hi‑fi)

Information architecture (IA)
- Patient portal: browse availability → request appointment → confirm checklist → reminders.
- Student dashboard: case pipeline → schedule → treatment logging → supervisor submission.
- Supervisor tools (planned): rosters → consent → sign‑offs → audits.

Caption: IA mirrors the three personas to minimize mental model conflict.

Key flows (brief)
- Patient “Find & Book”: location/date filters → clinic/student slot → pre‑visit checklist (allergies, symptoms) → SMS/email reminders.
- Student “Log & Track”: appointment sync → treatment summary → hour counter by competency → submit for review.
- Supervisor “Verify” (planned): review queue → approve/sign → export reports.

Caption: Each flow owns one outcome: show up, learn, verify.

Design principles
- Safety by design: consent, scope, escalation pathways are surfaced before actions.
- Low‑friction forms: few fields, progressive disclosure for medical details.
- Mobile‑first: appointments and reminders optimized for 320–768px.

Caption: Principles matched resource constraints of real clinics.

Planned validation metrics (no hard numbers yet)
- Patient: time‑to‑first‑booking, confirmation rate, no‑show rate.
- Student: hours logged/week, case mix coverage, documentation errors.
- Supervisor: review throughput, time‑to‑sign‑off, audit completeness.

Caption: Metrics align to access, throughput, and accountability.

---

## Phase 3 — Build (shipping constraints + rationale)

My role (build‑heavy)
- Co‑founder, Product Designer, Front‑end Developer.
- Designed in Figma (low‑fi to hi‑fi), then built the front end (React + TypeScript + Tailwind) and integrated with a backend collaborator.

Caption: Owning design and build let me keep research decisions intact in code.

Front‑end architecture (concise)
- App shell with responsive layout; accessible components (focus states, semantics, keyboard navigation).
- Data layer: slot availability, appointment intents, treatment logs, supervisor states.
- State isolation for critical forms; optimistic UI for scheduling; server validation for consent and scope.

Caption: Data models centered on appointments, logs, and sign‑offs.

Accessibility & responsiveness
- 44px touch targets, semantic landmarks, labeled inputs, field‑level guidance.
- Mobile‑first layouts; “sizes” on hero/content images; reduced‑motion support for transitions.
- SMS/email reminders written at 6th–8th grade reading level.

Caption: If the SMS isn’t readable, people won’t show up.

Privacy, safety, & equity (trade‑offs)
- Minimum necessary data; store only what’s needed for care and verification.
- Patient consent and escalation (e.g., emergency flags) baked into the flow.
- Attendance equity: reduce bias by ordering requests FIFO with guardrails (planned) vs. “cherry‑picking” cases.

Caption: Policies are encoded into defaults to prevent dark patterns.

---

## Outcome (current state) & Proxy Impact

Current status
- Functional MVP: patient search/request, student scheduling/logging; supervisor admin in development.
- Pilots in outreach with two student groups; recruiting clinics for supervised sessions.

Caption: The loop from discovery → booking → logging is end‑to‑end.

Proxy impact (what we expect to show in validation)
- Patients: faster time‑to‑booking, fewer abandoned calls, lower no‑shows with reminders.
- Students: reliable case sourcing to reach graduation requirements sooner.
- Clinics: clearer documentation for audits and program tracking.

Caption: Even without hard numbers yet, the value chain is measurable.

Validation plan (next 4–6 weeks)
- 8–10 moderated usability sessions (patients + students); System Usability Scale + task metrics.
- A/B of reminder cadence (24h vs. 24h+2h) on confirmation and show rates.
- Supervisor review pilot: cycle time from submission to sign‑off; error taxonomy.

Caption: Study design is concrete and admissions‑relevant.

---

## Reflection & What I’d Do Next

What changed my mind
- Discovery is the “killer feature”: patients struggle to find affordable care as much as students struggle to find cases.
- Reminders are care: logistics messaging is as impactful as UI polish for access.
- Safety must feel effortless: consent and escalation affordances should never feel optional.

What I’d improve next
- Supervisor console first: verification, bulk approvals, audit exports.
- Eligibility & triage: lightweight screening to protect students/patients from mis‑scoped cases.
- Attendance equity: guardrails against preferential selection; transparent queuing.
- Community partners: integrate with social services to widen patient reach.

Caption: The roadmap prioritizes safety, equity, and scale.

---

## Credits & Role

Role (mine)
- Co‑founder; Product Design; Front‑end Development; Research & Validation Planning.

Collaborators
- Co‑founder, Backend Development & infrastructure.
- Clinic advisors (in outreach), student volunteers, community liaisons.

Caption: Small team by design; validated with real stakeholders.

---

## TL;DR (for scanners)
- Problem: Patients can’t afford care; students can’t find enough supervised cases.
- Solution: Versum connects them with an overseen, bookable marketplace and logs clinical progress.
- My role: research → IA → design → build (front end) → validation plan.
- Why UW MHCID: I want to deepen my HCI toolkit (research rigor, ethics, equitable design) while continuing to build healthcare access tools that work in the real world.

Caption: Product shipped; process rigorous; impact measurable.



