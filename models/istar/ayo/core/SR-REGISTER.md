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
| K-G1 | Customer | goal | Suitable available products identified |
| K-T1 | Customer | task | Browse product and availability information |
| K-T2 | Customer | task | Compare products with purchasing needs |
| K-T3 | Customer | task | Review allergens and certification details |
| K-R1 | Customer | resource | Published product and availability data |
| K-R2 | Customer | resource | Purchasing and dietary requirements |
| K-R3 | Customer | resource | Published safety and certification details |
| K-Q1 | Customer | quality | Trustworthy product listings |
| K-Q2 | Customer | quality | Confidence in organic claims |
| K-Q3 | Customer | quality | Reliable marketplace experience |
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
| K-T1 | AND | K-G1 |
| K-T2 | AND | K-G1 |
| K-T3 | AND | K-G1 |
| K-R1 | neededBy | K-T1 |
| K-R2 | neededBy | K-T2 |
| K-R3 | neededBy | K-T3 |
| K-T1 | Help | K-Q1 |
| K-T2 | Help | K-Q3 |
| K-T3 | Help | K-Q2 |
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
| D09 | K-R1 | resource: Published product and availability data | M-R7 | UC1 |
| D10 | A-R1 | resource: Listing records for compliance review | M-R7 | UC1 |
| D11 | M-G5 | goal: Corrected product information supplied | P-G1 | UC1 |
| D12 | M-R9 | resource: Authorised review decision | A-R4 | PROPOSED |
| D13 | P-R4 | resource: Listing standards and guidance | A-R2 | UC1 |
| D14 | K-R3 | resource: Published safety and certification data | M-R7 | UC1 |
