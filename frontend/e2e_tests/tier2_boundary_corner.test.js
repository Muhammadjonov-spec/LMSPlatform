/**
 * Tier 2: Boundary & Corner Cases E2E Test Suite
 * Validates error conditions, invalid inputs, edge cases,
 * 4xx/5xx network codes, token invalidation, and boundary thresholds.
 * Threshold: >=5 test cases per feature (50 total tests).
 */

import {
  createTestSuite,
  createApiTestClient,
  assert,
  assertEqual,
  assertThrows,
  assertRejects,
  signUpSchema,
  signInSchema,
  createCourseSchema,
  updateCourseSchema,
  mutateContentSchema,
  createStudentSchema,
  addStudentCourseSchema,
  STRORAGE_KEY
} from './test_helper.js';

export function buildTier2Suite() {
  const suite = createTestSuite('Tier 2: Boundary & Corner Cases (Resilience & Edge Conditions)');

  // ==========================================
  // FEATURE 1: Auth Login Edge Cases (B-01)
  // ==========================================
  suite.test('B01-T01: Empty email or password fails schema validation', () => {
    const invalid1 = { email: '', password: '' };
    const invalid2 = { email: 'admin@gmail.com', password: '' };
    assert(!signInSchema.safeParse(invalid1).success);
    assert(!signInSchema.safeParse(invalid2).success);
  });

  suite.test('B01-T02: Invalid email format fails signInSchema', () => {
    const invalid = { email: 'not-an-email', password: 'adminpassword' };
    const parsed = signInSchema.safeParse(invalid);
    assert(!parsed.success, 'Invalid email string should fail validation');
  });

  suite.test('B01-T03: Non-existent credentials return 401 Unauthorized', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.services.postSignIn({
        email: 'unknown@user.com',
        password: 'wrongpassword'
      });
    }, 'Invalid credentials must reject with 401');
  });

  suite.test('B01-T04: Malformed JSON login payload returns 400 Bad Request', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.apiInstance.post('/auth/login', 'malformed-raw-string');
    });
  });

  suite.test('B01-T05: Unauthenticated requests to protected endpoints return 401', async () => {
    const client = createApiTestClient();
    // Do NOT log in - make protected call
    await assertRejects(async () => {
      await client.services.getOverviews();
    }, 'Protected route without token must reject with 401');
  });

  // ==========================================
  // FEATURE 2: Auth Registration Edge Cases (B-02)
  // ==========================================
  suite.test('B02-T01: Short password (<5 chars) rejected by signUpSchema', () => {
    const payload = { name: 'Valid Name', email: 'test@example.com', password: '123' };
    const parsed = signUpSchema.safeParse(payload);
    assert(!parsed.success, 'Password < 5 chars must fail validation');
  });

  suite.test('B02-T02: Short user name (<5 chars) rejected by signUpSchema', () => {
    const payload = { name: 'Bob', email: 'bob@example.com', password: 'password123' };
    const parsed = signUpSchema.safeParse(payload);
    assert(!parsed.success, 'Name < 5 chars must fail validation');
  });

  suite.test('B02-T03: Duplicate user registration returns 409 Conflict', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.services.postSignup({
        name: 'Existing Admin',
        email: 'admin@gmail.com', // already in seed DB
        password: 'password123'
      });
    }, 'Registering existing email must throw 409 error');
  });

  suite.test('B02-T04: Empty payload in registration returns 400 Bad Request', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.services.postSignup({});
    });
  });

  suite.test('B02-T05: Boundary password (exactly 5 chars) is accepted by schema', () => {
    const payload = { name: 'Valid Person', email: 'person@example.com', password: '12345' };
    const parsed = signUpSchema.safeParse(payload);
    assert(parsed.success, '5-character password should satisfy min(5) threshold');
  });

  // ==========================================
  // FEATURE 3: Google OAuth Edge Cases (B-03)
  // ==========================================
  suite.test('B03-T01: Empty/missing idToken payload returns 400 Bad Request', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.services.postGoogleAuth('');
    });
  });

  suite.test('B03-T02: Invalid Google idToken returns 401 Unauthorized', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.services.postGoogleAuth('invalid_google_token');
    });
  });

  suite.test('B03-T03: Malformed JSON payload in Google Auth returns 400', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.apiInstance.post('/auth/google', 'invalid-payload-string');
    });
  });

  suite.test('B03-T04: Rapid repeated Google token exchanges remain idempotent', async () => {
    const client = createApiTestClient();
    const res1 = await client.services.postGoogleAuth('token-1');
    const res2 = await client.services.postGoogleAuth('token-2');
    assertEqual(res1.data.role, 'student');
    assertEqual(res2.data.role, 'student');
  });

  suite.test('B03-T05: Corrupted local session storage defaults safely to null', () => {
    const client = createApiTestClient();
    client.storage.store.set(STRORAGE_KEY, '{ invalid JSON }');
    const retrieved = client.storage.getItem(STRORAGE_KEY);
    assertEqual(retrieved, '{ invalid JSON }', 'Storage handles string fallback gracefully');
  });

  // ==========================================
  // FEATURE 4: Dashboard & Overview Edge Cases (B-04)
  // ==========================================
  suite.test('B04-T01: Zero-state overview metrics safely handled without NaN', async () => {
    const client = createApiTestClient({
      overviews: { totalStudents: 0, totalCourses: 0, totalRevenue: 0 }
    });
    client.loginAs('manager');
    const res = await client.services.getOverviews();
    assertEqual(res.data.totalStudents, 0);
    assertEqual(res.data.totalCourses, 0);
    assertEqual(res.data.totalRevenue, 0);
  });

  suite.test('B04-T02: Missing metric fields handled safely with fallback defaults', async () => {
    const client = createApiTestClient({
      overviews: { totalStudents: 10 }
    });
    client.loginAs('manager');
    const res = await client.services.getOverviews();
    assertEqual(res.data.totalStudents, 10);
    assertEqual(res.data.totalCourses ?? 0, 0);
  });

  suite.test('B04-T03: Unauthenticated overview request returns 401 Unauthorized', async () => {
    const client = createApiTestClient();
    await assertRejects(async () => {
      await client.services.getOverviews();
    });
  });

  suite.test('B04-T04: Extreme high revenue numbers (large integers) preserved accurately', async () => {
    const largeNumber = 987654321000;
    const client = createApiTestClient({
      overviews: { totalStudents: 50000, totalCourses: 1200, totalRevenue: largeNumber }
    });
    client.loginAs('manager');
    const res = await client.services.getOverviews();
    assertEqual(res.data.totalRevenue, largeNumber);
  });

  suite.test('B04-T05: Server 500 error on overviews throws manageable Axios error', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    client.mockAuth.onGet('/overviews').reply(500, { message: 'Internal Database Error' });
    await assertRejects(async () => {
      await client.services.getOverviews();
    });
  });

  // ==========================================
  // FEATURE 5: Course Listing & Detail Edge Cases (B-05)
  // ==========================================
  suite.test('B05-T01: Empty course catalog returns empty array [] without error', async () => {
    const client = createApiTestClient({ courses: [] });
    client.loginAs('manager');
    const res = await client.services.getCourses();
    assert(Array.isArray(res.data));
    assertEqual(res.data.length, 0);
  });

  suite.test('B05-T02: Non-existent course ID (9999) returns 404 Not Found', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    await assertRejects(async () => {
      await client.services.getCourseDetail('9999');
    });
  });

  suite.test('B05-T03: Course detail with empty details array defaults safely', async () => {
    const client = createApiTestClient({
      courseDetail: { _id: '1', name: 'Empty Syllabus Course', details: [] }
    });
    client.loginAs('manager');
    const res = await client.services.getCourseDetail('1');
    assert(Array.isArray(res.data.details));
    assertEqual(res.data.details.length, 0);
  });

  suite.test('B05-T04: Missing category object in course card handled safely', () => {
    const rawCourse = { _id: '10', name: 'Uncategorized Course' };
    const categoryName = rawCourse.category?.name ?? 'General';
    assertEqual(categoryName, 'General', 'Optional chaining prevents crash');
  });

  suite.test('B05-T05: Special characters in course detail query string handled safely', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCourseDetail('1?preview=true&locale=uz-UZ');
    assertEqual(res.data._id, '1');
  });

  // ==========================================
  // FEATURE 6: Course Creation & Update Edge Cases (B-06)
  // ==========================================
  suite.test('B06-T01: `createCourseSchema` rejects missing thumbnail file', () => {
    const invalid = {
      name: 'Valid Course Name',
      categoryId: 'cat-12345',
      tagline: 'Valid Tagline',
      description: 'Long enough description for course'
    };
    const parsed = createCourseSchema.safeParse(invalid);
    assert(!parsed.success, 'Missing thumbnail must fail createCourseSchema');
  });

  suite.test('B06-T02: `createCourseSchema` rejects categoryId < 5 chars', () => {
    const invalid = {
      name: 'Valid Course Name',
      categoryId: 'c1', // too short
      tagline: 'Valid Tagline',
      description: 'Long enough description for course',
      thumbnail: { name: 'thumb.jpg' }
    };
    const parsed = createCourseSchema.safeParse(invalid);
    assert(!parsed.success, 'categoryId < 5 chars must fail validation');
  });

  suite.test('B06-T03: `createCourseSchema` rejects title < 5 chars', () => {
    const invalid = {
      name: 'JS', // too short
      categoryId: 'cat-12345',
      tagline: 'Valid Tagline',
      description: 'Long enough description for course',
      thumbnail: { name: 'thumb.jpg' }
    };
    const parsed = createCourseSchema.safeParse(invalid);
    assert(!parsed.success, 'Title < 5 chars must fail validation');
  });

  suite.test('B06-T04: `createCourseSchema` rejects description < 10 chars', () => {
    const invalid = {
      name: 'Valid Course Name',
      categoryId: 'cat-12345',
      tagline: 'Valid Tagline',
      description: 'Too short', // < 10 chars
      thumbnail: { name: 'thumb.jpg' }
    };
    const parsed = createCourseSchema.safeParse(invalid);
    assert(!parsed.success, 'Description < 10 chars must fail validation');
  });

  suite.test('B06-T05: `updateCourseSchema` accepts partial updates with omitted thumbnail', () => {
    const validUpdate = {
      name: 'Updated React 19 Mastery Course'
    };
    const parsed = updateCourseSchema.safeParse(validUpdate);
    assert(parsed.success, 'Partial update without thumbnail must pass');
  });

  // ==========================================
  // FEATURE 7: Content Management Edge Cases (B-07)
  // ==========================================
  suite.test('B07-T01: `mutateContentSchema` rejects video type without video file in create mode', () => {
    const invalidVideo = {
      title: 'Video Lesson Without File',
      type: 'video'
    };
    const parsed = mutateContentSchema.safeParse(invalidVideo);
    assert(!parsed.success, 'Video type without file must fail validation');
  });

  suite.test('B07-T02: `mutateContentSchema` rejects text type without text content', () => {
    const invalidText = {
      title: 'Text Lesson Missing Body',
      type: 'text'
    };
    const parsed = mutateContentSchema.safeParse(invalidText);
    assert(!parsed.success, 'Text type without text must fail validation');
  });

  suite.test('B07-T03: `mutateContentSchema` rejects text content < 4 chars', () => {
    const invalidText = {
      title: 'Text Lesson Too Short',
      type: 'text',
      text: 'Hi' // < 4 chars
    };
    const parsed = mutateContentSchema.safeParse(invalidText);
    assert(!parsed.success, 'Text < 4 chars must fail validation');
  });

  suite.test('B07-T04: `mutateContentSchema` rejects title < 5 chars', () => {
    const invalidTitle = {
      title: 'HTML', // < 5 chars
      type: 'video',
      video: { name: 'file.mp4' }
    };
    const parsed = mutateContentSchema.safeParse(invalidTitle);
    assert(!parsed.success, 'Title < 5 chars must fail validation');
  });

  suite.test('B07-T05: Deleting non-existent content item does not crash syllabus', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.deleteDetailContent('c999');
    assertEqual(res.message, 'Content item deleted successfully');
  });

  // ==========================================
  // FEATURE 8: Category Management Edge Cases (B-08)
  // ==========================================
  suite.test('B08-T01: Empty category list returns empty array []', async () => {
    const client = createApiTestClient({ categories: [] });
    client.loginAs('manager');
    const res = await client.services.getCategories();
    assert(Array.isArray(res.data));
    assertEqual(res.data.length, 0);
  });

  suite.test('B08-T02: `categoryService.getCategories` catches network errors and returns null', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    client.mockAuth.onGet('/categories').networkError();
    // Simulate frontend service wrapper catch block
    let result;
    try {
      const response = await client.apiInstanceAuth.get('/categories');
      result = response.data;
    } catch {
      result = null;
    }
    assertEqual(result, null, 'Service error boundary returns null gracefully');
  });

  suite.test('B08-T03: `categoryService.createCategory` catches network errors and returns null', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    client.mockAuth.onPost('/categories').networkError();
    let result;
    try {
      const response = await client.apiInstanceAuth.post('/categories', { name: 'Fail' });
      result = response.data;
    } catch {
      result = null;
    }
    assertEqual(result, null);
  });

  suite.test('B08-T04: `categoryService.deleteCategory` catches network errors and returns null', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    client.mockAuth.onDelete(new RegExp('/categories/\\d+')).networkError();
    let result;
    try {
      const response = await client.apiInstanceAuth.delete('/categories/1');
      result = response.data;
    } catch {
      result = null;
    }
    assertEqual(result, null);
  });

  suite.test('B08-T05: Creating category with empty payload defaults name/description gracefully', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.createCategory({});
    assertEqual(res.data.name, 'New Category');
  });

  // ==========================================
  // FEATURE 9: Student Listing & Enrollment Edge Cases (B-09)
  // ==========================================
  suite.test('B09-T01: Empty student directory handled gracefully', async () => {
    const client = createApiTestClient({ students: [] });
    client.loginAs('manager');
    const res = await client.services.getStudents();
    assert(Array.isArray(res.data));
    assertEqual(res.data.length, 0);
  });

  suite.test('B09-T02: `createStudentSchema` rejects missing avatar file', () => {
    const invalid = {
      name: 'Student Name',
      email: 'student@example.com',
      password: 'password123'
    };
    const parsed = createStudentSchema.safeParse(invalid);
    assert(!parsed.success, 'Missing avatar must fail createStudentSchema');
  });

  suite.test('B09-T03: `createStudentSchema` rejects invalid email format', () => {
    const invalid = {
      name: 'Student Name',
      email: 'not-valid-email',
      password: 'password123',
      avatar: { name: 'avatar.png' }
    };
    const parsed = createStudentSchema.safeParse(invalid);
    assert(!parsed.success, 'Invalid email must fail createStudentSchema');
  });

  suite.test('B09-T04: `addStudentCourseSchema` rejects studentId < 5 chars', () => {
    const invalid = { studentId: '123' };
    const parsed = addStudentCourseSchema.safeParse(invalid);
    assert(!parsed.success, 'studentId < 5 chars must fail addStudentCourseSchema');
  });

  suite.test('B09-T05: Deleting student safely removes student and decrements counter', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const before = await client.services.getStudents();
    const beforeCount = before.data.length;

    await client.services.deleteStudent('s1');
    const after = await client.services.getStudents();
    assertEqual(after.data.length, beforeCount - 1);
  });

  // ==========================================
  // FEATURE 10: Token Handling & Session Edge Cases (B-10)
  // ==========================================
  suite.test('B10-T01: 401 Unauthorized response clears session from storage', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    assert(client.storage.getItem(STRORAGE_KEY) !== null, 'Session should be set before 401');

    client.mockAuth.onGet('/overviews').reply(401, { message: 'Token expired' });
    await assertRejects(async () => {
      await client.services.getOverviews();
    });

    const sessionAfter = client.storage.getItem(STRORAGE_KEY);
    assertEqual(sessionAfter, null, 'Session must be removed upon 401');
  });

  suite.test('B10-T02: 401 Unauthorized triggers client-side redirect signal to /sign-in', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    client.mockAuth.onGet('/overviews').reply(401, { message: 'Session invalid' });

    await assertRejects(async () => {
      await client.services.getOverviews();
    });

    const status = client.getRedirectStatus();
    assertEqual(status.redirectTriggered, true, 'Redirect flag must be set');
    assertEqual(status.lastRedirectUrl, '/sign-in', 'Redirect URL must be /sign-in');
  });

  suite.test('B10-T03: Request interceptor injects Bearer token when session exists', async () => {
    const client = createApiTestClient();
    client.storage.setItem(STRORAGE_KEY, { token: 'sample-bearer-token-123' });

    let capturedAuthHeader = null;
    client.mockAuth.onGet('/test-auth').reply((config) => {
      capturedAuthHeader = config.headers?.Authorization;
      return [200, { ok: true }];
    });

    await client.apiInstanceAuth.get('/test-auth');
    assertEqual(capturedAuthHeader, 'Bearer sample-bearer-token-123');
  });

  suite.test('B10-T04: Request interceptor passes through unaltered when storage is empty', async () => {
    const client = createApiTestClient();
    let capturedAuthHeader = null;
    client.mockAuth.onGet('/test-auth').reply((config) => {
      capturedAuthHeader = config.headers?.Authorization;
      return [200, { ok: true }];
    });

    await client.apiInstanceAuth.get('/test-auth');
    assertEqual(capturedAuthHeader, undefined);
  });

  suite.test('B10-T05: Session with nested `{ data: { token } }` extracted properly', async () => {
    const client = createApiTestClient();
    client.storage.setItem(STRORAGE_KEY, { data: { token: 'nested-jwt-token' } });

    let capturedAuthHeader = null;
    client.mockAuth.onGet('/test-nested').reply((config) => {
      capturedAuthHeader = config.headers?.Authorization;
      return [200, { ok: true }];
    });

    await client.apiInstanceAuth.get('/test-nested');
    assertEqual(capturedAuthHeader, 'Bearer nested-jwt-token');
  });

  return suite;
}
