# Model Traceability – BRFN Digital Marketplace (Sprint 2)

## 1. Purpose and how to read this

This document traces every Use Case 1 requirement through each model level, so a reader can follow it from **why** (i*) to **what** (strategic BPMN) to **how** (operational BPMN) to **build** (Camunda configuration):

```
Use Case 1 requirement
  → i* SD dependency     who depends on whom, and for what
  → i* SR element        the goal, task, resource or quality inside an actor
  → Strategic BPMN       the enterprise sub-process that owns it
  → Operational BPMN     the element(s) that carry it out in F1, F1a, F2 or F2a
  → Implementation       job types, forms, DMN
```

- **F1 – Product Listing and Validation:** a producer submits a product; BRFN validates it, checks organic certification where claimed (F1a), decides its initial availability and publishes it, or asks for corrections and archives it if abandoned.
- **F2 – Inventory and Seasonal Availability Management:** stock and season changes from the producer, from orders, and from a daily check are applied, and the product's availability is re-decided (F2a).

Operational element names are quoted exactly as they appear in the model files. Each operational element also has a short code (for example `UT_Submit`). Section 8 maps every code to its element and current ID in the `.bpmn` file.

**Status key:** **Traced** = linked at every level · **Config** = modelled, but a configuration or naming fix is listed in section 7 · **Gap** = missing from a model

## 2. Models traced

| Level | File |
|---|---|
| i* Strategic Dependency (SD) | [brfn-strategic-dependency.txt](../../models/istar/brfn-strategic-dependency.txt) / [.png](../../models/istar/brfn-strategic-dependency.png) |
| i* Strategic Rationale (SR) | [SR-Core.txt](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Core.txt) / [.png](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Core.png) |
| Strategic BPMN, Sprint 2 | [BRFN-Strategic-BPMN-Sprint2-2.bpmn](../../bpmn/strategic/BRFN-Strategic-BPMN-Sprint2-2.bpmn) |
| Operational BPMN, F1 | [F1-Product-Listing-Validation.bpmn](../../bpmn/operational/F1-Product-Listing-Validation.bpmn) / [.png](../../bpmn/operational/F1-Product-Listing-Validation.png) |
| Operational BPMN, F1a (called by F1) | [F1a-Verify-Organic-Certification.bpmn](../../bpmn/operational/F1a-Verify-Organic-Certification.bpmn) / [.png](../../bpmn/operational/F1a-Verify-Organic-Certification.png) |
| Operational BPMN, F2 | [F2-Inventory-Seasonal-Availability.bpmn](../../bpmn/operational/F2-Inventory-Seasonal-Availability.bpmn) / [.png](../../bpmn/operational/F2-Inventory-Seasonal-Availability.png) |
| Operational BPMN, F2a (called by F2) | [F2a-Evaluate-Product-Availability.bpmn](../../bpmn/operational/F2a-Evaluate-Product-Availability.bpmn) / [.png](../../bpmn/operational/F2a-Evaluate-Product-Availability.png) |
| DMN decision | [availability-status.dmn](../../camunda/dmn/availability-status.dmn) |
| Forms | [camunda/forms](../../camunda/forms) |

## 3. Requirements

Taken from Use Case 1 and our agreed scope in [PROPOSED-FUNCTIONALITIES.md](PROPOSED-FUNCTIONALITIES.md) and [README.md](README.md).

| ID | Requirement | Source |
|---|---|---|
| R1 | Producer submits a product with all required details | Use Case 1 |
| R2 | System validates the submitted information | Use Case 1 |
| R3 | If information is missing or invalid, the producer is asked to correct it | Use Case 1 |
| R4 | Organic certification is checked with an external or simulated service | Use Case 1 |
| R5 | The process copes when the verification service is unavailable | Use Case 1 |
| R6 | Listings that are never corrected are archived | Agreed scope |
| R7 | Validated products are published and become available to customers | Use Case 1 |
| R8 | Producer receives feedback on the outcome of a submission | Requirements README |
| R9 | Producer updates product quantity and seasonal availability | Use Case 1 |
| R10 | Stock changes are received from the ordering process | Agreed scope (Task 2 link) |
| R11 | Stock at zero makes the product unavailable for new orders | Use Case 1 |
| R12 | Restocked products become available again only while in season | Use Case 1 |
| R13 | Seasonal availability is checked automatically (daily) | Requirements README, agreed scope |
| R14 | Availability is decided by a DMN decision table | Requirements README |
| R15 | Invalid stock input and stock discrepancies are handled | Agreed scope |
| N1 | Easy for producers to use | Requirements README |
| N2 | Product and organic information is accurate and trustworthy | Requirements README |
| N3 | External service problems are handled appropriately | Requirements README |

