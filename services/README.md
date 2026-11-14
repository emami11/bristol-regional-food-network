# BRFN Services

Job workers and a simulated organic certification service for F1 and F2.
Rules and variable names: [docs/requirements/business-rules-and-variables.md](../docs/requirements/business-rules-and-variables.md).

## Runnable F1/F2 demo

With Camunda 8 Run running on HTTP **8095** and gRPC **26500**:

```powershell
cd services
npm ci
npm run demo
```

Open [the token viewer](http://127.0.0.1:8790/). The demo deploys both [executable BPMNs, DMN and forms](../bpmn/operational/ayo/README.md), starts all workers and the certificate mock, and provides stock-message controls. Run this instead of the separate `mock` and `workers` commands below. Local Tasklist/Operate login: `demo` / `demo`.

For Camunda 8 Run **8.10.9**, extract the official Windows archive to a folder without spaces, then run:

```powershell
.\c8run.exe start --detached --no-browser --disable-connectors --port 8095
```

The archive includes its Java runtime. In this workspace it has already been started using the short Windows path because the parent folder contains spaces.

Optional local settings: `BRFN_GRPC_ADDRESS` (default `127.0.0.1:26500`), `BRFN_REST_ADDRESS` (default `http://127.0.0.1:8095`), `BRFN_ENGINE_USERNAME` / `BRFN_ENGINE_PASSWORD` (default `demo`), and `BRFN_DEMO_PORT` (default `8790`). The demo's gRPC connection uses local unauthenticated Camunda 8 Run; the separate worker runner below supports the existing SaaS `.env` configuration. Viewer Tasklist/Operate links use the default HTTP port.

```powershell
npm test             # 26 unit tests
npm run test:tokens  # 4 checks of the actual token-simulation library against the BPMN files
npm run test:engine  # real engine scenarios; requires npm run demo in another terminal
```

The integration checks create sample products, complete real tasks and cancel their remaining test instances afterwards. They do not send email. Evidence is written to ignored `data/engine-test-results.json`. The catalogue and duplicate-order ledger persist under ignored `data/`; use one demo runner at a time.

The viewer bundle builds from `src/demo/simulation.js` into ignored `public/operational-assets/`. No generated bundle or local engine binaries are committed.

| Part | File | What it does |
|---|---|---|
| Rules | `src/rules/productRules.js` | Validation rules V1–V12 and how certificate answers are read (no Camunda code) |
| Workers | `src/workers/handlers.js` | `validate-product` and `verify-certificate` job handlers |
| Worker runner | `src/index.js` | Connects to Camunda 8 and starts both workers |
| Simulated service | `src/cert-mock/server.js` | Small web service with five made-up certificates and an outage switch |
| Tests | `test/`, `integration/` | Unit tests and real Camunda execution scenarios |

## Run it

Needs Node.js 20 or newer (`node --version`).

```powershell
cd services
npm install
copy .env.example .env      # then fill in .env (see below)
npm test                    # should say: pass 26, fail 0
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
