# F1/F2 execution checks

Checked on **14 November 2026**, using local **Camunda 8 Run 8.10.9**, the Node.js workers, simulated certification service, deployed BPMN/DMN and native Camunda user tasks.

- `npm test`: **26 passed, 0 failed**.
- `npm run test:engine`: **17 real-engine scenarios passed**.
- `npm run test:tokens`: **4 token-engine checks passed**, using the same simulation library as the viewer: F1 publication, withdrawal and archive, plus F2's order, producer, timer and stop subscriptions. These exercise token routing without a browser; they do not evaluate FEEL rules or verify visual rendering.
- Both process definitions deployed successfully; no active incidents were found at the end of the scenario run.
- Modelling review on **15 November 2026**: added explicit exclusive merges in F1/F2, separating joins from decision gateways. `bpmnlint 12.1.1` with `bpmnlint:recommended` reports **0 errors and 0 warnings** for both saved models. The five F1 messages shown in Camunda and three corresponding F2 findings are resolved in these files.
- After the merge changes, both models deployed successfully again; all **17 real-engine scenarios** and **4 token-engine checks** passed again on 15 November.
- Integration into `main` on **16 November 2026**: reran all **26 unit tests**, **4 token-engine checks**, the viewer build and recommended BPMN lint (**0 errors, 0 warnings**). The real-engine scenario evidence above is from the 15 November run.
- `npm run build:simulation`: token-viewer bundle built successfully. Visual browser verification was blocked by browser attachment/desktop-access timeouts; animated display and Tasklist form layout still need a visual check.

| Area | Executed checks |
|---|---|
| Listing | Valid non-organic publication; invalid details corrected before publication |
| Certification | Valid service answer; revoked certificate corrected by removing the organic claim; outage caught and approved manually |
| Exceptions | Producer withdrawal; real boundary timer archives an abandoned correction |
| Stock | Zero stock closes ordering; in-season restocking reopens it; invalid producer updates loop back without changing stored stock; an unchanged stock form preserves the latest quantity after orders |
| Seasons | Past and future seasons remain unavailable; a real timer refreshes availability |
| Messages | Publication starts F2; stock messages clamp overselling and ignore repeated order IDs; stop message completes F2 |

Timers were shortened only for integration tests (`correctionTimeout: PT2S`, `seasonCheckDelayMs: 1200`). Normal defaults are seven days and the next midnight UTC. Unit tests also cover persistence of duplicate-order IDs after a store restart and immediate closure of ordering before DMN completion.

These results cover the local execution paths listed above. They do not establish a university SaaS deployment or production operation. Certification is simulated and notifications are a local outbox.

## Repeat

Start the local engine and `npm run demo`, then run `npm test`, `npm run test:tokens` and `npm run test:engine` from `services`. Detailed engine results are saved to ignored `services/data/engine-test-results.json`.

To repeat the modelling check from the repository root:

```powershell
npx --yes bpmnlint@12.1.1 --config bpmn/operational/ayo/.bpmnlintrc --max-warnings=0 "bpmn/operational/ayo/*.bpmn"
```

See [opening and demonstration steps](../../bpmn/operational/ayo/README.md).
