# Stakeholder Analysis

**Responsible Group Member:** Ayobamidele Esho (Ayo)

## Overview

This analysis identifies the main stakeholders in the Bristol Regional Food Network (BRFN), their roles, goals and needs. It supports Use Case 1: Producer Product Listing and Inventory Management.

## Key Stakeholders

| Stakeholder / Actor | Role | Main Goal | Main Needs |
|---|---|---|---|
| Local food producers | List products and update stock. | Publish valid products and maintain accurate availability. | Simple updates, clear feedback and accurate stock records. |
| Individual customers | Browse and purchase local food. | Find suitable, available products. | Clear prices, product origin, allergen information and accurate availability. |
| Restaurants and cafés | Purchase ingredients for their businesses. | Source suitable local ingredients reliably. | Reliable availability and straightforward ordering. |
| Community organisations | Purchase food for community needs. | Obtain suitable food for their groups. | Dietary and allergen information and dependable availability. |
| Marketplace administrators | Oversee listings and resolve issues. | Support compliant listings and resolve exceptions. | Accurate records, verification results and clear review policies. |
| Payment service provider | Process payments and return outcomes. | Process valid payment requests reliably. | Correct transaction information and clear payment instructions. |
| Certification verification service | Check organic certification claims. | Provide accurate verification results. | Complete certification details and clear verification requests. |
| Marketplace Platform | Validate listings and manage availability. | Publish valid products and display current availability. | Complete product details, stock updates and external-service results. |

The Marketplace Platform is a technical actor included to explain automated responsibilities. Payment is wider marketplace context and remains outside the two selected Task 1 functionalities.

## Stakeholder Dependencies

Producers depend on the Platform for validation, publication and feedback. The Platform depends on producers for accurate product details and stock updates. All three buyer groups depend on the Platform for reliable product information and availability.

The Platform depends on the Certification Verification Service for check results, while the service needs complete verification requests. Administrators need issue records from the Platform. Where manual review applies, the Platform relies on administrators to review unresolved verification cases.

In the wider marketplace, the Platform relies on the Payment Service for transaction outcomes, while the Payment Service needs valid payment requests.

## How This Supports Our Project

This analysis supports the strategic BPMN model, the **SD model** showing dependencies between actors, and the **SR model** explaining their goals, tasks, resources and desired qualities.
