# Logbook — Tech Stack and System Design

> **Project name:** Logbook *(working title; subject to change)*  
> **Document type:** Combined Tech Stack and System Design  
> **Status:** Draft 1.0  
> **Purpose:** Define the initial technical direction for the Logbook MVP and provide enough context for implementation by a developer or coding agent.

---

# 1. System Overview

Logbook is a cross-platform mobile fitness application focused on fast, simple, and reliable workout and nutrition logging.

The MVP will include:

- Workout logging
- Workout routines
- Exercise tracking
- Custom exercises
- Nutrition logging
- Calorie and macronutrient tracking
- Barcode scanning
- Custom food creation
- Body-weight tracking
- Basic progress history

The MVP will **not** include AI coaching, smart progression, recovery suggestions, or other premium intelligence features.

The system should be designed so those features can be added later without requiring a complete architectural rewrite.

---

# 2. Architectural Goals

The system must prioritize:

1. **Offline-first logging**
   - Users must be able to log workouts and food without internet access.
   - Poor gym reception must not block normal app usage.

2. **Fast interactions**
   - Common actions should update immediately.
   - Logging should never wait for a remote server response.

3. **Cross-platform support**
   - Android and iOS should share one primary codebase.
   - Platform-specific behavior should be used only where it improves usability.

4. **Simple maintenance**
   - The architecture should remain manageable for a solo developer.
   - Avoid unnecessary abstraction and enterprise-style complexity.

5. **Reliable synchronization**
   - Local data should sync with the cloud when connectivity is available.
   - Failed sync operations should retry safely.

6. **Future extensibility**
   - Premium smart features should be addable later.
   - Workout feedback, subjective exercise notes, and progression data should be supported by the data model even if not fully exposed in the MVP.

---

# 3. Recommended Tech Stack

## 3.1 Mobile Application

| Area | Technology | Purpose |
|---|---|---|
| Framework | React Native | Build Android and iOS applications from one codebase |
| Tooling | Expo | Native APIs, development builds, cloud builds, and deployment workflow |
| Language | TypeScript | Type-safe application development |
| Navigation | Expo Router | File-based mobile navigation |
| UI | React Native components with a custom design system | Shared visual identity across Android and iOS |
| Local state | Zustand | Lightweight global UI and temporary session state |
| Server state | TanStack Query | Remote fetching, caching, mutations, and synchronization status |
| Local database | Expo SQLite | Offline-first persistence |
| Forms | React Hook Form | Form handling and validation |
| Validation | Zod | Runtime schema validation |
| Secure storage | Expo SecureStore | Secure token and sensitive preference storage |
| Barcode scanning | Expo Camera or a compatible Expo barcode scanner | Scan packaged food barcodes |
| Charts | React Native chart library selected during implementation | Basic progress visualization |
| Testing | Jest and React Native Testing Library | Unit and component testing |
| End-to-end testing | Maestro or Detox | Critical mobile workflow testing |

---

## 3.2 Backend

| Area | Technology | Purpose |
|---|---|---|
| Backend platform | Supabase | Managed backend services |
| Database | PostgreSQL | Cloud source of truth |
| Authentication | Supabase Auth | User accounts and sessions |
| Authorization | PostgreSQL Row-Level Security | Ensure users can access only their own data |
| File storage | Supabase Storage | Optional profile images or future exported files |
| Server functions | Supabase Edge Functions | Secure server-side operations and third-party integrations |
| API | Supabase-generated APIs plus Edge Functions | Mobile-to-backend communication |
| Monitoring | Supabase logs plus optional external error tracking | Diagnose backend and client failures |

---

## 3.3 Development Infrastructure

| Area | Technology | Purpose |
|---|---|---|
| Source control | Git and GitHub | Version control and collaboration |
| Package manager | npm or pnpm | Dependency management |
| CI/CD | GitHub Actions | Automated tests and checks |
| Mobile builds | Expo Application Services | Android and iOS builds |
| Private development networking | Tailscale | Secure access to local development services |
| Error tracking | Sentry or equivalent | Production error reporting |
| API testing | Bruno, Postman, or Insomnia | Test backend endpoints |

---

# 4. Why React Native and Expo

React Native is selected because:

- The project needs Android and iOS support.
- The developer already has React and JavaScript experience.
- A shared TypeScript codebase reduces duplicated work.
- React Native supports native mobile behavior rather than functioning as a simple web wrapper.
- Expo reduces native setup and provides managed build tools.
- Expo Application Services can produce iOS builds even when the main development environment is Windows or Linux.

