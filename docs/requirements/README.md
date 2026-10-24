# Requirements Analysis

## Overview

Our group has provisionally selected Use Case 1: Producer Product Listing and Inventory Management.

For this use case, we are focusing on two major functionalities that will be developed in more detail during later sprints.

## Functionality 1: Product Listing and Validation

This allows registered producers to submit products for sale on the BRFN marketplace.

The main requirements are:

- Producers can enter product details, including price, quantity, origin, allergens and availability.
- The system checks that required information has been provided.
- Producers can correct incomplete or invalid submissions.
- Organic certification can be verified through a simulated external service where applicable.
- Validated products can be published on the marketplace.
- Producers receive feedback about their submissions.

## Functionality 2: Inventory and Seasonal Availability

This allows producers to maintain accurate stock and availability information.

The main requirements are:

- Producers can update product quantities.
- The system checks whether products are in season.
- Products become unavailable when stock reaches zero.
- Products can become available again when restocked, provided they are still in season.
- Stock changes can be received from an external ordering process.
- Availability decisions can be supported by a DMN decision table.

## Other Requirements

The system should be easy for producers to use, maintain accurate product information and handle invalid inputs or unavailable external services appropriately.

## Scope

Our focus is on product listings, validation, stock management and seasonal availability.

Customer checkout and payment processing are outside our selected use case, although stock updates from orders may be used as an integration point.

## Current Status

Initial requirements identified for Sprint 1. Detailed modelling and implementation are planned for later sprints.
