# Runnable F1 and F2

**Contributor:** Ayobamidele Esho (Ayo)

These operational models implement the group's product-listing and inventory rules. The whole-enterprise strategic BPMN remains the overview.

| File | Purpose |
|---|---|
| [BRFN-F1-Executable.bpmn](BRFN-F1-Executable.bpmn) | Submit, validate, check organic claims, correct or withdraw, and publish a listing |
| [BRFN-F2-Executable.bpmn](BRFN-F2-Executable.bpmn) | Receive stock messages and producer updates, check seasons, and update availability |
| [product-availability.dmn](product-availability.dmn) | Shared availability decision used by both processes |
| Four `.form` files | Product, correction, admin review and stock-update forms |

## Open and run

1. Open either `.bpmn` file in Camunda Modeler to edit it. Deploy both models, the DMN and all four forms together; `npm run demo` does this automatically on the local engine.
2. Start [Camunda 8 Run](https://docs.camunda.io/docs/self-managed/quickstart/developer-quickstart/c8run/install-start/). This demo was tested with **8.10.9**, HTTP port **8095**, gRPC port **26500**, and local credentials **demo / demo**.
3. In the repository's `services` folder, run `npm ci`, then `npm run demo`. This starts the workers, simulated certification service and token viewer.
4. Open [the viewer](http://127.0.0.1:8790/). Click **Animate tokens**, then the start-event play arrow to explore paths. Gateway choices in this mode are manual; the real engine evaluates the rules.
5. Click **Start real listing**, then complete **Submit product details** in [Tasklist](http://localhost:8095/tasklist). Claim the task if Tasklist asks. The supplied sample data can be submitted unchanged.
6. After publication, click **Refresh products** and select your product. **Request stock form** creates an F2 task in Tasklist. Set stock to `0`, then restock it, to demonstrate availability changes. **Simulate order** sends a real stock-change message.

**Watch F2 live** shows active engine steps with green outlines. Use [Operate](http://localhost:8095/operate) for the full execution history. F2 normally waits at its event gateway: it continues when an update, daily timer or stop message arrives.

F1 starts one F2 monitor when a product is published. Certification outages route to admin review. Uncorrected listings archive after seven days; integration tests shorten this timer. Daily season checks use the next midnight UTC, preserving that deadline when other updates arrive.

## What is connected

Camunda executes the gateways, forms, DMN, messages, timers and Node.js workers. Product records and duplicate-order IDs persist in `services/data/catalogue.json`. Certification uses the group's mock service; producer notifications are recorded locally rather than emailed.

The local runner uses one Node process and a JSON store. It is a coursework demonstration. Cloud deployment needs the university cluster connection and worker configuration; opening a file in Web Modeler alone does not start the workers.

See [test results](../../../docs/testing/ayo-executable-bpmn-results.md) and [service setup](../../../services/README.md).