The app should maintain one shared Logbook design system while adapting selected behaviors for each platform.

Shared elements should include:

- Color system
- Typography
- Workout cards
- Exercise rows
- Food rows
- Progress charts
- Navigation structure
- Spacing system
- Form styles

Platform-specific adaptations may include:

- Back gestures
- Date and time pickers
- Switch controls
- Haptic feedback
- Safe areas
- Keyboard behavior
- Navigation transitions
- Permission prompts

The design target is approximately:

- **90% shared interface**
- **10% platform-specific adaptation**

---

# 5. High-Level Architecture

```text
┌─────────────────────────────────────────────┐
│              React Native App               │
│                                             │
│  ┌──────────────┐   ┌────────────────────┐  │
│  │ Presentation │   │ Application Logic  │  │
│  │ Screens/UI   │   │ Use Cases/Services │  │
│  └──────┬───────┘   └─────────┬──────────┘  │
│         │                     │             │
│  ┌──────▼─────────────────────▼──────────┐  │
│  │       Local Data and App State        │  │
│  │ Expo SQLite / Zustand / Query Cache   │  │
│  └────────────────┬──────────────────────┘  │
└───────────────────┼─────────────────────────┘
                    │
             Sync when online
                    │
┌───────────────────▼─────────────────────────┐
│                  Supabase                   │
│                                             │
│  Auth  │ PostgreSQL │ Edge Functions        │
│        │ RLS        │ Storage               │
└─────────────────────────────────────────────┘
```

---

# 6. Offline-First Data Flow

The local database is the primary operational data source while the app is in use.

When a user logs a workout set:

```text
User enters weight and repetitions
                ↓
Input is validated locally
                ↓
Record is saved immediately to Expo SQLite
                ↓
The interface updates immediately
                ↓
A sync operation is queued
                ↓
The record is uploaded to Supabase when online
                ↓
The local record is marked as synchronized
```

The same pattern applies to:

- Workout sessions
- Exercise sets
- Food logs
- Custom foods
- Body-weight entries
- Routine updates

The user should never need to wait for Supabase before continuing.

---

# 7. Local and Remote Data Responsibilities

## 7.1 Expo SQLite

SQLite stores data required for immediate and offline usage.

Examples:

- Active workout
- Workout history available offline
- Workout routines
- Exercise data
- Custom exercises
- Daily food logs
- Recently used foods
- User-created foods
- Weight entries
- Pending sync operations

SQLite should be treated as the mobile app's operational database.

---

## 7.2 Supabase PostgreSQL

Supabase stores the synchronized cloud copy of user data.

It provides:

- Multi-device synchronization
- Account recovery
- Cloud backup
- Persistent user ownership
- Future web or admin access
- A foundation for premium analysis features

PostgreSQL is the cloud source of truth when resolving synchronized data between devices.

---

## 7.3 Zustand

Zustand should remain small.

It is for global state that does not naturally belong in the database or remote query cache.

Appropriate examples:

- Current theme
- Unit preference
- Currently selected tab
- Temporary routine draft
- Rest timer presentation state
- Active modal state
- Unsaved form state
- Premium entitlement status

Zustand should **not** become the main storage layer for:

- Workout history
- Food logs
- Exercise records
- Nutrition history
- User-created foods

Those belong in SQLite and Supabase.

---

## 7.4 TanStack Query

TanStack Query handles communication with remote services.

It should manage:

- Fetching remote data
- Remote mutations
- Cache invalidation
- Loading and error states
- Retry policies
- Sync status
- Background refetching

TanStack Query should not replace SQLite for offline data.

A practical model is:

```text
SQLite
  = immediate operational data

TanStack Query
  = remote communication and server state

Zustand
  = temporary global app and UI state

Supabase
  = cloud persistence and authentication
```

---

# 8. Synchronization Strategy

Each locally synchronized record should include fields similar to:

```text
id
user_id
created_at
updated_at
deleted_at
sync_status
last_synced_at
device_id
```

Suggested sync states:

```text
pending
syncing
synced
failed
conflict
```

## Initial MVP strategy

Keep synchronization simple:

1. Generate UUIDs on the client.
2. Save locally first.
3. Add a pending sync operation.
4. Upload when internet access is available.
5. Retry failed operations with controlled backoff.
6. Mark successful records as synchronized.
7. Use `updated_at` for basic conflict resolution.

## Conflict handling

For the first version:

