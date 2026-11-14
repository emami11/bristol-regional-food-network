# Operational BPMN Models

This folder contains the operational BPMN models developed for Sprint 2 of the project.

**Runnable contribution:** [Ayo's F1/F2 implementation](ayo/README.md) includes executable models, a shared DMN, four forms, workers and a token viewer. [Execution results](../../docs/testing/ayo-executable-bpmn-results.md) record the local Camunda tests. The progress notes below describe the original group model files.

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

F2 is also part of the Sprint 2 operational modelling work. Its model and implementation progress will be documented here as development continues.



