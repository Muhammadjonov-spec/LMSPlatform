/**
 * E2E Test Suite Helper & In-Memory API Simulator
 * Provides deterministic mock storage, API client with interceptors,
 * in-memory mock database, and test assertions.
 */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mockDataRaw from '../src/mockData.json' with { type: 'json' };
import {
  signUpSchema,
  signInSchema,
  createCourseSchema,
  updateCourseSchema,
  mutateContentSchema,
  createStudentSchema,
  updateStudentSchema,
  addStudentCourseSchema
} from '../src/utils/zodSchema.js';

export {
  signUpSchema,
  signInSchema,
  createCourseSchema,
  updateCourseSchema,
  mutateContentSchema,
  createStudentSchema,
  updateStudentSchema,
  addStudentCourseSchema
};

/**
 * In-Memory Mock Secure Storage (Drop-in simulation for react-secure-storage)
 */
export class MockSecureStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    if (!this.store.has(key)) return null;
    const value = this.store.get(key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  setItem(key, value) {
    if (typeof value === 'object' && value !== null) {
      this.store.set(key, JSON.stringify(value));
    } else {
      this.store.set(key, String(value));
    }
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export const STRORAGE_KEY = 'STRORAGE_KEY';

/**
 * Creates an isolated API Test Client with configured interceptors and in-memory mock DB.
 */
export function createApiTestClient(customInitialState = null) {
  const storage = new MockSecureStorage();
  let redirectTriggered = false;
  let lastRedirectUrl = null;

  // Clone seed database
  const db = {
    users: [
      { id: 1, email: 'admin@gmail.com', password: 'admin123', name: 'Admin User', role: 'manager' },
      { id: 2, email: 'superadmin@gmail.com', password: 'superadmin123', name: 'Super Admin User', role: 'manager' },
      { id: 3, email: 'student@gmail.com', password: 'student123', name: 'Student User', role: 'student' }
    ],
    overviews: JSON.parse(JSON.stringify(mockDataRaw.overviews.data)),
    courses: JSON.parse(JSON.stringify(mockDataRaw.courses.data)),
    courseDetail: JSON.parse(JSON.stringify(mockDataRaw.courseDetail.data)),
    students: [
      { _id: 's1', name: 'John Doe', email: 'john@example.com', avatar_url: 'https://images.unsplash.com/photo-1535713875002', courses: ['1'] },
      { _id: 's2', name: 'Jane Smith', email: 'jane@example.com', avatar_url: 'https://images.unsplash.com/photo-1494790108377', courses: ['1', '2'] }
    ],
    categories: JSON.parse(JSON.stringify(mockDataRaw.categories.data)),
    subscriptions: JSON.parse(JSON.stringify(mockDataRaw.subscriptions.data)),
    rewards: JSON.parse(JSON.stringify(mockDataRaw.rewards)),
    courseStudents: {
      '1': [
        { _id: 's1', name: 'John Doe', email: 'john@example.com' },
        { _id: 's2', name: 'Jane Smith', email: 'jane@example.com' }
      ],
      '2': [
        { _id: 's2', name: 'Jane Smith', email: 'jane@example.com' }
      ]
    },
    enrolledCourses: [
      { _id: '1', name: 'Frontend Web Development', category: { name: 'Programming' }, progress: 65 },
      { _id: '2', name: 'UI/UX Design Masterclass', category: { name: 'Design' }, progress: 30 }
    ],
    teachers: [],
    orders: []
  };

  if (customInitialState) {
    Object.assign(db, customInitialState);
  }

  // Axios instances
  const apiInstance = axios.create({ baseURL: 'http://localhost:5000/api/v1', timeout: 5000 });
  const apiInstanceAuth = axios.create({ baseURL: 'http://localhost:5000/api/v1', timeout: 5000 });

  // Request interceptor for auth
  apiInstanceAuth.interceptors.request.use(
    (config) => {
      try {
        const session = storage.getItem(STRORAGE_KEY);
        if (session) {
          const token = typeof session === 'string' ? session : session?.token ?? session?.data?.token;
          if (token) {
            config.headers = {
              ...(config.headers || {}),
              Authorization: `Bearer ${token}`
            };
          }
        }
      } catch (err) {
        void err;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  // Response interceptor for 401
  apiInstanceAuth.interceptors.response.use(
    (response) => response,
    (err) => {
      const status = err?.response?.status;
      if (status === 401) {
        try {
          storage.removeItem(STRORAGE_KEY);
        } catch (removeErr) {
          void removeErr;
        }
        redirectTriggered = true;
        lastRedirectUrl = '/sign-in';
      }
      return Promise.reject(err);
    }
  );

  // Mock Adapters
  const mockPublic = new MockAdapter(apiInstance);
  const mockAuth = new MockAdapter(apiInstanceAuth);

  // 1. Auth Handlers
  const handleLogin = (config) => {
    let body;
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      return [400, { message: 'Invalid JSON payload' }];
    }
    const { email, password } = body || {};
    if (!email || !password) {
      return [400, { message: 'Email and password are required' }];
    }

    const user = db.users.find((u) => u.email === email && u.password === password);
    if (user) {
      const token = `mock-jwt-${user.role}-${user.id}`;
      return [
        200,
        {
          data: {
            token,
            role: user.role,
            user: { id: user.id, email: user.email, name: user.name }
          }
        }
      ];
    }
    return [401, { message: 'Invalid credentials' }];
  };

  mockPublic.onPost('/auth/login').reply(handleLogin);
  mockPublic.onPost('/sign-in').reply(handleLogin);

  const handleRegister = (config) => {
    let body;
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      return [400, { message: 'Invalid JSON payload' }];
    }
    const { email, password, name, role } = body || {};
    if (!email || !password || (!name && (!body?.firstName || !body?.lastName))) {
      return [400, { message: 'Missing required registration fields' }];
    }
    const fullName = name || `${body.firstName || ''} ${body.lastName || ''}`.trim();
    if (password.length < 5) {
      return [400, { message: 'Password must be at least 5 characters' }];
    }
    const existing = db.users.find((u) => u.email === email);
    if (existing) {
      return [409, { message: 'User with this email already exists' }];
    }

    const newUser = {
      id: db.users.length + 1,
      email,
      password,
      name: fullName,
      role: role || 'student'
    };
    db.users.push(newUser);
    const token = `mock-jwt-${newUser.role}-${newUser.id}`;
    return [
      201,
      {
        data: {
          token,
          role: newUser.role,
          user: { id: newUser.id, email: newUser.email, name: newUser.name }
        }
      }
    ];
  };

  mockPublic.onPost('/auth/register').reply(handleRegister);
  mockPublic.onPost('/sign-up').reply(handleRegister);

  // Google OAuth
  mockPublic.onPost('/auth/google').reply((config) => {
    let body;
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      return [400, { message: 'Invalid JSON payload' }];
    }
    const idToken = body?.idToken || body?.credential;
    if (!idToken) {
      return [400, { message: 'Google idToken is required' }];
    }
    if (idToken === 'invalid_google_token') {
      return [401, { message: 'Google authentication failed: Invalid token' }];
    }
    return [
      200,
      {
        data: {
          token: `mock-google-jwt-${Date.now()}`,
          role: 'student',
          user: { id: 99, email: 'googleuser@gmail.com', name: 'Google User' }
        }
      }
    ];
  });

  // Logout
  mockAuth.onPost('/auth/logout').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { success: true, message: 'Logged out successfully' }];
  });

  // 2. Overviews
  mockAuth.onGet('/overviews').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { data: db.overviews }];
  });

  // 3. Courses
  mockAuth.onGet('/courses').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { data: db.courses }];
  });

  mockAuth.onGet(new RegExp('/courses/\\d+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/(\d+)/);
    const id = idMatch ? idMatch[1] : '1';
    if (id === '9999' || id === '999') {
      return [404, { message: 'Course not found' }];
    }
    const isPreview = config.url.includes('preview=true');
    const course = {
      ...db.courseDetail,
      _id: id,
      isPreview
    };
    return [200, { data: course }];
  });

  mockAuth.onPost('/courses').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const newCourse = {
      _id: String(db.courses.length + 1),
      name: 'Newly Created Course',
      category: { name: 'Programming' },
      thumbnail_url: 'https://images.unsplash.com/photo-course-thumb',
      ...((typeof config.data === 'object' && config.data !== null && !(config.data instanceof FormData)) ? config.data : {})
    };
    db.courses.push(newCourse);
    db.overviews.totalCourses += 1;
    return [201, { data: newCourse }];
  });

  mockAuth.onPut(new RegExp('/courses/\\d+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/(\d+)/);
    const id = idMatch ? idMatch[1] : '1';
    return [200, { data: { _id: id, name: 'Updated Course Name', updatedAt: new Date().toISOString() } }];
  });

  mockAuth.onDelete(new RegExp('/courses/\\d+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/(\d+)/);
    const id = idMatch ? idMatch[1] : '1';
    db.courses = db.courses.filter((c) => c._id !== id);
    if (db.overviews.totalCourses > 0) db.overviews.totalCourses -= 1;
    return [200, { message: 'Course deleted successfully' }];
  });

  // 4. Course Contents
  mockAuth.onPost('/courses/contents').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const newContent = {
      _id: `c${Date.now()}`,
      title: 'New Lesson Item',
      type: 'video',
      youtubeId: 'dQw4w9WgXcQ',
      description: 'Lesson description'
    };
    if (!db.courseDetail.details) db.courseDetail.details = [];
    db.courseDetail.details.push(newContent);
    return [201, { data: newContent }];
  });

  mockAuth.onGet(new RegExp('/courses/contents/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/contents\/(\w+)/);
    const contentId = idMatch ? idMatch[1] : 'c1';
    const item = db.courseDetail.details?.find((d) => d._id === contentId) || {
      _id: contentId,
      title: 'Sample Lesson',
      type: 'video',
      description: 'Sample description'
    };
    return [200, { data: item }];
  });

  mockAuth.onPut(new RegExp('/courses/contents/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/contents\/(\w+)/);
    const contentId = idMatch ? idMatch[1] : 'c1';
    return [200, { data: { _id: contentId, title: 'Updated Lesson Title', status: 'updated' } }];
  });

  mockAuth.onDelete(new RegExp('/courses/contents/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/contents\/(\w+)/);
    const contentId = idMatch ? idMatch[1] : 'c1';
    if (db.courseDetail.details) {
      db.courseDetail.details = db.courseDetail.details.filter((d) => d._id !== contentId);
    }
    return [200, { message: 'Content item deleted successfully' }];
  });

  // 5. Students & Course Enrollment
  mockAuth.onGet('/students').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { data: db.students }];
  });

  mockAuth.onGet(new RegExp('/students/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/students\/(\w+)/);
    const id = idMatch ? idMatch[1] : 's1';
    const student = db.students.find((s) => s._id === id) || db.students[0];
    return [200, { data: student }];
  });

  mockAuth.onPost('/students').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const newStudent = {
      _id: `s${db.students.length + 1}`,
      name: 'New Enrolled Student',
      email: 'student.new@example.com',
      avatar_url: 'https://images.unsplash.com/photo-new',
      courses: []
    };
    db.students.push(newStudent);
    db.overviews.totalStudents += 1;
    return [201, { data: newStudent }];
  });

  mockAuth.onDelete(new RegExp('/students/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/students\/(\w+)/);
    const id = idMatch ? idMatch[1] : 's1';
    db.students = db.students.filter((s) => s._id !== id);
    if (db.overviews.totalStudents > 0) db.overviews.totalStudents -= 1;
    return [200, { message: 'Student deleted successfully' }];
  });

  mockAuth.onGet(new RegExp('/courses/students/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/students\/(\w+)/);
    const courseId = idMatch ? idMatch[1] : '1';
    const list = db.courseStudents[courseId] || [];
    return [200, { data: list }];
  });

  mockAuth.onPost(new RegExp('/courses/students/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/students\/(\w+)/);
    const courseId = idMatch ? idMatch[1] : '1';
    let body;
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = {};
    }
    const studentId = body?.studentId || 's1';
    if (!db.courseStudents[courseId]) db.courseStudents[courseId] = [];
    const student = db.students.find((s) => s._id === studentId) || { _id: studentId, name: 'Enrolled Student', email: 'enrolled@example.com' };
    db.courseStudents[courseId].push(student);
    return [200, { message: 'Student added to course successfully', data: student }];
  });

  mockAuth.onPut(new RegExp('/courses/students/\\w+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/courses\/students\/(\w+)/);
    const courseId = idMatch ? idMatch[1] : '1';
    let body;
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = {};
    }
    const studentId = body?.studentId;
    if (db.courseStudents[courseId]) {
      db.courseStudents[courseId] = db.courseStudents[courseId].filter((s) => s._id !== studentId);
    }
    return [200, { message: 'Student removed from course successfully' }];
  });

  mockAuth.onGet('/students-courses').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { data: db.enrolledCourses }];
  });

  // 6. Categories
  mockAuth.onGet('/categories').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { data: db.categories }];
  });

  mockAuth.onPost('/categories').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    let body;
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = {};
    }
    const newCategory = {
      id: db.categories.length + 1,
      name: body?.name || 'New Category',
      description: body?.description || 'Category Description',
      courseCount: 0
    };
    db.categories.push(newCategory);
    return [201, { data: newCategory }];
  });

  mockAuth.onDelete(new RegExp('/categories/\\d+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/categories\/(\d+)/);
    const id = idMatch ? Number(idMatch[1]) : 1;
    db.categories = db.categories.filter((cat) => cat.id !== id);
    return [200, { message: 'Category deleted successfully' }];
  });

  // 7. Subscriptions & Rewards
  mockAuth.onGet('/subscriptions').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { data: db.subscriptions }];
  });

  mockAuth.onPut(new RegExp('/subscriptions/\\d+')).reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    const idMatch = config.url.match(/\/subscriptions\/(\d+)/);
    const id = idMatch ? Number(idMatch[1]) : 1;
    return [200, { data: { id, message: 'Subscription plan updated successfully' } }];
  });

  mockAuth.onGet('/rewards').reply((config) => {
    const authHeader = config.headers?.Authorization;
    if (!authHeader) return [401, { message: 'Unauthorized' }];
    return [200, { data: db.rewards }];
  });

  // Services Wrapper object bound to this client
  const services = {
    // Auth
    postSignup: async (data) => apiInstance.post('/auth/register', data).then((res) => res.data),
    postSignIn: async (data) => apiInstance.post('/auth/login', data).then((res) => res.data),
    postGoogleAuth: async (idToken) => apiInstance.post('/auth/google', { idToken }).then((res) => res.data),
    postLogout: async () => apiInstanceAuth.post('/auth/logout').then((res) => res.data),

    // Overviews
    getOverviews: async () => apiInstanceAuth.get('/overviews').then((res) => res.data),

    // Courses
    getCourses: async () => apiInstanceAuth.get('/courses').then((res) => res.data),
    getCourseDetail: async (id, isPreview = false) =>
      apiInstanceAuth.get(`/courses/${id}${isPreview ? '?preview=true' : ''}`).then((res) => res.data),
    createCourse: async (data) => apiInstanceAuth.post('/courses', data).then((res) => res.data),
    updateCourse: async (data, id) => apiInstanceAuth.put(`/courses/${id}`, data).then((res) => res.data),
    deleteCourse: async (id) => apiInstanceAuth.delete(`/courses/${id}`).then((res) => res.data),

    // Contents
    createContent: async (data) => apiInstanceAuth.post('/courses/contents', data).then((res) => res.data),
    getDetailContent: async (id) => apiInstanceAuth.get(`/courses/contents/${id}`).then((res) => res.data),
    updateContent: async (data, id) => apiInstanceAuth.put(`/courses/contents/${id}`, data).then((res) => res.data),
    deleteDetailContent: async (id) => apiInstanceAuth.delete(`/courses/contents/${id}`).then((res) => res.data),

    // Students
    getStudents: async () => apiInstanceAuth.get('/students').then((res) => res.data),
    getDetailStudent: async (id) => apiInstanceAuth.get(`/students/${id}`).then((res) => res.data),
    createStudents: async (data) => apiInstanceAuth.post('/students', data).then((res) => res.data),
    deleteStudent: async (id) => apiInstanceAuth.delete(`/students/${id}`).then((res) => res.data),
    getStudentsCourse: async (id) => apiInstanceAuth.get(`/courses/students/${id}`).then((res) => res.data),
    addStudentsCourse: async (data, id) => apiInstanceAuth.post(`/courses/students/${id}`, data).then((res) => res.data),
    deleteStudentsCourse: async (studentId, courseId) =>
      apiInstanceAuth.put(`/courses/students/${courseId}`, { studentId }).then((res) => res.data),
    getCoursesStudents: async () => apiInstanceAuth.get('/students-courses').then((res) => res.data),

    // Categories
    getCategories: async () => apiInstanceAuth.get('/categories').then((res) => res.data),
    createCategory: async (data) => apiInstanceAuth.post('/categories', data).then((res) => res.data),
    deleteCategory: async (id) => apiInstanceAuth.delete(`/categories/${id}`).then((res) => res.data),

    // Subscriptions
    getSubscriptions: async () => apiInstanceAuth.get('/subscriptions').then((res) => res.data),
    updateSubscription: async (id, data) => apiInstanceAuth.put(`/subscriptions/${id}`, data).then((res) => res.data),

    // Rewards
    getRewards: async () => apiInstanceAuth.get('/rewards').then((res) => res.data)
  };

  return {
    apiInstance,
    apiInstanceAuth,
    mockPublic,
    mockAuth,
    storage,
    db,
    services,
    getRedirectStatus: () => ({ redirectTriggered, lastRedirectUrl }),
    loginAs: (role = 'manager') => {
      const user = db.users.find((u) => u.role === role) || db.users[0];
      const sessionData = {
        token: `mock-jwt-${user.role}-${user.id}`,
        role: user.role,
        user: { id: user.id, email: user.email, name: user.name }
      };
      storage.setItem(STRORAGE_KEY, sessionData);
      return sessionData;
    }
  };
}

