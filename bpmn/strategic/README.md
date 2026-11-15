# Strategic BPMN Model

**Responsible Group Member:** Noyo Acogo Emami

## Overview

This folder contains our strategic BPMN model for the Bristol Regional Food Network (BRFN).

We created the model in Camunda to show how the main business processes are organised and how the marketplace communicates with external participants.

## Main Business Areas

The model is divided into three lanes:

1. Product and Inventory Management
2. Marketplace Operations
3. Quality Assurance and Community Services

Together, these areas contain seven high-level subprocesses covering product listings, inventory, customer purchasing, multi-vendor orders, payments, food quality, and community engagement.

## External Participants

The model shows communication between BRFN and four external participants:

- Food Producers
- Customers
- Payment Service Provider
- Organic Certification Verification Service

Dashed message flows represent information exchanged between these participants and the marketplace.

## Model Structure

We used subprocesses to keep the strategic diagram simple while representing the main business activities.

Each subprocess also contains a basic internal workflow showing its starting event, main activity, and ending event.

The model provides an overview of the enterprise rather than a fully executable system.

## BPMN Files and Sprint 2 Changes

- [Sprint 1 strategic BPMN](BRFN-Strategic-BPMN-Sprint1.bpmn) — original model, retained for comparison.
- [Sprint 2 refined strategic BPMN](BRFN-Strategic-BPMN-Sprint2.bpmn) — updated F1 and F2 subprocesses and independent inventory update trigger.
- [Sprint 2 refinement notes](SPRINT-2-REFINEMENT-NOTES.md) — detailed explanation of changes, rationale, modelling checks and remaining review items.

These BPMN files can be opened in Camunda Web Modeler. The strategic model documents the business process relationships; the operational BPMN models and implementation details are maintained separately.

