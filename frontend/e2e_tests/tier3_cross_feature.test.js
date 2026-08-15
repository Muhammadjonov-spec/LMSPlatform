/**
 * Tier 3: Cross-Feature Combinations E2E Test Suite
 * Validates sequential, multi-step pairwise integration flows across
 * authentication, authoring, syllabus management, student enrollment,
 * and security state transitions.
 * Threshold: 10 comprehensive cross-feature workflows.
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
  mutateContentSchema,
  createStudentSchema,
  addStudentCourseSchema,
  STRORAGE_KEY
} from './test_helper.js';

export function buildTier3Suite() {
  const suite = createTestSuite('Tier 3: Cross-Feature Combinations (Pairwise Integration Workflows)');

  // =========================================================================
  // WORKFLOW 1: Registration -> Sign-in -> Session Storage -> Auth Bearer
  // =========================================================================
  suite.test('W01: Register new user -> Authenticate -> Verify token storage & authenticated request', async () => {
    const client = createApiTestClient();
    const newUser = {
      name: 'Eleanor Shellstrop',
      email: 'eleanor@thegoodplace.com',
      password: 'goodplacepass123',
      role: 'manager'
    };

    // Step 1: Validate with signUpSchema
    assert(signUpSchema.safeParse(newUser).success);

    // Step 2: Register
    const regRes = await client.services.postSignup(newUser);
    assertEqual(regRes.data.user.email, newUser.email);

    // Step 3: Sign In with credentials
    const loginRes = await client.services.postSignIn({
      email: newUser.email,
      password: newUser.password
    });
    assertNotNull(loginRes.data.token);

    // Step 4: Persist in storage
    client.storage.setItem(STRORAGE_KEY, loginRes.data);

    // Step 5: Verify authenticated API access with injected token
    const overviewRes = await client.services.getOverviews();
    assertNotNull(overviewRes.data);
    assertEqual(overviewRes.data.totalStudents, 120);
  });

  // =========================================================================
  // WORKFLOW 2: Manager Auth -> Fetch Categories -> Create Course -> Verify List
  // =========================================================================
  suite.test('W02: Manager Login -> Select Category -> Author Course -> Verify in Catalog', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // Step 1: Fetch active categories
    const categoriesRes = await client.services.getCategories();
    assert(categoriesRes.data.length > 0);
    const selectedCategory = categoriesRes.data[0];

    // Step 2: Form payload validation
    const coursePayload = {
      name: 'Next.js 15 Fullstack Mastery',
      categoryId: String(selectedCategory.id || 'cat-12345'),
      tagline: 'App Router, Server Actions, and Turbopack',
      description: 'Master modern fullstack React development with Next.js 15 in this comprehensive curriculum.',
      thumbnail: { name: 'nextjs-cover.webp', size: 20480 }
    };
    assert(createCourseSchema.safeParse(coursePayload).success);

    // Step 3: Create course
    const createdCourseRes = await client.services.createCourse({
      name: coursePayload.name,
      categoryId: coursePayload.categoryId,
      category: { name: selectedCategory.name }
    });
    assertNotNull(createdCourseRes.data._id);

    // Step 4: Verify course appears in catalog
    const coursesListRes = await client.services.getCourses();
    const found = coursesListRes.data.find((c) => c._id === createdCourseRes.data._id);
    assertNotNull(found, 'Created course must appear in courses catalog');
    assertEqual(found.name, 'Newly Created Course');
  });

  // =========================================================================
  // WORKFLOW 3: Manager Auth -> Create Course -> Add Video Lesson -> Add Text Lesson -> Verify Syllabus
  // =========================================================================
  suite.test('W03: Create Course -> Append Video Lesson -> Append Text Lesson -> Verify Complete Syllabus', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // Step 1: Create Course
    const courseRes = await client.services.createCourse({ name: 'Python for Data Science' });
    const courseId = courseRes.data._id;

    // Step 2: Validate & Add Video Lesson
    const videoData = {
      title: 'NumPy Arrays & Vectorization',
      type: 'video',
      video: { name: 'numpy_lecture.mp4', size: 5000000 }
    };
    assert(mutateContentSchema.safeParse(videoData).success);
    const videoRes = await client.services.createContent({
      courseId,
      title: videoData.title,
      type: 'video',
      youtubeId: 'x7X9w_G88bY'
    });
    assertNotNull(videoRes.data._id);

    // Step 3: Validate & Add Text Lesson
    const textData = {
      title: 'Pandas DataFrame Cheatsheet',
      type: 'text',
      text: 'Pandas provides fast, flexible, and expressive data structures designed to make working with relational data intuitive.'
    };
    assert(mutateContentSchema.safeParse(textData).success);
    const textRes = await client.services.createContent({
      courseId,
      title: textData.title,
      type: 'text',
      text: textData.text
    });
    assertNotNull(textRes.data._id);

    // Step 4: Verify Syllabus Integrity in Course Detail
    const courseDetailRes = await client.services.getCourseDetail(courseId);
    assert(courseDetailRes.data.details.length >= 2, 'Syllabus must contain added modules');
  });

  // =========================================================================
  // WORKFLOW 4: Manager Auth -> Create Student -> Enroll Student to Course -> Verify Enrollment
  // =========================================================================
  suite.test('W04: Author Student -> Enroll to Course -> Verify Student in Course Roster', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // Step 1: Create Student
    const studentPayload = {
      name: 'Grace Hopper',
      email: 'grace.hopper@navy.mil',
      password: 'compilerpioneer',
      avatar: { name: 'grace.jpg', size: 10240 }
    };
    assert(createStudentSchema.safeParse(studentPayload).success);

    const studentRes = await client.services.createStudents(studentPayload);
    const studentId = studentRes.data._id;

    // Step 2: Validate Enrollment schema
    assert(addStudentCourseSchema.safeParse({ studentId: 'student-id-test' }).success);

    // Step 3: Enroll student into course 1
    const enrollRes = await client.services.addStudentsCourse({ studentId }, '1');
    assertEqual(enrollRes.message, 'Student added to course successfully');

    // Step 4: Verify Student appears in Course Roster
    const rosterRes = await client.services.getStudentsCourse('1');
    const enrolled = rosterRes.data.find((s) => s._id === studentId);
    assertNotNull(enrolled, 'Enrolled student must be present in course roster');
  });

  // =========================================================================
  // WORKFLOW 5: Manager Auth -> Update Course -> Edit Lesson -> Delete Lesson
  // =========================================================================
  suite.test('W05: Update Course Metadata -> Edit Video Lesson -> Delete Lesson Item -> Audit Syllabus', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // Step 1: Update Course Title
    const updateRes = await client.services.updateCourse({ name: 'Refactored Web Development' }, '1');
    assertEqual(updateRes.data._id, '1');

    // Step 2: Edit Content Item
    const editRes = await client.services.updateContent({ title: 'HTML5 Semantic Tags & Accessibility' }, 'c1');
    assertEqual(editRes.data._id, 'c1');

    // Step 3: Delete a Content Item
    const delRes = await client.services.deleteDetailContent('c3');
    assertEqual(delRes.message, 'Content item deleted successfully');

    // Step 4: Audit Course Detail
    const detailRes = await client.services.getCourseDetail('1');
    const remaining = detailRes.data.details.find((d) => d._id === 'c3');
    assertEqual(remaining, undefined, 'Deleted content item should not exist in details');
  });

  // =========================================================================
  // WORKFLOW 6: Student Auth -> Fetch Enrolled Courses -> Access Player Preview
  // =========================================================================
  suite.test('W06: Student Login -> Access Enrolled Courses -> Open Course Preview Player', async () => {
    const client = createApiTestClient();

    // Step 1: Login as Student
    const loginRes = await client.services.postSignIn({
      email: 'student@gmail.com',
      password: 'student123'
    });
    assertEqual(loginRes.data.role, 'student');
    client.storage.setItem(STRORAGE_KEY, loginRes.data);

    // Step 2: Get Enrolled Courses
    const enrolledRes = await client.services.getCoursesStudents();
    assert(Array.isArray(enrolledRes.data));
    assert(enrolledRes.data.length >= 1);
    const targetCourse = enrolledRes.data[0];

    // Step 3: Access Course Preview / Player
    const playerRes = await client.services.getCourseDetail(targetCourse._id, true);
    assertEqual(playerRes.data.isPreview, true);
    assert(playerRes.data.details.length > 0);
  });

  // =========================================================================
  // WORKFLOW 7: Full Lifecycle: Create Category -> Create Course -> Delete Course -> Delete Category
  // =========================================================================
  suite.test('W07: Complete CRUD Lifecycle: Category -> Course -> Teardown', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // Step 1: Create Category
    const catRes = await client.services.createCategory({
      name: 'Artificial Intelligence & LLMs',
      description: 'Generative AI and Agent Architectures'
    });
    const categoryId = catRes.data.id;

    // Step 2: Create Course in this Category
    const courseRes = await client.services.createCourse({
      name: 'Agentic AI Architecture',
      categoryId: String(categoryId)
    });
    const courseId = courseRes.data._id;

    // Step 3: Delete Course
    const delCourseRes = await client.services.deleteCourse(courseId);
    assertEqual(delCourseRes.message, 'Course deleted successfully');

    // Step 4: Delete Category
    const delCatRes = await client.services.deleteCategory(categoryId);
    assertEqual(delCatRes.message, 'Category deleted successfully');
  });

  // =========================================================================
  // WORKFLOW 8: Auth Token Invalidation -> 401 Interceptor -> Clean Storage Purge -> Safe Redirect
  // =========================================================================
  suite.test('W08: Session Expiry Interception -> Storage Cleanup -> Redirect Trigger Verification', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // Verify session active
    assertNotNull(client.storage.getItem(STRORAGE_KEY));

    // Force 401 on next request
    client.mockAuth.onGet('/overviews').reply(401, { message: 'Token Expired' });

    let caught = false;
    try {
      await client.services.getOverviews();
    } catch {
      caught = true;
    }
    assert(caught, 'Request should fail with 401');

    // Verify storage cleared and redirect triggered
    assertEqual(client.storage.getItem(STRORAGE_KEY), null, 'Session storage must be purged');
    const redirectStatus = client.getRedirectStatus();
    assertEqual(redirectStatus.redirectTriggered, true);
    assertEqual(redirectStatus.lastRedirectUrl, '/sign-in');
  });

  // =========================================================================
  // WORKFLOW 9: Student Course Enrollment & De-enrollment Cycle
  // =========================================================================
  suite.test('W09: Enroll Student to Course -> Verify Roster -> Unenroll Student -> Verify Removal', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // Step 1: Enroll student s1 to course 2
    await client.services.addStudentsCourse({ studentId: 's1' }, '2');
    const rosterAfterAdd = await client.services.getStudentsCourse('2');
    assert(rosterAfterAdd.data.some((s) => s._id === 's1'));

    // Step 2: Unenroll student s1 from course 2
    const unenrollRes = await client.services.deleteStudentsCourse('s1', '2');
    assertEqual(unenrollRes.message, 'Student removed from course successfully');

    // Step 3: Verify removal
    const rosterAfterRemove = await client.services.getStudentsCourse('2');
    assert(!rosterAfterRemove.data.some((s) => s._id === 's1'));
  });

  // =========================================================================
  // WORKFLOW 10: Registration -> Google OAuth Fallback -> Profile Synchronization
  // =========================================================================
  suite.test('W10: User Registration -> OAuth Sign-in Transition -> Student Session Verification', async () => {
    const client = createApiTestClient();

    // Step 1: Attempt standard registration
    const regPayload = {
      name: 'Klara Oswald',
      email: 'klara@soufflegirl.com',
      password: 'impossiblegirl1',
      role: 'student'
    };
    const regRes = await client.services.postSignup(regPayload);
    assertEqual(regRes.data.role, 'student');

    // Step 2: Sign-in via Google OAuth
    const googleRes = await client.services.postGoogleAuth('klara_google_token');
    client.storage.setItem(STRORAGE_KEY, googleRes.data);

    // Step 3: Access student features
    const rewardsRes = await client.services.getRewards();
    assert(rewardsRes.data.leaderboard.length > 0);
    assert(rewardsRes.data.badges.length > 0);
  });

  return suite;
}