## 4. F1 – Product Listing and Validation (with F1a)

| Req | i* SD dependency | i* SR element | Strategic BPMN (Sprint 2) | Operational BPMN | Implementation | Status |
|---|---|---|---|---|---|---|
| **R1** Submit product | Food Producer → Marketplace platform: *Valid product listing* (goal). Marketplace platform → Food Producer: *Complete product information* (resource). Food Producer → Marketplace platform: *simple listing process* (quality) | Registered Producer: task *Submit and correct product details*. Marketplace Platform: resource *Producer product and stock details* | **Manage Product Listings** (`Activity_1cldul4`): start *Product Details Received*; message *Product Listing Submission* from Food Producers | F1: start *Producer wants to list a new product*; user task *Submit product details* `UT_Submit` (form `product-submission`); service task *Save draft listing* `ST_SaveDraft` | Form `product-submission`; job type `save-draft-listing` | Traced |
| **R2** Validate | Food Producer → Marketplace platform: *Valid product listing* (goal) | Marketplace Platform: task *Validate details and applicable certification* | *Validate Product Information* (`Activity_1qkax36`); *Product Information Valid?* (`Gateway_0nkjwdp`) | F1: service task *Validate product details* `ST_Validate`; gateway *Details valid* `GW_Valid` (No is the default flow) | Job type `validate-product` | Config (G5) |
| **R3** Correct | Food Producer → Marketplace platform: *Validation feedback* (resource) | Registered Producer: task *Submit and correct product details* | *Request Product Information Correction* (`Activity_1y56vr7`); *Receive Corrected Product Information* (`Activity_15okjg2`); message *Listing Confirmation / Validation Feedback* | F1: user task *Correct product details* `UT_Correct` (form `product-correction`), which loops back to *Save draft listing*; non-interrupting timer *3 days without correction* `BE_Remind` → send task *Send correction reminder* → end *Reminder set* | `validationErrors`, `validationSummary` shown in the correction form | Config (G6) |
| **R4** Organic check | Marketplace platform → Organic certification verification service: *Organic certification checked* (goal), *Certification verification result* (resource). Marketplace platform → Food Producer: *Organic certification details* (resource). Customer → Marketplace platform: *Trustworthy organic claims* (quality) | Marketplace Platform: resource *Certification result*. Certification Verification Service: task *Check evidence and return result*, goal *Certification outcome supplied*, quality *Accurate verification*. SR dependums *Certification request*, *Certification outcome* | *Check Organic Certification Requirements* (`Activity_0asvpvn`); *Organic Certification Required?* (`Gateway_0nzbtf7`); *Request Organic Certification Verification* (`Activity_1uwe5sa`); *Certification Valid?* (`Gateway_073o5sz`); black-box pool *Organic Certification Verification Service* | F1: gateway *organic claimed* `GW_Organic`; call activity *Verify organic certification* `CA_Verify` → F1a: start *Cerificate check requested*; service task *Request certificate verification* `ST_Request`, message flows to black-box pool *Certification Body Service (simulated)*; *Record verification outcome*; end *verification complete*. Back in F1: gateway *certificate verified* `GW_Cert` (No → *Correct product details*) | Job types `verify-certificate`, `record-verification-audit` | Config (G1, G2, G4, G5) |
| **R5** Service unavailable | Marketplace platform → Marketplace Admin: *Manual verification review* (task). Marketplace platform → Organic certification verification service: *Timely verification response* (quality) | Marketplace Admin: task *Review listing compliance*, quality *Manageable review effort* | Not shown at strategic level (*Review Failed Certification* covers a failed result, not an outage) | F1a: error boundary event *Service Unavailable* `BE_CertDown` on *Request certificate verification* → user task *Review certificate manually* `UT_Manual` (Marketplace Admin lane, form `manual-cert-review`) → *Record verification outcome* | Error code `CERT_SERVICE_UNAVAILABLE`; form `manual-cert-review` | Traced |
| **R6** Archive abandoned listing | Marketplace Admin → Marketplace platform: *Compliant products published* (goal) | Marketplace Admin: goal *Listing standards maintained* | *Reject Product Listing* (`Activity_1cuumwx`); end *Listing Rejected* | F1: interrupting timer *7 days without correction* `BE_Archive` on *Correct product details* → *Archive draft listing* → *Notify producer listing archieved* → end *Listing Archived* | Job type `archieve-listing` | Config (G6, G7) |
| **R7** Publish | Customer → Marketplace platform: *Accurate product information displayed*, *Accurate product availability* (goals). Marketplace Admin → Marketplace platform: *Compliant products published* (goal) | Marketplace Platform: task *Publish valid listings*, goal *Valid product listings published*. Registered Producer: goal *Valid products published* | *Publish Product Listing* (`Activity_1laooec`); end *Product Listing Published*; then **Manage Inventory and Seasonal Availability** | F1: business rule task *Determine initial availability* `BR_Availability` (DMN `availability-status`); service task *Publish product listing* `ST_Publish`; send task *Notify producer product live* `SND_Live`; end *Product Published* | DMN `availability-status`; job types `publish-product`, `notify-producer` | Traced |
| **R8** Feedback | Food Producer → Marketplace platform: *Validation feedback* (resource) | Registered Producer: goal *Valid products published* | Message *Listing Confirmation / Validation Feedback* | F1: send tasks *Notify producer product live*, *Send correction reminder* and *Notify producer listing archieved*, with message flows to black-box pool *Notification service (Simulated email)*; correction form shows `validationSummary` | Job type `notify-producer` | Traced |

