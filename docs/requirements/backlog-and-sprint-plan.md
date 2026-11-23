# Product Backlog, Sprint Planning and Progress Tracking

**Responsible Group Member:** Elvis Uchendi  
**Project:** Bristol Regional Food Network (BRFN) Digital Marketplace  
**Current Sprint:** Sprint 3

## 1. Purpose

My role would be to prioritise tasks in the product backlog for the project backlog and help with the planning and tracking the progress of the tasks within the sprint, as well as noting what the group has finished or not yet done.

It will ensure that the group works towards the requirements for the assessments systematically.

The aim for Sprint 1 is to reach a common understanding regarding the business BRFN, find out its stakeholders and key business processes, outline the functional requirements and requirements, and create a high-level strategic BPMN diagram that would be an image of the entire enterprise.

Also, the team should keep project documentation, make records about the participation and check the scope of work with the tutor.

## 2. Product Backlog

Product backlog contains a list of the major components of the task involved in the entire process. The priorities may vary depending on the importance of the items for the final assessment outcomes.

2. Product Backlog
ID	Task	Priority	Sprint
PB1	Analyse the BRFN case study and assessment brief	High	Sprint 1
PB2	Determine the key business processes	High	Sprint 1
PB3	Determine stakeholders and their roles	High	Sprint 1
PB4	Identify two critical functionalities	High	Sprint 1
PB5	Formulate the strategic BPMN model	High	Sprint 1
PB6	Formulate the initial project requirements	High	Sprint 1
PB7	Construct the product backlog and sprint plan	High	Sprint 1
PB8	Analyse Sprint 1 deliverables	High	Sprint 1
PB9	Generate the i* Strategic Dependency Model	High	Sprint 2
PB10	Generate the i* Strategic Rationale Model	High	Sprint 2
PB11	Improve the strategic BPMN	High	Sprint 2
PB12	Construct the F1 Operational BPMN	High	Sprint 2
PB13	Construct the F2 Operational BPMN	High	Sprint 2
PB14	Construct traceability between the models	High	Sprint 2
PB15	Construct Camunda Forms for F1 and F2	High	Sprint 2
PB16	Construct process variables, gateways and business rules	High	Sprint 2
PB17	Start service-task construction and process testing	High	Sprint 2
PB18	Finish Camunda processes implementation	In progress but not confirmed	Sprint 3
PB19	Perform tests of process workflows	Testing began but is not finished	Sprint 3
PB20	Make final analysis and provide evidence	in progress	Sprint 3


## 3. Sprint 1

### Sprint Goal

The objective of Sprint 1 was to have a basic understanding of BRFN’s business, find out their major processes and stakeholders, pick two major functionalities, and create a strategic BPMN model.

### Sprint 1 Task Tracker

| Task | Responsible Member | Status |
|---|---|---|
| Business analysis and enterprise processes | Xavier Ajike | Completed |
| Stakeholder analysis | Ayobamidele Esho | Completed |
| Proposed functionalities and use-case scope | Moses Bororio | Completed |
| Strategic BPMN model | Noyo Acogo Emami | Completed |
| Initial requirements | Moses Bororio/Group | Completed |
| Backlog and sprint planning | Elvis Uchendi | Completed |
| Group review and meeting minutes | Whole group | Completed |

### Sprint 1 Output

The team has performed their initial analysis and chosen two major functionalities:

- **F1** – Product Listing & Validation
- **F2** – Inventory & Seasonal Availability Management

The Sprint 1 documentation and strategic BPMN model were uploaded to Github.

These documents have served as a base for Sprint 2 work.
## 4. Sprint 2 Plan

### Sprint 2 Goal

Objective of Sprint 2 is to create the stakeholder model and operational process BPMN diagrams for the chosen BRFN features, create traceability between the models, and kick start the process automation using Camunda.

### Planned Activities

1. Develop i* Strategic Dependency and Strategic Rationale models.
2. Develop Operational BPMN models for Product Listing & Validation and Inventory and Seasonal Availability Management.
3. Trace the models i*, strategic BPMN and operational BPMN.
4. Start development of executable Camunda processes, user tasks and forms.
5. Develop process variables, gateways, service tasks and business rules.
6. Keep the backlog, progress reports and contributions of the team members.
7. Assess Sprint 2 deliverables and report the remaining work to be done.

### Sprint 2 Task Tracker

