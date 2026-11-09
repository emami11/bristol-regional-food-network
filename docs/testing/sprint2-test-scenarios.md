# Sprint 2 Test Scenarios and Evidence

**Responsible Group Member:** Moses Bororio
**Issue:** #20, acceptance criterion 4: test example scenarios and record evidence, limitations and next steps.

Rules and variable names come from [business-rules-and-variables.md](../requirements/business-rules-and-variables.md).

## 1. Automated tests (service code)

Run from `services/` with `npm test`. These test the validation rules and the certificate worker against the simulated service, without Camunda.

| Date | Result | Notes |
|---|---|---|
| 3 Nov 2026 | 18 passed, 0 failed | Rules V1–V12, certificate outcomes C3–C6, outage switch |
| <date> | | Re-run after any rule change |

## 2. Process scenarios (in Camunda)

Run each scenario in Web Modeler **Play** or on the cluster with the workers running. Record evidence as a screenshot in `docs/testing/evidence/` (Play's path view, or Operate's instance view with variables) and link it in the table.

### F1: Product Listing and Validation

| ID | Scenario | Input | Expected path and variables | Result | Evidence |
|---|---|---|---|---|---|
| T1 | Valid, not organic | All fields valid, `organicClaimed = false` | Validation passes (`dataValid = true`), certificate check skipped, availability decided, published | | |
| T2 | Valid, organic, certificate valid | `certNumber = BOS-1001` | `certValid = true`, `certStatus = VALID`, published | | |
| T3 | Invalid, then corrected | `price = 0`, `harvestDate` in the future | `dataValid = false`, `validationErrors` lists both; correction form shows them; after fixing, published | | |
| T4 | Invalid, never corrected | `price = 0`, then leave the correction task | Timer fires (`PT1M` in test), listing archived | | |
| T5 | Certificate expired | `certNumber = BOS-2001` | `certValid = false`, `certStatus = EXPIRED`, back to the producer | | |
| T6 | Certificate revoked | `certNumber = WCO-3001` | `certValid = false`, `certStatus = REVOKED`, back to the producer | | |
| T7 | Certificate not found | `certNumber = NOPE-1` | `certValid = false`, `certStatus = NOT_FOUND`, back to the producer | | |
| T8 | Service down, admin approves | Mock outage on, `certNumber = BOS-1001`, admin `APPROVE` | `CERT_SERVICE_DOWN` caught, admin task created, published | | |
| T9 | Service down, admin rejects | Mock outage on, admin `REJECT` with a reason | Back to the producer with `adminReason` | | |
| T10 | Valid but out of season | `availableFrom` after today | Published with `availabilityStatus = NOT_YET_IN_SEASON` | | |

### F2: Inventory and Seasonal Availability (availability decision)

Test the `product-availability` DMN table directly (DMN editor's test or Play), with `today = 2026-11-03`.

| ID | `quantity` | `availableFrom` | `availableTo` | Expected `availabilityStatus` | Result |
|---|---|---|---|---|---|
| D1 | 40 | 2026-06-01 | 2026-11-30 | `AVAILABLE` | |
| D2 | 0 | 2026-06-01 | 2026-11-30 | `OUT_OF_STOCK` | |
| D3 | 40 | 2026-06-01 | 2026-09-30 | `OUT_OF_SEASON` (restocked after season) | |
| D4 | 40 | 2026-12-01 | 2027-02-28 | `NOT_YET_IN_SEASON` | |
| D5 | 0 | 2026-06-01 | 2026-09-30 | `OUT_OF_SEASON` (season row wins) | |
| D6 | 1 | 2026-11-03 | 2026-11-03 | `AVAILABLE` (first and last day count as in season) | |

## 3. How to switch the simulated service off and on

With the mock running (`npm run mock` in `services/`), in PowerShell:

```powershell
# outage on
Invoke-RestMethod -Method Post -Uri http://localhost:4010/admin/outage -ContentType 'application/json' -Body '{"down": true}'
# outage off
Invoke-RestMethod -Method Post -Uri http://localhost:4010/admin/outage -ContentType 'application/json' -Body '{"down": false}'
```

## 4. Limitations (Sprint 2)

- The certification service is simulated with five made-up certificates; there is no real API.
- The workers run on a group member's laptop, so the cluster only reaches them while that laptop is running `npm run workers`.
- Notifications to producers are not sent; they will be logged in Sprint 3.
- Product data lives in process variables only; there is no product database, so the duplicate-listing check and F2's stock history are not implemented.
- F2's stock-change worker and message correlation are planned for Sprint 3.

## 5. Next steps (Sprint 3)

- Implement `apply-stock-change` (rules S1–S4) and `notify-producer`.
- Connect F2's `stock-changed` message and test it with a sample message.
- Run every scenario above end to end and attach the evidence.
- Decide with the group whether to add any of the optional extras (duplicate check, low-stock warning).
