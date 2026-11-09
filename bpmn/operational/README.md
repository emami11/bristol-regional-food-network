# Operational BPMN Models

This folder contains the detailed BPMN models developed for Sprint 2 of the Bristol Regional Food Network (BRFN) project.

The operational models expand on the processes identified in the Sprint 1 strategic BPMN, showing how the individual activities, decisions and interactions work in more detail.

## F1 – Product Listing and Validation

**Current status:** BPMN model developed; Camunda implementation in progress.

The F1 process covers how a food producer submits a product to the BRFN marketplace and how the listing is checked before it can be published.

The model includes:

- **Product information validation:** Submitted details are checked before the listing moves forward. If information is incomplete or invalid, the producer is asked to correct it.
- **Organic certification checks:** The process determines whether certification is required and requests verification where necessary.
- **Certification review:** Failed verification results are reviewed to determine whether the producer can resolve the issue.
- **Correction paths:** Producers can submit corrected product information or updated certification evidence without restarting the entire process.
- **Publication or rejection:** A product is published once the required checks have been passed. Listings that cannot meet the requirements are rejected.

The diagram separates the responsibilities of Product Listing Management and Compliance and Verification. It also shows message exchanges with the Food Producer and the Organic Certification Verification Service.

### Camunda implementation

I've started configuring the F1 process in Camunda Web Modeler.

So far, I've created a Certification Compliance Review form and linked it to the **Review Failed Certification** user task. The form captures the certification issue, whether it can be resolved, and the reviewer's notes.

I've also configured the YES and NO conditions for the **Can Certification Issue Be Resolved?** gateway using the `certificationIssueResolvable` variable.

The other gateway conditions, service-task configurations and message handling are still being worked on. The model has not yet been demonstrated as a complete executable process.

### Files

- `BRFN-F1-Product-Listing-and-Validation.bpmn` – Current F1 BPMN model exported from Camunda Web Modeler.
- `F1-Product-Listing-Validation.png` – Earlier F1 diagram image added during Sprint 2 development.

### Next steps

The next stage is to finish configuring the remaining gateways and process variables, connect the necessary service tasks, and test the main workflow paths in Camunda.

I'll update the BPMN file and this documentation as the implementation progresses.

## F2 – Inventory and Seasonal Availability Management

F2 is also part of the Sprint 2 operational modelling work. Its model and implementation progress will be documented here as development continues.



