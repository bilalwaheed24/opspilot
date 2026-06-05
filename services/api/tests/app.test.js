const request = require('supertest');
const app = require('../src/app');

describe('API Tests', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /tasks returns array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  test('POST /tasks creates task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test task');
  });

  test('POST /tasks without title returns 400', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});