import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 20000);

  it('should create a product to /POST produt', async () => {
    const createProductDto = {
      name: 'name',
      description: 'description',
      size: 'large',
      color: 'green',
      price: 10,
      stock: 10,
      brand: 'brand',
      category: '654020d452b74c6d41d549df',
    };
    const response = await request(app.getHttpServer())
      .post('/product')
      .send(createProductDto)
      .expect(201);

    productId = response.body._id; //(used for other tests like patch, getById and remove)
  });

  it('should return a server error due to bad data in body to /POST product', async () => {
    const invalidProductDto = {
      stock: 'abcd',
    };
    const response = await request(app.getHttpServer()).post('/product').send(invalidProductDto);
    expect(response.status).toEqual(500);
  });

  it('should get all products from GET /product', async () => {
    const response = await request(app.getHttpServer()).get('/product');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get one product by id from /GET product/:id', async () => {
    await request(app.getHttpServer()).get(`/product/${productId}`).expect(200);
  });

  it('should get an error with a bad id to /GET product/:id', async () => {
    const response = await request(app.getHttpServer()).get(`/product/1540211852b74c6d41d549ec`); // not a real id
    expect(response.status).toEqual(404);
  });

  it('should update a product by id to /PATCH product/:id', async () => {
    const updateProductDto = {
      color: 'black',
      size: 'small',
    };
    await request(app.getHttpServer())
      .patch(`/product/${productId}`)
      .send(updateProductDto)
      .expect(200);
  });

  it('should get an error due to bad id to /PATCH product/:id', async () => {
    const updateProductDto = {
      color: 'some other color',
    };
    const response = await request(app.getHttpServer())
      .patch('/product/054021c352b74c6d41d54a01') // not a real id
      .send(updateProductDto);
    expect(response.status).toEqual(404);
  });

  it('should delete a product by id from /DELETE product/:id', async () => {
    const response = await request(app.getHttpServer()).delete(`/product/${productId}`).expect(200);
    expect(response.body).toHaveProperty('message', 'Product deleted');
  });

  it('should return 404 due to inexisting product to /DELETE product/:id', async () => {
    const response = await request(app.getHttpServer()).delete('/product/054021c352b74c6d41d54a01'); // not a real id
    expect(response.status).toEqual(404);
  });

  afterAll(async () => {
    await app.close(); //takes down the server/app
  });
});
