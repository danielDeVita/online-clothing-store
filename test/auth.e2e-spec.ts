import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 20000);

  it('should register a new user to (POST) /auth/register', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `${Math.floor(Math.random() * 100)}@email.com`, //random email so it doesn't repeat in DB and passes validation
        name: 'Test User',
        password: 'password',
      })
      .expect(201);
  });

  it('should not allow a new user to (POST) /auth/register due to repeated email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', name: 'Test User', password: 'password' })
      .expect(400);
  });

  it('should login a registered user to (POST) /auth/login ', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(201);
  });

  it('should not login a registered user to (POST) /auth/login due to bad credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'NOT_THE_CORRECT_PASSWORD' })
      .expect(400);
  });

  afterAll(async () => {
    await app.close(); //takes down the server/app
  });
});
