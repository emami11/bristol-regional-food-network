# Proposed Functionalities — Detailed Scope

**Responsible Group Member:** Moses Bororio

### Proposed Major Functionalities

Both functionalities come from Use Case 1 and sit in the Product and Inventory Management lane of our strategic BPMN, as the "Manage Product Listings" and "Manage Inventory and Seasonal Availability" sub-processes. Each is a complete end-to-end process with user interaction, automated processing, business decisions, service interaction, data handling, and alternative and exception paths.

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

---

### Why these two

We checked candidate processes against the brief's definition of a major functionality.

| Criterion from the brief | F1 Product Listing and Validation | F2 Inventory and Seasonal Availability | Producer registration (not chosen) |
|---|---|---|---|
| End-to-end business process | Yes | Yes | Partly |
| User interaction | Product, correction and admin review forms | Stock and season update form | Registration form |
| Automated processing | Validation, publishing | Stock update, status change | Account creation |
| Business decisions | Data valid? Organic claimed? Certificate valid? | Availability rules (DMN) | Few |
| Service interaction | Certification verification (simulated) | Stock-change messages from orders | None |
| Alternative and exception paths | Invalid data, failed certificate, service unavailable, abandoned listing | Invalid stock value, sold out, out of season | Few |

### Agreement with the module team

| Date | How we asked | Response |
|---|---|---|
  | — | To be asked at our practical, w/c 26 Oct 2026 | Awaiting |

