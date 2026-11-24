# BRFN Services

Job workers and a simulated organic certification service for F1 (Product Listing and Validation), F1a (Verify Organic Certification) and F2 (Inventory and Seasonal Availability).

| Part | File | What it does |
|---|---|---|
| Rules | `src/rules/productRules.js` | F1 validation rules and how certificate answers are read (no Camunda code) |
| Check workers | `src/workers/handlers.js` | `validate-product` and `verify-certificate` |
| Listing workers | `src/workers/listingWorkers.js` | `save-draft-listing`, `publish-product`, `archieve-listing` |
| Listing store | `src/store/listings.js` | Simulated in-memory store of listings (DRAFT, PUBLISHED, ARCHIVED); replaced by a database in Task 2 |
| F2 worker | `src/workers/loadProduct.js` | `load-product` |
| Worker runner | `src/index.js` | Connects to Camunda 8 and starts the workers |
| Simulated service | `src/cert-mock/server.js` | Small web service with five made-up certificates and an outage switch |
| Tests | `test/` | `npm test` runs them all |

## Run it

Needs Node.js 20 or newer (`node --version`).

```powershell
cd services
npm install
copy .env.example .env      # then fill in .env (see below)
npm test                    # every test should pass
```

Then, in two terminals:

```powershell
npm run mock       # terminal 1: simulated certification service on http://localhost:4010
npm run workers    # terminal 2: connects to Camunda and waits for jobs
```

### Filling in .env

- **Camunda 8 SaaS:** in Camunda Console, open your cluster → **API** → **Create new client**, tick **Zeebe**, and copy the values it shows into `.env`.
- **Camunda 8 Run on your laptop:** use the commented-out local block in `.env.example` instead.

Never commit `.env`; it holds your client secret. It's in `.gitignore`.

## What the model and workers agree on

### Job types

| Job type | Model element | Reads | Writes |
|---|---|---|---|
| `save-draft-listing` | F1 *Save draft listing* | the submission form fields, `listingId` on a resubmission | `listingId`, `listingStatus` = `DRAFT` |
| `validate-product` | F1 *Validate product details* | the submission form fields | `isValid`, `validationErrors` (list of messages), `validationFields` |
| `verify-certificate` | F1a *Request certificate verification* | `organicClaimed`, `certNumber`, `certBody` | `certVerified`, `certReason`, `certStatus`, `certCheckedAt` |
| `publish-product` | F1 *Publish product listing* | `listingId`, `availability` (from the DMN) | `listingStatus` = `PUBLISHED`, `productId`, `availabilityStatus`, `ordersOpen`, `publishedAt` |
| `archieve-listing` | F1 *Archive draft listing* | `listingId` | `listingStatus` = `ARCHIVED`, `archivedAt` |
| `load-product` | F2 *Load product listing* | `productId` | product fields, `quantity` |

`archive-listing` is also registered, so correcting the spelling in the model doesn't break anything.

`notify-producer` (F1 send tasks, F2a) and `record-verification-audit` (F1a) are not in this folder yet.

### Errors

| Error code | Thrown by | Caught by |
|---|---|---|
| `CERT_SERVICE_UNAVAILABLE` | `verify-certificate`, after 3 failed attempts | F1a *Service Unavailable* → *Review certificate manually* |

### Form field keys

`validate-product` reads the keys of `camunda/forms/product-submission.form`: `productName`, `description`, `category`, `price`, `unit`, `quantity`, `seasonStart`, `seasonEnd`, `farmOrigin`, `farmPostcode`, `harvestDate`, `bestBefore`, `containsAllergens`, `allergens`, `organicClaimed`, `certBody`, `certNumber`, `certExpiry`. The correction form shows `validationErrors` and `certReason`.

## Validation rules (`validate-product`)

All problems are reported at once, so the producer can fix everything in one go.

- Product name 3–80 characters; description up to 1000 characters.
- Category, unit and certification body must be one of the form's options.
- Price above £0.00 with at most 2 decimal places; quantity a whole number, 0 or more.
- Farm name required; farm postcode must be a valid UK postcode.
- All four dates must be real dates. Season end on or after season start. Harvest date not in the future. Best-before after the harvest date and not already passed.
- If the product contains allergens, at least one of the 14 must be ticked.
- If organic is claimed: certification body, certificate number and an unexpired certificate expiry date are required.

## Test the outage path

Start the mock already down: set `CERT_MOCK_DOWN=true` in `.env` and restart `npm run mock`. Or switch it while running:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:4010/admin/outage -ContentType 'application/json' -Body '{"down": true}'
```

The worker tries 3 times, 1 second apart, then throws `CERT_SERVICE_UNAVAILABLE`.

## Test certificates (made up)

| `certNumber` | Certification body on the form | Result |
|---|---|---|
| `BOS-1001` | Soil Association | Valid |
| `BOS-1002` | Organic Farmers & Growers | Valid |
| `WCO-3002` | Organic Food Federation | Valid |
| `BOS-2001` | Soil Association | Expired |
| `WCO-3001` | Organic Food Federation | Revoked |
| any valid number with a different body | | Body mismatch |
| anything else | | Not found |

## Use of generative AI

This code was written with AI assistance (Claude), then reviewed and tested by the group. Every function is commented so any group member can explain it.
