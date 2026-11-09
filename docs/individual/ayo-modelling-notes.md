# Ayo: tasks and model handover

Checked repository main **9aeeddc** and the live GitHub issues on **3 November 2026**. The latest main-branch commit was dated 2 November 2026.

## What GitHub currently assigns to you

The main README and meeting log record your Sprint 1 **Stakeholder Analysis** work. The updated backlog marks it completed and moves the project to Sprint 2.

Your live GitHub assignments are:

| Issue | Assignment | Acceptance / next action |
|---|---|---|
| [#17: Develop i* Strategic Rationale model](https://github.com/emami11/bristol-regional-food-network/issues/17) | Assigned to `eshoayobami8-6b` | Explain internal goals, softgoals, tasks, resources and trade-offs for Use Case 1; align with SD and stakeholder analysis; save editable source and diagram exports; review with the group. |
| [#14: Refine Strategic BPMN for Sprint 2](https://github.com/emami11/bristol-regional-food-network/issues/14) | Shared with all five members, including you | Review process relationships, appropriate gateways, external messages and readability while retaining strategic abstraction. |

Both issues were open and shown as Todo in the project metadata when checked. No issue or project status was changed. [#16, the SD model](https://github.com/emami11/bristol-regional-food-network/issues/16), is assigned to Xavier; [#15, detailed F1/F2 BPMN](https://github.com/emami11/bristol-regional-food-network/issues/15), is assigned to Noyo.

In this chat, you requested a rebuilt SR and confirmed that your own BPMN should be a **whole-enterprise strategic BPMN**. The personal variant supports your contribution to #14. It leaves the shared strategic file unchanged and does not replace Noyo's operational F1/F2 work.

## Your new files

| Deliverable | Start here |
|---|---|
| Revised five-actor SR, aligned with the updated actor analysis | [Core SR in piStar](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Core.txt) |
| Expanded eight-actor view retaining buyer segments and payment context | [Expanded SR in piStar](../../models/istar/ayo/pistar/BRFN-Ayo-SR-Expanded.txt) |
| Your own whole-enterprise strategic BPMN | [Personal BPMN](../../bpmn/personal/ayo/BRFN-Ayo-Strategic-BPMN.bpmn) |
| Model explanations and assumptions | [SR notes](../../models/istar/ayo/README.md); [BPMN notes](../../bpmn/personal/ayo/README.md) |

## How the models connect

| Requirement / responsibility | Core SR elements | Personal BPMN |
|---|---|---|
| Product submission and corrections | P-G1, P-T1/P-T2, M-G1, M-G5; D02/D03/D11 | Ayo_SP_Listings |
| Applicable certification checking | V-G1, M-T2; D05/D06 | Listing subprocess and certification request/result messages |
| Service outage and authorised review | M-G3, M-T4/M-T5, A-G2; D07/D08/D12 | Admin review annotation on listing subprocess; detailed route deferred to F1 |
| Current stock, seasons and unavailable-product exclusion | P-G2, M-G2, M-T6/M-T7/M-T8; D04 | Ayo_SP_Inventory; producer update, catalogue and stock-change data |
| Buyer information and safe purchasing decisions | K-G1, K-T1/K-T2/K-T3; D09/D14 | Ayo_SP_Purchasing; Customers pool and catalogue input |
| Payment outcomes and producer settlements | Expanded view: M-G6/M-G7, S-G1/S-G2 | Ayo_SP_Payments and provider/producer exchanges |
| Wider food quality and community processes | Outside detailed core UC1 SR scope | Ayo_SP_Quality; Ayo_SP_Community |

Use the core SR to discuss Use Case 1. Use the expanded view only when explaining the broader buyer/payment context. The personal BPMN has wider enterprise coverage; a different number of actors and pools is expected when abstraction levels differ.

## Next actions

1. Coordinate your SR with Xavier's SD under #16. No SD source file was present on main when checked, so final SD consistency still needs joint review.
2. Check the lecturer's i* notation against the revised SR before presentation.
3. Open the personal BPMN in Camunda, inspect its seven subprocesses and revise the layout/decisions you want to explain.
4. Review the proposed admin policy, internal stock triggers and settlement cadence with the group.
5. Keep genuine changes and review evidence in your commits when the drafts are ready to share.

The new `model-traceability.md` incorrectly mapped F2 to Manage Product Listings. The local change corrects it to **Manage Inventory and Seasonal Availability**, matching the requirements and both strategic diagrams. Operational model element references remain prospective until the F1/F2 sources are available.

The personal BPMN includes a high-level **Payment accepted?** XOR gateway with a named Yes condition and a default No/unresolved outcome, supporting #14's request to consider appropriate gateways. The detailed decline/retry handling remains inside the later operational process.

The model drafts were prepared on `codex/ayo-sr-strategic-bpmn`. The SR was converted to piStar on 9 November 2026 after Ayo clarified the required tool. This contribution includes native piStar `.txt` models, an editable `.bpmn` source and SVG/PNG exports; the earlier `.drawio` files remain reference drawings. See [piStar instructions and validation](../../models/istar/ayo/pistar/README.md). #17 still needs joint SD consistency checking and group review; publishing the artefacts does not by itself close the issue.
