# Journal Platform (Reflect)

A production-grade, full-stack diary and analytical journaling application engineered for low-latency client interactions, strict data isolation, and comprehensive insight calculations. The platform leverages modern serverless primitives alongside robust, isolated execution environments to guarantee performance and security at scale.

🚀 [Live Production Deployment](https://reflect-journalapp.vercel.app)

---

## 🛠️ System Architecture & Tech Stack

- **Application Core:** Next.js 16 (App Router) utilizing the Turbopack compilation engine. Built entirely on Next.js Server Actions for secure, form-driven state transitions without exposed REST endpoints.
- **Database & ORM:** PostgreSQL hosted on Neon's serverless compute framework. Interfaced via Prisma v7 using an environment-isolated, configuration-driven data tier.
- **Identity Management:** NextAuth.js backed by Google OAuth 2.0 protocol validation and cryptographically signed server-side sessions.
- **UI/UX Framework:** TailwindCSS utilizing fluid layout utilities, responsive design systems, and strict layout-shift mitigation techniques.
- **State Management:** Zustand for high-performance, decoupled client-side global state coordination, tracking global application view states and filtering parameters without the execution overhead of React Context providers.

---

## 💎 Core Platform Capabilities

Based on verified integration matrices, the platform handles complex, multi-layered workflows across its lifecycles:

- **Rich Entry Operations:** Complete CRUD orchestration supporting titles, contents, granular mood profiles, and dynamic tag matrices.
- **Deep Memory Modifications:** Advanced mutation handling that processes deep state differentials when editing existing journal history without polluting legacy references.
- **Analytical Insights Engine:** Decoupled business logic that tracks journal entries over time, running isolated computational logic to map emotional metrics, word frequency, and historical tracking stats.
- **Global User Preferences:** Dynamic configuration contexts allowing users to tailor UI layers, notification matrices, and personal privacy flags.

---

## 🔄 Database Infrastructure & Topography (Prisma v7)

To bypass the typical connection constraints inherent to serverless execution spikes, the application explicitly decouples runtime database access from administrative schema management via `prisma.config.ts`:

- **Application Runtime Proxy (`DATABASE_URL`):** Utilizes Neon's transaction-mode connection pooler channel (via PgBouncer settings) to automatically absorb sudden serverless compute scale-outs.
- **Administrative CLI Pipeline (`DIRECT_URL`):** Establishes an unpooled direct connection route reserved strictly for structural database transformations, avoiding pool-lock engine faults during schema shifts.
- **Local Sandboxing:** Operates entirely within an isolated local PostgreSQL container context, ensuring structural mutations during prototyping never touch live production pools.

---

## 🧪 Testing Matrix & Directory Mapping

The application splits quality assurance workflows across distinct processing boundaries based on execution cost and environmental needs. Here is exactly where every file lives, what it handles, and where its execution results output:

```text
journal-platform/
├── e2e/                             # 🌐 Playwright E2E Runner Scope
│   └── journal.spec.ts              # Core Platform E2E (Full-stack browser testing)
└── src/                             # 🧪 Vitest Runner Scope (JSDOM Environment)
    ├── actions/
    │   └── __tests__/
    │       ├── data-management.test.ts # System purge/export mutations
    │       ├── journal-entries.test.ts # Entry creation and modification logic
    │       └── user-preferences.test.ts# Global setting alteration pipelines
    ├── components/
    │   └── modals/
    │       └── __tests__/
    │           └── EntryModal.test.tsx # UI Component Integration & Workflows
    └── lib/
        └── stats/
            └── calculations.test.ts # Analytics Engine & Statistics Logic
```

Below are the verified execution results copied directly from the development and continuous integration environments.

### 1. Unit & Integration Suite (Vitest)

Run via terminal: `npm run test`

```text
 RUN  v4.1.8 D:/Projects/Programming/Web Development/journal-platform/journal-web

 ✓ src/actions/__tests__/data-management.test.ts (6 tests) 10ms
 ✓ src/actions/__tests__/journal-entries.test.ts (11 tests) 17ms
 ✓ src/actions/__tests__/user-preferences.test.ts (3 tests) 5ms
 ✓ src/lib/stats/calculations.test.ts (4 tests) 5ms
stdout | src/components/modals/__tests__/EntryModal.test.tsx > EntryModal Component Integration Suite > Form Validation and User Workflows > should process structural parameter payloads correctly for new creations
Updating entry with data: {
  title: 'Morning Runs',
  content: 'Cardio conditioning routines completed early.',
  mood: 'excited',
  tags: []
}

stdout | src/components/modals/__tests__/EntryModal.test.tsx > EntryModal Component Integration Suite > Form Validation and User Workflows > should dispatch deep modifications to update actions when editing an existing memory
Updating entry with data: {
  title: 'New Fixed Title',
  content: 'Old Content',
  mood: 'sad',
  tags: []
}

 ✓ src/components/modals/__tests__/EntryModal.test.tsx (7 tests) 220ms

 Test Files  5 passed (5)
      Tests  31 passed (31)
   Start at  13:45:28
   Duration  54.72s (transform 3.01s, setup 0ms, import 11.96s, tests 256ms, environment 134.66s)
```

### 2. Full-Stack End-to-End Suite (Playwright)

```text
Running 4 tests using 2 workers

[WebServer]  GET /login 200 in 2.5s (next.js: 2.4s, application-code: 123ms)
[WebServer]  GET /api/auth/signin 200 in 2.7s (next.js: 2.7s, application-code: 31ms)
[WebServer]  POST /api/auth/callback/credentials 302 in 31ms
[WebServer]  GET / 200 in 581ms

[WebServer]  POST / 200 in 156ms
[WebServer]   └─ ƒ createJournalEntry({"content":"Writing data layers directly to database via Playwright browser interaction.","mood":"excited","tags":["playwright-automation"]}) in 41ms src/actions/journal-entries.ts

[WebServer]  POST / 200 in 42ms
[WebServer]   └─ ƒ fetchUserTags() in 24ms src/actions/journal-entries.ts

  4 passed (1.6m)
```
