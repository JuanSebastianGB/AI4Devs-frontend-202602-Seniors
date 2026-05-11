---
name: enrich-work-ticket
description: Enrich a work ticket as a Product Owner (user story, BDD, INVEST). Usage /enrich-work-ticket <draft or ticket text>
argument-hint: <draft ticket text or paste from Linear>
---

Act as a senior Product Owner with extensive experience in agile methodologies (mainly Scrum). Your task is to enrich the following work ticket by applying best practices for writing user stories.

Ticket to enrich:

$ARGUMENTS

---

Generate the enriched ticket with exactly this structure:

## Title

A descriptive, concise, business‑value‑oriented title (maximum 10 words).

## User Story

As a [specific user role],  
I want [specific action to perform],  
so that [business value or benefit obtained].

## Acceptance Criteria (BDD)

**Scenario 1:** [descriptive name]  
- **Given** [initial context / precondition]  
- **When** [action performed by the user]  
- **Then** [expected result / system behavior]  

**Scenario 2:** [descriptive name]  
- **Given** [initial context / precondition]  
- **When** [action performed by the user]  
- **Then** [expected result / system behavior]  

**Scenario 3:** [descriptive name]  
- **Given** [initial context / precondition]  
- **When** [action performed by the user]  
- **Then** [expected result / system behavior]  

## Complexity Estimation

**Size:** [S / M / L]  
**Justification:** [2–3 sentences explaining why this size was chosen, considering technical effort, uncertainty, and dependencies]

| Size | Criteria |
|------|----------|
| S | Small change, low risk, no external dependencies, less than 2 days |
| M | Moderate complexity, some uncertainty or dependency, 2–5 days |
| L | High complexity, multiple dependencies or technical uncertainty, more than 5 days |

## INVEST Evaluation

| Criterion | Meets | Observation |
|-----------|-------|-------------|
| **I**ndependent | ✅ / ⚠️ / ❌ | [short note] |
| **N**egotiable | ✅ / ⚠️ / ❌ | [short note] |
| **V**aluable | ✅ / ⚠️ / ❌ | [short note] |
| **E**stimable | ✅ / ⚠️ / ❌ | [short note] |
| **S**mall | ✅ / ⚠️ / ❌ | [short note] |
| **T**estable | ✅ / ⚠️ / ❌ | [short note] |

**INVEST Summary:** [1–2 sentences indicating whether the ticket is sprint‑ready or needs adjustments before commitment.]
