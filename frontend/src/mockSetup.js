import MockAdapter from 'axios-mock-adapter';
import apiInstance, { apiInstanceAuth } from './utils/axios';
import mockData from './mockData.json';

const mock = new MockAdapter(apiInstance, { delayResponse: 300 });
const mockAuth = new MockAdapter(apiInstanceAuth, { delayResponse: 300 });

// Helper to safely parse request body
const parseBody = (config) => {
  if (!config.data) return {};
  try {
    return typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
  } catch {
    return {};
  }
};

// 1. Sign In Handlers (/auth/login and legacy /sign-in)
const handleSignIn = (config) => {
  const { email, password } = parseBody(config);
  
  if (email === 'admin@gmail.com' && password === 'admin123') {
    return [200, mockData.signInAdmin];
  }
  if (email === 'superadmin@gmail.com' && password === 'superadmin123') {
    return [200, mockData.signInSuperAdmin];
  }
  if (email === 'student@gmail.com' && password === 'student123') {
    return [200, mockData.signInStudent];
  }
  
  return [401, { message: 'Invalid credentials. Please check your email and password.' }];
};

mock.onPost('/auth/login').reply(handleSignIn);
mock.onPost('/sign-in').reply(handleSignIn);

// 2. Sign Up Handlers (/auth/register and legacy /sign-up)
const handleSignUp = (config) => {
  const body = parseBody(config);
  const { email, password, name, firstName, lastName, role } = body;

  if (!email || !password) {
    return [400, { message: 'Email and password are required' }];
  }

  const fullName = name || [firstName, lastName].filter(Boolean).join(' ') || 'New User';
  const assignedRole = role || 'student';

  return [
    201,
    {
      data: {
        token: `mock-jwt-${assignedRole}-${Date.now()}`,
        role: assignedRole,
        user: {
          id: Date.now(),
          email,
          name: fullName,
          role: assignedRole
        }
      },
      message: 'Registration successful'
    }
  ];
};

mock.onPost('/auth/register').reply(handleSignUp);
mock.onPost('/sign-up').reply(handleSignUp);

// 3. Google OAuth (/auth/google)
const handleGoogleAuth = (config) => {
  const body = parseBody(config);
  const idToken = body?.idToken || body?.credential;

  if (!idToken) {
    return [400, { message: 'Google authentication token is required' }];
  }
  if (idToken === 'invalid_google_token') {
    return [401, { message: 'Google authentication failed: Invalid token' }];
  }

  return [
    200,
    {
      data: {
        token: `mock-jwt-google-${Date.now()}`,
        role: 'student',
        user: {
          id: 99,
          email: 'googleuser@gmail.com',
          name: 'Google User',
          role: 'student'
        }
      }
    }
  ];
};

mock.onPost('/auth/google').reply(handleGoogleAuth);

// 4. Logout (/auth/logout)
const handleLogout = () => {
  return [200, { success: true, message: 'Logged out successfully' }];
};

mock.onPost('/auth/logout').reply(handleLogout);
mockAuth.onPost('/auth/logout').reply(handleLogout);

// 5. Authenticated Endpoints
mockAuth.onGet('/overviews').reply(200, mockData.overviews);
mockAuth.onGet('/courses').reply(200, mockData.courses);
mockAuth.onGet(new RegExp('/courses/\\d+')).reply(200, mockData.courseDetail);
mockAuth.onGet('/students').reply(200, mockData.students);
mockAuth.onGet('/categories').reply(200, mockData.categories);
mockAuth.onGet('/subscriptions').reply(200, mockData.subscriptions);
mockAuth.onGet('/rewards').reply(200, mockData.rewards);

// Mock students courses
mockAuth.onGet('/courses/students').reply(200, mockData.courses);

// Mock other unauthenticated & authenticated fallbacks
mock.onAny().passThrough();
mockAuth.onAny().reply(200, { data: [] });

console.log('Mock setup complete. Endpoints ready for /auth/login, /auth/register, /auth/google, /auth/logout');

