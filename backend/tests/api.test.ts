import request from 'supertest';
import app from '../src/app'; // Adjust the path to your Express app

describe('API Endpoints', () => {
  it('GET /ping should return pong', async () => {
    const response = await request(app).get('/ping');
    expect(response.status).toBe(200);
    expect(response.text).toBe('pong');
  });
});


describe('Default route', () =>{
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Route not found' });
  });
});