/**
 * Lightweight Test Assertion Framework
 */
export function createTestSuite(suiteName) {
  const tests = [];

  function test(name, fn) {
    tests.push({ name, fn });
  }

  async function run() {
    const results = {
      suiteName,
      passed: 0,
      failed: 0,
      tests: [],
      durationMs: 0
    };

    const startTime = Date.now();

    for (const t of tests) {
      const testStart = Date.now();
      try {
        await t.fn();
        const duration = Date.now() - testStart;
        results.passed++;
        results.tests.push({ name: t.name, status: 'PASS', duration });
      } catch (err) {
        const duration = Date.now() - testStart;
        results.failed++;
        results.tests.push({
          name: t.name,
          status: 'FAIL',
          duration,
          error: err.message,
          stack: err.stack
        });
      }
    }

    results.durationMs = Date.now() - startTime;
    return results;
  }

  return { test, it: test, run, getTestCount: () => tests.length };
}

/**
 * Custom Assertion Matchers
 */
export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message ? message + ': ' : ''}Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
  }
}

export function assertDeepEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${message ? message + ': ' : ''}Deep equality mismatch.\nExpected: ${e}\nActual: ${a}`);
  }
}

export function assertNotNull(actual, message) {
  if (actual === null || actual === undefined) {
    throw new Error(message || `Expected non-null value, got ${actual}`);
  }
}

export function assertThrows(fn, message) {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) {
    throw new Error(message || 'Expected function to throw error, but it succeeded');
  }
}

export async function assertRejects(promiseFn, message) {
  let rejected = false;
  try {
    await promiseFn();
  } catch {
    rejected = true;
  }
  if (!rejected) {
    throw new Error(message || 'Expected promise to reject, but it resolved');
  }
}
