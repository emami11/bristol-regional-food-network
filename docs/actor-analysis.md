# Use Case 1 – Actor Identification and Analysis

**Project:** Bristol Regional Food Network (BRFN)  


## 1. Overview

This document identifies and analyses the main actors involved in Use Case 1: Producer Product Listing and Inventory Management within the Bristol Regional Food Network (BRFN).

The purpose of this analysis is to identify the actors involved in product listing and inventory management, understand their responsibilities and goals, and examine how they interact with the marketplace system.

The analysis focuses on the selected use case rather than the entire marketplace. It provides a foundation for understanding the different roles involved and supports the development of the project's socio-technical and business process models.

## 2. Actor Identification

Five main actors have been identified for Use Case 1.

| Actor | Actor Type | Description |
|---|---|---|
| **Registered Producer** | Agent | A registered farmer or food business representative responsible for submitting products and maintaining inventory information. |
| **Customer** | Role | Represents customers who rely on accurate product information and availability when purchasing food. |
| **Marketplace Admin** | Position | Represents marketplace staff responsible for overseeing product compliance and handling exceptional cases where required. |
| **Marketplace Platform** | Agent | The software system responsible for validating product information, publishing products and managing inventory availability. |
| **Certification Verification Service** | Agent | An external or simulated service responsible for verifying organic certification claims. |

The Registered Producer, Marketplace Platform and Certification Verification Service are directly involved in the product submission, validation and publication process.

The Customer relies on accurate product information provided by the marketplace, while the Marketplace Admin supports compliance and operational oversight.

Together, these actors contribute to the effective management of product listings and inventory within the marketplace.

## 3. Actor Responsibilities and Goals

This section outlines the main responsibilities, goals and softgoals of the five actors involved in Use Case 1.

Responsibilities describe the activities performed by each actor, goals represent the outcomes they aim to achieve, and softgoals describe desirable qualities such as efficiency, reliability and ease of use.

### 3.1 Registered Producer

The Registered Producer is responsible for creating and maintaining product listings within the marketplace.

| Responsibilities | Goals | Softgoals |
|---|---|---|
| Submit new product listings. | Successfully publish valid products. | Simple and efficient listing process. |
| Provide accurate product descriptions, prices and quantities. | Maintain accurate inventory information. | Minimal administrative effort. |
| Supply relevant product information, including allergens and organic certification details where applicable. | Meet product listing requirements. | Clear and understandable validation feedback. |
| Correct missing or invalid product information. | Keep product availability up to date. | |
| Update stock quantities and seasonal availability. | | |

### 3.2 Customer

The Customer represents individuals who use the marketplace to find and purchase locally produced food.

Although customers do not directly manage product listings, they depend on accurate information provided by the marketplace.

| Responsibilities | Goals | Softgoals |
|---|---|---|
| Browse available products. | Access accurate product information. | Trustworthy product listings. |
| Review product descriptions and availability information. | Identify products that are currently available. | Confidence in organic certification claims. |
| Consider allergen and best-before information when making purchasing decisions. | Obtain reliable allergen and best-before information. | Reliable marketplace experience. |

### 3.3 Marketplace Admin

The Marketplace Admin represents marketplace staff responsible for overseeing product listing compliance and supporting marketplace operations.

| Responsibilities | Goals | Softgoals |
|---|---|---|
| Monitor product listing compliance. | Ensure products meet marketplace requirements. | Effective compliance management. |
| Support producers experiencing listing difficulties. | Resolve exceptional cases. | Reduced administrative workload. |
| Review unresolved verification issues where manual intervention is implemented. | Maintain reliable marketplace operations. | Customer and producer confidence. |
| Help maintain marketplace listing standards. | | |

**Note:** Manual administrator review is a proposed exception-handling feature and is not an explicit requirement of Use Case 1.

### 3.4 Marketplace Platform

The Marketplace Platform is the software system responsible for managing product listing and inventory processes.

| Responsibilities | Goals | Softgoals |
|---|---|---|
| Receive product listing submissions. | Publish valid product listings. | Reliable automated processing. |
| Validate mandatory product information. | Maintain accurate inventory and product availability. | Efficient product management. |
| Request corrections when information is missing or invalid. | Prevent unavailable products from being offered for new orders. | Minimal processing delays. |
| Request organic certification verification when applicable. | Handle validation and verification failures appropriately. | |
| Publish successfully validated products. | | |
| Process stock quantity and seasonal availability updates. | | |
| Automatically make products unavailable when stock reaches zero. | | |
| Restore product availability after replenishment when appropriate. | | |
| Handle verification failures and service unavailability. | | |

### 3.5 Certification Verification Service

The Certification Verification Service is an external or simulated service responsible for checking organic certification claims submitted through the marketplace.

| Responsibilities | Goals | Softgoals |
|---|---|---|
| Receive organic certification verification requests. | Provide accurate certification verification results. | Timely verification responses. |
| Check submitted certification information. | Support the verification of organic product claims. | Reliable service availability. |
| Return verification results. | | Accurate verification processing. |
| Communicate unsuccessful verification outcomes or service errors. | | |

## 4. Actor Relationships

The actors interact with one another to support the product listing and inventory management process.

Understanding these relationships helps explain how information is exchanged and how different actors contribute to the operation of the marketplace.

| Actor Relationship | Description |
|---|---|
| **Producer → Marketplace Platform** | The Producer submits product information and inventory updates to the Platform. |
| **Marketplace Platform → Producer** | The Platform validates submitted information, provides feedback and requests corrections when necessary. |
| **Marketplace Platform → Certification Verification Service** | The Platform requests verification of organic certification claims and receives verification results. |
| **Customer → Marketplace Platform** | The Customer relies on the Platform to display accurate product information and availability. |
| **Marketplace Admin → Marketplace Platform** | The Admin oversees listing compliance and may access information about exceptional cases. |
| **Marketplace Platform → Marketplace Admin** | The Platform may request manual review when automated verification cannot resolve an issue. |

These relationships demonstrate the interactions between human actors, the marketplace software system and external services.

The Producer and Marketplace Platform have a central relationship because product submission, validation, publication and inventory updates depend on their interaction.

The Certification Verification Service supports the Platform by checking organic certification claims, while the Customer relies on the resulting product information.

The Marketplace Admin provides organisational oversight and may become involved when exceptional cases require additional attention.

The relationships identified here will support the group's later modelling work, where dependencies between actors can be represented in greater detail.

## 5. Conclusion

This analysis identifies five main actors involved in Use Case 1: Registered Producer, Customer, Marketplace Admin, Marketplace Platform and Certification Verification Service.

Each actor contributes to the product listing and inventory management process through different responsibilities, goals and relationships.

The Registered Producer and Marketplace Platform are central to product submission, validation, publication and inventory updates, while the Certification Verification Service supports organic certification verification.

The Customer depends on accurate product information and availability, while the Marketplace Admin supports compliance and exceptional cases where required.

Understanding these actors, their responsibilities, goals, softgoals and interactions provides a foundation for the next stages of system analysis and business process modelling.
