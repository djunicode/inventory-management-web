export default {
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ data: 'data' })),
  get: jest.fn(() => Promise.resolve({ data: 'data' })),
  post: jest.fn(() => Promise.resolve({ data: '' })),
};

/* jest.mock('axios', () => jest.fn(() => Promise.resolve({ data: 'data' }))); */
