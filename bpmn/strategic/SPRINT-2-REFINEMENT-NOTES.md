# Strategic BPMN – Sprint 2 Changes

## Overview

During Sprint 2, the strategic BPMN was updated from Sprint 1 to show more detail for our two selected functionalities: Product Listing and Validation (F1) and Inventory and Seasonal Availability Management (F2).

The overall structure of the model remained the same.

## Changes to F1

The product listing subprocess, was expanded to show what happens when a producer submits a product.

The changes included:

- Checking whether the product information is valid.
- Requesting corrections when information is missing or incorrect.
- Checking organic certification where required.
- Allowing certification issues to be reviewed and corrected.
- Publishing valid product listings or rejecting those that do not meet the requirements.

## Changes to F2

Updated the inventory subprocess to show how product availability is determined.

The process now includes:

- Updating product stock information.
- Checking stock levels and seasonal availability.
- Deciding whether the product should be marked as available or unavailable.

A separate inventory update event was added, so producers can update existing products without submitting a new listing.

## Other Changes

Reviewed how customer orders relate to inventory management. Orders and cancellations can affect stock levels, so this relationship was noted in the model.

The other main business processes were kept unchanged to maintain the overall view of BRFN.
