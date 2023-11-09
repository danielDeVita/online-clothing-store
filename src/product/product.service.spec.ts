import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  const mockProductRepository = {
    create: jest.fn().mockImplementation((dto: CreateProductDto) => Promise.resolve(dto)),
    findAll: jest.fn().mockImplementation(() => Promise.resolve([mockProduct, mockProduct])),
    findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ id, ...mockProduct })),
    update: jest.fn().mockImplementation((id: string, dto: UpdateProductDto) =>
      Promise.resolve({
        id,
        ...dto,
      }),
    ),
    remove: jest
      .fn()
      .mockImplementation((id: string) =>
        Promise.resolve({ message: 'Product deleted', product: { id, ...mockProduct } }),
      ),
  };

  const mockProduct: CreateProductDto = {
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
  const mockUpdateProduct: UpdateProductDto = {
    color: 'red',
    price: 5,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductRepository)
      .compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    expect(await service.create(mockProduct)).toEqual({
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

  it('should return all products', async () => {
    expect(await service.findAll()).toEqual([mockProduct, mockProduct]);
  });

  it('should return one product by id', async () => {
    expect(await service.findOne('1')).toEqual({
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

  it('should update a product', async () => {
    expect(await service.update('1', mockUpdateProduct)).toEqual({
      color: 'red',
      price: 5,
      id: '1',
    });
  });

  it('should remove a product by id', async () => {
    expect(await service.remove('1')).toEqual({
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
