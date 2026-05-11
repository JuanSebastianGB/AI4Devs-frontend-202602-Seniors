import { getApiBaseUrl } from './apiConfig';

describe('getApiBaseUrl', () => {
  const original = process.env.REACT_APP_API_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.REACT_APP_API_URL;
    } else {
      process.env.REACT_APP_API_URL = original;
    }
  });

  it('defaults when REACT_APP_API_URL is unset', () => {
    delete process.env.REACT_APP_API_URL;
    expect(getApiBaseUrl()).toBe('http://localhost:3010');
  });

  it('strips trailing slash', () => {
    process.env.REACT_APP_API_URL = 'http://api.example.com/';
    expect(getApiBaseUrl()).toBe('http://api.example.com');
  });
});
