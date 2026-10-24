# Use Case 1 – Actor Identification and Analysis

**Responsible Group Member:** Xavier Ajike

## 1. Overview

This document identifies the main actors involved in **Use Case 1: Producer Product Listing and Inventory Management** within the food marketplace system.

The purpose of this analysis is to identify the stakeholders, their responsibilities, motivations and relationships with other actors.

These actors form the foundation for the i* Strategic Dependency (SD) and Strategic Rationale (SR) models.

## 2. Actors, Types and Motivations

| Actor | i* Actor Type | Why It Matters | Core Intentions |
|---|---|---|---|
| **Producer** | Role | Supplies products, submits product information and maintains stock availability. | Publish products successfully, maintain accurate inventory, comply with product information requirements and minimise administrative effort. |
| **Customer** | Role | Uses published product information to identify available products. | Access accurate product information, identify available products and trust organic certification claims. |
| **Marketplace Admin** | Position | Oversees marketplace compliance and may handle verification exceptions requiring manual intervention. | Ensure compliant product listings, resolve exceptional cases and protect marketplace reputation. |
| **Marketplace Platform** | Agent | Automates product validation, publication, stock updates and seasonal availability management. | Publish valid products, maintain accurate availability and handle validation or verification failures reliably. |
| **Certification Verification Service** | Agent | External or simulated service responsible for checking organic certification claims. | Provide accurate certification verification results and respond reliably to verification requests. |

## 3. Detailed Actor Responsibilities

### 3.1 Producer

**Actor Type:** Role

**Description:**

The Producer represents a registered farmer or food business representative who supplies products to the marketplace.

**Responsibilities:**
- Submit new product listings.
- Provide product names, descriptions, categories and prices.
- Supply available quantities and seasonal availability periods.
- Provide farm origin, harvest dates, allergen details and best-before dates where relevant.
- Provide organic certification details when making organic claims.
- Correct missing or invalid product information.
- Update product quantities and availability periods.

**Goals:**
- Successfully publish valid products.
- Maintain accurate stock and availability.
- Minimise time spent managing product listings.
- Meet applicable product information requirements.

**Dependencies:**

The Producer depends on the Marketplace Platform for product publication, validation feedback and inventory management.

### 3.2 Customer

**Actor Type:** Role

**Description:**

The Customer represents individuals who view product listings and rely on the marketplace to display accurate product information.

**Responsibilities:**
- View available product listings.
- Review product descriptions and availability information.
- Use product information to make informed purchasing decisions.

**Goals:**
- Access accurate product information.
- Identify products that are currently available.
- Receive reliable allergen and best-before information.
- Trust organic certification claims.

**Dependencies:**

The Customer depends on the Marketplace Platform to provide accurate product information and prevent unavailable products from being offered for new orders.

### 3.3 Marketplace Admin

**Actor Type:** Position

**Description:**

The Marketplace Admin represents an authorised marketplace representative responsible for oversight and compliance.

The position may cover the roles of Compliance Reviewer and Support.

**Responsibilities:**
- Oversee marketplace listing compliance.
- Review validation or verification exceptions where manual intervention is part of the system design.
- Review unresolved certification issues.
- Support producers experiencing listing problems.
- Help maintain marketplace policies.

**Goals:**
- Ensure only compliant products are published.
- Maintain marketplace reliability and reputation.
- Resolve exceptional cases effectively.

**Dependencies:**

The Marketplace Admin depends on the Marketplace Platform for information about product validation, certification outcomes and unresolved exceptions.

**Note:** Manual administrator review is a proposed system feature rather than an explicit requirement of Use Case 1.

### 3.4 Marketplace Platform

**Actor Type:** Agent

**Description:**

The Marketplace Platform represents the software system responsible for automating product listing, validation and inventory management.

The proposed implementation uses Camunda to coordinate business processes.

**Responsibilities:**
- Receive product listing submissions.
- Validate mandatory product information.
- Identify missing or invalid fields.
- Request corrections from producers.
- Request organic certification verification when applicable.
- Process verification results.
- Publish successfully validated products.
- Update stock quantities and seasonal availability.
- Automatically mark products unavailable when stock reaches zero.
- Restore availability after replenishment when the product remains within its seasonal availability period.
- Handle external verification failures or unavailability.

**Goals:**
- Ensure valid products are published.
- Maintain accurate product availability.
- Automate repetitive marketplace operations.
- Handle exceptions reliably.
- Support efficient producer interactions.

**Dependencies:**

The Marketplace Platform depends on the Producer for product information and inventory updates, the Certification Verification Service for verification results, and potentially the Marketplace Admin for manual exception handling.

### 3.5 Certification Verification Service

**Actor Type:** Agent

**Description:**

The Certification Verification Service represents an external or simulated software service used to check organic certification claims.

**Responsibilities:**
- Receive organic certification verification requests.
- Check submitted certification information.
- Return verification results.
- Communicate unsuccessful verification outcomes.
- Provide appropriate responses when verification cannot be completed.

**Goals:**
- Provide accurate verification results.
- Support reliable organic certification checking.
- Respond to verification requests efficiently.

**Dependencies:**

The Marketplace Platform depends on this service to obtain the results required to assess organic certification claims.

## 4. Actor Relationships

The following relationships may be represented in the i* models where appropriate:

- **Registered Producer is-a User:** A registered producer is a specialised type of marketplace user.
- **Marketplace Admin is-a User:** An administrator is a specialised type of marketplace user.
- **Producer plays Supplier role:** The producer fulfils the supplier responsibilities within the marketplace.
- **Marketplace Admin covers Compliance Reviewer and Support roles:** The administrator position may perform both responsibilities.
- **Marketplace Platform is-part-of Marketplace Organisation:** The software platform operates as part of the wider marketplace enterprise.

## 5. Actor Scope

The five identified actors provide coverage for the main activities in Use Case 1:

1. Product submission and validation.
2. Organic certification verification.
3. Product publication.
4. Inventory and seasonal availability management.
5. Customer access to accurate product information.
6. Compliance oversight and exception handling.

Additional enterprise actors, such as Payment Service, Notification Service and Food Safety Authority, may be relevant to the wider strategic business process model, but are not required for the core Use Case 1 SD model.

## 6. Conclusion

The five actors provide a focused basis for analysing the socio-technical relationships involved in product listing and inventory management.

The Producer, Marketplace Platform and Certification Verification Service are central to the operational process. The Customer represents the interests of those relying on published information, while the Marketplace Admin provides organisational oversight and may support exception handling.

These actors will be used to identify goals, softgoals, tasks, resources and dependencies in the i* Strategic Dependency and Strategic Rationale models.
