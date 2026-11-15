# Strategic BPMN Model

**Responsible Group Member:** Noyo Acogo Emami

## Overview

This folder contains the strategic BPMN for the Bristol Regional Food Network (BRFN), developed in Camunda Web Modeler. The model shows the main business processes, the BRFN areas responsible for them, and the information exchanged with external participants.

The original Sprint 1 model is retained. During Sprint 2, I revisited the diagram to make the selected F1 and F2 processes clearer and to show how product listings, inventory updates and customer orders relate to one another.

## Main process areas

The BRFN pool is organised into three lanes:

1. **Product and Inventory Management** — product listing and validation; inventory and seasonal availability.
2. **Marketplace Operations** — customer purchasing, coordination of multi-vendor orders, and payments/producer settlements.
3. **Quality Assurance and Community Services** — food quality and traceability, and sustainability/community activities.

There are seven subprocesses across these lanes. The external participants shown are Food Producers, Customers, the Payment Service Provider, and the Organic Certification Verification Service. Message flows show communication between BRFN and those participants; sequence flows show the order of work within BRFN.

## Sprint 2 changes

### 1. Product listing and validation (F1)

The internal workflow of **Manage Product Listings** was expanded beyond its initial start-task-end representation. It now shows:

- Validation of submitted product information, with an alternative path for invalid details and a loop for corrected information.
- A decision about whether organic certification is required.
- Certification verification when applicable, including a decision on the verification result.
- Review of failed certification, with an opportunity for corrected certification evidence and re-verification if the issue can be resolved.
- Separate outcomes for publishing a valid product listing and rejecting a listing that cannot meet the requirements.

The aim was to show the main business decisions and exceptional outcomes rather than imply that every listing proceeds directly to publication.

### 2. Inventory and seasonal availability (F2)

The internal workflow of **Manage Inventory and Seasonal Availability** was expanded to show stock information being updated, seasonal availability and stock levels being checked, and an exclusive decision on whether the product is available for purchase. The decision leads to an available or unavailable status before the paths rejoin.

The main diagram also now includes a separate **Inventory Update Requested** message start event from Food Producers. This means an existing product's stock can be updated independently of a new listing request. Both routes lead into the inventory-management subprocess.

### 3. Relationship between orders and stock

The **Allocate Orders to Producers** activity within **Coordinate Multi-Vendor Orders** was documented to explain that confirmed orders and cancellations can affect product stock. Corresponding documentation was added to **Update Product Stock Information** in F2.

This is a business-level dependency, not a new sequence flow connecting the two subprocesses. The detailed stock-change message and its processing belong in the standalone F2 operational model and subsequent integration work.

### 4. Strategic model review

The higher-level purchasing, payment, quality, and community processes were retained so that the diagram still presents the wider enterprise. The revised F1 and F2 flows were checked in Camunda Web Modeler, which reported **0 modelling problems** at the time of export on **15 November 2026**. This is a modelling check, not evidence that the processes are executable or fully tested.

## Model files

| File | Purpose |
|---|---|
| [BRFN-Strategic-BPMN-Sprint1.bpmn](BRFN-Strategic-BPMN-Sprint1.bpmn) | Original Sprint 1 strategic BPMN, preserved for comparison |
| [BRFN-Strategic-BPMN-Sprint1.png](BRFN-Strategic-BPMN-Sprint1.png) | Sprint 1 image export |
| [BRFN-Strategic-BPMN-Sprint2.bpmn](BRFN-Strategic-BPMN-Sprint2.bpmn) | Refined strategic BPMN exported from Camunda on 15 November 2026 |

Open the `.bpmn` files in Camunda Modeler to inspect the main diagram and expanded subprocesses.

## Relationship to other Sprint 2 work

The strategic model identifies where F1 and F2 sit within BRFN. Their **standalone operational BPMN models** are intended to describe more detailed responsibilities, events, interactions and decisions. The agreed requirements and process variables are recorded in:

- [Proposed functionalities](../../docs/requirements/PROPOSED-FUNCTIONALITIES.md)
- [Business rules and process variables](../../docs/requirements/business-rules-and-variables.md)
- [Model traceability](../../docs/requirements/model-traceability.md)

## Outstanding review points

- Review the refined strategic diagram with the group and tutor, especially the balance between strategic overview and the expanded F1/F2 detail.
- Confirm that the standalone operational F1 and F2 diagrams and the i* SD/SR models remain consistent with the strategic subprocesses.
- Update the traceability document to reference the Sprint 2 strategic file and the actual operational model files.
- Confirm how order-related stock-change messages, daily seasonal checks and exception handling are represented at the operational level. These are not implemented by adding sequence flows to the strategic diagram.

**Related GitHub issue:** [#14 — Refine Strategic BPMN Model for Sprint 2](https://github.com/emami11/bristol-regional-food-network/issues/14).