## 5. F2 – Inventory and Seasonal Availability (with F2a)

| Req | i* SD dependency | i* SR element | Strategic BPMN (Sprint 2) | Operational BPMN | Implementation | Status |
|---|---|---|---|---|---|---|
| **R9** Producer update | Marketplace platform → Food Producer: *Updated stock and seasonal information* (resource). Food Producer → Marketplace platform: *Accurate stock and availability* (goal) | Registered Producer: task *Update quantity and seasons*, quality *Easy stock updates*. Marketplace Platform: task *Apply stock and seasonal updates* | **Manage Inventory and Seasonal Availability** (`Activity_1wg7dn8`): message *Inventory Update Request* (`Flow_1o4hku8`); start *Inventory Update Requested*; *Update Product Stock Information* (`Activity_1eyqht7`) | F2: start *T1 Producer wants to update stock or season* `Start_T1`; *Load product listing*; gateway *what triggered update*; user task *Update stock and season* `UT_Update` (Producer lane, form `stock-season-update`); gateway *update valid* `GW_UpdateValid` (No loops back to the form) | Form `stock-season-update`; job type `load-product` | Config (G2, G3) |
| **R10** Order stock change | No dependency yet | Marketplace Platform: task *Apply stock and seasonal updates* | **Coordinate Multi-Vendor Orders**: *Allocate Orders to Producers* (`Activity_16wt9bj`). The relationship to inventory is described in section 9 | F2: message start *T2 Stock reduced by an order* `Start_T2` (message `stock-reduced`) from black-box pool *Order and checkout process*; gateway *what triggered update*; script task *Calculate new stock level* `SCR_Calc` | Message `stock-reduced`; script result `quantity` | Config (G2, G3); Gap in i* (G9) |
| **R11** Zero stock closes | Customer → Marketplace platform: *Accurate product availability* (goal) | Marketplace Platform: task *Evaluate and set availability*, goal *Product availability current* | *Check Seasonal Availability and Stock Level* (`Activity_02qoa9e`); *Product Available for Purchase?* (`Gateway_0tsmgt0`); *Mark Product as Unavailable* (`Activity_0gjocu6`) | F2: call activity *Evaluate product availability* → F2a: business rule task *Decide availability status* (DMN rule 4, `OUT_OF_STOCK`); *Stock Value Valid?*; *Save stock and season dates*; gateway *Status changed?* `GW_Changed`; service task *Open or close to new orders* `ST_Toggle`; send task *Notify producer of new status* `SND_Status`; end *Availability updated* | DMN rule 4; job types `save-stock-season`, `set-order-availability`, `notify-producer` | Config (G1) |
| **R12** Restock in season | Food Producer → Marketplace platform: *Accurate stock and availability* (goal) | Marketplace Platform: goal *Product availability current* | *Mark Product as Available* (`Activity_1x02f8v`) | F2a: DMN rule 5 (`AVAILABLE`), with rule 3 (`OUT_OF_SEASON`) checked first so a restock after the season stays closed; *Status changed?* `GW_Changed`; *Open or close to new orders* `ST_Toggle`; *Notify producer of new status* `SND_Status` | DMN rules 3 and 5 | Config (G1) |
| **R13** Daily season check | No dependency yet | Marketplace Platform: task *Evaluate and set availability* | Not shown | F2: timer start *T3 everyday at 00:05* `Start_T3`; *Find season changes due today*; gateway *Any product update* (No is the default, to *Nothing to update*); multi-instance sub-process *Re-evaluate each product*, calling *Evaluate product availability* for each product; end *Daily check complete* | DMN rules 2 and 3; job type `find-season-changes` | Config (G2, G6); Gap in i* (G9) |
| **R14** DMN decision | Customer → Marketplace platform: *Accurate product availability* (goal) | Marketplace Platform: task *Evaluate and set availability* | Gateway *Product Available for Purchase?* | Decision `availability-status` (hit policy FIRST, 5 rules), used by F1 *Determine initial availability* `BR_Availability` and F2a *Decide availability status* | Result variable `availability` (`status`, `ordersOpen`) | Traced |
| **R15** Invalid input and discrepancies | No dependency yet | Marketplace Admin: task *Review listing compliance* | Not shown | F2: *update valid* No loop. F2a: *Stock Value Valid?* (rule 1 `REJECTED`) → error end *Invalid stock value* (`INVALID_STOCK`). F2: error boundary *Stock below zero* → user task *Reconcile stock discrepancy* (Marketplace Admin lane, form `stock-reconciliation`), then re-evaluated; in the daily check, error boundary *Bad stock record* → *Flag product for admin review* → end *Product flagged* | DMN rule 1; error `INVALID_STOCK`; form `stock-reconciliation`; job type `flag-product-review` | Traced |

