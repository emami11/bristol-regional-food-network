# Bristol Regional Food Network (BRFN)

**Distributed and Enterprise Software Development – Group 14**

## Project Overview

The Bristol Regional Food Network (BRFN) project focuses on developing a digital marketplace that connects local food producers with customers.

Our group is working on **Use Case 1: Producer Product Listing and Inventory Management**.

We have selected these as our two main functionalities:

1. **Product Listing and Validation (F1):** Producers would submit product information, which is then checked before the product is published. Organic certification is also verified where required.
2. **Inventory and Seasonal Availability Management (F2):** Producers update stock levels and seasonal availability. The marketplace then uses this information to determine whether products are available for purchase.

## Project Development

This project follows an Agile approach across three sprints.

- **Sprint 1:** Business analysis, stakeholder identification, strategic BPMN modelling and project planning.
- **Sprint 2:** i\* Strategic Dependency and Strategic Rationale models, detailed operational BPMN models, and initial Camunda implementation.
- **Sprint 3:** Complete the implementation, test both processes, and prepare the final demonstration.


## Group Members and Responsibilities

| Member           | Main Responsibility                                                  |
| ---------------- | -------------------------------------------------------------------- |
| Noyo Acogo Emami | Group coordination, meeting records and strategic BPMN modelling     |
| Xavier Ajike     | Business and actor analysis                                          |
| Moses Bororio    | Functional requirements, business rules, F1 and F2 operational BPMN and Camunda implementation |
| Ayobamidele Esho | Stakeholder analysis and i\* modelling                               |
| Elvis Uchendi    | Sprint planning, backlog and progress tracking                       |

All members contribute to group discussions, modelling reviews and project decisions.

## Individual Contributions

### Moses Bororio

| Area | Work | Files |
|---|---|---|
| Requirements | Selection and scoping of the two major functionalities, with the criteria used to choose them | [PROPOSED-FUNCTIONALITIES.md](docs/requirements/PROPOSED-FUNCTIONALITIES.md) |
| Business rules | Validation, certification, stock and seasonal-availability rules, and the process variables they use | [business-rules-and-variables.md](docs/requirements/business-rules-and-variables.md) |
| Operational BPMN | F1 Product Listing and Validation, with F1a Verify Organic Certification as a called process | [F1](bpmn/operational/F1-Product-Listing-Validation.bpmn), [F1a](bpmn/operational/F1a-Verify-Organic-Certification.bpmn) |
| Operational BPMN | F2 Inventory and Seasonal Availability, with F2a Evaluate Product Availability as a called process | [F2](bpmn/operational/F2-Inventory-Seasonal-Availability.bpmn), [F2a](bpmn/operational/F2a-Evaluate-Product-Availability.bpmn) |
| Camunda | User task forms and the availability decision table (DMN) | [camunda/forms](camunda/forms), [camunda/dmn](camunda/dmn) |
| Services | `validate-product` and `verify-certificate` job workers, a simulated organic certification service, and automated tests | [services](services/README.md) |
| Testing | Sprint 2 test scenarios, limitations and next steps | [sprint2-test-scenarios.md](docs/testing/sprint2-test-scenarios.md) |

## Use of Generative AI

- **Moses Bororio:** the business rules document, the service-task code and tests, the Sprint 2 test scenarios, and the form field lists and decision rules were drafted with AI assistance (Claude), then reviewed and tested by the group. The F1, F1a, F2 and F2a BPMN models were built in Camunda Web Modeler. Forms and the DMN first drafted with AI are being rebuilt in Web Modeler.

## Tools

Camunda 8, BPMN 2.0, piStar, GitHub and GitHub Projects.
