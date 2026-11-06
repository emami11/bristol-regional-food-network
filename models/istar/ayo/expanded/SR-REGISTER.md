# SR element and relationship register

Source: repository main `9aeeddc355d42e18477f753973677f85c8dadbbe`, reviewed 3 November 2026.

## Elements

| ID | Actor | Type | Label |
|---|---|---|---|
| P-G1 | Registered Producer | goal | Valid product information maintained |
| P-G2 | Registered Producer | goal | Inventory and seasonal records current |
| P-G3 | Registered Producer | goal | Valid products published |
| P-T1 | Registered Producer | task | Submit complete product information |
| P-T2 | Registered Producer | task | Review feedback and correct issues |
| P-T3 | Registered Producer | task | Update product quantities |
| P-T4 | Registered Producer | task | Update seasonal availability |
| P-R1 | Registered Producer | resource | Product details and applicable evidence |
| P-R2 | Registered Producer | resource | Validation and correction feedback |
| P-R3 | Registered Producer | resource | Current quantity and season records |
| P-R4 | Registered Producer | resource | Listing standards and guidance |
| P-Q1 | Registered Producer | quality | Simple and efficient listing |
| P-Q2 | Registered Producer | quality | Minimal administrative effort |
| P-Q3 | Registered Producer | quality | Understandable validation feedback |
| A-G1 | Marketplace Admin | goal | Marketplace listing standards maintained |
| A-G2 | Marketplace Admin | goal | Unresolved verification cases reviewed |
| A-T1 | Marketplace Admin | task | Monitor listing compliance |
| A-T2 | Marketplace Admin | task | Maintain standards and guide producers |
| A-T3 | Marketplace Admin | task | Inspect unresolved verification evidence |
| A-T4 | Marketplace Admin | task | Record justified review decision |
| A-R1 | Marketplace Admin | resource | Published listing records |
| A-R2 | Marketplace Admin | resource | Listing standards and guidance |
| A-R3 | Marketplace Admin | resource | Exception case and supporting evidence |
| A-R4 | Marketplace Admin | resource | Recorded review decision |
| A-Q1 | Marketplace Admin | quality | Effective compliance management |
| A-Q2 | Marketplace Admin | quality | Reduced administrative workload |
| A-Q3 | Marketplace Admin | quality | Customer and producer confidence |
| M-G1 | Marketplace Platform | goal | Valid product listings published |
| M-G2 | Marketplace Platform | goal | Unavailable products excluded from new orders |
| M-G3 | Marketplace Platform | goal | Unavailable verification handled |
| M-G4 | Marketplace Platform | goal | Unresolved verification case reviewed |
| M-G5 | Marketplace Platform | goal | Corrected product information obtained |
| M-T1 | Marketplace Platform | task | Validate mandatory product information |
| M-T2 | Marketplace Platform | task | Check applicable organic certification |
| M-T3 | Marketplace Platform | task | Publish valid products and provide feedback |
| M-T4 | Marketplace Platform | task | Obtain result through verification retry |
| M-T5 | Marketplace Platform | task | Resolve case through authorised review |
| M-T6 | Marketplace Platform | task | Apply quantity and season updates |
| M-T7 | Marketplace Platform | task | Evaluate stock and seasonal rules |
| M-T8 | Marketplace Platform | task | Set and expose current availability |
| M-R1 | Marketplace Platform | resource | Submitted product information |
| M-R2 | Marketplace Platform | resource | Quantity and seasonal update records |
| M-R3 | Marketplace Platform | resource | Certification check outcome |
| M-R4 | Marketplace Platform | resource | Certification request and evidence |
| M-R5 | Marketplace Platform | resource | Validation and correction feedback |
| M-R6 | Marketplace Platform | resource | Unresolved verification case record |
| M-R7 | Marketplace Platform | resource | Published product and availability data |
| M-R8 | Marketplace Platform | resource | Stock and seasonal decision rules |
| M-R9 | Marketplace Platform | resource | Authorised review decision |
| M-Q1 | Marketplace Platform | quality | Reliable automated processing |
| M-Q2 | Marketplace Platform | quality | Efficient product management |
| M-Q3 | Marketplace Platform | quality | Minimal processing delays |
| V-G1 | Certification Verification Service | goal | Accurate verification outcomes supplied |
| V-T1 | Certification Verification Service | task | Receive and check request completeness |
| V-T2 | Certification Verification Service | task | Check organic certification evidence |
| V-T3 | Certification Verification Service | task | Return verified, rejected or error result |
| V-R1 | Certification Verification Service | resource | Certification request and evidence |
| V-R2 | Certification Verification Service | resource | Certification verification outcome |
| V-R3 | Certification Verification Service | resource | Simulated certification reference data |
| V-Q1 | Certification Verification Service | quality | Timely verification responses |
| V-Q2 | Certification Verification Service | quality | Reliable service availability |
| V-Q3 | Certification Verification Service | quality | Accurate verification processing |
| I-G1 | Individual Customer | goal | Suitable household products identified |
| I-T1 | Individual Customer | task | Browse product and availability information |
| I-T2 | Individual Customer | task | Compare products with household needs |
| I-T3 | Individual Customer | task | Review allergens and certification details |
| I-R1 | Individual Customer | resource | Published product and availability data |
| I-R2 | Individual Customer | resource | Household needs and spending plan |
| I-R3 | Individual Customer | resource | Published safety and certification details |
| I-Q1 | Individual Customer | quality | Trustworthy product listings |
| I-Q2 | Individual Customer | quality | Confidence in organic claims |
| I-Q3 | Individual Customer | quality | Reliable marketplace experience |
| I-G2 | Individual Customer | goal | Purchase payment outcome obtained |
| B-G1 | Restaurant / Cafe Buyer | goal | Suitable business ingredients identified |
| B-T1 | Restaurant / Cafe Buyer | task | Browse product and availability information |
| B-T2 | Restaurant / Cafe Buyer | task | Compare ingredients with menu requirements |
| B-T3 | Restaurant / Cafe Buyer | task | Review allergens and certification details |
| B-R1 | Restaurant / Cafe Buyer | resource | Published product and availability data |
| B-R2 | Restaurant / Cafe Buyer | resource | Menu and purchasing requirements |
| B-R3 | Restaurant / Cafe Buyer | resource | Published safety and certification details |
| B-Q1 | Restaurant / Cafe Buyer | quality | Trustworthy product listings |
| B-Q2 | Restaurant / Cafe Buyer | quality | Confidence in organic claims |
| B-Q3 | Restaurant / Cafe Buyer | quality | Reliable marketplace experience |
| B-G2 | Restaurant / Cafe Buyer | goal | Purchase payment outcome obtained |
| C-G1 | Community Organisation Buyer | goal | Suitable food for the group identified |
| C-T1 | Community Organisation Buyer | task | Browse product and availability information |
| C-T2 | Community Organisation Buyer | task | Compare products with group dietary needs |
| C-T3 | Community Organisation Buyer | task | Review allergens and certification details |
| C-R1 | Community Organisation Buyer | resource | Published product and availability data |
| C-R2 | Community Organisation Buyer | resource | Group dietary and purchasing requirements |
| C-R3 | Community Organisation Buyer | resource | Published safety and certification details |
| C-Q1 | Community Organisation Buyer | quality | Trustworthy product listings |
| C-Q2 | Community Organisation Buyer | quality | Confidence in organic claims |
| C-Q3 | Community Organisation Buyer | quality | Reliable marketplace experience |
| C-G2 | Community Organisation Buyer | goal | Purchase payment outcome obtained |
| M-G6 | Marketplace Platform | goal | Customer payment outcome communicated |
| M-G7 | Marketplace Platform | goal | Producer settlement allocations recorded |
| M-T9 | Marketplace Platform | task | Submit sandbox payment request |
| M-T10 | Marketplace Platform | task | Record and communicate payment result |
| M-T11 | Marketplace Platform | task | Calculate 5% commission and producer shares |
| M-T12 | Marketplace Platform | task | Prepare weekly settlement instructions |
| M-R10 | Marketplace Platform | resource | Valid sandbox payment request |
| M-R11 | Marketplace Platform | resource | Gateway payment outcome |
| M-R12 | Marketplace Platform | resource | Paid order lines and producer totals |
| M-R13 | Marketplace Platform | resource | Calculated producer allocation records |
| M-R14 | Marketplace Platform | resource | Producer transfer instructions |
| M-R15 | Marketplace Platform | resource | Settlement transfer outcome |
| M-R16 | Marketplace Platform | resource | Producer settlement statement |
| M-Q4 | Marketplace Platform | quality | Reliable payment feedback |
| M-Q5 | Marketplace Platform | quality | Transparent producer accounting |
| S-G1 | Payment Service | goal | Payment result returned |
| S-G2 | Payment Service | goal | Instructed transfers accounted for |
| S-T1 | Payment Service | task | Process sandbox payment request |
| S-T2 | Payment Service | task | Return success, decline or error outcome |
| S-T3 | Payment Service | task | Execute instructed test transfers |
| S-T4 | Payment Service | task | Return transfer status and reference |
| S-R1 | Payment Service | resource | Valid sandbox payment request |
| S-R2 | Payment Service | resource | Gateway payment outcome |
| S-R3 | Payment Service | resource | Producer transfer instructions |
| S-R4 | Payment Service | resource | Settlement transfer outcome |
| S-Q1 | Payment Service | quality | Reliable transaction outcomes |
| S-Q2 | Payment Service | quality | Auditable transfers |
| P-R5 | Registered Producer | resource | Producer settlement statement |