## 6. Non-functional requirements and i* qualities

| Req | i* quality | Where it's realised | Status |
|---|---|---|---|
| N1 Easy for producers | SD: *simple listing process* (Food Producer → Marketplace platform). SR: *Easy stock updates* qualifies *Update quantity and seasons* | All validation errors returned at once (`validationErrors`); the correction form loops back without restarting; a reminder after 3 days; a short stock form for F2 | Traced |
| N2 Accurate and trustworthy | SD: *Trustworthy organic claims*, *Accurate product information displayed*, *Accurate product availability*. SR: *Trustworthy listings*, *Accurate verification* | Validation in F1; certificate check in F1a; outcome recorded by *Record verification outcome*; availability re-decided on every stock or season change | Traced |
| N3 Service problems handled | SD: *Timely verification response* | F1a's *Service Unavailable* error boundary sends the check to *Review certificate manually*, so an outage doesn't stop the listing | Traced |
| Trade-off | SR: *Validate details and applicable certification* **helps** *Trustworthy listings* but **hurts** *Prompt publication* | Accepted on purpose: checks are kept, and delay is reduced by returning all errors together and by the manual review fallback, so an outage doesn't block publication | Traced |

### Every SD dependency lands somewhere

| SD dependency (type) | Realised by |
|---|---|
| Complete product information (resource) | R1 |
| Valid product listing (goal) | R1, R2 |
| simple listing process (quality) | R1, N1 |
| Validation feedback (resource) | R3, R8 |
| Organic certification details (resource) | R4 |
| Organic certification checked (goal) | R4 |
| Certification verification result (resource) | R4 |
| Trustworthy organic claims (quality) | R4, N2 |
| Timely verification response (quality) | R5, N3 |
| Manual verification review (task) | R5: *Review certificate manually* in F1a |
| Compliant products published (goal) | R6, R7 |
| Accurate product information displayed (goal) | R7, N2 |
| Accurate product availability (goal) | R11, R12, R14 |
| Updated stock and seasonal information (resource) | R9 |
| Accurate stock and availability (goal) | R9, R12 |

