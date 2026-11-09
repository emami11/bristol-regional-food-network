# Business Rules and Process Variables (F1 and F2)

**Responsible Group Member:** Moses Bororio
**Issue:** #20 Sprint 2: Implement Variables, Gateways, Service Tasks and Business Rules

This document is the single reference for the rules our operational BPMN, Camunda Forms, DMN decision and job workers must follow. If a rule or a variable name changes, change it here first, then in the model, forms and code.

Scope is as agreed in [PROPOSED-FUNCTIONALITIES.md](PROPOSED-FUNCTIONALITIES.md).

## 1. Naming conventions

- Process variables use `camelCase` (e.g. `bestBeforeDate`).
- Dates are ISO text `YYYY-MM-DD` (what a Camunda Forms date field produces).
- Status values are `UPPER_SNAKE_CASE` text (e.g. `OUT_OF_STOCK`).
- Job types and message names use `kebab-case` (e.g. `verify-certificate`).
- **Form field keys must match these variable names exactly**, or the forms, conditions and workers won't see each other's data.

## 2. Process variables

### F1: set by the producer (product form and correction form)

| Variable | Type | Required | Notes |
|---|---|---|---|
| `name` | text | Yes | 3–100 characters |
| `description` | text | Yes | Up to 1000 characters |
| `category` | text | Yes | One of the categories in rule V4 |
| `price` | number | Yes | £, above 0, max 2 decimal places |
| `quantity` | number | Yes | Whole number, 0 or more |
| `farmOrigin` | text | Yes | Farm or area the product comes from |
| `harvestDate` | date | Yes | |
| `bestBeforeDate` | date | Yes | |
| `availableFrom` | date | Yes | Start of the seasonal availability period |
| `availableTo` | date | Yes | End of the seasonal availability period |
| `allergens` | list of text | Yes (may be empty) | Empty list means it contains none of the 14 |
| `organicClaimed` | boolean | Yes | |
| `certNumber` | text | If organic | Certificate number |
| `certBody` | text | If organic | Certifying body |
| `certExpiry` | date | If organic | Expiry on the certificate |

### F1: set by the system

| Variable | Type | Set by | Values / notes |
|---|---|---|---|
| `dataValid` | boolean | `validate-product` worker | `true` when every V rule passes |
| `validationErrors` | list | `validate-product` worker | `[{ field, message }]`, every problem at once |
| `validationSummary` | text | `validate-product` worker | One line per error, for showing in the correction form |
| `certValid` | boolean | `verify-certificate` worker or admin | `true` only for a valid, unexpired certificate |
| `certStatus` | text | `verify-certificate` worker | `VALID`, `EXPIRED`, `REVOKED`, `NOT_FOUND`, `SERVICE_DOWN`, `NOT_CLAIMED` |
| `certCheckedAt` | date-time | `verify-certificate` worker | When the check ran |
| `certVerifiedBy` | text | worker or admin step | `SERVICE` or `ADMIN` |
| `availabilityStatus` | text | `product-availability` decision | See rule A1–A4 |

### F1: set by the marketplace admin (manual certificate review form)

| Variable | Type | Values / notes |
|---|---|---|
| `adminDecision` | text | `APPROVE` or `REJECT` |
| `adminReason` | text | Required when rejecting; shown to the producer |

### F2

| Variable | Type | Set by | Notes |
|---|---|---|---|
| `productId` | text | process start / message | Identifies the product; correlation key for stock messages |
| `newQuantity` | number | producer (stock form) | Whole number, 0 or more |
| `quantityChange` | number | `stock-changed` message | Negative for a sale, positive for a cancellation |
| `orderId` | text | `stock-changed` message | Used to ignore a duplicate message |
| `availableFrom`, `availableTo` | date | producer (stock form) | Same rules as F1 |
| `quantity` | number | system | Stock after the change is applied |
| `previousStatus` | text | system | Status before this run |
| `availabilityStatus` | text | `product-availability` decision | Status after this run |
| `statusChanged` | boolean | system | `availabilityStatus != previousStatus` |

## 3. Validation rules (F1)

Checked by the `validate-product` service task. **All failures are reported together**, then the producer corrects them and the full check runs again.

| ID | Rule | Error shown to the producer |
|---|---|---|
| V1 | Name is present, 3–100 characters | Product name is required / must be 3 to 100 characters |
| V2 | Description is present, up to 1000 characters | Description is required |
| V3 | Farm origin is present | Farm origin is required |
| V4 | Category is one of: Vegetables, Fruit, Dairy, Eggs, Meat, Fish, Bakery, Preserves, Drinks, Other | Category must be one of … |
| V5 | Price is above £0.00 with at most 2 decimal places | Price must be more than £0.00 |
| V6 | Quantity is a whole number, 0 or more | Quantity must be a whole number, 0 or more |
| V7 | All four dates are real calendar dates | … must be a real date (YYYY-MM-DD) |
| V8 | Harvest date is not in the future | Harvest date cannot be in the future |
| V9 | Best-before date is after the harvest date and has not passed | Best-before date must be after the harvest date |
| V10 | Season end is on or after season start | Season end must be on or after the season start |
| V11 | Allergens are declared as a list, each one of the 14 UK allergens (celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, tree nuts, peanuts, sesame, soya, sulphites) | Allergens must be declared |
| V12 | If organic is claimed: certificate number, body and expiry are present, and expiry has not passed | Certificate … is required for organic products / has already expired |

