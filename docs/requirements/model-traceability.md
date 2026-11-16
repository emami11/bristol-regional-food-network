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
| **F1 – Product Listing and Validation** | Food Producer relies on the marketplace to validate listing details, check an organic claim where relevant, and return a publication or correction/rejection outcome. | **Manage Product Listings**; expanded internal decisions cover validation, certification, corrections, publication and rejection. | [Moses's selected F1 diagram image](../../bpmn/operational/F1-Product-Listing-Validation.png). Its matching editable BPMN XML export is pending; configuration and execution need verification against that export. | [Proposed Functionalities – F1](PROPOSED-FUNCTIONALITIES.md); [validation/certification rules V1–V12 and C1–C8](business-rules-and-variables.md) |
| **F2 – Inventory and Seasonal Availability Management** | Food Producer relies on the marketplace to maintain accurate stock and seasonal status; customer ordering depends on up-to-date availability. | **Manage Inventory and Seasonal Availability**; expanded internal decisions cover stock updates and available/unavailable outcomes, with an independent producer inventory-update trigger. | [Moses's selected F2 diagram image](../../bpmn/operational/F2-Inventory-Seasonal-Availability.png). Its matching editable BPMN XML export is pending; stock messages, seasonal decisions and exception handling need verification against it. | [Proposed Functionalities – F2](PROPOSED-FUNCTIONALITIES.md); [stock rules S1–S5 and availability rules A1–A4](business-rules-and-variables.md) |

These descriptions are working interpretations of the models and requirements. The precise dependency labels and links in the i* models must still be reviewed with the SD/SR model owners.

## 4. Cross-process relationship: customer orders and stock

The strategic BPMN documentation for **Allocate Orders to Producers** and **Update Product Stock Information** identifies the business dependency: confirmed sales can reduce stock, and cancellations can restore it. The independent producer inventory-update trigger lets stock be updated without creating a new product listing.

The agreed F2 technical contract specifies a `stock-changed` message correlated using `productId`, with `quantityChange` and `orderId`. Its implementation and connection to the group's customer-ordering process still need verification in the selected operational model. The strategic relationship alone does not demonstrate executable integration. See [Business Rules and Process Variables](business-rules-and-variables.md) and [process test scenarios](../testing/sprint2-test-scenarios.md).

## 5. Repository references (checked 16 November 2026)

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
- [Selected F1 model image (Moses)](../../bpmn/operational/F1-Product-Listing-Validation.png) — editable BPMN pending
- [Operational F2 diagram (PNG)](../../bpmn/operational/F2-Inventory-Seasonal-Availability.png)
- [Validation and certification job workers](../../services/README.md)
- [Service and process test scenarios](../testing/sprint2-test-scenarios.md)
- [Operational model progress notes](../../bpmn/operational/README.md)


**Selection note (16 November 2026):** The group has selected Moses's F1 and F2 designs. The editable selected F1 and F2 BPMN XML files still need to be exported from Moses's Camunda workspace and committed here. Ayo's separate executable F1/F2 prototype has been removed at his request. His SR model and personal strategic BPMN remain available. The selected operational diagrams still need their own configuration and execution checks.
