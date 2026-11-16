# Bristol Regional Food Network

**Distributed and Enterprise Software Development | Group 14**

## Project Overview

This repository contains the group project for the Distributed and Enterprise Software Development.

The Bristol Regional Food Network (BRFN) is a digital marketplace designed to connect local food producers with customers.

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
| [`bpmn/personal/ayo/`](bpmn/personal/ayo/README.md) | Ayo's whole-enterprise strategic BPMN, editable source and diagram pictures |
| [`models/istar/ayo/`](models/istar/ayo/README.md) | Ayo's verified SR model in piStar, editable source and diagram pictures |
| [`bpmn/operational/ayo/`](bpmn/operational/ayo/README.md) | Runnable F1/F2 BPMN, shared DMN, forms and token simulation instructions |
| `docs/business-analysis/` | Main business activities and responsibilities |
| `docs/requirements/` | Selected functionalities and requirements |
| `docs/stakeholder-analysis/` | Stakeholders and their needs |
| `visualisation/` | Interactive explanation of the strategic processes |

The interactive visualisation uses sample data to explain the proposed business flows. 

## BPMN File Guide (Sprint 2)

Several BPMN files are retained because they record different stages of work and individual contributions. **Do not treat every diagram as the same approved model.** The table identifies what each file is for; final model selection and cross-model review remain group decisions.

| File | Role |
|---|---|
| [Sprint 2 strategic BPMN](bpmn/strategic/BRFN-Strategic-BPMN-Sprint2.bpmn) | Current group strategic refinement: enterprise overview, with expanded F1 and F2 subprocesses |
| [Sprint 1 strategic BPMN](bpmn/strategic/BRFN-Strategic-BPMN-Sprint1.bpmn) | Earlier baseline retained for comparison |
| [F1 product listing and validation](bpmn/operational/BRFN-F1-Product-Listing-and-Validation.bpmn) | Noyo's working operational F1 diagram; Camunda configuration is still being completed separately |
| [F2 diagram image](bpmn/operational/F2-Inventory-Seasonal-Availability.png) | Operational F2 design image; not confirmed to be an export of Ayo's executable F2 model |
| [Ayo's executable F1/F2 models](bpmn/operational/ayo/README.md) | Separate implementation contribution with BPMN, DMN, forms, service integration and local test evidence |
| [Alternative F1 files](bpmn/operational/README.md) | Other group drafts/exports in the operational folder; provenance and final status need confirming |
| [Ayo's personal strategic model](bpmn/personal/ayo/README.md) | Additional enterprise-level modelling contribution, not an automatic replacement for the group strategic model |
| [Practice BPMN](bpmn/practice/README.md) | Learning exercise, not a Sprint 2 deliverable |

**Open alignment checks:** Confirm which operational F1/F2 versions are the final agreed deliverables; reconcile F2 external producer representation with the strategic model; ensure rejected F1 listings do not proceed to new-product availability; and review the [model traceability table](docs/requirements/model-traceability.md).

**Documentation:** [Strategic changes](bpmn/strategic/SPRINT-2-REFINEMENT-NOTES.md) · [Operational model notes](bpmn/operational/README.md) · [Local executable test results](docs/testing/ayo-executable-bpmn-results.md).

## Tools

Camunda 8, BPMN 2.0, GitHub and GitHub Projects.

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