### SR elements not yet realised

| SR element | Reason |
|---|---|
| Customer: task *Review available products and details* | Customer browsing is outside Use Case 1 (Use Case 2 storefront) |
| Marketplace Admin: resource *Published listing records* (SR dependum *Listing records*) | No listing store yet; product data lives in process variables |

## 7. Gaps and inconsistencies to fix

| # | Where | Issue | Fix |
|---|---|---|---|
| G1 | F1, F1a, F2a | The call activities call `verify-organic-certification` and `evaluate-product-availability`, but F1a's process ID is `Process_0m14bmy` and F2a's is `Process_0ez0v2i`, so neither can be found. F1's process is `Process_1sltvgi`, named "New BPMN diagram" | Set F1a's process ID to `verify-organic-certification` and F2a's to `evaluate-product-availability`; give F1 a proper process ID and name |
| G2 | F1, F2 | Some FEEL expressions start with `==` (F1 *organic claimed* Yes; F2 both *what triggered update* branches, *update valid* Yes, *Any product update* Yes, the *Calculate new stock level* script and the multi-instance input collection). Web Modeler adds the first `=` itself, so these are invalid | Remove the extra `=` |
| G3 | F2 | Both *what triggered update* branches test `trigger = "ORDER"`, and nothing sets `trigger` | Keep `= trigger = "ORDER"` on the order branch, make the producer branch the default, and set `trigger` on *T2 Stock reduced by an order* with an output mapping |
| G4 | F1 | *certificate verified* Yes tests `organicClaimed = true`. *Verify organic certification* has *propagate all child variables* off and no output mappings, so F1a's result never reaches F1 | Condition `= certVerified = true`; add output mappings for `certVerified` and `certReason` on the call activity |
| G5 | All operational models | The service tasks have job types but no job workers, so in Camunda the processes wait at the first service task | Build or simulate a worker for each job type; the validation and certificate workers must return the variables the gateways test (`isValid`, `certVerified`, `certReason`) |
| G6 | F1, F2 timers | Reminder and archive timers use test values `PT1M` and `PT2M`. The daily cycle `R/P1D` has no start time, so it doesn't run at 00:05 | Use `P3D` and `P7D` for submission; daily cycle `R/2026-11-18T00:05:00Z/P1D` |
| G7 | F1, F1a | Typos: job type `archieve-listing`, *Notify producer listing archieved*, *Cerificate check requested*, pool *BRF MARKETPLACE* | Correct the spelling |
| G8 | All operational models | Element IDs are Camunda's generated IDs, not the codes used in this document | Set each element's ID to its code (section 8) |
| G9 | i* | The order stock change (R10) and the daily season check (R13) have no SD dependency or SR element | Add a *Stock change from orders* dependency (Order process → Marketplace platform) and a platform task for the daily check |
| G10 | All models | The producer is named *Food Producer* (SD), *Registered Producer* (SR), *Food Producers* (strategic) and *Producer* (F2 lane) | Agree one name, or state the mapping in each model's README |

## 8. Element index

Codes used in this document, the element they refer to, and its current ID in the `.bpmn` file. Once G8 is done, the code and the ID will be the same.