| Task | Member assigned | Status | Next action to take |
|---|---|---|---|
| i* Strategic Dependency model | Group / i* members | Model is uploaded | Conduct final group review |
| i* Strategic Rationale model | Ayo | Model is uploaded | Conduct consistency check against SD |
| Strategic BPMN improvement | Noyo | BPMN updated on Camunda | Export current version and conduct review |
| F1 operational BPMN | Moses, Elvis | BPMN uploaded and imported | Conduct implementation review and test process |
| F1a organic certification subprocess | Moses | BPMN uploaded and imported | Conduct review of call activity and process configuration |
| F2 operational BPMN | Moses | BPMN uploaded and imported | Conduct implementation review and test process |
| F2a product availability subprocess | Moses | BPMN uploaded and imported | Conduct review of subprocess configuration |
| Camunda forms | Operational modelling members | All 5 forms imported | Conduct validation and field check |
| Availability DMN | Operational modelling members | BPMN uploaded and imported | Conduct test of decision rules |
| Business rules and process variables | Moses / implementation members | Partially done | Conduct review for consistency against BPMN, Forms and DMN |
| Service workers and simulated certification service | Implementation members | Code on GitHub | Conduct review of integration with selected models |
| Model traceability | Group | Draft completed | Conduct update on links and models |
| Camunda process testing | Group | Conducted | Conduct resolution of execution access and evidence collection |
| Backlog and progress monitoring | Elvis | Conducted | Conduct update after group review |

Status notes: "Uploaded/imported" means that the document is uploaded. This does not mean that the process was implemented/executed successfully.

## 4.1 Strategic BPMN Progress
The strategic BPMN from Sprint 1 has been improved to add more details to the two chosen functionalities.
For F1, the BPMN includes product validation, correction requests, organic certification verification, publication and rejection options.
For F2, the BPMN includes inventory update, stock and seasonal availability check.

Additionally, an inventory update path has been created so that the already existing products can be updated without submitting a new listing.
The connection between F1 and F2 has also been checked. In the revised Camunda version, the difference between published and rejected listings is determined before moving to inventory management.
The strategic BPMN is non-executable as it describes the overview of the business process, not the executable implementation of it.
Current Position: Latest changes were made in Camunda and no modelling issues were found in the Design tab. Latest version has to be exported to GitHub and reviewed by the group.

## 4.2 Operational BPMN Progress
The group chose Moses' F1 and F2 operational BPMNs.
The following editable BPMN files are stored in GitHub:
File and Purpose
F1-Product-Listing-Validation.bpmn	Product submission, validation and publication
F1a-Verify-Organic-Certification.bpmn	Organic certification verification
F2-Inventory-Seasonal-Availability.bpmn	Stock and seasonal availability update
F2a-Evaluate-Product-Availability.bpmn	Product availability evaluation
PNG images are also available.
All four BPMN files have been imported to the UWE Camunda Web Modeler project on 17 November 2026.
No design issues were found in the F1 diagram. Four information notices about the usage of the external resources were shown in its implementation review.
F2 process has three major triggers:
* T1: Producer updates stock/seasonal availability information.
* T2: Customer order decreases stock quantity.
* T3: Daily check of seasonal availability takes place at 00:05.
In addition, F2 has stock discrepancy management and administrator review path.
Current Position: Both operational models are ready to be reviewed and configured. The end-to-end process execution has not been successful yet.

## 5. Sprint 2 Testing

Testing has commenced for the Camunda project along with its related documents.

So far:

| Check | Result |
|---|---|
| F1 BPMN design validation | No problem detected |
| F1 implementation validation | Four informational notices |
| Validation of product submission Form | No problem detected |
| F2 implementation validation | Five problems detected during the review |
| Importing operational files into UWE Camunda | Completed |
| Execution of End-to-end F1 | Has not been verified |
| Execution of End-to-end F2 | Has not been verified |

The deployment environment for UWE workspace has not been confirmed yet. Process execution permissions also need to be sorted out.

The testing evidence should be provided once the processes become executable.

## 6. Sprint 2 Outstanding Tasks

The following tasks should take priority until Sprint 2 is completed.

| Priority | Task | Expected outcome |
|---|---|---|
| High | Export latest strategic BPMN to GitHub | Latest updated model is in the repository |
| High | F1 and F2 reviews completion | Detection and resolving of the remaining issues related to the modeling or configuration |
| High | Validation of all Camunda Forms | All forms utilize correct variables and referenced by processes |
| High | Availability test of DMN | Decision rules give expected outcomes |
| High | Access resolution to Camunda environment | Detection of the way to execute the processes |
| High | Testing of initial process scenarios | Recording evidence of process scenario execution |
| High | Model traceability update | Traceability between all models consistent |
| High | Contributions and responsibilities review | Recording of the individual contribution accurately |

Any tasks which cannot be done in Sprint 2 should be identified as the outstanding ones for Sprint 3.

## 7. Sprint 2 Task Ownership and Acceptance Criteria

Sprint 2 task ownership and acceptance criteria will be tracked using the GitHub Project Board and the GitHub Issues.

My role is to track task ownership and progress, manage the backlog, keep record of contributions made by members and also evaluate the work completed according to the acceptance criteria.

