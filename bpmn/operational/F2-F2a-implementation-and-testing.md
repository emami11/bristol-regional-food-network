# Sprint 3 – F2 and F2a Implementation and Testing

## Making F2 and F2a Executable

For Sprint 3, we focused on getting our F2 (Inventory and Seasonal Availability) and F2a (Evaluate Product Availability) BPMN diagrams working in Camunda, rather than just having the processes represented as diagrams.

We started by making F2 an executable process in Camunda. This process handles three main scenarios:

- **T1:** A producer updates the stock quantity or seasonal dates of a product.
- **T2:** A product's stock decreases after an order is placed.
- **T3:** A daily scheduled check identifies products whose availability may need updating because of seasonal changes.

To make these scenarios work, we connected the service tasks in our BPMN diagrams to JavaScript workers running through Node.js. These workers carry out the automated activities, such as loading product information, checking seasonal changes, updating stock records, and notifying producers.

We also configured the process variables, gateways, and call activities so that Camunda could pass information between the different stages and decide which path to follow.

For T3, we implemented a scheduled check that can identify multiple products requiring an availability update. Each product is then passed through the F2a subprocess for reevaluation.

F2a was also deployed as an executable process. Instead of repeating the same availability checks in F2, we used a call activity to connect F2 to F2a whenever a product needed to be evaluated.

F2a uses our `availability-status` DMN decision table to determine whether a product should be available for new orders. It also connects to the JavaScript workers responsible for saving stock information, updating order availability, and sending notifications.

At the moment, we use a simple in-memory product store for testing. This allows us to demonstrate how stock information is updated without needing a full database. Producer notifications are also simulated rather than sent as actual emails.

### JavaScript Workers Used

The main workers we used for F2 and F2a are:

| Worker | What it does |
|---|---|
| `load-product` | Retrieves the product information needed for stock updates and order reductions. |
| `find-season-changes` | Checks whether any products need their availability updated because of seasonal changes. |
| `save-stock-season` | Saves changes made to a product's stock quantity and seasonal information. |
| `set-order-availability` | Updates whether a product can accept new orders based on its availability status. |
| `notify-producer` | Simulates notifying the producer when their product's availability changes. |

We developed and tested these workers locally on a Mac using Node.js. Some of the latest changes may still need to be pushed to GitHub, so we will need to ensure that the repository contains the final working versions before submission.

## How the Processes Work Together

One of the main things we wanted to achieve was making sure F2 and F2a could communicate properly.

When F2 receives a stock update or identifies a product that needs checking, it passes the relevant information to F2a. This includes details such as the product ID, quantity, current availability status, and seasonal dates.

F2a then uses the `availability-status` DMN table to decide the product's availability.

The decision table can return five possible results:

- **REJECTED:** The stock quantity is negative.
- **NOT_YET_IN_SEASON:** The product's season has not started.
- **OUT_OF_SEASON:** The product's season has ended.
- **OUT_OF_STOCK:** The product is in season but has no stock remaining.
- **AVAILABLE:** The product is in season and has stock available.

Once the decision has been made, F2a saves the relevant stock and seasonal information. If the product's availability has changed, the process updates whether new orders can be placed and runs the producer notification task.

After F2a finishes, F2 can continue and complete its own process.

For the daily seasonal check, we also included a separate path for situations where no products need updating. This means the process can finish without unnecessarily calling F2a.

## Testing F2 and F2a in Camunda

After implementing the workers and connecting the processes, we carried out several tests in Camunda to check whether the different scenarios worked as expected.

We tested stock updates, order-related stock reductions, and seasonal availability changes. We also checked whether F2 could successfully start F2a and receive the results.

The following tests were completed during our implementation work.

