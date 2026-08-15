/**
 * Tier 4: Real-World Application Scenarios E2E Test Suite
 * Validates complex, multi-persona end-to-end user journeys simulating
 * actual manager authoring, student learning progression, platform administration,
 * and resilient error recovery workflows.
 * Threshold: 5 comprehensive real-world scenarios.
 */

import {
  createTestSuite,
  createApiTestClient,
  assert,
  assertEqual,
  assertNotNull,
  signUpSchema,
  createCourseSchema,
  mutateContentSchema,
  STRORAGE_KEY
} from './test_helper.js';

export function buildTier4Suite() {
  const suite = createTestSuite('Tier 4: Real-World Application Scenarios (End-to-End Persona Journeys)');

  // =========================================================================
  // SCENARIO 1: Complete Manager Course Authoring & Publishing Lifecycle
  // =========================================================================
  suite.test('RW-01: Manager Journey: Sign In -> Setup Category -> Author Course -> Upload 3 Lessons -> Publish & Verify Syllabus', async () => {
    const client = createApiTestClient();

    // 1. Manager Authentication
    const loginRes = await client.services.postSignIn({
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    assertEqual(loginRes.data.role, 'manager');
    client.storage.setItem(STRORAGE_KEY, loginRes.data);

    // 2. Setup Category
    const categoryRes = await client.services.createCategory({
      name: 'Cloud Native Architecture',
      description: 'Microservices, Kubernetes, and Serverless Systems'
    });
    const categoryId = categoryRes.data.id;

    // 3. Author Course Form Submission
    const coursePayload = {
      name: 'Microservices with Kubernetes and Istio',
      categoryId: `cat-cloud-${categoryId}`,
      tagline: 'Production-ready microservices deployment',
      description: 'Deep dive into service meshes, observability, and container orchestration.',
      thumbnail: { name: 'k8s-mesh-thumbnail.jpg', size: 1048576 }
    };
    assert(createCourseSchema.safeParse(coursePayload).success);

    const createdCourseRes = await client.services.createCourse({
      name: coursePayload.name,
      categoryId: coursePayload.categoryId,
      category: { name: 'Cloud Native Architecture' }
    });
    const courseId = createdCourseRes.data._id;

    // 4. Upload Lesson 1: Introduction Video
    const lesson1Payload = {
      title: 'Module 1: Monolith vs Microservices Architecture',
      type: 'video',
      video: { name: 'mod1_intro.mp4', size: 25000000 }
    };
    assert(mutateContentSchema.safeParse(lesson1Payload).success);
    await client.services.createContent({
      courseId,
      title: lesson1Payload.title,
      type: 'video',
      youtubeId: 'video_id_01'
    });

    // 5. Upload Lesson 2: Deep Dive Video
    const lesson2Payload = {
      title: 'Module 2: Configuring Istio Service Mesh & Envoy Proxies',
      type: 'video',
      video: { name: 'mod2_istio.mp4', size: 35000000 }
    };
    assert(mutateContentSchema.safeParse(lesson2Payload).success);
    await client.services.createContent({
      courseId,
      title: lesson2Payload.title,
      type: 'video',
      youtubeId: 'video_id_02'
    });

    // 6. Upload Lesson 3: Text Lab Instructions
    const lesson3Payload = {
      title: 'Module 3: Hands-On Lab — Deploying Canary Releases',
      type: 'text',
      text: 'In this lab, you will configure VirtualServices and DestinationRules in Istio to implement a 90/10 canary traffic split across deployment v1 and v2.'
    };
    assert(mutateContentSchema.safeParse(lesson3Payload).success);
    await client.services.createContent({
      courseId,
      title: lesson3Payload.title,
      type: 'text',
      text: lesson3Payload.text
    });

    // 7. Publish Verification & Syllabus Audit
    const finalCourseDetail = await client.services.getCourseDetail(courseId);
    assert(finalCourseDetail.data.details.length >= 3, 'Course must have at least 3 lessons');
    assertEqual(finalCourseDetail.data.details[0].type, 'video');

    // 8. Overview Stats Verification
    const overviewStats = await client.services.getOverviews();
    assert(overviewStats.data.totalCourses > 15, 'Total courses count must reflect newly published course');
  });

  // =========================================================================
  // SCENARIO 2: End-to-End Student Learning & Progress Journey
  // =========================================================================
  suite.test('RW-02: Student Journey: Registration -> Sign-in -> Catalog Exploration -> Video Lesson Player -> Rewards Check', async () => {
    const client = createApiTestClient();

    // 1. Student Self-Registration
    const newStudent = {
      name: 'Samwise Gamgee',
      email: 'samwise@theshire.org',
      password: 'elvenropepassword',
      role: 'student'
    };
    assert(signUpSchema.safeParse(newStudent).success);
    const regRes = await client.services.postSignup(newStudent);
    assertEqual(regRes.data.role, 'student');

    // 2. Student Authentication
    const loginRes = await client.services.postSignIn({
      email: newStudent.email,
      password: newStudent.password
    });
    client.storage.setItem(STRORAGE_KEY, loginRes.data);

    // 3. Explore Enrolled Courses
    const enrolledRes = await client.services.getCoursesStudents();
    assert(enrolledRes.data.length > 0, 'Student should have enrolled courses list');
    const firstCourse = enrolledRes.data[0];

    // 4. Open Course Player (Preview Mode)
    const playerRes = await client.services.getCourseDetail(firstCourse._id, true);
    assertEqual(playerRes.data.isPreview, true);
    assert(playerRes.data.details.length > 0);

    // 5. Access First Lesson Details
    const firstLesson = playerRes.data.details[0];
    const lessonDetail = await client.services.getDetailContent(firstLesson._id);
    assertEqual(lessonDetail.data._id, firstLesson._id);

    // 6. View Leaderboards & Badges
    const rewards = await client.services.getRewards();
    assert(rewards.data.leaderboard.length > 0, 'Leaderboard must contain student ranks');
    assert(rewards.data.badges.length > 0, 'Badges must be available for motivation');
  });

  // =========================================================================
  // SCENARIO 3: Platform Administration & Metrics Audit
  // =========================================================================
  suite.test('RW-03: SuperAdmin Journey: Sign In -> Dashboard Analytics Audit -> Subscriptions Pricing -> Students Directory', async () => {
    const client = createApiTestClient();

    // 1. SuperAdmin Sign In
    const loginRes = await client.services.postSignIn({
      email: 'superadmin@gmail.com',
      password: 'superadmin123'
    });
    assertEqual(loginRes.data.role, 'manager');
    client.storage.setItem(STRORAGE_KEY, loginRes.data);

    // 2. Audit Platform Metrics
    const metrics = await client.services.getOverviews();
    assert(metrics.data.totalStudents >= 100, 'Student population metric verified');
    assert(metrics.data.totalCourses >= 10, 'Course catalog count verified');
    assert(metrics.data.totalRevenue > 0, 'Platform revenue verified');

    // 3. Inspect & Update Subscription Tiers
    const subPlans = await client.services.getSubscriptions();
    assertEqual(subPlans.data.length, 3);
    const updateSubRes = await client.services.updateSubscription(3, { price: 1050000 });
    assertEqual(updateSubRes.data.id, 3);

    // 4. Audit Student Directory
    const studentsList = await client.services.getStudents();
    assert(studentsList.data.length >= 2);
    const firstStudent = studentsList.data[0];
    const detailStudent = await client.services.getDetailStudent(firstStudent._id);
    assertEqual(detailStudent.data._id, firstStudent._id);

    // 5. Audit Taxonomy
    const categories = await client.services.getCategories();
    assert(categories.data.length >= 4);
  });

  // =========================================================================
  // SCENARIO 4: Course Management, Batch Student Enrollment & Syllabus Revision
  // =========================================================================
  suite.test('RW-04: Manager Journey: Existing Course Selection -> Batch Enrollment -> Syllabus Revision -> Unenrollment', async () => {
    const client = createApiTestClient();
    client.loginAs('manager');

    // 1. Fetch Course Catalog and select course '1'
    const courses = await client.services.getCourses();
    assert(courses.data.length > 0);
    const targetCourse = courses.data[0];

    // 2. Batch enroll additional students into course '1'
    await client.services.addStudentsCourse({ studentId: 's1' }, targetCourse._id);
    await client.services.addStudentsCourse({ studentId: 's2' }, targetCourse._id);

    const roster = await client.services.getStudentsCourse(targetCourse._id);
    assert(roster.data.length >= 2, 'Roster should contain enrolled students');

    // 3. Add supplemental text resource to syllabus
    const resourceContent = await client.services.createContent({
      courseId: targetCourse._id,
      title: 'Module Appendix: Additional Reading Materials and Bibliography',
      type: 'text',
      text: 'Recommended reading: Clean Code by Robert C. Martin and Design Patterns by GoF.'
    });
    assertNotNull(resourceContent.data._id);

    // 4. Update Course Description
    await client.services.updateCourse({ description: 'Updated comprehensive syllabus with additional reading.' }, targetCourse._id);

    // 5. Unenroll student s2
    const unenrollRes = await client.services.deleteStudentsCourse('s2', targetCourse._id);
    assertEqual(unenrollRes.message, 'Student removed from course successfully');

    // 6. Verify final course state
    const finalCourse = await client.services.getCourseDetail(targetCourse._id);
    assertNotNull(finalCourse.data);
  });

  // =========================================================================
  // SCENARIO 5: Resilient Error Recovery & Expired Session Re-authentication
  // =========================================================================
  suite.test('RW-05: Session Resilience Journey: Active Session -> Token Expiry (401) -> Storage Purge -> Re-Authentication', async () => {
    const client = createApiTestClient();

    // 1. Initial Login
    const loginRes = await client.services.postSignIn({
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    client.storage.setItem(STRORAGE_KEY, loginRes.data);
    assertNotNull(client.storage.getItem(STRORAGE_KEY));

    // 2. Execute Successful Authenticated Request
    const initialOverview = await client.services.getOverviews();
    assertNotNull(initialOverview.data);

    // 3. Simulate Server Token Expiration -> Intercept 401
    client.mockAuth.onGet('/overviews').replyOnce(401, { message: 'JWT token has expired' });

    let failedAsExpected = false;
    try {
      await client.services.getOverviews();
    } catch {
      failedAsExpected = true;
    }
    assert(failedAsExpected, 'Expired session request should fail with 401');

    // 4. Verify Interceptor Purged Storage and Triggered Redirect
    assertEqual(client.storage.getItem(STRORAGE_KEY), null, 'Storage should be purged on 401');
    const status = client.getRedirectStatus();
    assertEqual(status.redirectTriggered, true);
    assertEqual(status.lastRedirectUrl, '/sign-in');

    // 5. User Re-Authenticates with Fresh Credentials
    const freshLogin = await client.services.postSignIn({
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    client.storage.setItem(STRORAGE_KEY, freshLogin.data);

    // 6. Restore Normal Authenticated Operations
    const restoredOverview = await client.services.getOverviews();
    assertNotNull(restoredOverview.data);
    assertEqual(restoredOverview.data.totalStudents, 120);
  });

  return suite;
}
