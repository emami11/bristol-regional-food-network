# BRFN Services

Job workers and a simulated organic certification service for F1 (Product Listing and Validation).
Rules and variable names: [docs/requirements/business-rules-and-variables.md](../docs/requirements/business-rules-and-variables.md).

| Part | File | What it does |
|---|---|---|
| Rules | `src/rules/productRules.js` | Validation rules V1–V12 and how certificate answers are read (no Camunda code) |
| Workers | `src/workers/handlers.js` | `validate-product` and `verify-certificate` job handlers |
| Worker runner | `src/index.js` | Connects to Camunda 8 and starts both workers |
| Simulated service | `src/cert-mock/server.js` | Small web service with five made-up certificates and an outage switch |
| Tests | `test/` | 18 tests for the rules, the workers and the mock |

## Run it

Needs Node.js 20 or newer (`node --version`).

```powershell
cd services
npm install
copy .env.example .env      # then fill in .env (see below)
npm test                    # should say: pass 18, fail 0
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

## Connect it to the model

In Camunda Modeler, on each service task set **Task definition → Job type** to:

- `validate-product`
- `verify-certificate`

For the outage path, the error boundary event on the certificate task needs a global error with **error code `CERT_SERVICE_DOWN`**.

## Test the outage path

Start the mock already down: set `CERT_MOCK_DOWN=true` in `.env` and restart `npm run mock`. Or switch it while running:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:4010/admin/outage -ContentType 'application/json' -Body '{"down": true}'
```

The worker tries 3 times, 1 second apart, then throws `CERT_SERVICE_DOWN`.

## Test certificates (made up)

| `certNumber` | Result |
|---|---|
| `BOS-1001`, `BOS-1002`, `WCO-3002` | Valid |
| `BOS-2001` | Expired |
| `WCO-3001` | Revoked |
| anything else | Not found |

## Use of generative AI

This code was written with AI assistance (Claude), then reviewed and tested by the group. Every function is commented so any group member can explain it.
