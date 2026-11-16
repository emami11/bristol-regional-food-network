# Operational BPMN Models

## Overview

This folder contains the operational BPMN diagrams for the two main functionalities selected by our group.

The operational models show the steps, decisions and interactions involved in each process in more detail than the strategic BPMN.

## F1 – Product Listing and Validation

This process shows how the food producers submit products to the BRFN marketplace and how listings are checked before publication.

The main activities include:

- Checking submitted product information.
- Requesting corrections if details are missing or incorrect.
- Verifying organic certification where required.
- Reviewing certification problems.
- Publishing approved listings or rejecting those that do not meet the requirements.

The model is also used to show interactions between the producer, BRFN and the certification verification service.

**File:** [F1 Operational BPMN Diagram](F1-Product-Listing-Validation.png)

## F2 – Inventory and Seasonal Availability Management

This process shows how product stock and seasonal availability are managed.

The main activities include:

- Receiving stock updates from producers.
- Updating product quantities.
- Checking stock levels and seasonal availability.
- Updating product availability.
- Handling stock changes caused by orders.

**File:** [F2 Operational BPMN Diagram](F2-Inventory-Seasonal-Availability.png)

## Camunda Files

The editable BPMN files for both functionalities have been added to GitHub, along with their supporting subprocesses.

- [F1 – Product Listing and Validation](F1-Product-Listing-Validation.bpmn)
- [F1a – Verify Organic Certification](F1a-Verify-Organic-Certification.bpmn)
- [F2 – Inventory and Seasonal Availability](F2-Inventory-Seasonal-Availability.bpmn)
- [F2a – Evaluate Product Availability](F2a-Evaluate-Product-Availability.bpmn)

The Camunda Forms are stored in the [`camunda/forms`](../../camunda/forms/) folder, and the availability decision table is stored in [`camunda/dmn`](../../camunda/dmn/).

The process files and supporting resources are available in GitHub. Deployment and end-to-end testing still need to be verified.