| Code | Model | Element | Type | Current ID |
|---|---|---|---|---|
| `UT_Submit` | F1 | Submit product details | User task | `Activity_1xdcg91` |
| `ST_SaveDraft` | F1 | Save draft listing | Service task | `Activity_1l6ky9a` |
| `ST_Validate` | F1 | Validate product details | Service task | `Activity_0yhdxwm` |
| `GW_Valid` | F1 | Details valid | Exclusive gateway | `Gateway_1cl6vtd` |
| `UT_Correct` | F1 | Correct product details | User task | `Activity_11kps77` |
| `BE_Remind` | F1 | 3 days without correction | Timer boundary (non-interrupting) | `Event_19rhqoz` |
| `BE_Archive` | F1 | 7 days without correction | Timer boundary (interrupting) | `Event_1x5wg90` |
| `GW_Organic` | F1 | organic claimed | Exclusive gateway | `Gateway_0l4m87i` |
| `CA_Verify` | F1 | Verify organic certification | Call activity | `Activity_18qrftv` |
| `GW_Cert` | F1 | certificate verified | Exclusive gateway | `Gateway_0cfjbfd` |
| `BR_Availability` | F1 | Determine initial availability | Business rule task | `Activity_0g7rtsa` |
| `ST_Publish` | F1 | Publish product listing | Service task | `Activity_176vrjt` |
| `SND_Live` | F1 | Notify producer product live | Send task | `Activity_1esilwy` |
| `ST_Request` | F1a | Request certificate verification | Service task | `Activity_01mdby5` |
| `BE_CertDown` | F1a | Service Unavailable | Error boundary | `Event_0x1atzi` |
| `UT_Manual` | F1a | Review certificate manually | User task | `Activity_09xhkux` |
| `Start_T1` | F2 | T1 Producer wants to update stock or season | Start event | `StartEvent_1` |
| `UT_Update` | F2 | Update stock and season | User task | `Activity_0geaw7l` |
| `GW_UpdateValid` | F2 | update valid | Exclusive gateway | `Gateway_19qq81g` |
| `Start_T2` | F2 | T2 Stock reduced by an order | Message start event | `Event_1gehfkw` |
| `SCR_Calc` | F2 | Calculate new stock level | Script task | `Activity_1vc5kvd` |
| `Start_T3` | F2 | T3 everyday at 00:05 | Timer start event | `Event_1n74rpe` |
| `GW_Changed` | F2a | Status changed? | Exclusive gateway | `Gateway_14esawy` |
| `ST_Toggle` | F2a | Open or close to new orders | Service task | `Activity_18pl0nc` |
| `SND_Status` | F2a | Notify producer of new status | Send task | `Activity_1rdd8bg` |

## 9. Cross-process relationship: customer orders and stock

The strategic BPMN documentation for **Allocate Orders to Producers** and **Update Product Stock Information** identifies the business dependency: confirmed sales can reduce stock, and cancellations can restore it. The independent producer inventory-update trigger lets stock be updated without creating a new product listing.

In F2 this is the message start event *T2 Stock reduced by an order*, fed by the black-box pool *Order and checkout process*. The ordering process is outside Use Case 1, so the message can be tested with a sample message rather than a real order.

## 10. Repository references (checked 17 November 2026)

### Background and requirements
- [Actor analysis](../actor-analysis.md)
- [Stakeholder analysis](../stakeholder-analysis/README.md)
- [Proposed functionalities](PROPOSED-FUNCTIONALITIES.md)

### i* models
- [Strategic Dependency (SD), editable piStar model](../../models/istar/brfn-strategic-dependency.txt)
- [Strategic Dependency image](../../models/istar/brfn-strategic-dependency.png)
- [Strategic Rationale (SR), editable piStar model](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Core.txt)
- [Strategic Rationale image](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Core.png)

### BPMN, DMN and forms
- [Strategic BPMN – original Sprint 1](../../bpmn/strategic/BRFN-Strategic-BPMN-Sprint1.bpmn)
- [Strategic BPMN – refined Sprint 2](../../bpmn/strategic/BRFN-Strategic-BPMN-Sprint2-2.bpmn)
- [Strategic BPMN change documentation](../../bpmn/strategic/README.md)
- [Operational models F1, F1a, F2, F2a](../../bpmn/operational/README.md)
- [Availability decision (DMN)](../../camunda/dmn/availability-status.dmn)
- [Camunda forms](../../camunda/forms)

## 11. Use of generative AI

This document was drafted with AI assistance (Claude) by reading the group's model files, then reviewed by the group. The models it traces were built by the group.
