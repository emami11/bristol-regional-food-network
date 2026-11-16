# Operational BPMN Models

This folder contains the operational BPMN models developed for Sprint 2 of the project.

The operational models expand on the processes/functionalities identified in the Sprint 1 strategic BPMN, showing how each activities, decisions and interactions work in more detail.

## F1 – Product Listing and Validation

**Current status:** The group has selected Moses's F1 design, currently available as a PNG. The corresponding editable BPMN XML remains on Moses's Camunda workspace and still needs exporting to this repository.

The F1 process covers how a food producer submits a product to the BRFN marketplace and how the listing is checked before it can be published.

The model includes:

- **Product information validation:** Submitted details are checked before the listing moves forward. If information is incomplete or invalid, the producer is asked to correct it.
- **Organic certification checks:** The process determines whether certification is required and requests verification where necessary.
- **Certification review:** Failed verification results are reviewed to determine whether the producer can resolve the issue.
- **Correction paths:** Producers can submit corrected product information or updated certification evidence without restarting the entire process.
- **Publication or rejection:** A product is published once the required checks have been passed. Listings that cannot meet the requirements are rejected.

The diagram separates the responsibilities of Product Listing Management and Compliance and Verification. It also shows message exchanges with the Food Producer and the Organic Certification Verification Service.

### Camunda implementation

Earlier Camunda configuration work was carried out on Noyo's separate F1 version, which has now been removed from GitHub at the group's request. That configuration should not be assumed to exist in Moses's selected F1 model.

In Noyo's separate Camunda workspace, a Certification Compliance Review form has been created and linked to the **Review Failed Certification** user task. The form captures the certification issue, whether it can be resolved, and also the reviewer's notes.

In that same separate model, the YES and NO conditions were added for the **Can Certification Issue Be Resolved?** gateway using the `certificationIssueResolvable` variable.

The selected Moses F1 XML has not yet been inspected, so implementation status cannot be verified from the PNG alone. The model has not yet been demonstrated as a complete executable process.

### Files

- [F1-Product-Listing-Validation.png](F1-Product-Listing-Validation.png) – Selected F1 model image, uploaded by Moses.
- **Pending:** Matching editable F1 BPMN XML export from Moses's Camunda workspace.
- `F1-Product-Listing-Validation.png` – Earlier F1 diagram image added during Sprint 2 development.

### Next steps

The next steps now, are to finish configuring the remaining gateways and process variables, connect the necessary service tasks, and test the main workflow paths in Camunda.

The BPMN file will be consistenlty updated, as well as documentation being done, as the implementation progresses.

## F2 – Inventory and Seasonal Availability Management

**Current status (16 November 2026):** The group has selected Moses's F2 design, currently available as a PNG. Its matching editable BPMN XML export still needs to be uploaded from Camunda before configuration and execution can be verified.

- [F2-Inventory-Seasonal-Availability.png](F2-Inventory-Seasonal-Availability.png) – Current available visual evidence of the F2 diagram.
- **Pending:** Matching editable F2 BPMN XML export and review against the agreed requirements.

### Relationship to the strategic BPMN and requirements

The refined Sprint 2 strategic model contains **Manage Inventory and Seasonal Availability**, with stock updates, seasonal and quantity checks, and an available/unavailable decision. It also shows a separate producer inventory-update request so existing product stock can change independently of a new listing.

The agreed F2 scope calls for producer quantity updates, order-related `stock-changed` messages, zero-stock handling, seasonal limits and restocking rules. These are defined in [Proposed Functionalities](../../docs/requirements/PROPOSED-FUNCTIONALITIES.md) and [Business Rules and Process Variables](../../docs/requirements/business-rules-and-variables.md).


## Sprint 2 strategic reference

- [Refined Strategic BPMN – Sprint 2](../strategic/BRFN-Strategic-BPMN-Sprint2.bpmn)
- [Summary of strategic BPMN changes](../strategic/README.md)
