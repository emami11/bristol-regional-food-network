# Strategic BPMN – Sprint 2 Refinement Notes

**Model:** [BRFN-Strategic-BPMN-Sprint2.bpmn](BRFN-Strategic-BPMN-Sprint2.bpmn)  
**Related issue:** [#14 – Refine Strategic BPMN Model for Sprint 2](https://github.com/emami11/bristol-regional-food-network/issues/14)  
**Date:** 15 November 2026

## Purpose and approach

The Sprint 1 strategic BPMN was reviewed and developed further for Sprint 2, focusing on the two selected functionalities in Use Case 1: **F1 – Product Listing and Validation** and **F2 – Inventory and Seasonal Availability Management**. The original strategic structure was retained so the relationship between these functions and the wider Bristol Regional Food Network marketplace remains visible.

The model is organised into three BRFN lanes: Product and Inventory Management, Marketplace Operations, and Quality Assurance and Community Services. It also shows external interactions with Food Producers, Customers, the Organic Certification Verification Service, and the Payment Service Provider.

## Changes made

### F1 – Manage Product Listings

The internal subprocess was expanded beyond the initial start–task–end outline to show how a producer's listing is handled:

- Validate product information and use an exclusive gateway to decide whether it is valid.
- If information is invalid, request and receive corrections, then return to validation.
- If information is valid, check whether organic certification is required.
- Where certification is required, request verification and evaluate the result.
- If verification fails, review whether the issue can be resolved. Corrected evidence returns to the verification step; an unresolvable issue leads to listing rejection.
- Valid listings proceed to publication; the subprocess has separate **Product Listing Published** and **Listing Rejected** end events.

The existing external message flows for listing submission, producer feedback and certification verification were retained at the strategic level.

### F2 – Manage Inventory and Seasonal Availability

The internal subprocess now follows the sequence **Update Product Stock Information → Check Seasonal Availability and Stock Level → Product Available for Purchase?**.

An exclusive gateway distinguishes products that can be marked **Available** from those marked **Unavailable**. Both outcomes rejoin before the **Inventory Updated** end event.

A separate producer-originated **Inventory Update Requested** message start event was added to the main Product and Inventory Management lane. It joins the route to F2 so stock information can be updated independently of a newly submitted listing.

### Relationship to marketplace orders

The **Allocate Orders to Producers** task now includes documentation explaining that confirmed orders can reduce stock and cancellations can restore it. The **Update Product Stock Information** task in F2 also documents these possible stock-change sources. This explains the business dependency without introducing a sequence flow between independent strategic subprocesses.

**Important:** This relationship is documented in the strategic model; it is **not** an implemented order-to-inventory message integration. The detailed `stock-changed` message contract belongs in the F2 operational design.

### Preserved strategic scope

The existing processes for customer purchasing, multi-vendor orders, payments and producer settlements, food quality and traceability, and sustainability/community engagement remain in the strategic diagram. The main model continues to use subprocesses to distinguish enterprise-level processes from their internal detail.

## Model checks and versioning

- The refined model was inspected in Camunda Web Modeler, which showed **0 modelling problems** during the final visual review.
- The Sprint 2 BPMN was exported and committed separately from the Sprint 1 BPMN, preserving the earlier version.
- The exported file contains the main collaboration and the internal diagrams for the subprocesses.
- The Sprint 2 file was pushed to the repository's `main` branch in commit [`7a960ca`](https://github.com/emami11/bristol-regional-food-network/commit/7a960ca).

**Note:** A zero-problem indicator confirms that Camunda did not flag modelling problems in that review; it does not establish that the process is executable or that every business requirement has been implemented.

## Outstanding review items

1. **F1 outcome and F2 continuation:** The main BPMN currently proceeds from **Manage Product Listings** into **Manage Inventory and Seasonal Availability** regardless of whether F1 ended with publication or rejection. The group should decide how to represent that only successfully published listings enter the new-product availability path, while still supporting independent producer inventory updates.
2. **F2 detail versus operational requirements:** The strategic F2 subprocess summarizes available/unavailable outcomes, but does not explicitly show invalid quantity correction, daily season checks, separate unavailable statuses, overselling and duplicate stock-change handling, or notifications. These are recorded in [the functionality scope](../../docs/requirements/PROPOSED-FUNCTIONALITIES.md) and [business rules](../../docs/requirements/business-rules-and-variables.md) and should be checked against the **standalone operational F2 model**, rather than automatically expanding every rule in this strategic overview.
3. **F1 operational exceptions:** The operational requirements include a seven-day abandoned-listing timer and manual review when the certification service is unavailable. Confirm these in the standalone operational F1 BPMN; the strategic overview alone does not demonstrate them.
4. **Cross-model traceability:** Update [model-traceability.md](../../docs/requirements/model-traceability.md) with the Sprint 2 strategic file, current F1/F2 operational files, and verified links to the i* SD/SR models. The existing document still points to Sprint 1 and is marked for group confirmation.
5. **Final review:** Check subprocess labels, message flow intent and diagram readability with the group/tutor before closing issue #14.

## Scope and status

The **strategic BPMN refinement and export are complete as a documented draft**. Full Sprint 2 completion also depends on operational BPMN review, the team’s i* models, traceability, and initial Camunda execution/forms/testing tasks tracked separately in GitHub. No claim is made here that the complete F1/F2 implementation is executable.
