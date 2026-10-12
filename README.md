# ClaimSmart

**Should you pay for that dent yourself, or file a motor insurance claim?**

ClaimSmart is a full-stack **MERN** app for Indian car owners. Pick your car, tick what's damaged (and
edit the prices to match your garage's quote), enter your policy details — it runs the IRDAI No-Claim
Bonus (NCB) maths and tells you which path costs less. Log in and every check is saved to your history.

Filing a claim resets your NCB to 0%, which means a higher premium *every year after*, not just once. For
minor damage that hidden future cost is often bigger than the repair bill. ClaimSmart makes the trade-off
visible: repair cost vs. deductible + next year's premium hike.

## Features

- **JWT authentication** — register / login, bcrypt-hashed passwords, protected routes on both the API and the React app.
- **Saved check history** — each check (car, damaged parts, prices, policy inputs, verdict) is stored per user; list, re-open, delete one, or clear all.
- **Editable part prices** — every damage type comes with a typical garage price for the selected car; override any of them with a real quote.
- **Real NCB maths** — reverse-calculates base premium, projects next year's slab, computes premium loss (slabs: 0/20/25/35/45/50%).
- **Verdict + chart** — clear recommendation with exact rupee savings, a stacked comparison chart (Recharts), and an expandable full calculation.
- **DIY suggestions** — when skipping the claim is smarter and the damage is cosmetic, suggests DIY fixes instead of a garage visit.
- **Guests welcome** — the calculator works without an account; logging in just adds saving.

## Tech stack

| Layer    | Tech                                                                 |
| -------- | -------------------------------------------------------------------- |
| Frontend | React 18, Vite, React Router, Tailwind CSS, Recharts, Lucide icons   |
| Backend  | Node.js, Express                                                     |
| Database | MongoDB + Mongoose                                                   |
| Auth     | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`                         |

## Project structure

```
claimsmart/
├── client/                      # React (Vite) app
│   └── src/
│       ├── api/client.js        # every HTTP call + token storage
│       ├── context/AuthContext  # login / register / logout state
│       ├── pages/               # Home, Calculator, Login, Register, History, HistoryDetail
│       └── components/          # layout, auth, landing, calculator, history
└── server/                      # Express API
    ├── api/index.js             # Vercel serverless entry
    └── src/
        ├── app.js, index.js     # Express app / local server start
        ├── config/              # env + cached MongoDB connection
        ├── models/              # User, CarDamageCost, VehicleCheck
        ├── controllers/         # auth, cars, calculate, history
        ├── routes/, middleware/ # routing, JWT guards, error handling
        ├── utils/               # calculations (pure), validators (pure), JWT, payload builders
        ├── data/                # parts catalogue, 22 car models, DIY products
        └── seed/                # catalogue seeding
```

## API

| Method | Endpoint             | Auth      | Description                                              |
| ------ | -------------------- | --------- | -------------------------------------------------------- |
| POST   | `/api/auth/register` | –         | Create account → `{ token, user }`                       |
| POST   | `/api/auth/login`    | –         | Log in → `{ token, user }`                               |
| GET    | `/api/auth/me`       | required  | Current user                                             |
| GET    | `/api/cars`          | –         | Car catalogue with part prices, NCB slabs, deductible    |
| POST   | `/api/calculate`     | optional  | Run the verdict. Saved to history if a valid JWT is sent |
| GET    | `/api/history`       | required  | Your past checks, newest first                           |
| GET    | `/api/history/:id`   | required  | One saved check (same shape as `/api/calculate`)         |
| DELETE | `/api/history/:id`   | required  | Delete one check                                         |
| DELETE | `/api/history`       | required  | Delete all your checks                                   |

`POST /api/calculate` body:

```json
{
  "carId": "<CarDamageCost _id>",
  "selectedParts": [{ "partName": "Front Bumper – Dent/Crack", "estimatedCost": 10500 }],
  "currentPremium": 14000,
  "currentNCB": 25
}
```

Send the token as `Authorization: Bearer <jwt>`.

## Running locally

**Prerequisites:** Node.js 18+ and a MongoDB database. The easiest option is a free
[MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local `mongod`).

```bash
# 1. install everything (root + server + client)
npm run install:all

# 2. configure the server
#    copy server/.env.example to server/.env, then fill in MONGO_URI and JWT_SECRET

# 3. start API (http://localhost:5001) and React app (http://localhost:5173) together
npm run dev
```

The car catalogue is seeded automatically on first start. After changing prices in
`server/src/data/partsCatalog.js`, refresh the database with `npm run seed`.

Sanity-check the database-free logic (decision engine, validators, payload builder, catalogue):

```bash
npm run verify
```

## Deploying

Three pieces: MongoDB Atlas, the API, and the React app.

1. **MongoDB Atlas** — create a free cluster, add a database user, and under *Network Access* allow `0.0.0.0/0`
   (serverless hosts have no fixed IP). Copy the connection string.
2. **API** — import the repo on Vercel with **Root Directory = `server`** (`server/vercel.json` + `server/api/index.js`
   are already set up), or host it on Render / Railway as a normal Node service (`npm start`). Set env vars:
   `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL, no trailing slash).
3. **React app** — import the repo again on Vercel with **Root Directory = `client`**. Set
   `VITE_API_URL=https://<your-api-domain>/api`. `client/vercel.json` handles SPA routing.

Then update the API's `CLIENT_URL` to the final frontend URL and redeploy it (it's the CORS allow-list).

## The maths

```
Base Premium         = Current Premium / (1 − Current NCB / 100)
Next NCB             = next slab in [0, 20, 25, 35, 45, 50], capped at 50%
Premium if claim     = Base Premium × (1 − 0 / 100)
Premium if no claim  = Base Premium × (1 − Next NCB / 100)
Premium Loss         = Premium if claim − Premium if no claim

Cost of not claiming = Local repair cost
Cost of claiming     = ₹1,000 deductible + Premium Loss
→ "Pay out-of-pocket" if the repair cost is lower, otherwise "File the claim"
```

## Security notes

- Passwords are hashed with bcrypt and excluded from queries by default (`select: false`).
- Login errors are deliberately generic, so the API doesn't reveal which emails are registered.
- History endpoints always filter by the authenticated user's id — you can't read or delete someone else's check by guessing an id.
- The server validates every request (part names must exist for that car, costs/premium must be sane numbers) and CORS is an allow-list.
- The JWT is kept in `localStorage` for simplicity. For a production app, an `httpOnly` cookie is the stronger choice (it isn't readable by injected scripts), at the cost of CSRF handling.

## Disclaimer

Repair costs are illustrative local-garage estimates, not authorised service-centre price lists — always confirm
with your garage or insurer. ClaimSmart is a portfolio project and isn't affiliated with any insurer or IRDAI.
