# Journal Platform (Reflect)

A full-stack, personal journaling and analytics application built for speed, security, and clean data isolation. It leverages a modern serverless architecture to ensure snappy client interactions and safe database operations.

🚀 [Live Production Deployment](https://reflect-journalapp.vercel.app)

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router) with Turbopack. Powered entirely by Next.js Server Actions for secure, form-driven state changes without the need to expose traditional REST endpoints.
- **Database & ORM:** Serverless PostgreSQL hosted on Neon, paired with Prisma v7 for type-safe database queries.
- **Authentication:** NextAuth.js configured with Google OAuth 2.0 and secure server-side sessions.
- **Styling:** TailwindCSS for responsive layouts, utility-first styling, and optimized rendering to prevent layout shifts.
- **State Management:** Zustand for lightweight client-side state management, handling UI views and search filters without the re-render overhead of React Context.

---

## 💎 Key Features

The app handles complex, multi-layered data workflows seamlessly across the user lifecycle:

- **Full CRUD Journaling:** Easily manage entries with titles, markdown content, mood selectors, and dynamic tags.
- **Optimized Editing:** Smooth mutation handling that accurately updates state differentials when editing old entries, ensuring history updates cleanly without reference bugs.
- **Analytics Engine:** Behind-the-scenes business logic that parses journal data over time to compute mood metrics, word frequencies, and historical trends.
- **User Settings:** Global configuration toggles for customizing UI layers, privacy flags, and personal preferences.

---

## 🔄 Database & Connection Pooling (Prisma v7)

To prevent serverless functions from exhausting database connections during high traffic, the app splits runtime access and schema management inside `prisma.config.ts`:

- **App Runtime (`DATABASE_URL`):** Connects via Neon's transaction-mode pooler (PgBouncer) to easily handle sudden serverless scale-outs.
- **Migrations & CLI (`DIRECT_URL`):** A direct, unpooled connection reserved strictly for running database migrations, preventing pool-lock errors.
- **Local Development:** Runs against a local PostgreSQL database to keep prototyping safe and isolated from production data.

---

## 🧪 Testing Setup & File Structure

The test suite is split between lightweight unit/integration tests and full full-stack end-to-end flows. Here is a breakdown of where tests live and how they run:

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

Run locally or via CI pipelines:

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
