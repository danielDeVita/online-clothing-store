import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProductService = {
    create: jest.fn((dto) => dto),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),
    findAll: jest.fn(() => [mockProduct, mockProduct]),
    findOne: jest.fn((id) => ({ id, ...mockProduct })),
    remove: jest.fn((id) => ({ message: 'Product deleted', product: { id, ...mockProduct } })),
  };

  const mockProduct = {
    name: 'test name product',
    description: 'test description product',
    size: 'large',
    color: 'blue',
    price: 10,
    stock: 10,
    image: 'url to a image',
    brand: 'some brand test',
    category: '1',
  };
  const mockUpdateProduct = {
    color: 'red',
    price: 5,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', () => {
    expect(controller.create(mockProduct)).toEqual({
      name: 'test name product',
      description: 'test description product',
      size: 'large',
      color: 'blue',
      price: 10,
      stock: 10,
      image: 'url to a image',
      brand: 'some brand test',
      category: '1',
    });
  });

  it('should return all products', () => {
    expect(controller.findAll()).toEqual([mockProduct, mockProduct]);
  });

  it('should return one product by id', () => {
    expect(controller.findOne('1')).toEqual({
      name: 'test name product',
      description: 'test description product',
      size: 'large',
      color: 'blue',
      price: 10,
      stock: 10,
      image: 'url to a image',
      brand: 'some brand test',
      category: '1',
      id: '1',
    });
  });

  it('should update a product', () => {
    expect(controller.update('1', mockUpdateProduct)).toEqual({
      color: 'red',
      price: 5,
      id: '1',
    });
  });

  it('should remove a product by id', () => {
    expect(controller.remove('1')).toEqual({
      message: 'Product deleted',
      product: {
        name: 'test name product',
        description: 'test description product',
        size: 'large',
        color: 'blue',
        price: 10,
        stock: 10,
        image: 'url to a image',
        brand: 'some brand test',
        category: '1',
        id: '1',
      },
    });
  });
});
