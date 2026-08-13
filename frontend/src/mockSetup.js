import MockAdapter from 'axios-mock-adapter';
import apiInstance, { apiInstanceAuth } from './utils/axios';
import mockData from './mockData.json';

const mock = new MockAdapter(apiInstance, { delayResponse: 500 });
const mockAuth = new MockAdapter(apiInstanceAuth, { delayResponse: 500 });

// Mock Sign In
mock.onPost('/sign-in').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  
  if (email === 'admin@gmail.com' && password === 'admin123') {
    return [200, mockData.signInAdmin];
  }
  if (email === 'superadmin@gmail.com' && password === 'superadmin123') {
    return [200, mockData.signInSuperAdmin];
  }
  if (email === 'student@gmail.com' && password === 'student123') {
    return [200, mockData.signInStudent];
  }
  
  return [401, { message: 'Invalid credentials' }];
});

// Mock other unauthenticated endpoints if any
mock.onAny().passThrough();

// Mock Authenticated Endpoints
mockAuth.onGet('/overviews').reply(200, mockData.overviews);
mockAuth.onGet('/courses').reply(200, mockData.courses);
mockAuth.onGet(new RegExp('/courses/\\d+')).reply(200, mockData.courseDetail);
mockAuth.onGet('/students').reply(200, mockData.students);
mockAuth.onGet('/categories').reply(200, mockData.categories);
mockAuth.onGet('/subscriptions').reply(200, mockData.subscriptions);
mockAuth.onGet('/rewards').reply(200, mockData.rewards);

// Mock students courses
mockAuth.onGet('/courses/students').reply(200, mockData.courses);

// Catch all for any other authenticated requests to prevent crash
mockAuth.onAny().reply(200, { data: [] });

console.log('Mock setup complete. Use admin@gmail.com, superadmin@gmail.com, or student@gmail.com with passwords admin123, superadmin123, student123');
