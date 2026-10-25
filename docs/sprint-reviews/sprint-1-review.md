# Sprint 1 Review — Strategic Process Analysis and Project Setup

**Group 14 · Bristol Regional Food Network · Use Case 1: Producer Product Listing and Inventory Management**

| Item | Details |
|---|---|
| Review date | Thursday 29 October 2026 |
| Submission | One ZIP on Blackboard before 14:00 (in-class groups submit before presenting) |
| Format | **[TBC: In-class presentation / Pre-recorded video]** |
| Length | 10 minutes |
| Weighting | 20% of the Task 1 group mark |
| Standup 3 | In class: marked with the review. Video: attended separately as usual |

## 1. Sprint goal

> Establish a shared understanding of the business, identify its major processes and stakeholders, develop a high-level strategic BPMN model, and agree the initial project scope.

From [backlog-and-sprint-plan.md](../requirements/backlog-and-sprint-plan.md).

## 2. How the review is marked

| Criterion | Weight | What we show |
|---|---|---|
| Strategic BPMN model | 50% | The whole BRFN enterprise: pools, lanes, collapsed sub-processes, external services, message flows, and why it is modelled at this level |
| Business analysis, functional scope and sprint planning | 30% | Business areas, stakeholders and actors, the two functionalities and why we chose them, backlog with priorities, sprint plan with owners |
| Sprint progress, version control and professional practice | 20% | Project board, task allocation, commit history from every member, branches and pull requests |

Every member must take part and introduce themselves with their **full name and student ID**.

## 3. What we delivered

| Deliverable | Where | Owner | Status |
|---|---|---|---|
| Strategic BPMN model | [BRFN-Strategic-BPMN-Sprint1.bpmn](../../bpmn/strategic/BRFN-Strategic-BPMN-Sprint1.bpmn) | OritseNoyo Acogo Emami | Draft complete; review actions in section 7 |
| Strategic BPMN explanation | [bpmn/strategic/README.md](../../bpmn/strategic/README.md) | OritseNoyo Acogo Emami | Draft |
| Practice BPMN (product listing) | [bpmn/practice](../../bpmn/practice/README.md) | OritseNoyo Acogo Emami | Practice only |
| Business analysis | [docs/business-analysis](../business-analysis/README.md) | Xavier Ajike | Draft, awaiting group review |
| Actor analysis (Use Case 1) | [docs/actor-analysis.md](../actor-analysis.md) | Xavier Ajike | Draft |
| Stakeholder analysis | [docs/stakeholder-analysis](../stakeholder-analysis/README.md) | Ayobamidele Esho | Draft, awaiting group review |
| Two proposed functionalities, scope and selection criteria | [PROPOSED-FUNCTIONALITIES.md](../requirements/PROPOSED-FUNCTIONALITIES.md) | Moses Bororio | Awaiting tutor confirmation |
| Functional and non-functional requirements | [docs/requirements](../requirements/README.md) | Moses Bororio | Draft |
| Product backlog and Sprint 1 plan | [backlog-and-sprint-plan.md](../requirements/backlog-and-sprint-plan.md) | Elvis Uchendi | Draft |
| Project board | [TBC: GitHub Projects link] | Elvis Uchendi | [TBC] |
| Contribution Matrix (draft) | [contribution-matrix.md](../contribution-matrix.md) | Elvis Uchendi | [TBC] |

Update the Status column on the day so it matches the repository exactly. Don't mark anything Done that hasn't been produced and reviewed.

## 4. Run sheet (10 minutes)

Live walkthroughs overrun, and in-class reviews stop at 10 minutes.

| Time | Who | Section | On screen |
|---|---|---|---|
| 0:00–1:00 | Everyone | Full name, student ID, role (about 12 seconds each) | Repository README, Assigned Tasks table |
| 1:00–1:40 | OritseNoyo Acogo Emami | BRFN in one sentence, our use case, the sprint goal, how we worked | README |
| 1:40–2:40 | Xavier Ajike | Business analysis: three business areas, and how they became the BPMN lanes; key actors | docs/business-analysis, docs/actor-analysis.md |
| 2:40–3:20 | Ayobamidele Esho | Stakeholders and what they need; which ones became external pools | docs/stakeholder-analysis |
| 3:20–6:20 | OritseNoyo Acogo Emami | Strategic BPMN walkthrough | Camunda Modeler, zoomed in area by area |
| 6:20–8:00 | Moses Bororio | The two functionalities: how we found them, why these two, scope, tutor sign-off | PROPOSED-FUNCTIONALITIES.md, with both sub-processes highlighted on the BPMN |
| 8:00–9:30 | Elvis Uchendi | Backlog, priorities, Sprint 1 plan, board, task allocation, commit history | GitHub Projects board, Insights → Contributors, pull requests |
| 9:30–10:00 | Elvis Uchendi | Sprint 2 plan and close | Board filtered to Sprint 2 |