| Test | What we tested | Result |
|---|---|---|
| T1 – Producer stock update | A producer updates a product's stock quantity or seasonal information. | The main update and availability evaluation path completed successfully. |
| T2 – Order stock reduction | An order reduces a product's stock quantity by 5. | Completed successfully, with the demonstration quantity updated to 20. |
| T3 – No seasonal changes | The daily check runs when no products require an update. | Completed successfully through the "Nothing to update" path. |
| T3 – Seasonal availability change | The daily check identifies a product whose availability needs updating. | Completed successfully and called F2a to reevaluate the product. |
| F2a – Availability reevaluation | F2a evaluates the product and updates its availability. | Completed successfully, changing the product from OUT_OF_SEASON to AVAILABLE. |

### Test Evidence

We recorded the Camunda process instance IDs for the completed tests:

| Test | Camunda Process Instance ID |
|---|---|
| T2 – Order stock reduction | `2251799868340502` |
| T3 – No seasonal changes | `2251799868448958` |
| T3 – Seasonal availability change | `2251799868462360` |
| F2a – Availability reevaluation | `2251799868462396` |

These instance IDs can be used to identify the test executions in Camunda. We also plan to add screenshots showing the completed process instances, execution paths, and relevant variables as evidence in GitHub.

### Testing the Seasonal Availability Check

For our T3 test, we used a demonstration product called **Locally Grown Carrots**, with the product ID `BRFN-DEMO-001`.

The product had a stock quantity of 25. To test whether the seasonal check could detect a change, we temporarily set its stored availability status to `OUT_OF_SEASON`, even though the product's seasonal dates indicated that it should be available.

When the scheduled check ran, the `find-season-changes` worker identified that the stored availability needed updating.

F2 then called F2a, which evaluated the product using the DMN decision table. The result was `AVAILABLE`, and the process updated the product so that new orders could be accepted.

Both F2 and F2a completed successfully during this test.

Afterward, we restored the demonstration product's initial status to `AVAILABLE` and restarted the worker application.

We also temporarily shortened the T3 timer so that we could test the scheduled process without waiting until the following day.

Once testing was completed, we changed the timer back to its daily schedule:

`R/2026-11-23T00:05:00Z/P1D`

This is configured to run at 00:05 UTC each day. Although the scheduled process was successfully tested, we have not yet independently confirmed a later daily execution after restoring the timer.

## Automated Testing

Alongside testing the processes directly in Camunda, we used Node.js automated tests to check the JavaScript workers and their business logic.

These tests helped us confirm that the workers handled valid inputs correctly and responded appropriately to invalid or unexpected information.

After completing the F2 and F2a implementation, we ran **31 automated tests**, and all 31 passed.

We later added tests for the F1a certificate audit worker, bringing the total to **33 tests**, which also passed without any failures.

These automated tests are separate from our live Camunda tests. The automated tests check the JavaScript logic, while the Camunda tests show whether the different components can work together as part of an executable business process.

## Current Limitations and Further Improvements

Although the main F2 and F2a process paths are now working, there are still some areas we need to consider before the final demonstration and submission.

Our current product store is held in memory, meaning the stored information is not permanently saved when the worker application restarts. For this stage of the project, it allows us to test the functionality, but a persistent database would be more suitable when developing the full enterprise application in Task 2.

The producer notification service is also simulated. It demonstrates that the process reaches the notification stage, but it does not currently send real emails.

We have successfully tested the main stock-update and seasonal-availability paths. However, we still need to verify some exception scenarios, including the complete handling of negative stock discrepancies.

We also need to confirm that the restored daily timer continues running as expected and that all the latest BPMN, DMN, and JavaScript files are included in GitHub.

Finally, we will add screenshots from Camunda showing our completed tests and process variables. This will provide clearer evidence of the work completed during Sprint 3 and help us demonstrate how F2 and F2a interact.

## Summary

Overall, we have moved F2 and F2a from BPMN diagrams into executable Camunda processes.

We implemented JavaScript workers to carry out the automated activities, connected both processes using call activities, and used a DMN decision table to evaluate product availability.

Our tests showed that the main stock-update, order-reduction, and seasonal-check scenarios could run successfully. We also confirmed that F2 could call F2a and complete the availability update.

The next steps are to finish checking the remaining exception scenarios, make sure the final files and screenshots are saved in GitHub, and prepare the processes for the live Sprint 3 demonstration.