- Prefer the most recently updated record.
- Avoid silent destructive overwrites where possible.
- Treat completed workout sessions as mostly append-only.
- Use soft deletion for synchronized records.
- Record conflict information for debugging.

More advanced merge logic can be introduced later if multi-device usage exposes real conflict cases.

---

# 9. Authentication

Supabase Auth will manage accounts.

Initial supported methods may include:

- Email and password
- Email verification
- Password reset

Potential later additions:

- Google sign-in
- Apple sign-in

Authentication should not block all offline functionality after a user has previously authenticated successfully.

Secure session data should be stored using Expo SecureStore.

---

# 10. Security

The application must follow these principles:

- All production traffic uses HTTPS.
- Supabase service-role keys must never be embedded in the app.
- Only public client credentials may be included in the mobile build.
- Sensitive server operations must use Edge Functions.
- Row-Level Security must be enabled for all user-owned tables.
- Users may only access records where `user_id` matches their authenticated identity.
- Input must be validated both locally and server-side.
- Authentication tokens must be stored securely.
- Logs must not expose passwords, tokens, or sensitive user notes.

---

# 11. Tailscale's Role

Tailscale is a development and infrastructure tool, not an end-user dependency.

## Appropriate uses

- Connect a physical Android or iOS device to a backend running on the developer's computer.
- Access a local PostgreSQL instance from trusted development devices.
- Reach private staging services.
- Protect internal dashboards.
- Access self-hosted monitoring tools.
- Test local APIs without opening router ports.

Example:

```text
Physical Android device
          │
      Tailscale
          │
Development computer
          │
Local API / Local Supabase / PostgreSQL
```

## Inappropriate production use

Public users should not need to:

- Install Tailscale
- Join a private tailnet
- Authenticate with the developer's network
- Keep a VPN connection active

The public production app should communicate directly with Supabase or another public HTTPS backend.

```text
Logbook mobile app
        │
    Public HTTPS
        │
Supabase production backend
```

Tailscale should remain limited to private development, staging, administration, and monitoring access.

---

# 12. Food and Barcode Architecture

Nutrition entries may originate from:

1. User-created foods
2. Recently used foods
3. Favorite foods
4. A curated internal food database
5. An external barcode or nutrition database

Search priority should favor user-trusted data:

```text
User-created and recently used foods
                ↓
Favorite foods
                ↓
Curated internal foods
                ↓
External database results
```

When a user logs an external food, the app should save a local snapshot of:

- Food name
- Brand
- Serving size
- Calories
- Protein
- Carbohydrates
- Fat
- Barcode
- Source
- Date imported

This prevents previously logged meals from changing if an external database entry is edited later.

The MVP should make manual food creation fast:

```text
Enter food name
        ↓
Enter serving information
        ↓
Enter calories and macros
        ↓
Save
```

The flow should avoid unnecessary approval screens.

---

# 13. Workout Architecture

The core workout hierarchy is:

```text
Routine
  └── Routine Exercise
        └── Target configuration

Workout Session
  └── Session Exercise
        └── Workout Set
```

A routine is a reusable template.

A workout session is a historical instance created from a routine or started manually.

A session exercise should keep a snapshot of relevant exercise information so historical sessions remain understandable even if the original exercise is later edited.

Each set may include:

- Weight
- Repetitions
- Set type
- Completion status
- Notes
- Timestamp
- Optional future difficulty rating
- Optional future feedback fields

The schema should leave room for future smart features without exposing them in the MVP.

Possible future fields:

- Perceived difficulty
- Repetitions in reserve
- Pain or discomfort category
- Mental state
- Fatigue state
- Progression recommendation
- Recommendation outcome

---

