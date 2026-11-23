# Sprint 3 execution evidence — F2 and F2a

**Project:** Bristol Regional Food Network (BRFN)  
**Scope:** F2 Inventory and Seasonal Availability; F2a Evaluate Product Availability  
**Environment used for live tests:** Camunda 8, UWE Frenchay 2026 development cluster  
**Evidence status:** Live instance outcomes were inspected in Camunda during testing on 22 November 2026. **Runtime screenshots still need to be captured and committed**; this document is not a substitute for screenshots.

## What was made executable

The [F2 operational BPMN](../bpmn/operational/F2-Inventory-Seasonal-Availability.bpmn) was deployed as an executable Camunda process. Its entry paths distinguish producer stock/season updates (T1), order-driven stock reduction (T2), and a scheduled daily seasonal check (T3). Service tasks use job types processed by a Node.js Camunda worker application. Gateways, process variables, call activities and a multi-instance reevaluation loop control execution.

The [F2a operational BPMN](../bpmn/operational/F2a-Evaluate-Product-Availability.bpmn) was deployed as a callable executable process. F2 invokes it when a product's availability must be reevaluated; it uses the [availability-status DMN decision](../camunda/dmn/availability-status.dmn), persists stock/season changes in a **demonstration in-memory product store**, updates whether new orders are open, and sends a **simulated** producer notification.

The Camunda workers used for the tested paths include:

| Worker job type | Purpose |
| --- | --- |
| `load-product` | Load current demonstration product data for T1/T2 |
| `find-season-changes` | Compare stored availability to expected seasonal availability for T3 |
| `save-stock-season` | Save a product's quantity and seasonal details in the demonstration store |
| `set-order-availability` | Open/close orders according to the evaluated status |
| `notify-producer` | Log a simulated producer status notification |

**Important:** The latest local implementations of some workers were developed and tested on a Mac and may not yet be pushed to this GitHub branch. The live verification described below does **not** establish that a fresh checkout of this branch already reproduces every test. The code and deployment resources must be synchronized before final submission.

## Decision logic and data flow

1. F2 receives or loads product variables such as `productId`, quantity, current availability and seasonal dates.
2. F2 calls F2a with the product variables needed for availability evaluation. T3 uses a collection of products requiring reevaluation.
3. F2a calls the `availability-status` DMN to classify an item according to quantity and season dates. The implemented rules distinguish **REJECTED** (negative quantity), **NOT_YET_IN_SEASON**, **OUT_OF_SEASON**, **OUT_OF_STOCK**, and **AVAILABLE**.
4. F2a saves the relevant stock/season values; when the availability status changes, the corresponding service tasks update order availability and issue a simulated producer notification.
5. F2 continues or completes when F2a returns. The no-change T3 path can end without invoking F2a.

## Live scenarios observed

| Test | Observed outcome | Evidence |
| --- | --- | --- |
| **T1 — Producer updates stock or season** | Core stock-update and F2/F2a availability path completed in earlier Camunda testing | Screenshot not yet committed |
| **T2 — Stock reduced by an order** | Completed with `quantitySold=5` and resulting demonstration quantity `20` | Camunda instance `2251799868340502`; screenshot pending |
| **T3 — Scheduled seasonal check, nothing changed** | **Completed** via the “Nothing to update” route; `productsToCheck=[]`, `seasonalCheckCount=0` | F2 instance `2251799868448958` (version 4); screenshot pending |
| **T3 — Seasonal status change** | **Completed**; found one product requiring reevaluation and called F2a | F2 instance `2251799868462360` (version 7); screenshot pending |
| **F2a invoked by T3** | **Completed**; product `BRFN-DEMO-001` moved from `OUT_OF_SEASON` to `AVAILABLE`; `ordersOpen=true`, `orderAvailabilityUpdated=true` | F2a instance `2251799868462396` (version 1); screenshot pending |

The T3 scenario used the demonstration product **BRFN-DEMO-001 — Locally Grown Carrots**, quantity `25`, and a controlled out-of-season stored status to test whether seasonal reevaluation detected a change. After testing, the demonstration store's initial status was restored to `AVAILABLE` and the worker was restarted.

During tests the seasonal timer was temporarily shortened to speed up verification. It was subsequently restored in Camunda Web Modeler to the configured daily expression `R/2026-11-23T00:05:00Z/P1D`. This specifies 00:05 UTC daily; future recurring execution after restoration has **not** been independently verified.

## Automated tests and limitations

The Node.js service suite passed **31/31 tests** following the F2/F2a implementation. A later suite of **33/33 tests** also included new F1a audit-worker tests. These are *unit tests* and should be presented separately from the live Camunda execution evidence above.

**Known limitations / unfinished checks:**
- The demonstration product store is **in memory**, not durable across worker restarts.
- Producer notifications are **simulated**, not delivered email.
- Negative-stock reconciliation and every exception branch have **not** been verified end to end.
- The scheduler's subsequent daily occurrence following the final restoration remains to be observed.
- Fresh-clone reproducibility requires the final BPMN/DMN and local worker changes to be pushed, dependency setup documented, and configuration provided via safe environment-variable examples (never commit credentials).

## Screenshot evidence to add

The current repository contains static BPMN images, but they are **diagram illustrations**, not proof of completed executions:

- [F2 BPMN image](../bpmn/operational/F2-Inventory-Seasonal-Availability.png)
- [F2a BPMN image](../bpmn/operational/F2a-Evaluate-Product-Availability.png)

Capture the following **genuine Camunda Test/Operate screenshots** and place them in `docs/evidence/` (create the folder when uploading):

1. `f2-t2-completed.png` — completed instance `2251799868340502`, with reduction variables.
2. `f2-t3-no-change-completed.png` — instance `2251799868448958`, no-change completion.
3. `f2-t3-seasonal-change-completed.png` — instance `2251799868462360`, completed multi-instance branch.
4. `f2a-t3-called-completed.png` — instance `2251799868462396`, final availability variables and completed status.
5. `f2-t1-completed.png` — a verified T1 completed instance, preferably including relevant input/output variables.

Before capturing, remove or mask authentication details, tokens, email addresses or any unrelated personal information. Capture the process name, completion status, relevant path, process instance ID, and non-sensitive variables where possible. Do not edit the workflow status or invent evidence.

## Live demonstration sequence

1. **Before class:** Deploy the final F2, F2a and DMN resources once; start the required Node.js workers and verify connection to the UWE development cluster.
2. **Demonstrate F2 T1 or T2:** Start the process with prepared non-sensitive inputs; show F2 calling F2a and the availability decision.
3. **Show F2a result:** Display calculated status, order availability and simulated notification, then completed history in Camunda.
4. **Show T3 evidence:** Display the previously completed no-change and changed-season instances; explain the daily timer, product collection and multi-instance call.
5. **Explain architecture:** BPMN orchestrates, DMN decides, worker services perform business actions, and process variables connect the steps.
6. **Explain limitations:** Demo in-memory storage and simulated notifications, with persistent storage and production notifications as integration opportunities for Task 2.

## Assessment relevance

Sprint 3 evaluates end-to-end process automation, Camunda Forms and implementation, service/interface/process integration, model consistency and readiness for Task 2, legal/ethical/social/professional considerations, and the in-class demonstration. This document supports the technical implementation and integration evidence, but is not a substitute for completed user-task/Form demonstrations, exception-path checks, model traceability, or individual comprehension.

**Next documentation action:** Upload the authentic screenshots and synchronize the latest worker code and BPMN/DMN exports with the repository. Only then mark the evidence set as complete.
