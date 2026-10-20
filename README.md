# Bristol Regional Food Network
## Distributed and Enterprise Software Development (UFCFTR-30-3)
## Group 14
### Project Overview

This repository contains the development work for Assessment Task 1
of the Distributed and Enterprise Software Development module
at the University of the West of England (UWE Bristol).

The project is based on the Bristol Regional Food Network,
a fictional community initiative connecting local food producers
with customers through a digital marketplace.

The platform aims to support local producers by improving
product accessibility, inventory management, order processing,
and communication between producers and customers.

## Selected Use Case

### Use Case 1: Producer Product Listing and Inventory Management

Our group's provisional choice is Use Case 1.

This focuses on allowing registered food producers to list
products, manage inventory, update seasonal availability,
and ensure customers receive accurate product information.

### Proposed Major Functionalities

Both functionalities come from Use Case 1 and sit in the Catalogue and Inventory lane of our strategic BPMN. Each is a complete end-to-end process with user interaction, automated processing, business decisions, service interaction, data handling, and alternative and exception paths.

**Functionality 1: Product Listing and Validation**

- Producer product information submission (name, description, category, price, quantity, availability period, farm origin, harvest date, allergens, best-before date)
- Mandatory information validation, with a correction loop back to the producer
- Organic certification verification where applicable, via a simulated external service
- Manual admin review if the verification service is unavailable
- Product publication with producer notification
- Validation and external-service exception handling, including a timer to archive abandoned listings

*In scope:* submission, validation, certification check, publishing.
*Out of scope:* producer registration and real certification APIs (simulated instead).

**Functionality 2: Inventory and Seasonal Availability Management**

- Product quantity updates by the producer, or by stock-change messages from orders
- Seasonal availability management, including a daily season check
- Automatic stock unavailability when quantity reaches zero
- Product restocking and availability restoration, only while within the seasonal availability period
- Inventory-related business decisions through a shared availability decision table (DMN)

*In scope:* stock and season updates, availability rules, opening and closing products to orders, producer notifications.
*Out of scope:* ordering, checkout and payment (Use Case 2). F2 only receives a stock-change message, which is our integration point for Task 2.



## Development Approach

The project follows an Agile sprint-based development approach.

### Sprint 1: Strategic Process Analysis and Project Setup

- Analyse the enterprise case study
- Identify stakeholders and responsibilities
- Identify major business processes
- Develop a strategic-level BPMN model
- Identify and scope two major functionalities
- Establish the product backlog and sprint plan
- Set up version control and record group contributions

### Sprint 2: Socio-Technical and Operational Modelling

- Develop i* Strategic Dependency and Strategic Rationale models
- Develop two detailed operational BPMN models
- Begin process automation using Camunda
- Implement initial user tasks, Forms, and service tasks

### Sprint 3: Implementation and Integration

- Complete executable Camunda processes
- Implement automated business logic
- Integrate services and interfaces
- Handle alternative and exception paths
- Prepare the final in-class demonstration

## Technologies

- BPMN 2.0
- Camunda 8
- GitHub
- Python (where appropriate)
- GitHub Projects for sprint management

## Project Documentation

Project documentation, BPMN models, development evidence,
and sprint planning materials will be maintained in
this repository as development progresses.

## Group Members

Noyo Acogo Emami
Xavier Ajike
Moses Bororio
Ayobamidele Esho
Elvis Uchendi

## Assessment Information

Module: Distributed and Enterprise Software Development

Module Code: UFCFTR-30-3

Assessment: Task 1

Academic Year: 2026/27

Final Submission Deadline: 10 December 2026, before 14:00
