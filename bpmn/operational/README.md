# Operational BPMN Models

This folder contains the operational BPMN models developed for Sprint 2 of the project.

The operational models expand on the processes/functionalities identified in the Sprint 1 strategic BPMN, showing how each activities, decisions and interactions work in more detail.

## F1 – Product Listing and Validation

**Current status:** The F1 BPMN model has been developed and Camunda implementation is currently in progress.

The F1 process covers how a food producer submits a product to the BRFN marketplace and how the listing is checked before it can be published.

The model includes:

- **Product information validation:** Submitted details are checked before the listing moves forward. If information is incomplete or invalid, the producer is asked to correct it.
- **Organic certification checks:** The process determines whether certification is required and requests verification where necessary.
- **Certification review:** Failed verification results are reviewed to determine whether the producer can resolve the issue.
- **Correction paths:** Producers can submit corrected product information or updated certification evidence without restarting the entire process.
- **Publication or rejection:** A product is published once the required checks have been passed. Listings that cannot meet the requirements are rejected.

The diagram separates the responsibilities of Product Listing Management and Compliance and Verification. It also shows message exchanges with the Food Producer and the Organic Certification Verification Service.

### Camunda implementation

Configuration to the F1 diagram, is currently in process, in the Camunda Web Modeler.

So far, a Certification Compliance Review form has been created and linked to the **Review Failed Certification** user task. The form captures the certification issue, whether it can be resolved, and also the reviewer's notes.

The YES and NO conditions have also been added on for the **Can Certification Issue Be Resolved?** gateway using the `certificationIssueResolvable` variable.

The other gateway conditions, service-task configurations and message handling are still being worked on. The model has not yet been demonstrated as a complete executable process.

### Files

- `BRFN-F1-Product-Listing-and-Validation.bpmn` – Current F1 BPMN model exported from Camunda Web Modeler.
- `F1-Product-Listing-Validation.png` – Earlier F1 diagram image added during Sprint 2 development.

### Next steps

The next steps now, are to finish configuring the remaining gateways and process variables, connect the necessary service tasks, and test the main workflow paths in Camunda.

The BPMN file will be consistenlty updated, as well as documentation being done, as the implementation progresses.

## F2 – Inventory and Seasonal Availability Management

**Current status (15 November 2026):** An F2 operational diagram image has been uploaded to GitHub, but the editable BPMN 2.0 XML export is not yet in this folder.

- [F2-Inventory-Seasonal-Availability.png](F2-Inventory-Seasonal-Availability.png) – Current available visual evidence of the F2 diagram.
- **Pending:** Upload the matching `.bpmn` export from Camunda Web Modeler so the detailed workflow, gateway configuration and model structure can be inspected and revised.

### Relationship to the strategic BPMN and requirements

The refined Sprint 2 strategic model contains **Manage Inventory and Seasonal Availability**, with stock updates, seasonal and quantity checks, and an available/unavailable decision. It also shows a separate producer inventory-update request so existing product stock can change independently of a new listing.

The agreed F2 scope calls for producer quantity updates, order-related `stock-changed` messages, zero-stock handling, seasonal limits and restocking rules. These are defined in [Proposed Functionalities](../../docs/requirements/PROPOSED-FUNCTIONALITIES.md) and [Business Rules and Process Variables](../../docs/requirements/business-rules-and-variables.md).

The PNG upload does not by itself establish which Camunda configuration, messages or DMN tables are implemented. Those items need checking against the editable F2 BPMN and any separately exported forms/DMN files.

### Next steps

1. Export and upload the matching F2 BPMN XML from Camunda.
2. Compare its actual tasks, events and gateways against the F2 requirements and the strategic model.
3. Document any producer update forms, decision tables, job-worker integration and test evidence that exist; distinguish these from Sprint 3 work.
4. Update [model traceability](../../docs/requirements/model-traceability.md) after the editable export has been reviewed.

## Sprint 2 strategic reference

- [Refined Strategic BPMN – Sprint 2](../strategic/BRFN-Strategic-BPMN-Sprint2.bpmn)
- [Summary of strategic BPMN changes](../strategic/README.md)
