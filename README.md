# Bristol Regional Food Network

**Distributed and Enterprise Software Development | Group 14**

## Project Overview

This repository contains our group project for the Distributed and Enterprise Software Development module at UWE Bristol.

The Bristol Regional Food Network (BRFN) is a fictional digital marketplace designed to connect local food producers with customers.

Our aim is to analyse the organisation's business processes and develop a system that supports product management and communication between producers and the marketplace.

## Selected Use Case

Our provisional selection is **Use Case 1: Producer Product Listing and Inventory Management**.

We're focusing on two main functionalities:

**1. Product Listing and Validation**

Producers submit product information, which is checked before the product is published. This includes checking required details and verifying organic certification where applicable.

**2. Inventory and Seasonal Availability Management**

Producers update their stock levels and seasonal availability. The system uses this information to determine whether products should be available to customers.

The detailed scope, including proposed validation rules and exception handling, is recorded in [Proposed Functionalities](docs/requirements/PROPOSED-FUNCTIONALITIES.md).

## Development Approach

We are following an Agile approach, with work organised into three sprints.

### Sprint 1 — Strategic Analysis and Project Setup

- Analyse the BRFN case study and identify stakeholders.
- Identify the main business processes and responsibilities.
- Create a strategic BPMN model in Camunda.
- Select and scope two major functionalities.
- Set up our GitHub repository and project board.

### Sprint 2 — Detailed Modelling

- Develop i* stakeholder models.
- Create detailed BPMN models for our selected functionalities.
- Begin process automation in Camunda.

### Sprint 3 — Implementation and Integration

- Develop and test executable processes.
- Implement the required business logic and integrations.
- Prepare the final demonstration.

## Project Files

| Folder | Contents |
|---|---|
| `bpmn/strategic/` | Enterprise-level strategic BPMN model |
| `bpmn/practice/` | Initial BPMN modelling practice |
| `docs/business-analysis/` | Main business activities and responsibilities |
| `docs/requirements/` | Selected functionalities and requirements |
| `docs/stakeholder-analysis/` | Stakeholders and their needs |
| `visualisation/` | Interactive explanation of the strategic processes |

The interactive visualisation uses sample data to explain the proposed business flows. It is not a running marketplace backend.

## Tools

Camunda 8, BPMN 2.0, GitHub and GitHub Projects. Additional technologies will be used as the implementation develops.

## Group Members

- Noyo Acogo Emami
- Xavier Ajike
- Moses Bororio
- Ayobamidele Esho
- Elvis Uchendi

## Assigned Tasks

The following responsibilities have been allocated to group members for the BRFN project. All members contribute to group discussions, reviews and project decisions.

| Group Member | Assigned Responsibilities |
|---|---|
| **OritseNoyo Acogo Emami** | Group leadership, meeting coordination, team communication, overall project oversight, practice BPMN diagrams, strategic BPMN modelling and revisions. |
| **Elvis Uchendi** | Sprint backlog, sprint planning, task tracking and progress reporting. |
| **Moses Bororio** | Proposed functionalities, functional and non-functional requirements, and use-case scope. |
| **Ayobamidele Esho (Ayo)** | Stakeholder analysis, stakeholder needs, interests and responsibilities. |
| **Xavier Ajike** | Actor analysis, business analysis and major business processes. |

These assignments identify the main responsibility for each area. Tasks and contributions will be reviewed as the project progresses.

## Assessment

| Item | Details |
|---|---|
| Module | Distributed and Enterprise Software Development (UFCFTR-30-3) |
| Assessment | Task 1 |
| Academic year | 2026/27 |
| Final deadline | 10 December 2026, before 14:00 |
