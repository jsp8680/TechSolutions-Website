const request = require('supertest');
const createApp = require('./app');

describe('Test your Express.js routes', () => {
  let app;

  beforeEach(() => {
    app = createApp(); // Create a new app instance for each test
  });

  it('should test the signup route', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'body425@gmail.com',
        password: 'password425',
      });

    // ... Assertions
  });

it('should test the appointment route', async () => {

    const response = await request(app)
        .get('/appointments');


    // ... Assertions
    expect(response.statusCode).toBe(302);
    });

it('should test the scheduling route', async () => {
    const response = await request(app)
      .get('/schedule');

    // ... Assertions
    expect(response.statusCode).toBe(200);
    });

    it('should test the home route', async () => {
        const response = await request(app)
          .get('/');

          expect(response.statusCode).toBe(200);

    });

  it('should test the login route', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'john@example.com',
        password: 'password',
        
      });

    // ... Assertions
  });

  it('should test the logout route', async () => {
    const response = await request(app)
      .get('/logout');

    // ... Assertions
  }
    );



    });
