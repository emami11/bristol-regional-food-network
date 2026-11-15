# Model Traceability – BRFN Digital Marketplace

## 1. Purpose

This document tracks how the stakeholder goals represented in the i* models connect to the BRFN strategic BPMN, the operational work on F1 and F2, and the agreed functionality requirements. It is a working cross-check for Sprint 2, not a claim that every Camunda process is executable.

## 2. Scope and model levels

- **F1 – Product Listing and Validation:** a food producer supplies product information; BRFN checks the details, handles any organic certification requirement, and decides whether to publish or reject the listing.
- **F2 – Inventory and Seasonal Availability Management:** BRFN handles updates to product stock, checks seasonal and stock availability, and updates whether a product can be purchased.

The **strategic BPMN** shows the enterprise context and high-level business responsibilities. The **operational BPMN** describes the detailed workflow and exceptions. The **i* SD/SR models** explain why actors depend on these processes and what goals or qualities matter.

## 3. Traceability table (working mappings)

| Functionality | Goal / dependency to confirm against i* | Strategic subprocess | Operational process / available evidence | Requirement reference |
|---|---|---|---|---|
| **F1 – Product Listing and Validation** | Food Producer relies on the marketplace to validate listing details, check an organic claim where relevant, and return a publication or correction/rejection outcome. | **Manage Product Listings**; expanded internal decisions cover validation, certification, corrections, publication and rejection. | [F1 editable operational BPMN](../../bpmn/operational/BRFN-F1-Product-Listing-and-Validation.bpmn): product validation, correction loops, certification checks/review and publication or rejection. | [Proposed Functionalities – F1](PROPOSED-FUNCTIONALITIES.md); [validation/certification rules V1–V12 and C1–C8](business-rules-and-variables.md) |
| **F2 – Inventory and Seasonal Availability Management** | Food Producer relies on the marketplace to maintain accurate stock and seasonal status; customer ordering depends on up-to-date availability. | **Manage Inventory and Seasonal Availability**; expanded internal decisions cover stock updates and available/unavailable outcomes, with an independent producer inventory-update trigger. | [F2 operational diagram image](../../bpmn/operational/F2-Inventory-Seasonal-Availability.png) has been uploaded. **Editable F2 BPMN export is still pending** on `main`; specific operational elements need verification against it. | [Proposed Functionalities – F2](PROPOSED-FUNCTIONALITIES.md); [stock rules S1–S5 and availability rules A1–A4](business-rules-and-variables.md) |

These descriptions are working interpretations of the models and requirements. The precise dependency labels and links in the i* models must still be reviewed with the SD/SR model owners.

## 4. Cross-process relationship: customer orders and stock

The strategic BPMN documentation for **Allocate Orders to Producers** and **Update Product Stock Information** identifies the business dependency: confirmed sales can reduce stock, and cancellations can restore it. The independent producer inventory-update trigger lets stock be updated without creating a new product listing.

This **does not establish a technical message correlation or executable sequence flow** between the subprocesses. The agreed F2 technical contract specifies a `stock-changed` message correlated using `productId`, with `quantityChange` and `orderId`. The stock-change worker and message integration are planned for later work. See [Business Rules and Process Variables](business-rules-and-variables.md).

## 5. Repository references (checked 15 November 2026)

### Background and requirements
- [Actor analysis](../actor-analysis.md)
- [Stakeholder analysis](../stakeholder-analysis/README.md)
- [Proposed functionalities](PROPOSED-FUNCTIONALITIES.md)
- [Business rules and variables](business-rules-and-variables.md)

### i* models
- [Strategic Dependency (SD), editable piStar model](../../models/istar/brfn-strategic-dependency.txt)
- [Strategic Dependency image](../../models/istar/brfn-strategic-dependency.png)
- [Strategic Rationale (SR), editable piStar model](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Core.txt)
- [Strategic Rationale image](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Core.png)

### BPMN models
- [Strategic BPMN – original Sprint 1](../../bpmn/strategic/BRFN-Strategic-BPMN-Sprint1.bpmn)
- [Strategic BPMN – refined Sprint 2](../../bpmn/strategic/BRFN-Strategic-BPMN-Sprint2.bpmn)
- [Strategic BPMN change documentation](../../bpmn/strategic/README.md)
- [Operational BPMN – F1](../../bpmn/operational/BRFN-F1-Product-Listing-and-Validation.bpmn)
- [Operational F2 diagram (PNG)](../../bpmn/operational/F2-Inventory-Seasonal-Availability.png)
- [Operational model progress notes](../../bpmn/operational/README.md)

## 6. Review and remaining decisions

| Check | Current status | Action needed |
|---|---|---|
| Strategic F1 and F2 subprocess labels match agreed scope | Recorded in the refined strategic diagram | Confirm in group review |
| F1 operational model and strategic F1 correspond | Initial mapping recorded | Check exception/service-unavailable and abandonment requirements against the actual F1 operational model |
| F2 operational model and strategic F2 correspond | **Provisional**; PNG evidence exists | Add the editable BPMN export, inspect the exact activities/gateways, then confirm mapping |
| SD/SR goals and dependencies match the stated F1/F2 mappings | **Provisional** | Confirm actor names, dependency directions and rationale with model owners |
| Stock-change message and seasonal availability rules | Requirements documented | Verify F2 process/DMN and record what is deferred to Sprint 3 |
| Camunda execution evidence | Not established by model files alone | Record initial runnable paths, forms, and test outcomes or state limitations |

## 7. Status

**Updated 15 November 2026:** File references and the high-level F1/F2 mappings are now recorded against the current repository. The F2 diagram image is present, but its editable BPMN export is pending. Cross-model verification and group approval are still outstanding.

**Related issue:** [#18 – Establish Traceability Across i*, Strategic and Operational BPMN](https://github.com/emami11/bristol-regional-food-network/issues/18).
