import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userID: string;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const jwtService = app.get(JwtService);
    const payload = {
      password: 'testPassword',
      email: 'someEmail@gmail.com',
    };
    jwtToken = jwtService.sign(payload);
  }, 20000);

  it('should create a user to /POST user', async () => {
    const createUserDto = {
      email: 'email@mail.com',
      password: '12345',
      firstName: 'dani',
      lastName: 'de vita',
      role: 'admin',
    };
    const response = await request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201);

    userID = response.body._id; //(used for other tests like patch, getById and remove)
  });

  it('should return a bad request due to invalid body to /POST user', async () => {
    const invalidUserDto = {
      email: 'email@mail.com',
      password: true,
      firstName: 'dani',
    };
    const response = await request(app.getHttpServer()).post('/user').send(invalidUserDto);
    expect(response.status).toEqual(400);
  });

  it('should get all users from /GET user', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    expect(Array.isArray(response.body)).toEqual(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.header).toHaveProperty('content-type');
  });

  it('should not authorize to get users from /GET user due to not real token', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer bad token no good`)
      .expect(401);
  });

  it('should get one user by id from /GET user/:id', async () => {
    await request(app.getHttpServer()).get(`/user/${userID}`).expect(200);
  });

  it('should get an error with a bad id to /GET user/:id', async () => {
    const response = await request(app.getHttpServer()).get(`/user/154021fc52b74c6d41d54a07`); // not a real id
    expect(response.status).toEqual(404);
  });

  it('should update a user by id to /PATCH user/:id', async () => {
    const updateUserDto = {
      firstName: 'DANIEL',
    };
    await request(app.getHttpServer()).patch(`/user/${userID}`).send(updateUserDto).expect(200);
  });

  it('should get an error due to bad id to /PATCH/:id', async () => {
    const updateUserDto = {
      lastName: 'some last name',
    };
    const response = await request(app.getHttpServer())
      .patch('/user/154021fc52b74c6d41d54a07') // not a real id
      .send(updateUserDto);
    expect(response.status).toEqual(404);
  });

  it('should delete a user by id from /DELETE user/:id', async () => {
    const response = await request(app.getHttpServer()).delete(`/user/${userID}`).expect(200);
    expect(response.body).toHaveProperty('message', 'User deleted');
  });

  it('should return 404 due to inexisting user to /DELETE user/:id', async () => {
    const response = await request(app.getHttpServer()).delete('/user/154021fc52b74c6d41d54a07'); // not a real id
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    await app.close(); //takes down the server/app
  });
});
