# Test Infrastructure & Methodology: LMS Platform

## 1. Test Philosophy & Principles
The LMS frontend test infrastructure adheres to a **strictly opaque-box, requirement-driven, contract-based verification methodology**. The testing strategy guarantees end-to-end reliability, UI contract adherence, safe error recovery, and robust state management without coupling tests to fragile internal implementation details.

### Core Testing Pillars
1. **Opaque-Box Verification**: Tests validate public API contracts, input validation schemas (Zod), HTTP interceptors, session storage lifecycle, and end-to-end user workflows against specification requirements rather than internal private functions.
2. **Progressive Testability**: Tests are isolated, deterministic, and runnable standalone without requiring a live external MongoDB database or active browser instance, utilizing high-fidelity mock adapters and client-side contract simulators.
3. **Contract & Schema Integrity**: Every API request and response is verified against the interface contracts defined in `PROJECT.md` and schema validators in `zodSchema.js`.
4. **Adversarial & Boundary Rigor**: Edge cases, network failures (401, 404, 500), malformed inputs, XSS/injection strings, and unhandled promise rejection hazards are rigorously exercised across all tiers.
5. **Deterministic Assertions**: Fixed seeds and authoritative expected outputs derived from `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `mockData.json`.

---

## 2. Feature Inventory
The test suite covers all 10 core functional domains of the LMS frontend application:

| Feature ID | Feature Domain | Description | Target Endpoints & Schemas |
| :--- | :--- | :--- | :--- |
| **F-01** | Auth Login | Standard credentials login, role resolution, JWT token issuance | `POST /auth/login`, `POST /sign-in`, `signInSchema` |
| **F-02** | Auth Registration | New account registration, name & credential validation, role mapping | `POST /auth/register`, `signUpSchema` |
| **F-03** | Google OAuth Integration | Google Identity Services JWT idToken exchange and session init | `POST /auth/google`, `postGoogleAuth` |
| **F-04** | Dashboard & Overview Stats | Manager dashboard KPI metrics (students, courses, revenue) | `GET /overviews`, `getOverviews` |
| **F-05** | Course Listing & Details | Course catalog query, course details, syllabus tree, preview mode | `GET /courses`, `GET /courses/:id`, `getCourseDetail` |
| **F-06** | Course Creation & Update | Course authoring form, category binding, multipart thumbnail handling | `POST /courses`, `PUT /courses/:id`, `createCourseSchema`, `updateCourseSchema` |
| **F-07** | Content Management | Lesson authoring (Video & Text), edit mode validations, content deletion | `POST /courses/contents`, `PUT /courses/contents/:id`, `DELETE /courses/contents/:id`, `mutateContentSchema` |
| **F-08** | Category Management | Category retrieval, creation, deletion, course count aggregation | `GET /categories`, `POST /categories`, `DELETE /categories/:id` |
| **F-09** | Student Listing & Enrollment | Student directory, profile retrieval, course enrollment, unenrollment | `GET /students`, `POST /students`, `GET /courses/students/:id`, `POST /courses/students/:id`, `PUT /courses/students/:id` |
| **F-10** | Subscriptions & Rewards | Subscription tiers, pricing updates, leaderboard rankings, badge system | `GET /subscriptions`, `PUT /subscriptions/:id`, `GET /rewards` |

---

## 3. 4-Tier Test Architecture

```
+-------------------------------------------------------------------------+
|                  TIER 4: REAL-WORLD APPLICATION SCENARIOS               |
|      Full multi-persona user journeys (Manager, Student, SuperAdmin)    |
+-------------------------------------------------------------------------+
                                    ▲
+-------------------------------------------------------------------------+
|                  TIER 3: CROSS-FEATURE COMBINATIONS                     |
|      Pairwise sequential integration pipelines & state transitions      |
+-------------------------------------------------------------------------+
                                    ▲
+-------------------------------------------------------------------------+
|                  TIER 2: BOUNDARY & CORNER CASES                        |
|      Validation failures, 4xx/5xx errors, token expiry, null fallbacks  |
+-------------------------------------------------------------------------+
                                    ▲
+-------------------------------------------------------------------------+
|                  TIER 1: FEATURE COVERAGE (HAPPY PATHS)                 |
|      >=5 tests per feature: schemas, endpoints, payloads, return shapes |
+-------------------------------------------------------------------------+
```

### Tier 1: Feature Coverage
- **Objective**: Verify standard happy-path behavior, schema validations, API contract return shapes, and default parameters for all 10 features.
- **Coverage Threshold**: At least 5 distinct test cases per feature (Minimum 50 test cases total).
- **Test File**: `frontend/e2e_tests/tier1_feature_coverage.test.js`

### Tier 2: Boundary & Corner Cases
- **Objective**: Verify application resilience against malformed inputs, boundary limits (min/max string lengths), empty lists, 401 Unauthorized handling, 404 Not Found, 409 Conflict, 500 Server errors, and token storage cleanup.
- **Coverage Threshold**: At least 5 distinct test cases per feature (Minimum 50 test cases total).
- **Test File**: `frontend/e2e_tests/tier2_boundary_corner.test.js`

### Tier 3: Cross-Feature Combinations
- **Objective**: Verify multi-step pairwise workflows that bridge multiple functional modules in sequence (e.g., Register -> Sign In -> Create Category -> Author Course -> Upload Content -> Enroll Student -> Audit Dashboard).
- **Coverage Threshold**: 10 comprehensive cross-feature workflows.
- **Test File**: `frontend/e2e_tests/tier3_cross_feature.test.js`

### Tier 4: Real-World Application Scenarios
- **Objective**: Simulate full, realistic end-to-end user journeys for each system role (Manager, Student, SuperAdmin) including full lifecycle authoring, learning progression, and session invalidation/recovery.
- **Coverage Threshold**: 5 extensive multi-stage user scenarios.
- **Test File**: `frontend/e2e_tests/tier4_real_world.test.js`

---

## 4. Coverage Thresholds & Assertion Rules

| Metric | Target Requirement | Verification Method |
| :--- | :--- | :--- |
| **Tier 1 Feature Tests** | >= 50 tests (>=5 per feature) | Automated Test Runner |
| **Tier 2 Boundary Tests** | >= 50 tests (>=5 per feature) | Automated Test Runner |
| **Tier 3 Workflow Tests** | >= 10 multi-step workflows | Automated Test Runner |
| **Tier 4 Scenario Tests** | >= 5 real-world journeys | Automated Test Runner |
| **Total Test Suite** | >= 115 test cases | Master Runner Summary |
| **Pass Rate** | 100% (0 failures, 0 uncaught rejections) | Exit code 0 |
| **Execution Time** | < 10 seconds for entire suite | Performance timer |

---

## 5. Test Runner & Execution Guide

### Running the Test Suite
The test runner is standalone and requires only Node.js (v18+ / v20+).

```bash
# From workspace root:
node frontend/e2e_tests/runner.js

# Or from frontend directory:
cd frontend
node e2e_tests/runner.js
```

### Structured Output Format
The runner outputs clean, colored, structured tier summaries, feature checklists, and execution metrics:
- `[PASS]` / `[FAIL]` per test case
- Tier summary blocks with elapsed time
- Aggregated metrics: Total Tests, Passed, Failed, Skipped, Execution Duration
- Process exit code `0` on 100% pass, `1` on any failure.
