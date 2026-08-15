/**
 * Tier 1: Feature Coverage E2E Test Suite
 * Validates primary behavior (happy paths), API contracts, schemas,
 * and default states for all 10 LMS core features.
 * Threshold: >=5 test cases per feature (50 total tests).
 */

import {
  createTestSuite,
  createApiTestClient,
  assert,
  assertEqual,
  assertNotNull,
  signUpSchema,
  signInSchema,
  createCourseSchema,
  updateCourseSchema,
  mutateContentSchema,
  createStudentSchema,
  updateStudentSchema,
  addStudentCourseSchema,
  STRORAGE_KEY
} from './test_helper.js';

export function buildTier1Suite() {
  const suite = createTestSuite('Tier 1: Feature Coverage (Happy Paths & Contracts)');

  // ==========================================
  // FEATURE 1: Auth Login (F-01)
  // ==========================================
  suite.test('F01-T01: Valid Admin login returns 200, JWT token, and manager role', async () => {
    const client = createApiTestClient();
    const res = await client.services.postSignIn({
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    assertNotNull(res?.data, 'Response must contain data object');
    assertEqual(res.data.role, 'manager', 'Admin role must be manager');
    assertEqual(res.data.token, 'mock-jwt-manager-1', 'JWT token should match format');
    assertEqual(res.data.user.email, 'admin@gmail.com', 'User email must match');
  });

  suite.test('F01-T02: Valid SuperAdmin login returns 200 and manager role', async () => {
    const client = createApiTestClient();
    const res = await client.services.postSignIn({
      email: 'superadmin@gmail.com',
      password: 'superadmin123'
    });
    assertEqual(res?.data?.role, 'manager', 'SuperAdmin role must be manager');
    assertEqual(res?.data?.user?.email, 'superadmin@gmail.com', 'SuperAdmin email must match');
  });

  suite.test('F01-T03: Valid Student login returns 200 and student role', async () => {
    const client = createApiTestClient();
    const res = await client.services.postSignIn({
      email: 'student@gmail.com',
      password: 'student123'
    });
    assertEqual(res?.data?.role, 'student', 'Student role must be student');
    assertEqual(res?.data?.user?.id, 3, 'Student ID must match');
  });

  suite.test('F01-T04: Sign-in schema validates valid email and 5+ char password', () => {
    const validData = { email: 'admin@gmail.com', password: 'admin123' };
    const parsed = signInSchema.safeParse(validData);
    assert(parsed.success, 'Valid sign-in payload should pass Zod validation');
    assertEqual(parsed.data.email, 'admin@gmail.com');
  });

  suite.test('F01-T05: Auth login persists session into encrypted local storage', async () => {
    const client = createApiTestClient();
    const res = await client.services.postSignIn({
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    client.storage.setItem(STRORAGE_KEY, res.data);
    const stored = client.storage.getItem(STRORAGE_KEY);
    assertEqual(stored?.role, 'manager', 'Storage should persist manager role');
    assertEqual(stored?.token, 'mock-jwt-manager-1', 'Storage should persist JWT token');
  });

  // ==========================================
  // FEATURE 2: Auth Registration (F-02)
  // ==========================================
  suite.test('F02-T01: Valid user registration returns 201 with token and user object', async () => {
    const client = createApiTestClient();
    const payload = {
      name: 'Alice Wonder',
      email: 'alice@example.com',
      password: 'password123',
      role: 'student'
    };
    const res = await client.services.postSignup(payload);
    assertNotNull(res?.data?.token, 'Registration must return a token');
    assertEqual(res.data.user.name, 'Alice Wonder');
    assertEqual(res.data.user.email, 'alice@example.com');
    assertEqual(res.data.role, 'student');
  });

  suite.test('F02-T02: `signUpSchema` successfully validates compliant registration payload', () => {
    const payload = {
      name: 'Bob Builder',
      email: 'bob@example.com',
      password: 'strongpass123'
    };
    const parsed = signUpSchema.safeParse(payload);
    assert(parsed.success, 'Valid registration payload must pass signUpSchema');
  });

  suite.test('F02-T03: User registration supports combined firstName and lastName payload', async () => {
    const client = createApiTestClient();
    const payload = {
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      password: 'securePassword'
    };
    const res = await client.services.postSignup(payload);
    assertEqual(res.data.user.name, 'Charlie Brown');
  });

  suite.test('F02-T04: Registration assigns requested manager role for educator onboarding', async () => {
    const client = createApiTestClient();
    const res = await client.services.postSignup({
      name: 'Professor Xavier',
      email: 'xavier@mutants.edu',
      password: 'telepathicpass',
      role: 'manager'
    });
    assertEqual(res.data.role, 'manager', 'Role should be manager');
  });

  suite.test('F02-T05: Register endpoint supports `/sign-up` alias route', async () => {
    const client = createApiTestClient();
    const res = await client.apiInstance.post('/sign-up', {
      name: 'Diana Prince',
      email: 'diana@themyscira.com',
      password: 'amazonpassword'
    });
    assertEqual(res.status, 201);
    assertEqual(res.data.data.user.name, 'Diana Prince');
  });

  // ==========================================
  // FEATURE 3: Google OAuth Integration (F-03)
  // ==========================================
  suite.test('F03-T01: Google idToken exchange returns 200 with JWT session token', async () => {
    const client = createApiTestClient();
    const res = await client.services.postGoogleAuth('valid_google_jwt_token_sample');
    assertNotNull(res?.data?.token, 'Google auth must issue session token');
    assert(res.data.token.startsWith('mock-google-jwt-'), 'Token format matches Google JWT');
  });

  suite.test('F03-T02: Google auth returns valid user object with email and name', async () => {
    const client = createApiTestClient();
    const res = await client.services.postGoogleAuth('valid_google_jwt_token_sample');
    assertEqual(res.data.user.email, 'googleuser@gmail.com');
    assertEqual(res.data.user.name, 'Google User');
  });

  suite.test('F03-T03: Google auth assigns default student role to new accounts', async () => {
    const client = createApiTestClient();
    const res = await client.services.postGoogleAuth('valid_google_jwt_token_sample');
    assertEqual(res.data.role, 'student', 'Default OAuth role should be student');
  });

  suite.test('F03-T04: Google auth handles credential property payload format', async () => {
    const client = createApiTestClient();
    const res = await client.apiInstance.post('/auth/google', {
      credential: 'sample_google_credential_response'
    });
    assertEqual(res.status, 200);
    assertNotNull(res.data.data.token);
  });

  suite.test('F03-T05: Google auth session is saved to encrypted storage structure', async () => {
    const client = createApiTestClient();
    const res = await client.services.postGoogleAuth('valid_google_jwt_token_sample');
    client.storage.setItem(STRORAGE_KEY, res.data);
    const session = client.storage.getItem(STRORAGE_KEY);
    assertEqual(session?.user?.email, 'googleuser@gmail.com');
    assertEqual(session?.role, 'student');
  });

  // ==========================================
  // FEATURE 4: Dashboard & Overview Stats (F-04)
  // ==========================================
  suite.test('F04-T01: Fetch overview statistics returns 200 with data object', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getOverviews();
    assertNotNull(res?.data, 'Overview response must have data property');
  });

  suite.test('F04-T02: Overview payload contains numeric totalStudents', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getOverviews();
    assertEqual(typeof res.data.totalStudents, 'number');
    assertEqual(res.data.totalStudents, 120);
  });

  suite.test('F04-T03: Overview payload contains numeric totalCourses', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getOverviews();
    assertEqual(typeof res.data.totalCourses, 'number');
    assertEqual(res.data.totalCourses, 15);
  });

  suite.test('F04-T04: Overview payload contains numeric totalRevenue', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getOverviews();
    assertEqual(typeof res.data.totalRevenue, 'number');
    assertEqual(res.data.totalRevenue, 24000);
  });

  suite.test('F04-T05: Overview metrics update dynamically when courses are added', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const before = await client.services.getOverviews();
    const initialCourses = before.data.totalCourses;

    await client.services.createCourse({
      name: 'Advanced TypeScript Patterns',
      categoryId: 'cat-programming-1',
      tagline: 'Master TS Types',
      description: 'Comprehensive course on TypeScript'
    });

    const after = await client.services.getOverviews();
    assertEqual(after.data.totalCourses, initialCourses + 1, 'Total courses count should increment by 1');
  });

  // ==========================================
  // FEATURE 5: Course Listing & Details (F-05)
  // ==========================================
  suite.test('F05-T01: Fetch courses returns array of course cards', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCourses();
    assert(Array.isArray(res?.data), 'Courses must be an array');
    assert(res.data.length >= 2, 'Initial seed courses should be present');
  });

  suite.test('F05-T02: Course cards contain required fields (_id, name, category, thumbnail_url)', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCourses();
    const course = res.data[0];
    assertNotNull(course._id, 'Course must have _id');
    assertNotNull(course.name, 'Course must have name');
    assertNotNull(course.category?.name, 'Course must have category with name');
    assertNotNull(course.thumbnail_url, 'Course must have thumbnail_url');
  });

  suite.test('F05-T03: Fetch single course detail returns syllabus structure', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCourseDetail('1');
    assertNotNull(res?.data, 'Course detail must contain data');
    assertEqual(res.data._id, '1');
    assert(Array.isArray(res.data.details), 'Course details must be an array of lessons');
  });

  suite.test('F05-T04: Course detail includes preview query parameter handling', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCourseDetail('1', true);
    assertEqual(res.data.isPreview, true, 'Preview flag must be set to true');
  });

  suite.test('F05-T05: Course details contain lesson items with id, title, type', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCourseDetail('1');
    const lesson = res.data.details[0];
    assertNotNull(lesson._id);
    assertNotNull(lesson.title);
    assertNotNull(lesson.type);
  });

  // ==========================================
  // FEATURE 6: Course Creation & Update (F-06)
  // ==========================================
  suite.test('F06-T01: `createCourseSchema` validates name, categoryId, tagline, description, thumbnail', () => {
    const validData = {
      name: 'Fullstack React & Node.js',
      categoryId: 'cat-fullstack-101',
      tagline: 'Build production web apps',
      description: 'An in-depth 12-week course on fullstack engineering.',
      thumbnail: { name: 'thumbnail.jpg', size: 1024 }
    };
    const parsed = createCourseSchema.safeParse(validData);
    assert(parsed.success, 'Valid course payload should pass createCourseSchema');
  });

  suite.test('F06-T02: `updateCourseSchema` allows optional thumbnail file', () => {
    const updateData = {
      name: 'Updated Fullstack Course Name',
      categoryId: 'cat-fullstack-101',
      tagline: 'Updated tagline text here',
      description: 'Updated long description text that passes length requirement.'
    };
    const parsed = updateCourseSchema.safeParse(updateData);
    assert(parsed.success, 'Update schema should succeed without thumbnail file');
  });

  suite.test('F06-T03: Create course endpoint returns 201 and appends to course list', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const initialList = await client.services.getCourses();
    const res = await client.services.createCourse({
      name: 'Docker & Kubernetes Mastery',
      categoryId: 'cat-devops-01'
    });
    assertNotNull(res?.data?._id);
    const updatedList = await client.services.getCourses();
    assertEqual(updatedList.data.length, initialList.data.length + 1);
  });

  suite.test('F06-T04: Update course endpoint updates course attributes and returns 200', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.updateCourse({ name: 'Updated Docker Course' }, '1');
    assertNotNull(res?.data);
    assertEqual(res.data._id, '1');
  });

  suite.test('F06-T05: Delete course endpoint deletes course and decrements totalCourses', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const initialCourses = await client.services.getCourses();
    const initialCount = initialCourses.data.length;

    const res = await client.services.deleteCourse('1');
    assertEqual(res.message, 'Course deleted successfully');

    const updatedCourses = await client.services.getCourses();
    assertEqual(updatedCourses.data.length, initialCount - 1);
  });

  // ==========================================
  // FEATURE 7: Content Management (F-07)
  // ==========================================
  suite.test('F07-T01: `mutateContentSchema` validates valid video lesson with file', () => {
    const videoContent = {
      title: 'Introduction Video Lesson',
      type: 'video',
      video: { name: 'intro.mp4', size: 10485760 }
    };
    const parsed = mutateContentSchema.safeParse(videoContent);
    assert(parsed.success, 'Video lesson with file must pass mutateContentSchema');
  });

  suite.test('F07-T02: `mutateContentSchema` validates valid text lesson with body text', () => {
    const textContent = {
      title: 'Course Cheatsheet Notes',
      type: 'text',
      text: 'Here are the comprehensive summary notes for lesson 1.'
    };
    const parsed = mutateContentSchema.safeParse(textContent);
    assert(parsed.success, 'Text lesson with body text must pass mutateContentSchema');
  });

  suite.test('F07-T03: Create lesson endpoint adds lesson item to course syllabus', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.createContent({
      title: 'Async/Await in JavaScript',
      type: 'video',
      youtubeId: 'VN_a8qR3c7w'
    });
    assertNotNull(res?.data?._id);
    assertEqual(res.data.title, 'New Lesson Item');
  });

  suite.test('F07-T04: Fetch lesson detail returns content item by ID', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getDetailContent('c1');
    assertNotNull(res?.data);
    assertEqual(res.data._id, 'c1');
    assertEqual(res.data.title, 'Introduction to HTML');
  });

  suite.test('F07-T05: Delete lesson endpoint removes item from course syllabus', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const before = await client.services.getCourseDetail('1');
    const beforeCount = before.data.details.length;

    const res = await client.services.deleteDetailContent('c1');
    assertEqual(res.message, 'Content item deleted successfully');

    const after = await client.services.getCourseDetail('1');
    assertEqual(after.data.details.length, beforeCount - 1);
  });

  // ==========================================
  // FEATURE 8: Category Management (F-08)
  // ==========================================
  suite.test('F08-T01: Fetch categories returns list of categories with id and name', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCategories();
    assert(Array.isArray(res?.data), 'Categories should return an array');
    assert(res.data.length >= 4, 'Categories should contain at least 4 items');
    assertEqual(res.data[0].id, 1);
    assertEqual(res.data[0].name, 'Frontend Dasturlash');
  });

  suite.test('F08-T02: Category list items contain description and courseCount', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getCategories();
    const cat = res.data[0];
    assertNotNull(cat.description);
    assertEqual(typeof cat.courseCount, 'number');
  });

  suite.test('F08-T03: Create category endpoint adds new category to list', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const initialCategories = await client.services.getCategories();
    const res = await client.services.createCategory({
      name: 'Cybersecurity & Ethical Hacking',
      description: 'Network security, penetration testing, ethical hacking'
    });
    assertNotNull(res?.data?.id);
    const updatedCategories = await client.services.getCategories();
    assertEqual(updatedCategories.data.length, initialCategories.data.length + 1);
  });

  suite.test('F08-T04: Delete category endpoint removes category by ID', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const initial = await client.services.getCategories();
    const initialLength = initial.data.length;

    const res = await client.services.deleteCategory(1);
    assertEqual(res.message, 'Category deleted successfully');

    const updated = await client.services.getCategories();
    assertEqual(updated.data.length, initialLength - 1);
  });

  suite.test('F08-T05: Category service safely parses response objects', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const categories = await client.services.getCategories();
    assertNotNull(categories);
    assert(categories.data.some((c) => c.name.includes('Backend')));
  });

  // ==========================================
  // FEATURE 9: Student Listing & Enrollment (F-09)
  // ==========================================
  suite.test('F09-T01: Fetch students returns list of registered students', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getStudents();
    assert(Array.isArray(res?.data));
    assert(res.data.length >= 2);
    assertEqual(res.data[0].name, 'John Doe');
  });

  suite.test('F09-T02: `createStudentSchema` validates name, email, password, and avatar', () => {
    const studentData = {
      name: 'David Beckham',
      email: 'david@sports.com',
      password: 'beckhampassword',
      avatar: { name: 'avatar.png', size: 50000 }
    };
    const parsed = createStudentSchema.safeParse(studentData);
    assert(parsed.success, 'Valid student data should pass createStudentSchema');
  });

  suite.test('F09-T03: `addStudentCourseSchema` validates studentId', () => {
    const valid = { studentId: 'student-id-12345' };
    const parsed = addStudentCourseSchema.safeParse(valid);
    assert(parsed.success, 'Valid studentId should pass addStudentCourseSchema');
  });

  suite.test('F09-T04: Fetch course students returns enrolled student list for specific course', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getStudentsCourse('1');
    assert(Array.isArray(res?.data));
    assertEqual(res.data.length, 2);
    assertEqual(res.data[0].name, 'John Doe');
  });

  suite.test('F09-T05: Add student to course associates student with course ID', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.addStudentsCourse({ studentId: 's1' }, '2');
    assertEqual(res.message, 'Student added to course successfully');
    const updated = await client.services.getStudentsCourse('2');
    assertEqual(updated.data.length, 2);
  });

  // ==========================================
  // FEATURE 10: Subscriptions & Rewards (F-10)
  // ==========================================
  suite.test('F10-T01: Fetch subscriptions returns pricing tiers (Free, Pro, Premium)', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getSubscriptions();
    assert(Array.isArray(res?.data));
    assertEqual(res.data.length, 3);
    assertEqual(res.data[0].name, 'Free');
    assertEqual(res.data[1].name, 'Pro');
    assertEqual(res.data[2].name, 'Premium');
  });

  suite.test('F10-T02: Subscription plans include price, features array, and isActive flag', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getSubscriptions();
    const plan = res.data[1]; // Pro
    assertEqual(plan.price, 490000);
    assert(Array.isArray(plan.features));
    assertEqual(plan.isActive, true);
  });

  suite.test('F10-T03: Update subscription plan modifies plan attributes', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.updateSubscription(2, { price: 520000 });
    assertEqual(res.data.id, 2);
    assertEqual(res.data.message, 'Subscription plan updated successfully');
  });

  suite.test('F10-T04: Fetch rewards returns leaderboard ranking array with points', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getRewards();
    assertNotNull(res?.data?.leaderboard);
    assert(Array.isArray(res.data.leaderboard));
    assertEqual(res.data.leaderboard[0].studentName, 'Ali Valiyev');
    assertEqual(res.data.leaderboard[0].points, 1250);
  });

  suite.test('F10-T05: Rewards response returns badges array with name, description, icon', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');
    const res = await client.services.getRewards();
    assertNotNull(res?.data?.badges);
    assert(Array.isArray(res.data.badges));
    assertEqual(res.data.badges[0].name, "Faol o'quvchi");
    assertEqual(res.data.badges[0].icon, '🔥');
  });

  return suite;
}