# 14. Suggested Project Structure

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── auth/
│   ├── workout/
│   ├── nutrition/
│   ├── progress/
│   └── settings/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── workouts/
│   ├── routines/
│   ├── exercises/
│   ├── nutrition/
│   ├── foods/
│   ├── progress/
│   └── settings/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── database/
│   ├── migrations/
│   ├── schema/
│   ├── repositories/
│   └── sync/
│
├── services/
│   ├── supabase/
│   ├── barcode/
│   └── analytics/
│
├── stores/
├── hooks/
├── theme/
├── constants/
├── utils/
├── schemas/
└── types/
```

The structure is feature-first but should remain practical.

Do not create additional layers unless they solve a real problem.

---

# 15. Design System Direction

Logbook should have a shared visual identity across Android and iOS.

The design system should define:

- Color tokens
- Typography scale
- Spacing scale
- Border radii
- Shadows
- Button variants
- Input variants
- Cards
- List rows
- Bottom sheets
- Dialogs
- Loading states
- Empty states
- Error states
- Success feedback

The design should prioritize:

- Readability during workouts
- Large tap targets
- Fast numeric entry
- Clear distinction between previous and current performance
- Minimal visual clutter
- Useful dark mode
- One-handed interaction where practical

---

# 16. Error Handling

The application should handle failures without interrupting logging.

Examples:

## Local write failure

- Show a clear error.
- Preserve the user's typed values.
- Allow immediate retry.

## Remote sync failure

- Keep the local record.
- Mark it as pending or failed.
- Retry automatically later.
- Avoid blocking the user.

## Barcode lookup failure

- Allow manual food creation immediately.
- Preserve the scanned barcode if useful.

## Expired authentication session

- Preserve unsynchronized local data.
- Ask the user to sign in again.
- Resume sync after authentication succeeds.

---

# 17. Testing Strategy

## Unit tests

Focus on:

- Macro calculations
- Unit conversions
- Personal-record logic
- Workout totals
- Food serving calculations
- Sync-state transitions
- Validation schemas

## Component tests

Focus on:

- Set entry rows
- Food entry forms
- Exercise search
- Routine editing
- Empty and error states

## Integration tests

Focus on:

- Local database writes
- Supabase synchronization
- Authentication
- Barcode result handling

## End-to-end tests

Critical MVP flows:

1. Create an account.
2. Create a routine.
3. Start and complete a workout.
4. Close and reopen an active workout.
5. Log food manually.
6. Scan and log a barcode.
7. Use the app offline.
8. Reconnect and synchronize.
9. Record body weight.
10. Review workout and nutrition history.

---

# 18. Future Premium Architecture

Premium features are not part of the MVP, but the architecture should support them later.

Potential future capabilities:

- Smart progression suggestions
- Conservative, moderate, and aggressive suggestion styles
- Exercise feedback prompts
- Recovery suggestions
- Exercise substitution recommendations
- Natural-language workout notes
- Historical performance analysis
- Premium subscription management

A future recommendation system should use a hybrid approach:

```text
Structured workout data
          ↓
Rule-based progression engine
          ↓
Optional LLM interpretation for free-text notes
          ↓
Structured recommendation
          ↓
Application-controlled wording
```

The LLM should not directly control the workout.

The app should use rules, safety constraints, and approved action categories.

Premium intelligence must remain optional and must not reduce the functionality of the free logging experience.

---

# 19. MVP Deployment Model

```text
Android and iOS App
        │
        ├── Local SQLite database
        ├── Secure local session storage
        └── Background synchronization
                    │
                    ▼
             Supabase Cloud
        ├── Authentication
        ├── PostgreSQL
        ├── Row-Level Security
        └── Edge Functions
```

Development environments may use:

```text
Expo development build
        │
        ├── Local Supabase or local API
        ├── Tailscale private access
        └── Development database
```

Production users connect only through public HTTPS services.

---

# 20. Initial Technical Decisions

| Decision | Choice |
|---|---|
| Mobile framework | React Native |
| Mobile tooling | Expo |
| Language | TypeScript |
| Navigation | Expo Router |
| Local database | Expo SQLite |
| Backend | Supabase |
| Cloud database | PostgreSQL |
| Authentication | Supabase Auth |
| Local UI state | Zustand |
| Remote state | TanStack Query |
| Validation | Zod |
| Form handling | React Hook Form |
| Architecture | Feature-first |
| Data approach | Offline-first |
| Production networking | Public HTTPS |
| Private development networking | Tailscale |
| MVP AI support | None |
| Future intelligence | Premium, post-MVP |

---

# 21. Open Technical Decisions

The following should be finalized during detailed system design or implementation planning:

- Exact charting library
- Exact barcode database provider
- Whether anonymous local-only usage is supported
- Initial authentication providers
- Background sync limitations on Android and iOS
- Conflict-resolution details
- Data export format
- Analytics provider
- Crash-reporting provider
- Subscription platform for the premium tier
- Minimum supported Android and iOS versions
- Whether full workout history is always stored locally or downloaded on demand

---

# 22. Final System Principle

> Logbook must remain useful when the network is slow, unavailable, or unreliable. The user should interact with the local app first, while synchronization happens quietly in the background.

The architecture should support the product philosophy:

> **Log quickly, track accurately, and get out of the user's way.**
