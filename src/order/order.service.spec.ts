import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn().mockImplementation((dto: CreateOrderDto) => Promise.resolve(dto)),
    findAll: jest.fn().mockImplementation(() => Promise.resolve([mockOrder, mockOrder])),
    update: jest.fn().mockImplementation((id: string, dto: UpdateOrderDto) =>
      Promise.resolve({
        id,
        ...dto,
      }),
    ),
    remove: jest.fn().mockImplementation((id: string) =>
      Promise.resolve({
        message: 'Order deleted',
        order: { id, ...mockOrder },
      }),
    ),
    findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ id, ...mockOrder })),
  };

  const mockOrder: CreateOrderDto = {
    user: 'some user',
    products: ['product1', 'product2'],
    total: 50,
    status: 'delivered',
  };

  const mockUpdateOrder: UpdateOrderDto = {
    status: 'shipping',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue(mockOrderService)
      .compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    expect(await service.create(mockOrder)).toEqual({
      user: 'some user',
      products: ['product1', 'product2'],
      total: 50,
      status: 'delivered',
    });
  });

  it('should return all orders', async () => {
    expect(await service.findAll()).toEqual([mockOrder, mockOrder]);
  });

  it('should return one order by id', async () => {
    expect(await service.findOne('1')).toEqual({
      user: 'some user',
      products: ['product1', 'product2'],
      total: 50,
      status: 'delivered',
      id: '1',
    });
  });

  it('should update an order', async () => {
    expect(await service.update('1', mockUpdateOrder)).toEqual({
      status: 'shipping',
      id: '1',
    });
  });

  it('should remove an order', async () => {
    expect(await service.remove('1')).toEqual({
      message: 'Order deleted',
      order: {
        user: 'some user',
        products: ['product1', 'product2'],
        total: 50,
        status: 'delivered',
        id: '1',
      },
    });
  });
});