## 5. Talking points

Prompts, not a script. Say it in your own words and point at the screen as you go.

### Introduction — OritseNoyo
- BRFN connects local food producers with individual customers, restaurants and community organisations.
- We chose Use Case 1, producer product listing and inventory management.
- Sprint 1 goal: understand the enterprise, model it at strategic level, agree our scope and set up the project.
- How we worked: roles in the README, weekly stand-ups, GitHub for documents and models, the board for tracking.

### Business analysis — Xavier
- Three business areas: Product and Inventory Management; Marketplace Operations; Quality Assurance and Community Services.
- These became the three lanes of the strategic BPMN, so each sub-process sits with the area responsible for it.
- Use Case 1 actors: Producer, Customer, Marketplace Admin, Marketplace Platform, Certification Verification Service. These feed the i* models in Sprint 2.

### Stakeholders — Ayobamidele
- Producers, customers (individuals, restaurants and cafés, community organisations), marketplace administrators, the payment provider and the certification service.
- External organisations we don't control (payment provider, certification service) are black-box pools in the BPMN.
- The dependencies we identified (e.g. producers depend on the marketplace to validate and publish) become the i* Strategic Dependency model next sprint.

### Strategic BPMN — OritseNoyo
1. **Why this level:** one view of the whole enterprise. Each sub-process is collapsed; detailed steps and decisions belong in the Sprint 2 operational models.
2. **Pools:** BRFN Marketplace, plus Food Producers, Customers, Payment Service Provider and Organic Certification Verification Service as black boxes.
3. **Lanes:** the three business areas from the business analysis.
4. **Seven sub-processes:** Manage Product Listings, Manage Inventory and Seasonal Availability, Facilitate Customer Purchasing, Coordinate Multi-Vendor Orders, Manage Payments and Producer Settlements, Food Quality and Traceability, Support Sustainability and Community Engagement.
5. **Follow a product's life:** a producer submits a listing → it is validated and certification checked → stock and season are managed → a customer purchases → the order is split by producer → payment is taken and settlements calculated.
6. **Two kinds of arrow:** dashed message flows cross between pools, labelled with what is exchanged; solid sequence flows stay inside the marketplace.
7. **How the areas connect:** point out the links between processes (e.g. a paid order reduces stock; a quality incident can suspend a product). See section 7.

### Functionalities — Moses
- Both come from the Product and Inventory Management lane: "Manage Product Listings" and "Manage Inventory and Seasonal Availability".
- **F1, Product Listing and Validation:** submission → validation with a correction loop → organic certificate checked by a simulated service → manual admin review if the service is down → published and producer notified. Abandoned listings are archived by a timer.
- **F2, Inventory and Seasonal Availability:** stock and season updates from producers, stock changes from orders and a daily season check feed one availability decision (DMN). Zero stock closes a product; restocking reopens it only within its season.
- **Why these two:** each has user interaction, automated processing, business decisions, service interaction and exception paths, which the brief requires. Producer registration doesn't.
- **Scope:** producer registration, real certification APIs, checkout and payment are out. F2's stock-change message is our integration point for Task 2.
- **Sign-off:** say when we asked the tutors and what they said.

### Project management — Elvis
- Backlog PB1–PB13 with priorities and sprints, plus user stories US1–US12 decomposing the two functionalities.
- Sprint 1 plan and task tracker: every task has an owner and a status.
- Board: show columns, assignees and an issue moving through to Done.
- Version control: commits from every member, branches and pull requests reviewed by another member.
- Be honest about what slipped and how the plan catches it up.

### Sprint 2 plan 
- Sprint 2 review on 2 November 2026: i* SD and SR models, operational BPMN for F1 and F2, traceability between the models, first Camunda processes with Forms.
- Name the owner of each.

## 6. Questions we should expect

