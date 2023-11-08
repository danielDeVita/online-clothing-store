import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('OrderController (e2e)', () => {
  let app: INestApplication;
  let orderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 20000);

  it('should create an order to /POST order', async () => {
    const createOrderDto = {
      user: '654021fc52b74c6d41d54a07',
      products: ['654b70ad06d8867fc1b1af5e'],
    };
    const response = await request(app.getHttpServer())
      .post('/order')
      .send(createOrderDto)
      .expect(201);
    orderId = response.body._id;
  });

  it('should return a server error due to bad data in body to /POST order', async () => {
    const invalidOrderDto = {
      products: ['054b71b5b334593b3e2847fc'], //non-existing product
    };
    const response = await request(app.getHttpServer()).post('/order').send(invalidOrderDto);
    expect(response.status).toEqual(500);
  });

  it('should get an error due to inssuficient stock to /PATCH order/:id', async () => {
    const createOrderDto = {
      products: ['654b70c606d8867fc1b1af61'],
    };
    const response = await request(app.getHttpServer())
      .post('/order/') // not a real id
      .send(createOrderDto);
    expect(response.status).toEqual(418);
  });

  it('GET /order', async () => {
    const response = await request(app.getHttpServer()).get('/order');
    expect(response.status).toEqual(200);
    expect(response.body).toBeDefined(); // Assert that the response body exists
    expect(Array.isArray(response.body)).toEqual(true); // Assert that the response is an array
  });

  it('should get one order by id from /GET order/:id', async () => {
    await request(app.getHttpServer()).get(`/order/${orderId}`).expect(200);
  });

  it('should get an error with a bad id to /GET order/:id', async () => {
    const response = await request(app.getHttpServer()).get(`/order/054b71b5b334593b3e2847fc`); // not a real id
    expect(response.status).toEqual(404);
  });

  it('PATCH /order/:id', async () => {
    const updateOrderDto = {
      status: 'shipped',
    };
    await request(app.getHttpServer()).patch(`/order/${orderId}`).send(updateOrderDto).expect(200);
  });

  it('should delete an order by id from /DELETE order/:id', async () => {
    const response = await request(app.getHttpServer()).delete(`/order/${orderId}`).expect(200);
    expect(response.body).toHaveProperty('message', 'Order deleted');
  });

  it('should return 404 due to inexisting order to /DELETE order/:id', async () => {
    const response = await request(app.getHttpServer()).delete('/order/154023d752b74c6d41d54a1b'); // not a real id
    expect(response.status).toEqual(404);
  });

  afterAll(async () => {
    await app.close(); //takes down the server/app
  });
});