Task completion will be verified from the GitHub issue, related files and group evaluation. Tasks can only be considered Done once they meet the set acceptance criteria.

## 8. Progress Reporting

At each stand-up, I will help the group answer three questions:

1. **What has been completed since the last meeting?** Identify the document, model or task that has actually changed.
2. **What will happen next?** Record the next action, the person responsible and the intended outcome.
3. **What is blocking progress?** Record unresolved decisions, required reviews, tutor feedback or dependencies on another team member.

Actions and status changes should be reflected in the tracker after the meeting. Where appropriate, GitHub commits and the files changed can help demonstrate progress, but the contribution record should accurately reflect the work performed.

### Sprint 2 Progress Evidence

The repository contains strategic BPMN models, the selected operational diagram images, i* SD/SR models, traceability documents, shared validation/certification workers and business rules. Ayo's separate executable F1/F2 models and their dedicated forms, DMN, runtime and test harness have been removed.

The remaining service tests check the shared validation rules and simulated certification service. End-to-end execution evidence must be recorded for Moses's selected models after their editable exports and configuration are available.
Open dependencies are the following: final consistency check of the model, group checking, deployment confirmation, integration checks, and contributions checklists.

The backlog will continue to be updated in accordance with the completion of remaining tasks.

## 9. Current Priorities

Current priorities revolve around implementing and assessing the performance of Sprint 3.

- Observe the completion and execution of the chosen F1, F1a, F2 and F2a processes.
- Observe the service-task workers, Camunda forms, process variables and DMN implementation.
- Document the outcome of the process tests that are normal and exceptional.
- Observe the issues that are outstanding in implementation and dependency between the group members.
- Update the traceability of the requirements using the evidence of implementation and testing.
- Document the progress and contributions of individuals.
- Facilitate the taking of screenshots, process evidence and demonstration.

Tasks will be marked as complete only after reviewing the evidence of implementation or testing.

## 10. Connection to Future Sprints

Sprint 2 creates the necessary stakeholder relations, operational procedures and Camunda implementation that are needed for the subsequent stage of the development process. The models and implementation created in Sprint 2 will be the basis for Sprint 3.

### Sprint 3 – Completion, Testing and Evaluation
This sprint will concentrate on the completion and improvement of the BRFN Digital Marketplace implementation.

### Planned Activities

1. Complete the Camunda processes execution for the implemented functionality.
2. Improve process variables, gateways, user tasks, forms and business rules.
3. Complete interactions of service tasks and integrate an external service in the simulation environment.
4. Implement and improve exception handling and alternative process flows.
5. Test the process in both regular and exceptional cases and document the findings.
6. Evaluate the implementation against the agreed requirements.
7. Finish project documentation, contributions logs and assessment material.

Sprint 3 will utilise the results from Sprint 2 to complete, test and evaluate the solution.

## 10.1 Sprint 3 Task Tracker

| Component | Evidence | Verification outstanding |
|---|---|---|
| F1 Product listing | BPMN and forms are operational | Submission, validation, corrections, publication, notification |
| F1a Organic certification | Subprocess and manual review form | Automation, service failure, admin decision |
| F2 Inventory management | BPMN is operational | Producer updates, order-driven updates, daily checks |
| F2a Availability | Subprocess and DMN | Decision output and integration with F1/F2 |
| Service-task workers | Reference to worker code in documentation of sprint 2 | Verify deployment, type and returned variables of jobs |
| Requirements traceability | Traced requirements R1-R15 in document | Add actual test results and references |

### Sprint 3 Current Blockers and Dependencies

- There is no confirmation of end-to-end F1 and F2 processes execution.
- The `validate-product` task needs confirmation of an active worker.
- There is no execution evidence of integrations of certification, availability and notifications.
- Tests results should be recorded before tasks completed.

### 11 Acceptance criteria for Sprint 3 tasks

The completion of all tasks in Sprint 3 will be conditioned upon the existence of proof.

Proof might consist of:

- Executable BPMN/DMN files.
- Camunda forms in working state.
- Completed process instances.
- Successful execution of both normal and exception paths.
- Screenshots from process execution.
- Related GitHub commits and documentation.

### 12 Next actions

- Confirm the implementation and deployment of service-workers.
- Test submission, validation, correction and publishing of F1.
- Test the certification service and manual review of F1a.
- Test the integration of F1 availability with the DMN.
- Coordinate F2 and F2a testing with group members responsible for their implementation.
- Update traceability document and backlog based on real results.
- Collect proofs and make preparations for the final group presentation.

## 13. Conclusion

My role is to make the group's work manageable and traceable. By maintaining the backlog, tracking task ownership, recording progress and highlighting blockers, I help the team see what has been achieved, what remains outstanding and what needs attention before the next assessment milestone.