## Internal relationships

| Source | Relationship | Target |
|---|---|---|
| P-T1 | AND | P-G1 |
| P-T2 | AND | P-G1 |
| P-T3 | AND | P-G2 |
| P-T4 | AND | P-G2 |
| P-R1 | neededBy | P-T1 |
| P-R2 | neededBy | P-T2 |
| P-R3 | neededBy | P-T3 |
| P-R3 | neededBy | P-T4 |
| P-R4 | neededBy | P-T1 |
| P-T2 | Hurt | P-Q1 |
| P-T1 | Hurt | P-Q2 |
| P-T2 | Hurt | P-Q2 |
| P-Q3 | qualification | P-R2 |
| A-T1 | AND | A-G1 |
| A-T2 | AND | A-G1 |
| A-T3 | AND | A-G2 |
| A-T4 | AND | A-G2 |
| A-R1 | neededBy | A-T1 |
| A-R2 | neededBy | A-T2 |
| A-R3 | neededBy | A-T3 |
| A-R4 | neededBy | A-T4 |
| A-T1 | Help | A-Q1 |
| A-T3 | Hurt | A-Q2 |
| A-T4 | Help | A-Q3 |
| M-T1 | AND | M-G1 |
| M-T2 | AND | M-G1 |
| M-T3 | AND | M-G1 |
| M-T6 | AND | M-G2 |
| M-T7 | AND | M-G2 |
| M-T8 | AND | M-G2 |
| M-T4 | OR | M-G3 |
| M-T5 | OR | M-G3 |
| M-R1 | neededBy | M-T1 |
| M-R3 | neededBy | M-T2 |
| M-R4 | neededBy | M-T2 |
| M-R6 | neededBy | M-T4 |
| M-R9 | neededBy | M-T5 |
| M-R2 | neededBy | M-T6 |
| M-R8 | neededBy | M-T7 |
| M-R7 | neededBy | M-T8 |
| M-T1 | Help | M-Q1 |
| M-T2 | Help | M-Q1 |
| M-T3 | Help | M-Q2 |
| M-T4 | Help | M-Q1 |
| M-T4 | Hurt | M-Q3 |
| M-T5 | Help | M-Q1 |
| M-T5 | Hurt | M-Q3 |
| M-T6 | Help | M-Q2 |
| M-T7 | Help | M-Q1 |
| M-T8 | Help | M-Q3 |
| V-T1 | AND | V-G1 |
| V-T2 | AND | V-G1 |
| V-T3 | AND | V-G1 |
| V-R1 | neededBy | V-T1 |
| V-R3 | neededBy | V-T2 |
| V-R2 | neededBy | V-T3 |
| V-T3 | Help | V-Q1 |
| V-T1 | Help | V-Q2 |
| V-T2 | Help | V-Q3 |
| I-T1 | AND | I-G1 |
| I-T2 | AND | I-G1 |
| I-T3 | AND | I-G1 |
| I-R1 | neededBy | I-T1 |
| I-R2 | neededBy | I-T2 |
| I-R3 | neededBy | I-T3 |
| I-T1 | Help | I-Q1 |
| I-T2 | Help | I-Q3 |
| I-T3 | Help | I-Q2 |
| B-T1 | AND | B-G1 |
| B-T2 | AND | B-G1 |
| B-T3 | AND | B-G1 |
| B-R1 | neededBy | B-T1 |
| B-R2 | neededBy | B-T2 |
| B-R3 | neededBy | B-T3 |
| B-T1 | Help | B-Q1 |
| B-T2 | Help | B-Q3 |
| B-T3 | Help | B-Q2 |
| C-T1 | AND | C-G1 |
| C-T2 | AND | C-G1 |
| C-T3 | AND | C-G1 |
| C-R1 | neededBy | C-T1 |
| C-R2 | neededBy | C-T2 |
| C-R3 | neededBy | C-T3 |
| C-T1 | Help | C-Q1 |
| C-T2 | Help | C-Q3 |
| C-T3 | Help | C-Q2 |
| M-T9 | AND | M-G6 |
| M-T10 | AND | M-G6 |
| M-T11 | AND | M-G7 |
| M-T12 | AND | M-G7 |
| M-R10 | neededBy | M-T9 |
| M-R11 | neededBy | M-T10 |
| M-R12 | neededBy | M-T11 |
| M-R13 | neededBy | M-T12 |
| M-T10 | Help | M-Q4 |
| M-T11 | Help | M-Q5 |
| M-T12 | Help | M-Q5 |
| S-T1 | AND | S-G1 |
| S-T2 | AND | S-G1 |
| S-T3 | AND | S-G2 |
| S-T4 | AND | S-G2 |
| S-R1 | neededBy | S-T1 |
| S-R2 | neededBy | S-T2 |
| S-R3 | neededBy | S-T3 |
| S-R4 | neededBy | S-T4 |
| S-T2 | Help | S-Q1 |
| S-T4 | Help | S-Q2 |

