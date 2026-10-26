# BRFN Sprint 1 — Presentation Revision Notes

## Why did we create the strategic BPMN?

To show how the Bristol Regional Food Network operates,
which business functions are involved, and how external
participants exchange information with the marketplace.

## Main organisational areas

1. Product and Inventory Management
   - Product listings and validation
   - Stock and seasonal availability

2. Marketplace Operations
   - Customer purchasing
   - Multi-vendor order coordination
   - Payments and producer settlements

3. Quality Assurance and Community Services
   - Food quality and traceability
   - Sustainability and community engagement

## BPMN concepts to explain

- Pool: an organisational participant in the collaboration.
- Lane: a responsibility area within BRFN.
- Subprocess: a major activity that contains more detailed steps.
- Sequence flow: solid arrow showing the order of activities.
- Message flow: dashed arrow showing communication between participants.
- Message Start Event: a process triggered by receiving a message.
- End Event: marks completion of that particular workflow.

## What happens in the example?

A producer submits product details. BRFN reviews the listing
and manages its availability. A customer selects products and
submits an order. BRFN coordinates items across producers,
communicates order details and interacts with an external
payment provider. Other independent workflows cover quality,
traceability, sustainability and community activity.

## How to describe the interactive visualisation

"The BPMN model is our formal representation of the
organisation's business processes. This interactive
visualisation explains those processes using example
information moving between participants. It does not
execute the real marketplace system, but makes the
proposed business interactions easier to understand."

## Questions your tutor may ask

Q: Why did you use subprocesses?
A: To keep the strategic diagram readable while allowing
each major business function to be broken down further.

Q: Why are some arrows dashed?
A: Dashed message flows represent communication between
different participants, whereas solid sequence flows
describe activities within one process.

Q: Is the visualisation a working backend?
A: No. It demonstrates the proposed business logic and
uses simulated data. Actual implementation comes later.

Q: What is the value of the model to the project?
A: It identifies enterprise functions, participants and
interactions, and supports agreement on the scope of
the more detailed work in later sprints.
