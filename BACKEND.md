# Backend Work Split (2 People)

Goal:

- No overlap
- Parallel work
- Fast integration

Split:

- **Kardam** → Core Logic Engine (Brain)
- **Asu** → API + Server + Integration (Body)

---

## Ownership Map (No Overlap)

### Kardam owns (core logic)

Work only in:

- `backend/src/services/`
- `backend/src/utils/`
- `backend/src/data/`

Primary files:

- `backend/src/data/streamSimulator.js`
- `backend/src/utils/calculateCPI.js`
- `backend/src/services/predictionService.js`
- `backend/src/services/classificationService.js`
- `backend/src/services/engine.js`

### Asu owns (server + API)

Work only in:

- `backend/src/controllers/`
- `backend/src/routes/`
- `backend/src/index.js`

Primary files:

- `backend/src/index.js`
- `backend/src/routes/liveRoutes.js`
- `backend/src/controllers/liveController.js`
- `backend/src/controllers/ackController.js`

---

## Kardam Tasks (Core Logic)

### 1) Data streaming engine

File: `backend/src/data/streamSimulator.js`

Requirements:

- Read CSV (from `dataset/` as agreed)
- Emit **1 row per second**
- Provide a clean way for the API layer to fetch the **latest row**

### 2) CPI calculation

File: `backend/src/utils/calculateCPI.js`

Contract:

```js
function calculateCPI(entry, exit, width) {
  const imbalance = entry - exit;
  return imbalance / width;
}
```

### 3) Prediction logic

File: `backend/src/services/predictionService.js`

Rule (baseline):

- If `imbalance > threshold` for the last **3–5** steps, return:

```js
{ risk: "HIGH", crush_in: 8-12 }
```

### 4) Surge vs Crush classifier

File: `backend/src/services/classificationService.js`

Rules (baseline):

- Continuous rise → `CRUSH_BUILDUP`
- Spike then drop → `SURGE`

### 5) Main engine combiner

File: `backend/src/services/engine.js`

Responsibilities:

- Take current row (and any short history buffer)
- Compute CPI + risk + crush estimate + density + status
- Return the **final JSON** (see integration contract below)

Final output shape (must be stable):

```json
{
  "cpi": 0.82,
  "risk": "HIGH",
  "crush_in": 9,
  "density": 4.1,
  "status": "CRUSH_BUILDUP"
}
```

---

## Asu Tasks (API + Server + Integration)

### 1) Express server setup

File: `backend/src/index.js`

Responsibilities:

- Start Express server
- Mount routes
- Configure CORS/JSON middleware as needed for mobile app

### 2) API routes

File: `backend/src/routes/liveRoutes.js`

Routes:

- `GET /live`
- `GET /alert`
- `POST /ack`

### 3) Controller logic

File: `backend/src/controllers/liveController.js`

Responsibilities:

- Call Kardam’s engine contract (`getCurrentState()`)
- Return JSON response to frontend/mobile

### 4) Acknowledgement system

File: `backend/src/controllers/ackController.js`

Track:

- Alert time
- Response time
- (Optional) Store in-memory first; persist later if needed

### 5) Connect stream → API

Responsibilities:

- Fetch current/latest row from stream simulator
- Pass into engine
- Serve the engine output through the API

---

## Integration Contract (Critical)

Single stable call that the API layer uses:

```js
getCurrentState() // returns:
// { cpi, risk, crush_in, density, status }
```

Rules:

- **Kardam** implements `getCurrentState()` and guarantees output shape.
- **Asu** treats it as a black box and only consumes the output.
- Do not change keys, types, or naming without syncing first.

End-to-end flow:

`streamSimulator → engine (Kardam) → API (Asu) → Mobile App`

---

## Parallel Workflow

### First 2–3 hours

- Kardam: `calculateCPI` + prediction + engine (mocked inputs ok)
- Asu: Express server + `/live` route with mocked response

### Next 3–5 hours

- Kardam: connect dataset → stream → engine output
- Asu: replace mock with real `getCurrentState()` output

### Final phase

- Integrate fully
- Test with Postman + mobile app

---

## Rules to Avoid Chaos

Don’t:

- Edit each other’s owned files/directories
- Change the output JSON shape randomly

Do:

- Lock the output JSON shape early
- Keep changes small and integrate frequently