| Question | Short answer |
|---|---|
| Why is the certification service a pool, not a lane? | It is an outside organisation. Lanes are responsibilities inside one organisation. |
| Where is the marketplace administrator? | [Answer depends on the fix in section 7: a lane, or annotated where admin review happens.] |
| Why are there no gateways? | Strategic level shows what the enterprise does and who is responsible. Decisions are modelled in the operational BPMN. |
| Where is the 5% commission? | Inside Manage Payments and Producer Settlements; detailed if Use Case 2 is built. |
| Why isn't producer registration modelled? | [Answer depends on section 7: added as a sub-process, or out of scope because …] |
| Why these two functionalities and not others? | Section 5, "Why these two". |
| How will Task 1 connect to Task 2? | F2 receives a stock-change message from the ordering process. |
| Who did what? | Point to the Assigned Tasks table, the board and Insights → Contributors. |

## 7. Strategic BPMN review actions

Found when checking the model against the assessment brief and the three use cases. Owner: OritseNoyo Acogo Emami. The model is updated by the group in Camunda Modeler.

| # | Finding | Why it matters | Action | Status |
|---|---|---|---|---|
| 1 | The four process chains never connect to each other | The brief asks for "relationships between the principal business processes" | Link Listings/Inventory → Facilitate Customer Purchasing; Payments → Manage Inventory (stock reduces after payment); Food Quality → Listings or Inventory (suspension) | Open |
| 2 | No message flow for producers updating stock and season | Use Case 1 requirement and the trigger for F2 | Food Producers → Manage Inventory and Seasonal Availability | Open |
| 3 | "Food Quality Incident Reported" is a message start event with no sender | Use Case 3: a customer, producer or admin reports the incident | Message flow from Customers and/or Food Producers | Open |
| 4 | No contact with producers or affected customers during an incident | Use Case 3 requirement | Food Quality ↔ Food Producers; Food Quality → Customers | Open |
| 5 | No settlement message to producers | Named in the sub-process but not shown as an interaction | Manage Payments and Producer Settlements → Food Producers | Open |
| 6 | "Product Listing Submission" and "Customer Purchase Request" target the sub-process, not their message start events | Notation consistency | Retarget each to its message start event | Open |
| 7 | Marketplace administrator not visible | Key internal actor in Use Cases 1 and 3, and in the stakeholder analysis | Add a lane, or annotate where admin review happens, and justify the choice | Open |
| 8 | Producer registration not modelled | Use Case 1 starts with a "registered producer" | Add an onboarding sub-process, or justify leaving it out | Open |
| 9 | Customer types not shown | Stakeholder analysis lists individuals, restaurants and community organisations | Rename the pool, e.g. "Customers (individuals, restaurants, community organisations)" | Open |
| 10 | F1 and F2 not highlighted | Markers need to see where the operational models zoom in | Colour or annotate the two sub-processes | Open |
| 11 | Labels overlap the collapsed-marker; empty space in the lower lane | Readability on a projector | Resize the boxes and tighten the layout | Open |
| 12 | No PNG export, and modelling decisions aren't explained | 1st-class band asks for "excellent justification" | Export PNG; add a "Modelling decisions" section to bpmn/strategic/README.md | Open |

When an action is done, change its status to **Fixed** and add the commit or pull request link.

## 8. Submission checklist (Wednesday 28 October)

- [ ] Repository public, or the marking team added as collaborators (repository owner)
- [ ] Project board visibility set to public
- [ ] Every Sprint 1 issue assigned and in the right column
- [ ] Strategic BPMN PNG committed next to the .bpmn
- [ ] Section 3 statuses match the repository
- [ ] Board screenshots: board view, assignees, Insights → Contributors
- [ ] links.txt filled: members with student IDs, repository and board links, format, commit SHA (`git rev-parse --short HEAD`)
- [ ] Slides PDF, if used
- [ ] Video MP4 under 10 minutes, every member on camera, if submitting video
- [ ] ZIP submitted before 14:00 on 29 October; a second member checks it uploaded

## 9. Feedback received

_To be completed after the review._

| Feedback from tutors | Action we will take | Owner | Sprint |
|---|---|---|---|
| | | | |

## 10. Sprint 1 retrospective

_To be completed by the group after the review._

| What went well | What to improve | What we'll change in Sprint 2 |
|---|---|---|
| | | |