## Dependencies

| ID | Depender element | Dependum | Dependee element | Scope |
|---|---|---|---|---|
| D01 | P-G3 | goal: Valid products published | M-G1 | UC1 |
| D02 | P-R2 | resource: Validation and correction feedback | M-R5 | UC1 |
| D03 | M-R1 | resource: Accurate submitted product information | P-R1 | UC1 |
| D04 | M-R2 | resource: Stock and seasonal update records | P-R3 | UC1 |
| D05 | M-R3 | resource: Certification verification outcome | V-R2 | UC1 |
| D06 | V-R1 | resource: Certification request and evidence | M-R4 | UC1 |
| D07 | M-G4 | goal: Unresolved verification case reviewed | A-G2 | PROPOSED |
| D08 | A-R3 | resource: Exception case and supporting evidence | M-R6 | PROPOSED |
| D10 | A-R1 | resource: Listing records for compliance review | M-R7 | UC1 |
| D11 | M-G5 | goal: Corrected product information supplied | P-G1 | UC1 |
| D12 | M-R9 | resource: Authorised review decision | A-R4 | PROPOSED |
| D13 | P-R4 | resource: Listing standards and guidance | A-R2 | UC1 |
| D-BUY-I | I-R1 | resource: Individual Customer product information | M-R7 | UC1 |
| D-SAFE-I | I-R3 | resource: Individual Customer safety and certification data | M-R7 | UC1 |
| D-BUY-B | B-R1 | resource: Restaurant / Cafe Buyer product information | M-R7 | UC1 |
| D-SAFE-B | B-R3 | resource: Restaurant / Cafe Buyer safety and certification data | M-R7 | UC1 |
| D-BUY-C | C-R1 | resource: Community Organisation Buyer product information | M-R7 | UC1 |
| D-SAFE-C | C-R3 | resource: Community Organisation Buyer safety and certification data | M-R7 | UC1 |
| D-PAY-I | I-G2 | goal: Individual Customer payment outcome | M-G6 | CONTEXT |
| D-PAY-B | B-G2 | goal: Restaurant / Cafe Buyer payment outcome | M-G6 | CONTEXT |
| D-PAY-C | C-G2 | goal: Community Organisation Buyer payment outcome | M-G6 | CONTEXT |
| D-PAY-REQUEST | S-R1 | resource: Sandbox payment request | M-R10 | CONTEXT |
| D-PAY-RESULT | M-R11 | resource: Gateway payment outcome | S-R2 | CONTEXT |
| D-TRANSFER-IN | S-R3 | resource: Producer transfer instructions | M-R14 | CONTEXT |
| D-TRANSFER-OUT | M-R15 | resource: Settlement transfer outcome | S-R4 | CONTEXT |
| D-STATEMENT | P-R5 | resource: Producer settlement statement | M-R16 | CONTEXT |
