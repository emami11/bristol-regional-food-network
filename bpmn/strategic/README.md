# Strategic BPMN Model

**Responsible Group Member:** Noyo Acogo Emami

## Overview

This folder contains the strategic BPMN model for the Bristol Regional Food Network (BRFN), created using Camunda Web Modeler.

The model shows the main business processes, the departments responsible for them and how the BRFN interacts with external participants.

The Sprint 1 version is still available for comparison, while the Sprint 2 version includes all the changes to the two selected functionalities.

## Main Business Processes

The BRFN process is divided into three lanes:

1. **Product and Inventory Management:** Product listing, validation, stock management and seasonal availability.
2. **Marketplace Operations:** Customer orders, order coordination and payments.
3. **Quality Assurance and Community Services:** Food quality, traceability and community activities.

The model also shows interactions with food producers, customers, the payment service provider and the organic certification verification service.

## Sprint 2 Changes

### F1 – Product Listing and Validation

I expanded the product listing subprocess to include:

- Checking submitted product details.
- Allowing producers to correct invalid information.
- Checking organic certification where required.
- Reviewing certification issues.
- Publishing valid listings or rejecting those that do not meet the requirements.

These changes show that a product must pass the required checks before it can be published.

### F2 – Inventory and Seasonal Availability

The inventory management subprocess were also expanded to include:

- Updating product stock information.
- Checking stock levels and seasonal availability.
- Deciding whether a product should be available for purchase.

A separate inventory update event was also added, so producers can update existing product stock without submitting a new product listing.

### Other Changes

The relationship between customer orders and inventory management was also looked at, since orders and cancellations can affect available stock.

The other main business processes were kept to maintain an overview of the whole organisation.

## Model Files

| File                               | Description                         |
| ---------------------------------- | ----------------------------------- |
| `BRFN-Strategic-BPMN-Sprint1.bpmn` | Original strategic BPMN             |
| `BRFN-Strategic-BPMN-Sprint1.png`  | Image of the Sprint 1 model         |
| `BRFN-Strategic-BPMN-Sprint2.bpmn` | Updated strategic BPMN for Sprint 2 |