Abandoned listings: if the producer doesn't resubmit the correction form within **7 days**, the listing is archived (timer `P7D`; use `PT1M` while testing).

## 4. Certification rules (F1)

| ID | Rule |
|---|---|
| C1 | The certificate is checked **only when** `organicClaimed = true`. |
| C2 | The `verify-certificate` worker asks the simulated certification service for `certNumber`. |
| C3 | Valid and unexpired → `certValid = true`, `certStatus = VALID`. |
| C4 | Expired, revoked or not found → `certValid = false` with the matching `certStatus`. The producer must correct the certificate or remove the organic claim. |
| C5 | If the service doesn't answer, the worker **retries** (3 attempts, 1 s apart, 3 s timeout each) before giving up. |
| C6 | After the retries fail, the worker throws the BPMN error **`CERT_SERVICE_DOWN`**. The model catches it and routes to manual review by a marketplace admin, so the process doesn't stop. |
| C7 | In manual review, `adminDecision = APPROVE` counts as a valid certificate; `REJECT` is treated like C4, with `adminReason` shown to the producer. |
| C8 | The outcome is recorded in `certStatus`, `certCheckedAt` and `certVerifiedBy`. |

## 5. Stock rules (F2)

| ID | Rule |
|---|---|
| S1 | A producer's new quantity must be a whole number, 0 or more; otherwise it goes back to the producer to correct. |
| S2 | A `stock-changed` message adds `quantityChange` to `quantity` (negative for a sale, positive for a cancellation). |
| S3 | Stock never goes below 0. If a sale would take it below 0, set it to 0 and flag it for the producer (overselling). |
| S4 | A `stock-changed` message for an `orderId` already applied is ignored. |
| S5 | Season end must be on or after season start (same as V10). |

## 6. Seasonal availability rules (F1 and F2)

One decision, **`product-availability`**, used by both functionalities. Implemented as a DMN decision table. Rows are in priority order: the first matching row decides.

**Inputs:** `quantity`, `availableFrom`, `availableTo`, `today` (the current date).
**Output:** `availabilityStatus`.

| ID | When | `availabilityStatus` | Open to new orders? |
|---|---|---|---|
| A1 | `today` is before `availableFrom` | `NOT_YET_IN_SEASON` | No |
| A2 | `today` is after `availableTo` | `OUT_OF_SEASON` | No |
| A3 | In season and `quantity = 0` | `OUT_OF_STOCK` | No |
| A4 | In season and `quantity > 0` | `AVAILABLE` | Yes |

A3 and A4 are the two rules Use Case 1 states: zero stock makes a product unavailable for new orders, and restocking makes it available again only while it is in season. A restock after `availableTo` still gives `OUT_OF_SEASON` because A2 is checked first.

The current date can be passed into the decision as `today` (e.g. an input expression `today()` in FEEL), so tests can also supply a fixed date.

## 7. Technical contract with the model

Names the BPMN, forms and code must agree on.

### Job types (service tasks)

| Job type | Used by | Reads | Writes | Status |
|---|---|---|---|---|
| `validate-product` | F1 | product form variables | `dataValid`, `validationErrors`, `validationSummary` | Implemented, `services/` |
| `verify-certificate` | F1 | `organicClaimed`, `certNumber` | `certValid`, `certStatus`, `certCheckedAt`, `certVerifiedBy` | Implemented, `services/` |
| `apply-stock-change` | F2 | `quantity`, `quantityChange` / `newQuantity`, `orderId` | `quantity`, `previousStatus` | Planned, Sprint 3 |
| `notify-producer` | F1, F2 | status variables | (none) | Planned, Sprint 3 (logs only) |

### BPMN errors

| Error code | Thrown by | Meaning |
|---|---|---|
| `CERT_SERVICE_DOWN` | `verify-certificate` | The certification service didn't answer after retries |

### Messages

| Message name | Correlation key | Used by |
|---|---|---|
| `stock-changed` | `= productId` | F2: stock change from the ordering process (Use Case 2 / Task 2 link) |

### Timers

| Purpose | Value | While testing |
|---|---|---|
| Archive an uncorrected listing | `P7D` | `PT1M` |
| Daily season check (F2) | `R/P1D` or a cron expression | `R/PT5M` |

### Conditions for the process's decisions (FEEL)

| Decision | Condition |
|---|---|
| Details valid | `= dataValid = true` (other branch as default) |
| Organic claimed | `= organicClaimed = true` |
| Certificate accepted (service) | `= certValid = true` |
| Certificate accepted (admin) | `= adminDecision = "APPROVE"` |
| Status changed (F2) | `= availabilityStatus != previousStatus` |
| Product orderable | `= availabilityStatus = "AVAILABLE"` |

## 8. Use of generative AI

This document and the code in `services/` were drafted with AI assistance (Claude) from our agreed scope, then reviewed by the group. The operational BPMN models, forms and DMN table are built by the group in Camunda.
