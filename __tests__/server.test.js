'use strict';

const { app } = require('../server.js');
const supertest = require('supertest');
const { db } = require('../auth/models');
const bcrypt = require('bcrypt');

const request = supertest(app);

beforeAll(async () => {
  await db.sync();
});

describe('Testing the POST methods', () => {
  test('Should signup to create a new user', async () => {
    let response = await request.post('/signup')
      .send({username: 'david', password: 'password'})
      .catch(e => console.log(e));
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('david');
    expect(await bcrypt.compare('password', response.body.password)).toBeTruthy();
  });
  test('Should signin to login as a user (use basic auth)', async () => {
    let response = await request.post('/signin')
      .auth('password', 'password')
      .catch(e => console.log(e));
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('password');
    expect(await bcrypt.compare('password', response.body.password)).toBeTruthy();
  });
});

describe('Testing the error handling of server', () => {
  test('Should respond with a 404 for incorrect method', async () => {
    const response = await request.get('/signin');
    expect(response.status).toEqual(404);
  });
});