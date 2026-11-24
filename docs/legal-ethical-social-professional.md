# Legal, Ethical, Social and Professional Issues (F1 and F2)

**Use Case 1:** F1 Product Listing and Validation (with F1a Verify Organic Certification) and F2 Inventory and Seasonal Availability (with F2a Evaluate Product Availability).

## Purpose and scope

Each legal, ethical, social and professional (LESP) issue below is tied to an element in our Camunda models, forms, decision table or job types, not just discussed. Element names are quoted exactly as they appear in the files in [bpmn/operational](../bpmn/operational), [camunda/forms](../camunda/forms) and [camunda/dmn](../camunda/dmn), so each one can be found.

## Legal

Five areas of UK law shape F1 and F2. In each case a gateway, form field, decision or job type stops the platform from publishing or selling something it shouldn't.

| Law | What it requires of BRFN | Where F1/F2 enforces it |
|---|---|---|
| Food Information Regulations 2014 (retained Reg. 1169/2011, Art. 14, distance selling) | Online sellers must give allergen information [before the purchase is completed and when the food is delivered](https://www.food.gov.uk/business-industry/guidancenotes/food-sold-online). | **Submit product details** form: `containsAllergens` (Yes/No) and the `allergens` checklist of the 14 regulated allergens. `validate-product` must reject "Yes" with nothing ticked, and the **Details valid** gateway stops the listing reaching **Publish product listing** until it passes. Showing allergens again on delivery is a Task 2 item. |
| GB organic regulations | Anyone who markets or sells organic food [must be certified by an approved UK control body](https://www.gov.uk/guidance/organic-food-labelling-rules), and labels carry its GB-ORG-XX code. | The **organic claimed** gateway calls **Verify organic certification** (F1a). The form takes `certBody`, `certNumber` and `certExpiry`; `verify-certificate` checks them, and expired or unknown certificates go back to the producer. A listing can only be published as organic once the **certificate verified** gateway passes. |
| Food Safety Act 1990, s.15 (falsely describing food), and food business registration | Food must not be described in a misleading way, and food businesses register with their local authority. | `validate-product` checks that the harvest date is not in the future and that best-before is after harvest. Capturing a producer's food business registration number is a Task 2 item. |
| Digital Markets, Competition and Consumers Act 2024, Part 4 (replaced the CPRs on [6 April 2025](https://www.taylorwessing.com/de/insights-and-events/insights/2024/09/aq-whats-changed-as-regards-unfair-commercial-practices)) | Giving false or misleading information that affects a decision to buy is an unfair commercial practice. | F2 doesn't let an item look buyable when it isn't. The `availability-status` decision closes orders at zero stock or outside the season, `set-order-availability` applies it, and the `stock-reduced` message (**T2 Stock reduced by an order**) keeps stock current after each sale. |
| UK GDPR and Data Protection Act 2018 (as amended by the Data (Use and Access) Act 2025) | Personal data is handled under the [seven principles](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/), including minimisation, storage limitation, security and accountability. | The forms collect listing data plus the farm name and `farmPostcode` only. The **7 days without correction** timer archives abandoned drafts instead of leaving them open. Camunda client credentials are kept in a git-ignored `.env` file. `record-verification-audit` records each certification outcome and who decided it (accountability). |

## Ethical

The automated checks are fixed, readable rules, and a person decides wherever a rule can't. No producer is rejected by a check they can't see or challenge.

| Issue | Risk | Design response |
|---|---|---|
| Human oversight | An outage of the certification service, or an unclear certificate, wrongly blocks a genuine organic producer. | The **Service Unavailable** error boundary (`CERT_SERVICE_UNAVAILABLE`) routes to **Review certificate manually**, where an administrator records `certDecision` and `certNotes`. The listing waits for a person instead of being rejected. |
| Transparency | Producers don't know why a listing failed and give up. | `validate-product` returns every failed rule at once, and the **Correct product details** form shows them. Producers are told at each step: **Notify producer product live**, **Send correction reminder**, **Notify producer listing archieved**. |
| Fair deadlines | A short deadline punishes producers who are busy harvesting. | **3 days without correction** is non-interrupting, so the task stays open and the producer gets a reminder. **7 days without correction** then archives the draft. The draft is archived, not deleted, so the producer can resubmit. |
| Honest data | Stock errors are "fixed" silently, hiding a real problem. | Negative stock returns `REJECTED` from the decision and throws `INVALID_STOCK` to **Reconcile stock discrepancy**, where a person investigates. Nothing is zeroed automatically. |
| Explainable decisions | Availability looks arbitrary to producers and customers. | The `availability-status` decision table has five visible rules (hit policy FIRST), so any status can be traced to one rule and its inputs. |

## Social

BRFN exists to keep money and food in the Bristol region, so F1 and F2 are designed around small producers with little time or IT support.

- **Low barrier to selling.** **Save draft listing** stores the submission before validation, so nothing is lost if a producer's connection drops. Errors come back in plain English, and certification details are only asked for when `organicClaimed` is ticked.
- **Seasonal, local food.** Season start and end dates, the daily **T3 everyday at 00:05** timer and `find-season-changes` open and close products on time. Customers only see what's actually in season, and producers aren't sent orders for produce they haven't harvested, which cuts waste.
- **Local supply chain.** Every listing records the farm name and `farmPostcode`, so the Task 2 storefront can let customers favour nearby producers.
- **Digital inclusion.** The Camunda forms are short, single-column screens with labelled fields. The Equality Act 2010 expects reasonable adjustments, so the Task 2 front end will target WCAG 2.2 AA (keyboard use, contrast, screen-reader labels).
- **Trust in the network.** Verified organic claims and accurate stock protect honest producers from being undercut by false claims, and protect customers with allergies.

## Professional

We used the four principles of the [BCS Code of Conduct](https://www.bcs.org/membership-and-registrations/become-a-member/bcs-code-of-conduct/) as our checklist.

| BCS principle | What it asks | How we meet it |
|---|---|---|
| Public interest | Due regard for public health, privacy, security and wellbeing. | Allergen and organic checks in F1, honest availability in F2, and the GDPR measures above. |
| Professional competence and integrity | Only claim what you can do, and keep work to recognised standards. | Models use BPMN 2.0, DMN and Camunda Forms for Camunda 8. F2 and F2a have been deployed and executed, with instance IDs and screenshots in [F2-F2a-implementation-and-testing.md](../bpmn/operational/F2-F2a-implementation-and-testing.md). Simulated services are named as simulated (**Certification Body Service (Simulated)**, **Notification service (Simulated email)**), not presented as real integrations. |
| Duty to relevant authority | Work with due care and diligence to the client's requirements. | Every requirement traces back to the case study and our i\* SD/SR models (see [model-traceability.md](requirements/model-traceability.md)). Exception paths (`INVALID_STOCK`, `CERT_SERVICE_UNAVAILABLE`, timers) are modelled rather than ignored. |
| Duty to the profession | Uphold the profession's reputation and support colleagues. | Full GitHub history, a README so the demo can be rerun, no secrets committed, and a signed Contribution Matrix that credits each member honestly. AI-tool use is declared under UWE's academic integrity policy. |

## Limitations and Task 2 actions

The Sprint 3 build uses an in-memory product store and simulated certification and notification services. These gaps are carried into Task 2:

- [ ] Show allergen information again at delivery (order confirmation and packing label), not only on the listing.
- [ ] Add the producer's food business registration number to **Submit product details**.
- [ ] Set a retention period for archived listings and the verification audit (storage limitation). Open question: how long?
- [ ] Show producers a privacy notice before their first submission.
- [ ] Replace the in-memory store with the Task 2 database, with role-based access (producer, administrator).
- [ ] Check the Task 2 front end against WCAG 2.2 AA.
- [ ] Set the F1 timers to `P3D` and `P7D` after the demo (`PT1M` and `PT2M` are for testing only).

## Sources

- [Food Standards Agency: food sold online](https://www.food.gov.uk/business-industry/guidancenotes/food-sold-online)
- [GOV.UK: organic food labelling rules](https://www.gov.uk/guidance/organic-food-labelling-rules)
- [ICO: a guide to the data protection principles](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/)
- [Taylor Wessing: DMCCA replaces the CPRs](https://www.taylorwessing.com/de/insights-and-events/insights/2024/09/aq-whats-changed-as-regards-unfair-commercial-practices)
- [BCS Code of Conduct](https://www.bcs.org/membership-and-registrations/become-a-member/bcs-code-of-conduct/)
